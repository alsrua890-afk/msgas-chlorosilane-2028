/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { DemandInputView } from './components/DemandInputView.tsx';
import { SupplyPlanView } from './components/SupplyPlanView.tsx';
import { MasterInfoView } from './components/MasterInfoView.tsx';

import { DispatchModal } from './components/DispatchModal.tsx';
import { TelemetryModal } from './components/TelemetryModal.tsx';
import { SmsModal } from './components/SmsModal.tsx';
import { HistoryLogModal } from './components/HistoryLogModal.tsx';
import { NotificationDrawer } from './components/NotificationDrawer.tsx';

import {
  INITIAL_TANKS,
  INITIAL_FORECASTS,
  INITIAL_UNREPORTED,
  INITIAL_ALERTS,
  INITIAL_TRUCKS,
  INITIAL_DISPATCH_ORDERS,
  INITIAL_CUSTOMER_DEMANDS,
} from './data/mockData.ts';

import {
  TankStation,
  WeeklyForecastRow,
  UnreportedFacility,
  SystemAlert,
  TankerTruck,
  DispatchOrder,
  CustomerDemand,
} from './types/ln2.ts';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Core Data States
  const [tanks, setTanks] = useState<TankStation[]>(INITIAL_TANKS);
  const [forecasts, setForecasts] = useState<WeeklyForecastRow[]>(INITIAL_FORECASTS);
  const [unreported, setUnreported] = useState<UnreportedFacility[]>(INITIAL_UNREPORTED);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [trucks, setTrucks] = useState<TankerTruck[]>(INITIAL_TRUCKS);
  const [dispatches, setDispatches] = useState<DispatchOrder[]>(INITIAL_DISPATCH_ORDERS);
  const [demands, setDemands] = useState<CustomerDemand[]>(INITIAL_CUSTOMER_DEMANDS);

  // Status & Timers
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [lastCalculatedTime, setLastCalculatedTime] = useState('2025-05-19 09:28:14');
  const [currentTimeString, setCurrentTimeString] = useState('2025년 5월 19일 (월) 09:30 기준');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchTargetFacilityId, setDispatchTargetFacilityId] = useState<string | undefined>('station-cheonan');
  const [telemetryStation, setTelemetryStation] = useState<TankStation | null>(null);
  const [smsTargetFacility, setSmsTargetFacility] = useState<UnreportedFacility | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Recalculate Logic
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLastCalculatedTime(timeStr);
      showToast('실시간 ERP 공급망 예측 모델 v2.4 재산출이 완료되었습니다.');
    }, 700);
  };

  // 2. Dispatch Order Confirmation
  const handleSubmitDispatch = (orderData: {
    sourceStation: string;
    destStation: string;
    truckId: string;
    volumeTons: number;
    departureTime: string;
    arrivalTime: string;
    priority: 'emergency' | 'high' | 'normal';
    memo: string;
  }) => {
    const selectedTruck = trucks.find((t) => t.id === orderData.truckId);
    const newOrder: DispatchOrder = {
      id: `disp-${Date.now()}`,
      orderNo: `DISP-250519-0${dispatches.length + 2}`,
      sourceStation: orderData.sourceStation,
      destStation: orderData.destStation,
      truckId: orderData.truckId,
      truckNo: selectedTruck?.truckNo || '충남85아 3102',
      driverName: selectedTruck?.driverName || '이운송 과장',
      volumeTons: orderData.volumeTons,
      departureTime: `오늘 ${orderData.departureTime}`,
      arrivalTime: `오늘 ${orderData.arrivalTime} (예정)`,
      priority: orderData.priority,
      status: 'dispatched',
      memo: orderData.memo,
      createdAt: '방금 전',
    };

    setDispatches([newOrder, ...dispatches]);

    // Update truck status to in_transit
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === orderData.truckId
          ? {
              ...t,
              status: 'in_transit',
              targetDestination: orderData.destStation,
              eta: `오늘 ${orderData.arrivalTime} 도착 예정`,
            }
          : t
      )
    );

    // Update inventory & forecast dynamically for destination station
    const matchedTank = tanks.find((t) => orderData.destStation.includes(t.name.slice(0, 4)) || t.name.includes(orderData.destStation.slice(0, 4)));
    const targetFacilityId = matchedTank ? matchedTank.id : 'station-cheonan';

    const addedVolume = orderData.volumeTons;
    setTanks((prev) =>
      prev.map((tank) => {
        if (tank.id === targetFacilityId || orderData.destStation.includes(tank.name.slice(0, 4))) {
          const newStock = Math.min(tank.maxCapacity, tank.currentStock + addedVolume);
          const newDays = Math.floor(newStock / tank.dailyOutflowAvg);
          const newPercent = +(newStock / tank.maxCapacity * 100).toFixed(1);
          return {
            ...tank,
            currentStock: newStock,
            daysRemaining: newDays,
            fillLevelPercent: newPercent,
            status: newDays > 5 ? 'normal' : 'warning',
            statusLabel: newDays > 5 ? '정상 (보충 완료)' : '주의 (보충 진행)',
            levelNote: '긴급 보충 공급 진행중',
          };
        }
        return tank;
      })
    );

    // Relieve forecast deficits
    setForecasts((prev) =>
      prev.map((f) => {
        if (f.facilityId === targetFacilityId || orderData.destStation.includes(f.facilityName.slice(0, 4))) {
          return {
            ...f,
            currentStock: f.currentStock + addedVolume,
            w0: +(f.w0 + addedVolume).toFixed(1),
            w1: +(f.w1 + addedVolume).toFixed(1),
            w2: +(f.w2 + addedVolume).toFixed(1),
            w3: +(f.w3 + addedVolume).toFixed(1),
            w4: +(f.w4 + addedVolume).toFixed(1),
            actionType: 'maintain',
            actionLabel: '배차 진행중 (안정)',
            status: 'normal',
          };
        }
        return f;
      })
    );

    // If Cheonan alert was pending and Cheonan is replenished
    if (orderData.destStation.includes('천안')) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === 'alert-cheonan-5days'
            ? {
                ...a,
                isDismissed: true,
                title: '[조치 완료] 천안 사업장 탱크로리 긴급 배차 지시 승인됨',
              }
            : a
        )
      );
    }

    showToast(`${orderData.destStation}으로 탱크로리(${orderData.volumeTons}톤) 배차가 승인되어 수급 전망이 정상화되었습니다.`);
  };

  // 3. Complete Dispatch Order
  const handleCompleteDispatch = (id: string) => {
    setDispatches((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'completed' } : d))
    );
    showToast('해당 탱크로리의 하역 및 인수 확인이 완료되었습니다.');
  };

  // 4. Send SMS to facility
  const handleSendSms = (facilityId: string) => {
    setUnreported((prev) =>
      prev.map((u) =>
        u.id === facilityId
          ? {
              ...u,
              status: 'sent',
              sentTimestamp: '09:31',
            }
          : u
      )
    );
    showToast('동부 충전소 박수급 대리에게 재고 입력 독촉 SMS가 발송되었습니다.');
  };

  // 5. Manual Inventory Entry from History Modal
  const handleManualInventorySubmit = (facilityId: string, tons: number) => {
    setUnreported((prev) =>
      prev.map((u) =>
        u.id === facilityId
          ? {
              ...u,
              status: 'completed',
              lastConfirmedTime: '방금 전 관제 대행 입력',
            }
          : u
      )
    );
    showToast(`동부 충전소 실측 재고(${tons.toFixed(1)}톤)가 전산에 확정 반영되었습니다.`);
  };

  // 6. Download Excel / CSV
  const handleDownloadExcel = () => {
    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel Korean support
      `MS GAS 액화질소(LN2) 주차별 수급 과부족 및 시설 관제 보고서\n` +
      `출력 기준 시각,${lastCalculatedTime}\n` +
      `관제 책임자,통합관제 김관리 총괄 책임자\n\n` +
      `[1. 전국 기지별 실시간 저장 잔량 현황]\n` +
      `사업장 구분,기지 코드,현재 저장잔량(톤),충전율(%),일일 평균 출하량(톤/일),탱크 총용량(톤),법정 안전재고(톤),소진 예상일수,상태\n` +
      tanks
        .map(
          (t) =>
            `"${t.name}","${t.stationCode}",${t.currentStock.toFixed(1)},${t.fillLevelPercent.toFixed(1)}%,${t.dailyOutflowAvg.toFixed(1)},${t.maxCapacity.toFixed(1)},${t.safeStock.toFixed(1)},${t.daysRemaining}일,"${t.statusLabel}"`
        )
        .join('\n') +
      `\n\n[2. 주차별 액화질소 과부족 전망 매트릭스 (단위: 톤)]\n` +
      `사업장,현재고,이번주(W+0),1주차 뒤(W+1),2주차 뒤(W+2),3주차 뒤(W+3),4주차 뒤(W+4),조치 권고\n` +
      forecasts
        .map(
          (f) =>
            `"${f.facilityName}",${f.currentStock.toFixed(1)}톤,${f.w0 > 0 ? '+' : ''}${f.w0.toFixed(1)}톤,${f.w1 > 0 ? '+' : ''}${f.w1.toFixed(1)}톤,${f.w2 > 0 ? '+' : ''}${f.w2.toFixed(1)}톤,${f.w3 > 0 ? '+' : ''}${f.w3.toFixed(1)}톤,${f.w4 > 0 ? '+' : ''}${f.w4.toFixed(1)}톤,"${f.actionLabel}"`
        )
        .join('\n') +
      `\n\n주차 기준 안내: W+0 (05/19~05/25) | W+1 (05/26~06/01) | W+2 (06/02~06/08) | W+3 (06/09~06/15) | W+4 (06/16~06/22)\n` +
      `산출 알고리즘: ERP 공급망 예측 모델 v2.4 (일일 평균 소진율 가중 적용)\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MS_GAS_LN2_수급현황보고서_20250519.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('주간 수급 보고서 엑셀(CSV) 파일이 정상적으로 다운로드되었습니다.');
  };

  const activeAlert = alerts.find((a) => !a.isDismissed) || null;
  const unreportedCount = unreported.filter((u) => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex text-[#2E2E2E] font-sans">
      {/* 1. Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreportedCount={unreportedCount}
        urgentAlertCount={activeAlert ? 1 : 0}
      />

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          title={
            currentTab === 'dashboard'
              ? '실시간 수급 현황'
              : currentTab === 'demand'
              ? '수요 입력 및 계약 관리'
              : currentTab === 'supply'
              ? '공급 계획 및 배차 관제'
              : '기준정보 설정'
          }
          subtitle="MS LN2 수급 관제 시스템"
          currentTimeString={currentTimeString}
          isRecalculating={isRecalculating}
          onRefresh={handleRecalculate}
          alerts={alerts}
          onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 pb-12">
          {currentTab === 'dashboard' && (
            <DashboardView
              tanks={tanks}
              forecasts={forecasts}
              unreported={unreported}
              alert={activeAlert}
              lastCalculatedTime={lastCalculatedTime}
              isRecalculating={isRecalculating}
              onDismissAlert={() => {
                if (activeAlert) {
                  setAlerts((prev) =>
                    prev.map((a) => (a.id === activeAlert.id ? { ...a, isDismissed: true } : a))
                  );
                }
              }}
              onOpenDispatchModal={(facilityId) => {
                setDispatchTargetFacilityId(facilityId || 'station-cheonan');
                setIsDispatchModalOpen(true);
              }}
              onOpenTelemetryModal={(station) => {
                setTelemetryStation(station);
              }}
              onOpenSmsModal={(facility) => {
                setSmsTargetFacility(facility);
              }}
              onOpenHistoryModal={() => {
                setIsHistoryModalOpen(true);
              }}
              onRecalculate={handleRecalculate}
              onDownloadExcel={handleDownloadExcel}
            />
          )}

          {currentTab === 'demand' && (
            <DemandInputView
              demands={demands}
              onAddDemand={(newDemand) => {
                setDemands([
                  { id: `cust-${Date.now()}`, ...newDemand },
                  ...demands,
                ]);
                showToast(`'${newDemand.customerName}' 고객사 수요가 성공적으로 등록되었습니다.`);
              }}
            />
          )}

          {currentTab === 'supply' && (
            <SupplyPlanView
              trucks={trucks}
              dispatches={dispatches}
              onOpenNewDispatch={() => {
                setDispatchTargetFacilityId('station-cheonan');
                setIsDispatchModalOpen(true);
              }}
              onCompleteDispatch={handleCompleteDispatch}
            />
          )}

          {currentTab === 'master' && (
            <MasterInfoView
              tanks={tanks}
              onUpdateTankSpecs={(updated) => {
                setTanks(updated);
              }}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        stations={tanks}
        trucks={trucks}
        targetFacilityId={dispatchTargetFacilityId}
        onSubmitDispatch={handleSubmitDispatch}
      />

      <TelemetryModal
        isOpen={!!telemetryStation}
        onClose={() => setTelemetryStation(null)}
        station={telemetryStation}
      />

      <SmsModal
        isOpen={!!smsTargetFacility}
        onClose={() => setSmsTargetFacility(null)}
        facility={smsTargetFacility}
        onSendSms={handleSendSms}
      />

      <HistoryLogModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        unreported={unreported}
        onManualInventorySubmit={handleManualInventorySubmit}
      />

      <NotificationDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={alerts}
        onDismissAlert={(id) => {
          setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, isDismissed: true } : a))
          );
        }}
        onClearAll={() => {
          setAlerts((prev) => prev.map((a) => ({ ...a, isDismissed: true })));
          showToast('모든 알림을 확인 처리하였습니다.');
        }}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#2E2E2E] text-white text-xs px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 border border-[#444950]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
