import React, { useState } from 'react';
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
  TrendingDown,
  TrendingUp,
  Activity,
  Layers,
  Fuel,
  Sparkles,
  ShieldAlert,
  Calendar,
  Truck,
  ArrowUpRight,
  Gauge,
  Thermometer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TankStation,
  WeeklyForecastRow,
  UnreportedFacility,
  SystemAlert,
} from '../types/ln2.ts';
import { NationalTankMap } from './NationalTankMap.tsx';
import { MsGasHeroBanner } from './MsGasHeroBanner.tsx';

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

  // Recharts interactive station selection state
  const [selectedChartStation, setSelectedChartStation] = useState<string>('ALL');

  // Calculate Shortage Ranking (Top 3 Deficit Facilities)
  const rankedByShortage = [...forecasts]
    .map((f) => {
      const tank = tanks.find((t) => t.id === f.facilityId);
      const minSurplus = Math.min(f.w0, f.w1, f.w2, f.w3, f.w4);
      let deficitWeek = '-';
      if (f.w0 < 0) deficitWeek = '이번주 (W+0)';
      else if (f.w1 < 0) deficitWeek = '1주차 뒤 (W+1)';
      else if (f.w2 < 0) deficitWeek = '2주차 뒤 (W+2)';
      else if (f.w3 < 0) deficitWeek = '3주차 뒤 (W+3)';
      else if (f.w4 < 0) deficitWeek = '4주차 뒤 (W+4)';

      return {
        ...f,
        tank,
        minSurplus,
        w4Surplus: f.w4,
        deficitWeek,
      };
    })
    .sort((a, b) => a.w4Surplus - b.w4Surplus);

  const top3Deficit = rankedByShortage.slice(0, 3);
  const total4WeekDeficit = top3Deficit
    .filter((f) => f.w4Surplus < 0)
    .reduce((sum, f) => sum + Math.abs(f.w4Surplus), 0);

  // Prepare 4-week forecast data for Recharts
  const chartWeeks = [
    { key: 'w0', label: '이번주 (W+0)', dateRange: '05/19~05/25' },
    { key: 'w1', label: '1주차 뒤 (W+1)', dateRange: '05/26~06/01' },
    { key: 'w2', label: '2주차 뒤 (W+2)', dateRange: '06/02~06/08' },
    { key: 'w3', label: '3주차 뒤 (W+3)', dateRange: '06/09~06/15' },
    { key: 'w4', label: '4주차 뒤 (W+4)', dateRange: '06/16~06/22' },
  ];

  const cheonanForecast = forecasts.find((f) => f.facilityId === 'station-cheonan');
  const hwaseongForecast = forecasts.find((f) => f.facilityId === 'station-hwaseong');
  const cheongjuForecast = forecasts.find((f) => f.facilityId === 'station-cheongju');
  const busanForecast = forecasts.find((f) => f.facilityId === 'station-busan');
  const dongbuForecast = forecasts.find((f) => f.facilityId === 'station-dongbu');

  const chartData = chartWeeks.map((week) => {
    const k = week.key as keyof WeeklyForecastRow;
    return {
      name: week.label,
      dateRange: week.dateRange,
      천안: cheonanForecast ? Number((cheonanForecast[k] as number).toFixed(1)) : 0,
      화성: hwaseongForecast ? Number((hwaseongForecast[k] as number).toFixed(1)) : 0,
      청주: cheongjuForecast ? Number((cheongjuForecast[k] as number).toFixed(1)) : 0,
      부산: busanForecast ? Number((busanForecast[k] as number).toFixed(1)) : 0,
      동부: dongbuForecast ? Number((dongbuForecast[k] as number).toFixed(1)) : 0,
    };
  });

  // MS GAS Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E5E9EE] rounded-xl p-3.5 shadow-xl text-xs space-y-2 min-w-[220px]">
          <div className="font-bold text-[#2E2E2E] border-b border-[#E5E9EE] pb-1.5 flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0D6F8F]" />
              <span>{label}</span>
            </span>
            <span className="text-[10px] text-[#6B7280] font-normal">{payload[0]?.payload?.dateRange}</span>
          </div>
          <div className="space-y-1.5 pt-0.5">
            {payload.map((item: any) => {
              const val = Number(item.value);
              const isNegative = val < 0;
              return (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-[#2E2E2E]">{item.name}</span>
                  </div>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      isNegative ? 'text-[#E05342]' : 'text-[#0D6F8F]'
                    }`}
                  >
                    {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)} 톤
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-[#8A92A0] pt-1 border-t border-[#E5E9EE] flex justify-between">
            <span>기준: 안전재고 차감 잔여량</span>
            <span className="text-[#0D6F8F] font-bold">MS ERP v2.4</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1520px] mx-auto">
      {/* 0. OFFICIAL MS GAS SLOGAN & GRAPHIC MOTIF HERO BANNER */}
      <MsGasHeroBanner
        onOpenQuickDispatch={() => onOpenDispatchModal('station-cheonan')}
        onOpenReport={onDownloadExcel}
      />

      {/* 1. URGENT PRIORITY 1 ALERT BANNER (MS GAS Styled) */}
      {alert && !alert.isDismissed && (
        <div className="bg-[#FFF5F5] border-2 border-[#E05342]/40 rounded-[20px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E05342] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#991B1B] font-extrabold text-sm tracking-tight">
                  {alert.title}
                </span>
                <span className="bg-[#E05342] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md tracking-wide">
                  PRIORITY 1
                </span>
              </div>
              <p className="text-xs text-[#B91C1C] mt-1 font-medium leading-relaxed">
                {alert.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
            <button
              onClick={() => onOpenDispatchModal('station-cheonan')}
              className="bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E] text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>상세 보기 및 배차</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2E2E2E]" />
            </button>
            <button
              onClick={onDismissAlert}
              title="알림 닫기"
              className="w-9 h-9 rounded-xl border border-[#FCA5A5] text-[#991B1B] hover:bg-[#FEE2E2] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STORAGE TANK LEVEL CARDS (MS GAS Teal & Yellow Accents) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: 충남 천안 사업장 (탱크 1호기) */}
        {cheonanTank && (
          <div className="bg-white rounded-[22px] border border-[#E5E9EE] hover:border-[#0D6F8F]/40 p-6 shadow-xs flex flex-col justify-between transition-all">
            <div>
              {/* Top Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D6F8F]" />
                  <span className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider">
                    {cheonanTank.stationCode}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FDE8E6] text-[#E05342] border border-[#FCA5A5]">
                  <span className="w-2 h-2 rounded-full bg-[#E05342] animate-pulse" />
                  <span>{cheonanTank.statusLabel}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg font-extrabold text-[#2E2E2E] tracking-tight">
                {cheonanTank.name}
              </h2>

              {/* Metrics Split */}
              <div className="mt-4 grid grid-cols-12 gap-4 items-center">
                {/* Left Metric */}
                <div className="col-span-7">
                  <div className="text-xs text-[#6B7280] font-medium">
                    현재 LN2 저장 잔량
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-[#2E2E2E] tracking-tight tabular-nums">
                      {cheonanTank.currentStock.toFixed(1)} 톤
                    </span>
                    <span className="text-sm font-bold text-[#6B7280] tabular-nums">
                      ({cheonanTank.fillLevelPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#E05342] mt-1.5 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>소진 예상 {cheonanTank.daysRemaining}일 후 (잔여 {cheonanTank.daysRemaining}일)</span>
                  </div>
                </div>

                {/* Right Specification Box */}
                <div className="col-span-5 bg-[#F6F8FA] rounded-xl p-3 text-xs space-y-2 border border-[#E5E9EE]">
                  <div className="flex items-center justify-between text-[#2E2E2E]">
                    <span className="text-[#6B7280] text-[11px]">일일 평균 출하</span>
                    <span className="font-bold text-[#2E2E2E] tabular-nums">
                      {cheonanTank.dailyOutflowAvg.toFixed(1)} 톤/일
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#2E2E2E]">
                    <span className="text-[#6B7280] text-[11px]">탱크 총용량</span>
                    <span className="font-bold text-[#2E2E2E] tabular-nums">
                      {cheonanTank.maxCapacity.toFixed(1)} 톤
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#2E2E2E]">
                    <span className="text-[#6B7280] text-[11px]">법정 안전재고</span>
                    <span className="font-bold text-[#E05342] tabular-nums">
                      {cheonanTank.safeStock.toFixed(1)} 톤 ({cheonanTank.safeStockPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Level Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2E2E2E]">실시간 충전 레벨</span>
                  <span className="font-bold text-[#E05342] tabular-nums">
                    {cheonanTank.fillLevelPercent.toFixed(1)}% ({cheonanTank.levelNote})
                  </span>
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full h-3 bg-[#E5E9EE] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#FCA5A5] border-r-2 border-[#E05342] z-0"
                    style={{ width: `${cheonanTank.safeStockPercent}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-[#0D6F8F] to-[#E05342] rounded-full transition-all duration-500 relative z-10"
                    style={{ width: `${cheonanTank.fillLevelPercent}%` }}
                  />
                </div>

                {/* Bar Ticks & Labels */}
                <div className="relative text-[11px] text-[#8A92A0] pt-1 flex justify-between select-none">
                  <span>0.0T (0%)</span>
                  <div
                    className="absolute text-center transform -translate-x-1/2 text-[#E05342] font-bold"
                    style={{ left: `${cheonanTank.safeStockPercent}%` }}
                  >
                    <span>▼ 10% 안전재고 ({cheonanTank.safeStock.toFixed(1)}톤)</span>
                  </div>
                  <span>최대 {cheonanTank.maxCapacity.toFixed(1)}T (100%)</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-[#E5E9EE] flex items-center justify-between text-xs bg-[#F6F8FA] -mx-6 -mb-6 px-6 py-3.5 rounded-b-[22px]">
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Radio className="w-4 h-4 text-[#0D6F8F] animate-pulse" />
                <span className="font-medium">원격 텔레메트리: {cheonanTank.telemetryLastReceived}</span>
              </div>
              <button
                onClick={() => onOpenDispatchModal('station-cheonan')}
                className="bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-xs"
              >
                <span>{cheonanTank.actionButtonLabel}</span>
              </button>
            </div>
          </div>
        )}

        {/* Card 2: 부산 본사 (메인 탱크) */}
        {busanTank && (
          <div className="bg-white rounded-[22px] border border-[#E5E9EE] hover:border-[#0D6F8F]/40 p-6 shadow-xs flex flex-col justify-between transition-all">
            <div>
              {/* Top Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D6F8F]" />
                  <span className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider">
                    {busanTank.stationCode}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#E6F3F7] text-[#0D6F8F] border border-[#C5E5EE]">
                  <span className="w-2 h-2 rounded-full bg-[#0D6F8F]" />
                  <span>{busanTank.statusLabel}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg font-extrabold text-[#2E2E2E] tracking-tight">
                {busanTank.name}
              </h2>

              {/* Metrics Split */}
              <div className="mt-4 grid grid-cols-12 gap-4 items-center">
                {/* Left Metric */}
                <div className="col-span-7">
                  <div className="text-xs text-[#6B7280] font-medium">
                    현재 LN2 저장 잔량
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-[#2E2E2E] tracking-tight tabular-nums">
                      {busanTank.currentStock.toFixed(1)} 톤
                    </span>
                    <span className="text-sm font-bold text-[#6B7280] tabular-nums">
                      ({busanTank.fillLevelPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#0D6F8F] mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6F8F]" />
                    <span>소진 예상 {busanTank.daysRemaining}일 후 (잔여 {busanTank.daysRemaining}일)</span>
                  </div>
                </div>

                {/* Right Specification Box */}
                <div className="col-span-5 bg-[#F6F8FA] rounded-xl p-3 text-xs space-y-2 border border-[#E5E9EE]">
                  <div className="flex items-center justify-between text-[#2E2E2E]">
                    <span className="text-[#6B7280] text-[11px]">일일 평균 출하</span>
                    <span className="font-bold text-[#2E2E2E] tabular-nums">
                      {busanTank.dailyOutflowAvg.toFixed(1)} 톤/일
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#2E2E2E]">
                    <span className="text-[#6B7280] text-[11px]">탱크 총용량</span>
                    <span className="font-bold text-[#2E2E2E] tabular-nums">
                      {busanTank.maxCapacity.toFixed(1)} 톤
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#2E2E2E]">
                    <span className="text-[#6B7280] text-[11px]">법정 안전재고</span>
                    <span className="font-bold text-[#0D6F8F] tabular-nums">
                      {busanTank.safeStock.toFixed(1)} 톤 ({busanTank.safeStockPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Level Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2E2E2E]">실시간 충전 레벨</span>
                  <span className="font-bold text-[#0D6F8F] tabular-nums">
                    {busanTank.fillLevelPercent.toFixed(1)}% ({busanTank.levelNote})
                  </span>
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full h-3 bg-[#E5E9EE] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#C5E5EE] border-r-2 border-[#0D6F8F] z-0"
                    style={{ width: `${busanTank.safeStockPercent}%` }}
                  />
                  <div
                    className="h-full bg-[#0D6F8F] rounded-full transition-all duration-500 relative z-10"
                    style={{ width: `${busanTank.fillLevelPercent}%` }}
                  />
                </div>

                {/* Bar Ticks & Labels */}
                <div className="relative text-[11px] text-[#8A92A0] pt-1 flex justify-between select-none">
                  <span>0.0T (0%)</span>
                  <div
                    className="absolute text-center transform -translate-x-1/2 text-[#0D6F8F] font-bold"
                    style={{ left: `${busanTank.safeStockPercent}%` }}
                  >
                    <span>▼ 10% 안전재고 ({busanTank.safeStock.toFixed(1)}톤)</span>
                  </div>
                  <span>최대 {busanTank.maxCapacity.toFixed(1)}T (100%)</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-[#E5E9EE] flex items-center justify-between text-xs bg-[#F6F8FA] -mx-6 -mb-6 px-6 py-3.5 rounded-b-[22px]">
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Radio className="w-4 h-4 text-[#0D6F8F] animate-pulse" />
                <span className="font-medium">원격 텔레메트리: {busanTank.telemetryLastReceived}</span>
              </div>
              <button
                onClick={() => onOpenTelemetryModal(busanTank)}
                className="bg-white hover:bg-[#E6F3F7] text-[#0D6F8F] border border-[#0D6F8F] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
              >
                <span>{busanTank.actionButtonLabel}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. INTERACTIVE NATIONAL GIS TANK LEVEL MAP (MS GAS Styled) */}
      <NationalTankMap
        tanks={tanks}
        onOpenDispatchModal={onOpenDispatchModal}
        onOpenTelemetryModal={onOpenTelemetryModal}
      />

      {/* 4. 주간 공급망 인사이트 카드 (HIGHLIGHT TOP 3 DEFICIT SITES) */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs space-y-5">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E9EE]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDE8E6] text-[#E05342] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
                  주간 공급망 인사이트: 결핍 위험 사업장 Top 3 요약
                </h3>
                <span className="bg-[#FDE8E6] text-[#E05342] border border-[#FCA5A5] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                  집중 관제 요망 (3개 거점)
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 font-medium">
                MS GAS 공급망 예측 모델 기반 4주간 누적 수요 차감 후 법정 안전재고 미달 및 최대 결핍 우려 사업장 상위 3곳
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="text-[11px] font-bold text-[#0D6F8F] bg-[#E6F3F7] border border-[#C5E5EE] px-3 py-1.5 rounded-xl">
              분석 대상: 전국 5개 사업장 기지
            </span>
          </div>
        </div>

        {/* 4-Column Quick Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#F6F8FA] rounded-xl p-3.5 border border-[#E5E9EE]">
            <span className="text-[11px] text-[#6B7280] font-medium">4주 후 총 예상 누적 결핍량</span>
            <div className="text-xl font-black text-[#E05342] mt-1 tabular-nums">
              -{total4WeekDeficit.toFixed(1)} 톤
            </div>
            <span className="text-[10px] text-[#991B1B] font-bold">상위 3개 결핍 거점 합산치</span>
          </div>

          <div className="bg-[#F6F8FA] rounded-xl p-3.5 border border-[#E5E9EE]">
            <span className="text-[11px] text-[#6B7280] font-medium">최단 결핍 도달 시점</span>
            <div className="text-xl font-black text-[#2E2E2E] mt-1">
              W+1 <span className="text-xs font-semibold text-[#6B7280]">(1주차 뒤)</span>
            </div>
            <span className="text-[10px] text-[#D97706] font-bold">천안(-6.8T) 및 화성(-2.5T) 동시 진입</span>
          </div>

          <div className="bg-[#F6F8FA] rounded-xl p-3.5 border border-[#E5E9EE]">
            <span className="text-[11px] text-[#6B7280] font-medium">필요 비상 탱크로리 수송</span>
            <div className="text-xl font-black text-[#0D6F8F] mt-1 tabular-nums">
              최소 6 회 <span className="text-xs font-semibold text-[#6B7280]">(96.0톤)</span>
            </div>
            <span className="text-[10px] text-[#0D6F8F] font-bold">서산 ASU 기지 즉시 출하 요망</span>
          </div>

          <div className="bg-[#F6F8FA] rounded-xl p-3.5 border border-[#E5E9EE]">
            <span className="text-[11px] text-[#6B7280] font-medium">전체 공급망 안전 마진율</span>
            <div className="text-xl font-black text-[#D97706] mt-1 tabular-nums">
              64.2% <span className="text-xs font-semibold text-[#6B7280]">(주의)</span>
            </div>
            <span className="text-[10px] text-[#D97706] font-bold">평시대비 -23.8%p 급감</span>
          </div>
        </div>

        {/* 3-Column Top 3 Shortage Facility Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {top3Deficit.map((item, idx) => {
            const rank = idx + 1;
            const isRank1 = rank === 1;
            const isRank2 = rank === 2;

            const rankBadgeColor = isRank1
              ? 'bg-[#E05342] text-white'
              : isRank2
              ? 'bg-[#B91C1C] text-white'
              : 'bg-[#F8D94F] text-[#2E2E2E]';

            const rankBorderColor = isRank1
              ? 'border-[#FCA5A5] bg-[#FFF8F8]'
              : isRank2
              ? 'border-[#FED7AA] bg-[#FFFBF7]'
              : 'border-[#FDE68A] bg-[#FEFDF2]';

            const statusBadgeText = isRank1
              ? '최대 결핍 1위 (Critical)'
              : isRank2
              ? '고위험 2위 (High Risk)'
              : '주의 관찰 3위 (Warning)';

            return (
              <div
                key={item.facilityId}
                className={`rounded-[18px] border p-5 flex flex-col justify-between transition-all hover:shadow-md ${rankBorderColor}`}
              >
                <div>
                  {/* Top Rank Badge & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${rankBadgeColor}`}>
                      RANK {rank}
                    </span>
                    <span className="text-[11px] font-bold text-[#4B5563]">
                      {statusBadgeText}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
                    {item.facilityName}
                  </h4>

                  {/* Stock & Remaining Days */}
                  <div className="mt-3 bg-white/95 border border-[#E5E9EE] rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[#6B7280]">
                      <span>현재 보유 잔량:</span>
                      <strong className="text-[#2E2E2E] font-bold tabular-nums">
                        {item.currentStock.toFixed(1)} 톤
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[#6B7280]">
                      <span>소진 예상 기한:</span>
                      <strong className={`font-bold ${item.tank?.daysRemaining && item.tank.daysRemaining <= 5 ? 'text-[#E05342]' : 'text-[#D97706]'}`}>
                        {item.tank?.daysRemaining ? `잔여 ${item.tank.daysRemaining}일` : '모니터링'}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[#6B7280]">
                      <span>안전재고 미달 시점:</span>
                      <strong className="text-[#E05342] font-bold">
                        {item.deficitWeek}
                      </strong>
                    </div>
                  </div>

                  {/* 4-Week Shortage Highlight */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280] font-medium">4주 후 예상 누적 수급:</span>
                      <span className="text-base font-black text-[#E05342] tabular-nums">
                        {item.w4Surplus.toFixed(1)} 톤
                      </span>
                    </div>

                    {/* Deficit Visual Gauge */}
                    <div className="w-full bg-[#E5E9EE] h-2.5 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#F8D94F] to-[#E05342] rounded-full"
                        style={{
                          width: `${Math.min(100, (Math.abs(item.w4Surplus) / 50) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8A92A0] pt-0.5">
                      <span>부족 임계선(0.0T)</span>
                      <span>심각도: {Math.abs(item.w4Surplus) >= 30 ? '극심' : Math.abs(item.w4Surplus) >= 10 ? '중대' : '경계'}</span>
                    </div>
                  </div>

                  {/* Recommendation Note */}
                  <div className="mt-3 bg-white/80 border border-[#E5E9EE] rounded-xl p-2.5 text-[11px] text-[#4B5563] font-medium leading-relaxed">
                    <strong className="text-[#0D6F8F]">조치 권고:</strong>{' '}
                    {isRank1
                      ? '16톤 초저온 단열 탱크로리 3대 긴급 배차 필수 (W+0 및 W+1 분할 주입)'
                      : isRank2
                      ? '서산 ASU 기지 직송 긴급 수송 루트 배정 요망 (24톤 트레일러 우선 투입)'
                      : '부산 본사 잉여 재고(+56.0톤)를 활용한 거점 간 리밸런싱 지원 편성'}
                  </div>
                </div>

                {/* MS GAS Action CTA Button */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] text-[#6B7280] font-medium">배차 지시 연동</span>
                  <button
                    onClick={() => onOpenDispatchModal(item.facilityId)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
                      isRank1
                        ? 'bg-[#E05342] hover:bg-[#C93B2B] text-white'
                        : isRank2
                        ? 'bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E]'
                        : 'bg-[#0D6F8F] hover:bg-[#0A5770] text-white'
                    }`}
                  >
                    <span>
                      {isRank1
                        ? '천안 긴급 배차 지시'
                        : isRank2
                        ? '화성 배차 지시서 작성'
                        : '청주 이동 배차 검토'}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Strategic Guidance Note */}
        <div className="bg-[#E6F3F7] rounded-xl p-4 border border-[#C5E5EE] flex items-start gap-3 text-xs text-[#2E2E2E] leading-relaxed">
          <Sparkles className="w-4 h-4 text-[#0D6F8F] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#0D6F8F] font-bold">MS GAS 중앙관제실 대응 지침:</strong>{' '}
            천안 사업장과 화성 공장은 1주차 뒤(W+1)에 법정 안전재고 미달선에 동시 진입합니다. 서산 ASU 생산기지 및 부산 본사 보유 여유분(총 +58.5톤)을
            선제적으로 분산 공급하여 반도체 생산라인 및 협력사 공급 차질을 사전에 차단하십시오.
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE RECHARTS FORECAST LINE CHART (MS GAS Color Palette) */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs space-y-4">
        {/* Header & Station Selector Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5E9EE]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-4 bg-[#0D6F8F] rounded-full" />
              <h3 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
                4주간 액화질소(LN2) 과부족 전망 변화 추이 (Recharts 시각화)
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] mt-1 font-medium">
              각 기지별 주차별(W+0 ~ W+4) 예상 안전재고 차감 잔여량 추이를 그래프로 분석하고 결핍 시점을 시뮬레이션합니다.
            </p>
          </div>

          {/* MS GAS Segmented Controls */}
          <div className="flex items-center gap-1.5 bg-[#F6F8FA] p-1.5 rounded-xl border border-[#E5E9EE] self-start lg:self-center flex-wrap">
            {[
              { id: 'ALL', label: '전체 추이 비교' },
              { id: 'station-cheonan', label: '충남 천안' },
              { id: 'station-hwaseong', label: '경기 화성' },
              { id: 'station-cheongju', label: '충북 청주' },
              { id: 'station-busan', label: '부산 본사' },
              { id: 'station-dongbu', label: '동부 충전소' },
            ].map((tab) => {
              const isActive = selectedChartStation === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedChartStation(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0D6F8F] text-white shadow-xs'
                      : 'text-[#4B5563] hover:text-[#0D6F8F] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EE" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#E5E9EE' }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#E5E9EE' }}
                unit="T"
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span className="text-xs font-bold text-[#2E2E2E]">{value}</span>
                )}
              />
              {/* Zero Reference Line (Safe Threshold) */}
              <ReferenceLine
                y={0}
                stroke="#E05342"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '안전재고 임계선 (0.0톤)',
                  position: 'insideBottomRight',
                  fill: '#E05342',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />

              {/* 천안 Line (MS Teal) */}
              {(selectedChartStation === 'ALL' || selectedChartStation === 'station-cheonan') && (
                <Line
                  type="monotone"
                  dataKey="천안"
                  name="충남 천안"
                  stroke="#0D6F8F"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0D6F8F', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, stroke: '#0D6F8F', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}

              {/* 화성 Line (Critical Red) */}
              {(selectedChartStation === 'ALL' || selectedChartStation === 'station-hwaseong') && (
                <Line
                  type="monotone"
                  dataKey="화성"
                  name="경기 화성"
                  stroke="#E05342"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 5, fill: '#E05342', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, stroke: '#E05342', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}

              {/* 청주 Line (MS Secondary Yellow/Gold) */}
              {(selectedChartStation === 'ALL' || selectedChartStation === 'station-cheongju') && (
                <Line
                  type="monotone"
                  dataKey="청주"
                  name="충북 청주"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, stroke: '#F59E0B', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}

              {/* 부산 Line (MS Tertiary Slate) */}
              {(selectedChartStation === 'ALL' || selectedChartStation === 'station-busan') && (
                <Line
                  type="monotone"
                  dataKey="부산"
                  name="부산 본사"
                  stroke="#2E2E2E"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2E2E2E', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, stroke: '#2E2E2E', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}

              {/* 동부 Line (Emerald Green) */}
              {(selectedChartStation === 'ALL' || selectedChartStation === 'station-dongbu') && (
                <Line
                  type="monotone"
                  dataKey="동부"
                  name="동부 충전소"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Insight Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#F6F8FA] rounded-xl p-3 border border-[#E5E9EE] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDE8E6] text-[#E05342] flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#6B7280] font-medium">천안·화성 동시 결핍</div>
              <div className="text-xs font-bold text-[#E05342]">1주차 뒤(-6.8T / -2.5T) 전락</div>
            </div>
          </div>

          <div className="bg-[#F6F8FA] rounded-xl p-3 border border-[#E5E9EE] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E6F3F7] text-[#0D6F8F] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#6B7280] font-medium">부산 본사 잉여 보유량</div>
              <div className="text-xs font-bold text-[#0D6F8F]">최대 +56.0톤 (배차 지원 가능)</div>
            </div>
          </div>

          <div className="bg-[#F6F8FA] rounded-xl p-3 border border-[#E5E9EE] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FEF9E7] text-[#D97706] flex items-center justify-center shrink-0">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#6B7280] font-medium">청주 공장 전환점</div>
              <div className="text-xs font-bold text-[#D97706]">3주차 뒤(-2.1톤) 이동 검토 요망</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. WEEKLY FORECAST TABLE (MS GAS Brand Styling) */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs">
        {/* Table Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E5E9EE] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-4 bg-[#0D6F8F] rounded-full" />
              <h2 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
                주차별 액화질소 과부족 전망 <span className="text-xs font-normal text-[#6B7280]">(단위: 톤)</span>
              </h2>
            </div>
            <p className="text-xs text-[#6B7280] mt-1 font-medium">
              각 사업장별 입고 예정량 대비 고객 수요 차감 후 예상 잔여/부족량 (마이너스 수치는 추가 조치 필수)
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-bold text-[#2E2E2E] self-end md:self-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D6F8F]" />
              <span>정상</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>주의</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E05342]" />
              <span>부족/위험</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#6B7280] border-b border-[#E5E9EE] bg-[#F6F8FA]">
                <th className="py-3 px-3 font-bold text-[#2E2E2E] rounded-l-lg">사업장 구분</th>
                <th className="py-3 px-3 font-bold text-right text-[#2E2E2E]">현재고</th>
                <th className="py-3 px-3 font-bold text-right text-[#2E2E2E]">이번주 (W+0)</th>
                <th className="py-3 px-3 font-bold text-right text-[#2E2E2E]">1주차 뒤 (W+1)</th>
                <th className="py-3 px-3 font-bold text-right text-[#2E2E2E]">2주차 뒤 (W+2)</th>
                <th className="py-3 px-3 font-bold text-right text-[#2E2E2E]">3주차 뒤 (W+3)</th>
                <th className="py-3 px-3 font-bold text-right text-[#2E2E2E]">4주차 뒤 (W+4)</th>
                <th className="py-3 px-3 font-bold text-center text-[#2E2E2E] rounded-r-lg">조치 계획</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9EE] text-xs">
              {forecasts.map((row) => {
                const getDotColor = () => {
                  if (row.status === 'danger') return 'bg-[#E05342]';
                  if (row.status === 'warning') return 'bg-[#F59E0B]';
                  return 'bg-[#0D6F8F]';
                };

                const formatVal = (val: number) => {
                  const prefix = val > 0 ? '+' : '';
                  return `${prefix}${val.toFixed(1)}톤`;
                };

                const getValClass = (val: number) => {
                  if (val < 0) return 'text-[#E05342] font-black';
                  if (val <= 10) return 'text-[#D97706] font-bold';
                  return 'text-[#0D6F8F] font-bold';
                };

                return (
                  <tr
                    key={row.facilityId}
                    className="hover:bg-[#F6F8FA] transition-colors"
                  >
                    <td className="py-3.5 px-3 font-bold text-[#2E2E2E] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${getDotColor()}`} />
                        <span>{row.facilityName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-[#2E2E2E] tabular-nums whitespace-nowrap">
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
                          className="bg-[#E05342] hover:bg-[#C93B2B] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{row.actionLabel}</span>
                        </button>
                      )}
                      {row.actionType === 'maintain' && (
                        <span className="border border-[#0D6F8F] text-[#0D6F8F] bg-[#E6F3F7] font-bold text-xs px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6F8F]" />
                          <span>{row.actionLabel}</span>
                        </span>
                      )}
                      {row.actionType === 'rebalance_review' && (
                        <button
                          onClick={() => onOpenDispatchModal(row.facilityId)}
                          className="border border-[#DCE2E8] text-[#2E2E2E] hover:bg-[#F6F8FA] font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <Fuel className="w-3.5 h-3.5 text-[#0D6F8F]" />
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
        <div className="mt-4 pt-3.5 border-t border-[#E5E9EE] flex flex-col md:flex-row md:items-center justify-between text-[11px] text-[#8A92A0] gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[#6B7280] font-semibold">ⓘ 주차 기준:</span>
            <span>W+0 (05/19~05/25) · W+1 (05/26~06/01) · W+2 (06/02~06/08) · W+3 (06/09~06/15) · W+4 (06/16~06/22)</span>
          </div>
          <div className="text-[#0D6F8F] font-bold">
            MS GAS 통합 ERP 예측 알고리즘 v2.4 (일일 평균 소진율 가중 적용)
          </div>
        </div>
      </div>

      {/* 7. BOTTOM TWO CARDS (Unreported & Control Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Left: 오늘 재고 미입력 사업장 */}
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <h3 className="font-extrabold text-[#2E2E2E] text-sm">
                  오늘 재고 미입력 사업장
                </h3>
              </div>
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-md bg-[#FEF9E7] text-[#D97706] border border-[#FDE68A]">
                미입력 {unreported.filter((u) => u.status === 'pending').length}개소
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">
              정기 마감 시각(오전 09:00)까지 현장 실측 재고가 전송되지 않은 지점입니다.
            </p>

            {/* List of Unreported Facilities */}
            <div className="space-y-3">
              {unreported.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-[#0D6F8F] border border-[#E5E9EE] flex items-center justify-center shrink-0 shadow-2xs">
                      <Building2 className="w-5 h-5 text-[#0D6F8F]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2E2E2E] text-xs">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#E05342] font-bold bg-[#FDE8E6] border border-[#FCA5A5] px-2 py-0.5 rounded-md">
                          {item.lastConfirmedTime}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B7280] mt-1 font-medium">
                        담당자: {item.managerName} (연락처: {item.contact})
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onOpenSmsModal(item)}
                      disabled={item.status === 'completed'}
                      className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                        item.status === 'sent'
                          ? 'bg-[#2E2E2E] text-white'
                          : item.status === 'completed'
                          ? 'bg-[#10B981] text-white cursor-default'
                          : 'bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E]'
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
          <div className="mt-6 pt-3.5 border-t border-[#E5E9EE] flex items-center justify-between text-xs text-[#6B7280]">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#8A92A0]" />
              <span>차기 자동 리마인더 발송 예정: 10:00 (30분 후)</span>
            </div>
            <button
              onClick={onOpenHistoryModal}
              className="text-[#0D6F8F] hover:text-[#0A5770] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>미입력 이력 로그 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Right: 관제 조치 및 리포트 */}
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-[#E6F3F7] text-[#0D6F8F] flex items-center justify-center">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-extrabold text-[#2E2E2E] text-sm">
                관제 조치 및 공식 리포트
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] mb-4">
              실시간 센서 텔레메트리 데이터를 다시 취합하거나 공식 공급 보고서를 추출합니다.
            </p>

            {/* Calculated Time Status Box */}
            <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#2E2E2E]">
                <RotateCw className="w-4 h-4 text-[#0D6F8F]" />
                <span className="font-semibold">최근 전체 산출 시각:</span>
              </div>
              <span className="text-xs font-bold text-[#0D6F8F] font-mono tabular-nums">
                {lastCalculatedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons in exact MS GAS Button Style */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="w-full bg-white hover:bg-[#F6F8FA] text-[#0D6F8F] border-2 border-[#0D6F8F] rounded-xl py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-[#0D6F8F]' : ''}`}
              />
              <span>실시간 재계산</span>
            </button>

            <button
              onClick={onDownloadExcel}
              className="w-full bg-[#0D6F8F] hover:bg-[#0A5770] text-white rounded-xl py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
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
