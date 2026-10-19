import React, { useState } from 'react';
import { SlidersHorizontal, Shield, Bell, Database, CheckCircle2, Save, Radio } from 'lucide-react';
import { TankStation } from '../types/ln2.ts';

interface MasterInfoViewProps {
  tanks: TankStation[];
  onUpdateTankSpecs: (updatedTanks: TankStation[]) => void;
}

export const MasterInfoView: React.FC<MasterInfoViewProps> = ({
  tanks,
  onUpdateTankSpecs,
}) => {
  const [stationList, setStationList] = useState<TankStation[]>(tanks);
  const [safeStockRatio, setSafeStockRatio] = useState(10);
  const [dangerLeadDays, setDangerLeadDays] = useState(5);
  const [warningLeadDays, setWarningLeadDays] = useState(10);
  const [sensorIntervalSec, setSensorIntervalSec] = useState(30);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleCapacityChange = (id: string, newCapacity: number) => {
    setStationList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const safe = (newCapacity * safeStockRatio) / 100;
          return {
            ...s,
            maxCapacity: newCapacity,
            safeStock: safe,
            fillLevelPercent: +(s.currentStock / newCapacity * 100).toFixed(1),
          };
        }
        return s;
      })
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTankSpecs(stationList);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1520px] mx-auto text-xs">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-blue-600 rounded-xs"></div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              관제 기준정보 및 안전재고 파라미터 설정
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            고압가스안전관리법 및 산업안전보건 기준에 따른 기지별 법정 안전재고, 위험 도달 경보 임계치, 센서 수신 주기를 관리합니다.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="self-start md:self-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>설정 저장 및 전산 반영</span>
        </button>
      </div>

      {/* Global Thresholds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 법정 안전재고율 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>법정 의무 안전재고율 (비상 비축)</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            탱크 총용량 대비 긴급 비축 하한 기준 (기본 10%)
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min="5"
              max="25"
              value={safeStockRatio}
              onChange={(e) => setSafeStockRatio(Number(e.target.value))}
              className="w-24 bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-sm text-slate-900 tabular-nums"
            />
            <span className="font-semibold text-slate-700">% (총용량 기준)</span>
          </div>
        </div>

        {/* Card 2: 위험 알림 잔여일수 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Bell className="w-4 h-4 text-red-600" />
            <span>긴급 알림(PRIORITY 1) 기준</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            안전재고 미달 예상 잔여일수 시 관제 경보 발생
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min="1"
              max="15"
              value={dangerLeadDays}
              onChange={(e) => setDangerLeadDays(Number(e.target.value))}
              className="w-24 bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-sm text-red-600 tabular-nums"
            />
            <span className="font-semibold text-slate-700">일 미만 도달 시 긴급</span>
          </div>
        </div>

        {/* Card 3: 센서 수신 주기 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>원격 텔레메트리 센서 핑 주기</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            IoT 차압 전송기 데이터 수집 주기 (초)
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min="5"
              max="120"
              value={sensorIntervalSec}
              onChange={(e) => setSensorIntervalSec(Number(e.target.value))}
              className="w-24 bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-sm text-slate-900 tabular-nums"
            />
            <span className="font-semibold text-slate-700">초 (실시간 폴링)</span>
          </div>
        </div>
      </div>

      {/* Storage Station Directory & Specs */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              전국 액화질소(LN2) 기지별 시설 제원 및 기준치
            </h3>
          </div>
          <span className="text-slate-400 text-xs">총 {stationList.length}개 사업장 등록됨</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">사업장 코드</th>
                <th className="py-2.5 px-3 font-semibold">기지 명칭</th>
                <th className="py-2.5 px-3 font-semibold">구분</th>
                <th className="py-2.5 px-3 font-semibold text-right">탱크 총용량 (톤)</th>
                <th className="py-2.5 px-3 font-semibold text-right">법정 안전재고</th>
                <th className="py-2.5 px-3 font-semibold text-right">일일 평균 출하량</th>
                <th className="py-2.5 px-3 font-semibold">센서 RTU ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stationList.map((station) => (
                <tr key={station.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {station.stationCode}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {station.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {station.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <input
                      type="number"
                      step="5"
                      value={station.maxCapacity}
                      onChange={(e) => handleCapacityChange(station.id, Number(e.target.value))}
                      className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-800"
                    />
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                    {station.safeStock.toFixed(1)}톤 ({safeStockRatio}%)
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-blue-700 tabular-nums">
                    {station.dailyOutflowAvg.toFixed(1)}톤/일
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    RTU-KR-{(station.id).slice(-4).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>관제 기준정보가 성공적으로 저장 및 전산에 반영되었습니다.</span>
        </div>
      )}
    </div>
  );
};
