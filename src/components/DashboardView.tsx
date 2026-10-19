import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  X,
  Radio,
  FileSpreadsheet,
  RotateCw,
  Mail,
  Building2,
  Clock,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Fuel,
} from 'lucide-react';
import {
  TankStation,
  WeeklyForecastRow,
  UnreportedFacility,
  SystemAlert,
} from '../types/ln2.ts';

interface DashboardViewProps {
  tanks: TankStation[];
  forecasts: WeeklyForecastRow[];
  unreported: UnreportedFacility[];
  alert: SystemAlert | null;
  lastCalculatedTime: string;
  isRecalculating: boolean;
  onDismissAlert: () => void;
  onOpenDispatchModal: (facilityId?: string) => void;
  onOpenTelemetryModal: (station: TankStation) => void;
  onOpenSmsModal: (facility: UnreportedFacility) => void;
  onOpenHistoryModal: () => void;
  onRecalculate: () => void;
  onDownloadExcel: () => void;
  onOpenRebalanceModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tanks,
  forecasts,
  unreported,
  alert,
  lastCalculatedTime,
  isRecalculating,
  onDismissAlert,
  onOpenDispatchModal,
  onOpenTelemetryModal,
  onOpenSmsModal,
  onOpenHistoryModal,
  onRecalculate,
  onDownloadExcel,
}) => {
  const cheonanTank = tanks.find((t) => t.id === 'station-cheonan') || tanks[0];
  const busanTank = tanks.find((t) => t.id === 'station-busan') || tanks[1];

  return (
    <div className="p-6 space-y-5 max-w-[1520px] mx-auto">
      {/* 1. URGENT ALERT BANNER */}
      {alert && !alert.isDismissed && (
        <div className="bg-[#fee2e2]/95 border border-red-200 rounded-xl p-4 flex items-start justify-between gap-4 shadow-xs transition-all">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-red-700 font-bold text-sm tracking-tight">
                  {alert.title}
                </span>
                <span className="bg-[#991b1b] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-xs text-red-600/90 mt-1 font-medium leading-relaxed">
                {alert.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenDispatchModal('station-cheonan')}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <span>상세 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDismissAlert}
              title="알림 닫기"
              className="text-red-400 hover:text-red-700 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STORAGE TANK LEVEL CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: 충남 천안 사업장 (탱크 1호기) */}
        {cheonanTank && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              {/* Header Line */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                    {cheonanTank.stationCode}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>{cheonanTank.statusLabel}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {cheonanTank.name}
              </h2>

              {/* Metrics Split */}
              <div className="mt-4 grid grid-cols-12 gap-3 items-center">
                {/* Left Metric */}
                <div className="col-span-7">
                  <div className="text-xs text-slate-500 font-medium">
                    현재 LN2 저장 잔량
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                      {cheonanTank.currentStock.toFixed(1)} 톤
                    </span>
                    <span className="text-xs font-bold text-slate-500 tabular-nums">
                      ({cheonanTank.fillLevelPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-red-500 mt-1 flex items-center gap-1">
                    <span>✱ 소진 예상 {cheonanTank.daysRemaining}일 후</span>
                    <span className="text-red-400">(잔여 {cheonanTank.daysRemaining}일)</span>
                  </div>
                </div>

                {/* Right Specification Box */}
                <div className="col-span-5 bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">일일 평균 출하</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {cheonanTank.dailyOutflowAvg.toFixed(1)} 톤/일
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">탱크 총용량</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {cheonanTank.maxCapacity.toFixed(1)} 톤
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">법정 안전재고</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {cheonanTank.safeStock.toFixed(1)} 톤 ({cheonanTank.safeStockPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Level Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">실시간 충전 레벨</span>
                  <span className="font-bold text-red-600 tabular-nums">
                    {cheonanTank.fillLevelPercent.toFixed(1)}% ({cheonanTank.levelNote})
                  </span>
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  {/* Danger zone marker background */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-red-100/70 border-r border-red-300 z-0"
                    style={{ width: `${cheonanTank.safeStockPercent}%` }}
                  />
                  {/* Active fill */}
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500 relative z-10"
                    style={{ width: `${cheonanTank.fillLevelPercent}%` }}
                  />
                </div>

                {/* Bar Ticks & Labels */}
                <div className="relative text-[11px] text-slate-400 pt-1 flex justify-between select-none">
                  <span>0.0T (0%)</span>
                  <div
                    className="absolute text-center transform -translate-x-1/2 text-rose-600 font-semibold"
                    style={{ left: `${cheonanTank.safeStockPercent}%` }}
                  >
                    <span>▼ 10% 안전재고 ({cheonanTank.safeStock.toFixed(1)}톤)</span>
                  </div>
                  <span>최대 {cheonanTank.maxCapacity.toFixed(1)}T (100%)</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>원격 텔레메트리 센서: {cheonanTank.telemetryLastReceived}</span>
              </div>
              <button
                onClick={() => onOpenDispatchModal(cheonanTank.id)}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                <span>{cheonanTank.actionButtonLabel}</span>
              </button>
            </div>
          </div>
        )}

        {/* Card 2: 부산 본사 (메인 탱크) */}
        {busanTank && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              {/* Header Line */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                    {busanTank.stationCode}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>{busanTank.statusLabel}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {busanTank.name}
              </h2>

              {/* Metrics Split */}
              <div className="mt-4 grid grid-cols-12 gap-3 items-center">
                {/* Left Metric */}
                <div className="col-span-7">
                  <div className="text-xs text-slate-500 font-medium">
                    현재 LN2 저장 잔량
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                      {busanTank.currentStock.toFixed(1)} 톤
                    </span>
                    <span className="text-xs font-bold text-slate-500 tabular-nums">
                      ({busanTank.fillLevelPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>소진 예상 {busanTank.daysRemaining}일 후</span>
                    <span className="text-blue-500/80">(잔여 {busanTank.daysRemaining}일)</span>
                  </div>
                </div>

                {/* Right Specification Box */}
                <div className="col-span-5 bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">일일 평균 출하</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {busanTank.dailyOutflowAvg.toFixed(1)} 톤/일
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">탱크 총용량</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {busanTank.maxCapacity.toFixed(1)} 톤
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 text-[11px]">법정 안전재고</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {busanTank.safeStock.toFixed(1)} 톤 ({busanTank.safeStockPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Level Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">실시간 충전 레벨</span>
                  <span className="font-bold text-blue-600 tabular-nums">
                    {busanTank.fillLevelPercent.toFixed(1)}% ({busanTank.levelNote})
                  </span>
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-blue-100/70 border-r border-blue-300 z-0"
                    style={{ width: `${busanTank.safeStockPercent}%` }}
                  />
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 relative z-10"
                    style={{ width: `${busanTank.fillLevelPercent}%` }}
                  />
                </div>

                {/* Bar Ticks & Labels */}
                <div className="relative text-[11px] text-slate-400 pt-1 flex justify-between select-none">
                  <span>0.0T (0%)</span>
                  <div
                    className="absolute text-center transform -translate-x-1/2 text-blue-600 font-semibold"
                    style={{ left: `${busanTank.safeStockPercent}%` }}
                  >
                    <span>▼ 10% 안전재고 ({busanTank.safeStock.toFixed(1)}톤)</span>
                  </div>
                  <span>최대 {busanTank.maxCapacity.toFixed(1)}T (100%)</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>원격 텔레메트리 센서: {busanTank.telemetryLastReceived}</span>
              </div>
              <button
                onClick={() => onOpenTelemetryModal(busanTank)}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                <span>{busanTank.actionButtonLabel}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. WEEKLY NITROGEN SURPLUS/DEFICIT FORECAST TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        {/* Table Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-4 bg-blue-600 rounded-xs"></div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                주차별 액화질소 과부족 전망 <span className="text-xs font-normal text-slate-500">(단위: 톤)</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              각 사업장별 입고 예정량 대비 고객 수요 차감 후 예상 잔여/부족량 (마이너스 수치는 추가 조치 필수)
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 self-end md:self-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>정상</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>주의</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>부족/위험</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-200">
                <th className="py-3 px-3 font-semibold text-slate-700">사업장 구분</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-700">현재고</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-700">이번주 (W+0)</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-700">1주차 뒤 (W+1)</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-700">2주차 뒤 (W+2)</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-700">3주차 뒤 (W+3)</th>
                <th className="py-3 px-3 font-semibold text-right text-slate-700">4주차 뒤 (W+4)</th>
                <th className="py-3 px-3 font-semibold text-center text-slate-700">조치 계획</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {forecasts.map((row) => {
                const getDotColor = () => {
                  if (row.status === 'danger') return 'bg-red-500';
                  if (row.status === 'warning') return 'bg-amber-500';
                  return 'bg-blue-500';
                };

                const formatVal = (val: number) => {
                  const prefix = val > 0 ? '+' : '';
                  return `${prefix}${val.toFixed(1)}톤`;
                };

                const getValClass = (val: number) => {
                  if (val < 0) return 'text-red-600 font-bold';
                  if (val <= 10) return 'text-amber-600 font-semibold';
                  return 'text-blue-600 font-semibold';
                };

                return (
                  <tr
                    key={row.facilityId}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getDotColor()}`}></span>
                        <span>{row.facilityName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700 tabular-nums whitespace-nowrap">
                      {row.currentStock.toFixed(1)}톤
                    </td>
                    <td className={`py-3.5 px-3 text-right tabular-nums whitespace-nowrap ${getValClass(row.w0)}`}>
                      {formatVal(row.w0)}
                    </td>
                    <td className={`py-3.5 px-3 text-right tabular-nums whitespace-nowrap ${getValClass(row.w1)}`}>
                      {formatVal(row.w1)}
                    </td>
                    <td className={`py-3.5 px-3 text-right tabular-nums whitespace-nowrap ${getValClass(row.w2)}`}>
                      {formatVal(row.w2)}
                    </td>
                    <td className={`py-3.5 px-3 text-right tabular-nums whitespace-nowrap ${getValClass(row.w3)}`}>
                      {formatVal(row.w3)}
                    </td>
                    <td className={`py-3.5 px-3 text-right tabular-nums whitespace-nowrap ${getValClass(row.w4)}`}>
                      {formatVal(row.w4)}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {row.actionType === 'emergency_dispatch' && (
                        <button
                          onClick={() => onOpenDispatchModal(row.facilityId)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{row.actionLabel}</span>
                        </button>
                      )}
                      {row.actionType === 'maintain' && (
                        <span className="border border-blue-400 text-blue-600 bg-blue-50/70 font-semibold text-xs px-3 py-1.5 rounded-md inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{row.actionLabel}</span>
                        </span>
                      )}
                      {row.actionType === 'rebalance_review' && (
                        <button
                          onClick={() => onOpenDispatchModal(row.facilityId)}
                          className="border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs px-3 py-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Fuel className="w-3.5 h-3.5 text-slate-500" />
                          <span>{row.actionLabel}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footnotes */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">ⓘ 주차 기준:</span>
            <span>W+0 (05/19~05/25) · W+1 (05/26~06/01) · W+2 (06/02~06/08) · W+3 (06/09~06/15) · W+4 (06/16~06/22)</span>
          </div>
          <div className="text-slate-400 font-medium">
            산출 알고리즘: ERP 공급망 예측 모델 v2.4 (일일 평균 소진율 가중 적용)
          </div>
        </div>
      </div>

      {/* 4. BOTTOM TWO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card Left: 오늘 재고 미입력 사업장 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-slate-800 text-sm">
                  오늘 재고 미입력 사업장
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                미입력 {unreported.filter((u) => u.status === 'pending').length}개소
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              정기 마감 시각(오전 09:00)까지 현장 실측 재고가 전송되지 않은 지점입니다.
            </p>

            {/* List of Unreported Facilities */}
            <div className="space-y-3">
              {unreported.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-red-500 font-semibold bg-red-50 border border-red-100 px-1.5 py-0.2 rounded">
                          {item.lastConfirmedTime}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        담당자: {item.managerName} (연락처: {item.contact})
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onOpenSmsModal(item)}
                      disabled={item.status === 'completed'}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        item.status === 'sent'
                          ? 'bg-slate-700 text-slate-200'
                          : item.status === 'completed'
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>
                        {item.status === 'sent'
                          ? '독촉 SMS 재발송'
                          : item.status === 'completed'
                          ? '입력 완료됨'
                          : '입력 독촉 SMS 발송'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>차기 자동 리마인더 발송 예정: 10:00 (30분 후)</span>
            </div>
            <button
              onClick={onOpenHistoryModal}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>미입력 이력 로그 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Right: 관제 조치 및 리포트 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                관제 조치 및 리포트
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              실시간 센서 텔레메트리 데이터를 다시 취합하거나 공식 공급 보고서를 추출합니다.
            </p>

            {/* Calculated Time Status Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">최근 전체 산출 시각:</span>
              </div>
              <span className="text-xs font-bold text-slate-800 font-mono tabular-nums">
                {lastCalculatedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/90 rounded-lg py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`}
              />
              <span>실시간 재계산</span>
            </button>

            <button
              onClick={onDownloadExcel}
              className="w-full bg-[#15803d] hover:bg-[#166534] text-white rounded-lg py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>주간 리포트 엑셀 내려받기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
