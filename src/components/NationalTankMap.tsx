import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Gauge,
  Thermometer,
  Layers,
  Maximize2,
  Navigation,
  ArrowRight,
  TrendingDown,
  Fuel,
  Info,
} from 'lucide-react';
import { TankStation } from '../types/ln2.ts';

interface NationalTankMapProps {
  tanks: TankStation[];
  onOpenDispatchModal: (facilityId: string) => void;
  onOpenTelemetryModal: (station: TankStation) => void;
}

export const NationalTankMap: React.FC<NationalTankMapProps> = ({
  tanks,
  onOpenDispatchModal,
  onOpenTelemetryModal,
}) => {
  // Filter status: 'ALL' | 'danger' | 'warning' | 'normal'
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'danger' | 'warning' | 'normal'>('ALL');
  const [selectedStationId, setSelectedStationId] = useState<string>('station-cheonan');
  const [showRoutes, setShowRoutes] = useState<boolean>(true);

  // Map station coordinate layout for South Korea SVG
  const stationLocations: Record<string, { x: number; y: number; region: string; shortName: string }> = {
    'station-cheonan': { x: 39, y: 44, region: '충청남도 천안시', shortName: '천안 1호기' },
    'station-hwaseong': { x: 36, y: 32, region: '경기도 화성시', shortName: '화성 공장' },
    'station-cheongju': { x: 49, y: 49, region: '충청북도 청주시', shortName: '청주 공장' },
    'station-busan': { x: 74, y: 80, region: '부산광역시 강서구', shortName: '부산 본사' },
    'station-dongbu': { x: 74, y: 26, region: '강원도 동해안', shortName: '동부 충전소' },
  };

  // Supply hubs & active routes
  const asuHub = { id: 'hub-seosan', name: '서산 ASU 생산기지', x: 27, y: 42 };

  // Filtered tanks
  const filteredTanks = tanks.filter((t) => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  const selectedStation = tanks.find((t) => t.id === selectedStationId) || tanks[0];

  const getStatusColor = (status: 'danger' | 'warning' | 'normal') => {
    switch (status) {
      case 'danger':
        return {
          bg: '#E05342',
          text: '#E05342',
          pillBg: '#FDE8E6',
          border: '#FCA5A5',
          pulse: 'bg-[#E05342]',
          label: '부족 (위험)',
        };
      case 'warning':
        return {
          bg: '#F59E0B',
          text: '#B45309',
          pillBg: '#FEF9E7',
          border: '#FDE68A',
          pulse: 'bg-[#F59E0B]',
          label: '주의 (모니터링)',
        };
      case 'normal':
      default:
        return {
          bg: '#0D6F8F',
          text: '#0D6F8F',
          pillBg: '#E6F3F7',
          border: '#C5E5EE',
          pulse: 'bg-[#0D6F8F]',
          label: '정상 (안정)',
        };
    }
  };

  return (
    <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs space-y-5">
      {/* 1. Header with MS GAS Pill Filters & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5E9EE]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-[#0D6F8F] rounded-full" />
            <h2 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
              전국 사업장 실시간 LN2 저장 탱크 잔량 관제 맵
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            전국 주요 반도체/산업 거점의 액화질소 잔량 상태(부족/주의/정상) 및 서산 ASU 공급 수송망을 인터랙티브 지도로 시각화합니다.
          </p>
        </div>

        {/* Filter Tabs & Route Toggle */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F6F8FA] p-1 rounded-xl border border-[#E5E9EE] text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#0D6F8F] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#0D6F8F]'
              }`}
            >
              전체 ({tanks.length})
            </button>
            <button
              onClick={() => setStatusFilter('danger')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'danger'
                  ? 'bg-[#E05342] text-white shadow-xs'
                  : 'text-[#E05342] hover:bg-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E05342]" />
              <span>위험 ({tanks.filter((t) => t.status === 'danger').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'warning'
                  ? 'bg-[#F8D94F] text-[#2E2E2E] shadow-xs'
                  : 'text-[#D97706] hover:bg-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>주의 ({tanks.filter((t) => t.status === 'warning').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'normal'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-[#10B981] hover:bg-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>정상 ({tanks.filter((t) => t.status === 'normal').length})</span>
            </button>
          </div>

          {/* Transport Route Toggle */}
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showRoutes
                ? 'bg-[#E6F3F7] text-[#0D6F8F] border-[#C5E5EE]'
                : 'bg-[#F6F8FA] text-[#6B7280] border-[#E5E9EE] hover:bg-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>운송 루트 {showRoutes ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Map Grid: Interactive Map (Left) + Selected Station Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Vector Map Area (7 cols) */}
        <div className="lg:col-span-7 bg-[#F6F8FA] border border-[#E5E9EE] rounded-[18px] p-5 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Map Top Indicators */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] z-10 select-none">
            <div className="flex items-center gap-2 bg-white/95 px-3 py-1 rounded-xl border border-[#E5E9EE] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-bold text-[#2E2E2E]">전국 5개 기지 실시간 IoT 수신중</span>
            </div>
            <div className="text-[11px] font-semibold text-[#8A92A0]">
              거점 클릭 시 실시간 압력·온도 확인
            </div>
          </div>

          {/* SVG Canvas Map */}
          <div className="relative w-full h-[390px] flex items-center justify-center my-auto">
            <svg
              viewBox="0 0 500 560"
              className="w-full h-full max-h-[390px] select-none"
              style={{ filter: 'drop-shadow(0px 2px 8px rgba(13, 111, 143, 0.06))' }}
            >
              {/* Subtle Map Grid lines */}
              <defs>
                <pattern id="msMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E9EE" strokeWidth="0.6" strokeOpacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#msMapGrid)" />

              {/* South Korea Mainland Outline Vector */}
              <path
                d="M 120 70 
                   Q 150 45, 230 45 
                   Q 310 40, 360 85 
                   L 390 140 
                   Q 410 200, 420 260 
                   L 415 340 
                   Q 410 400, 395 440 
                   L 360 480 
                   Q 320 505, 260 500 
                   L 190 490 
                   Q 140 460, 130 410 
                   L 135 340 
                   Q 110 300, 105 240 
                   L 100 170 
                   Q 95 110, 120 70 Z"
                fill="#FFFFFF"
                stroke="#C5E5EE"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Regional Shading / Boundaries */}
              <circle cx="180" cy="180" r="45" fill="#E6F3F7" fillOpacity="0.4" />
              <circle cx="210" cy="250" r="50" fill="#E6F3F7" fillOpacity="0.4" />
              <circle cx="340" cy="380" r="70" fill="#E6F3F7" fillOpacity="0.4" />

              {/* Major Highway Transport Routes (MS GAS Signature Swoosh Flow) */}
              {showRoutes && (
                <g className="routes" opacity="0.9">
                  {/* Seosan ASU to Hwaseong */}
                  <path
                    d="M 135 235 Q 155 205, 180 180"
                    fill="none"
                    stroke="#0D6F8F"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    className="animate-pulse"
                  />
                  {/* Seosan ASU to Cheonan */}
                  <path
                    d="M 135 235 Q 165 240, 195 246"
                    fill="none"
                    stroke="#E05342"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                  {/* Cheonan to Cheongju */}
                  <path
                    d="M 195 246 Q 220 260, 245 274"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  {/* Seosan ASU to Dongbu (Yeongdong Route) */}
                  <path
                    d="M 135 235 Q 260 170, 370 146"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                  {/* Busan HQ to Cheongju (Emergency Rebalance Route) */}
                  <path
                    d="M 370 448 Q 300 360, 245 274"
                    fill="none"
                    stroke="#2E2E2E"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    opacity="0.5"
                  />
                </g>
              )}

              {/* Seosan ASU Production Hub Marker */}
              <g transform="translate(135, 235)">
                <circle r="8" fill="#2E2E2E" stroke="#FFFFFF" strokeWidth="2.5" />
                <rect x="-38" y="-25" width="76" height="18" rx="6" fill="#2E2E2E" />
                <text x="0" y="-13" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="bold">
                  서산 ASU기지
                </text>
              </g>

              {/* Station Markers */}
              {tanks.map((tank) => {
                const loc = stationLocations[tank.id];
                if (!loc) return null;

                const cx = (loc.x / 100) * 500;
                const cy = (loc.y / 100) * 560;
                const isSelected = selectedStationId === tank.id;
                const colors = getStatusColor(tank.status);

                return (
                  <g
                    key={tank.id}
                    transform={`translate(${cx}, ${cy})`}
                    onClick={() => setSelectedStationId(tank.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Aura if Danger */}
                    {tank.status === 'danger' && (
                      <circle
                        r="18"
                        fill="#E05342"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Selection Ring */}
                    {isSelected && (
                      <circle
                        r="15"
                        fill="none"
                        stroke="#0D6F8F"
                        strokeWidth="2.5"
                        strokeDasharray="3 2"
                      />
                    )}

                    {/* Pin Circle */}
                    <circle
                      r="9"
                      fill={colors.bg}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Stock Value Badge */}
                    <rect
                      x="-36"
                      y="-28"
                      width="72"
                      height="18"
                      rx="6"
                      fill={isSelected ? '#0D6F8F' : '#2E2E2E'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="-16"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {loc.shortName} · {tank.currentStock.toFixed(0)}T
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Legend */}
          <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-2 border-t border-[#E5E9EE]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#E05342]" />
                <span className="font-bold text-[#E05342]">위험 (천안, 화성)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="font-bold text-[#D97706]">주의 (청주)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0D6F8F]" />
                <span className="font-bold text-[#0D6F8F]">정상 (부산, 동부)</span>
              </span>
            </div>
            <span className="text-[10px] text-[#8A92A0]">ASU 메인 공급라인 연동</span>
          </div>
        </div>

        {/* Right Column: Selected Station Telemetry & Specs (5 cols) */}
        {selectedStation && (
          <div className="lg:col-span-5 bg-white border border-[#E5E9EE] rounded-[18px] p-5 flex flex-col justify-between shadow-2xs">
            <div>
              {/* Top Station Name & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E9EE]">
                <div>
                  <div className="text-[11px] font-bold text-[#8A92A0] uppercase tracking-wider">
                    {selectedStation.stationCode}
                  </div>
                  <h3 className="text-base font-extrabold text-[#2E2E2E] tracking-tight mt-0.5">
                    {selectedStation.name}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    selectedStation.status === 'danger'
                      ? 'bg-[#FDE8E6] text-[#E05342] border-[#FCA5A5]'
                      : selectedStation.status === 'warning'
                      ? 'bg-[#FEF9E7] text-[#D97706] border-[#FDE68A]'
                      : 'bg-[#E6F3F7] text-[#0D6F8F] border-[#C5E5EE]'
                  }`}
                >
                  {selectedStation.statusLabel}
                </span>
              </div>

              {/* Main Storage Metric Box */}
              <div className="mt-4 bg-[#F6F8FA] rounded-xl p-4 border border-[#E5E9EE]">
                <div className="text-xs text-[#6B7280] font-medium">현재 초저온 액화질소 잔량</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#2E2E2E] tabular-nums">
                    {selectedStation.currentStock.toFixed(1)} 톤
                  </span>
                  <span className="text-sm font-bold text-[#6B7280] tabular-nums">
                    / {selectedStation.maxCapacity.toFixed(1)} 톤 ({selectedStation.fillLevelPercent.toFixed(1)}%)
                  </span>
                </div>

                {/* Mini Visual Fill Bar */}
                <div className="w-full bg-[#E5E9EE] h-2.5 rounded-full overflow-hidden mt-3 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedStation.status === 'danger'
                        ? 'bg-[#E05342]'
                        : selectedStation.status === 'warning'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#0D6F8F]'
                    }`}
                    style={{ width: `${selectedStation.fillLevelPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8A92A0] pt-1">
                  <span>0톤</span>
                  <span className="font-bold text-[#E05342]">법정 안전재고 {selectedStation.safeStock}톤 (10%)</span>
                  <span>{selectedStation.maxCapacity}톤</span>
                </div>
              </div>

              {/* Sensor Telemetry Specs */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F6F8FA] rounded-xl p-3 border border-[#E5E9EE]">
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
                    <Gauge className="w-3.5 h-3.5 text-[#0D6F8F]" />
                    <span>내부 탱크 압력</span>
                  </div>
                  <div className="text-base font-black text-[#2E2E2E] tabular-nums">
                    {selectedStation.pressureMpa} <span className="text-xs font-semibold text-[#6B7280]">MPa</span>
                  </div>
                  <span className="text-[10px] text-[#10B981] font-bold">정상 가동 범위 (0.8~1.0)</span>
                </div>

                <div className="bg-[#F6F8FA] rounded-xl p-3 border border-[#E5E9EE]">
                  <div className="flex items-center gap-1.5 text-[#6B7280] mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-[#0D6F8F]" />
                    <span>극저온 센서 온도</span>
                  </div>
                  <div className="text-base font-black text-[#2E2E2E] tabular-nums">
                    {selectedStation.temperatureC} <span className="text-xs font-semibold text-[#6B7280]">℃</span>
                  </div>
                  <span className="text-[10px] text-[#0D6F8F] font-bold">LN2 초저온 단열 양호</span>
                </div>
              </div>

              {/* Daily Outflow & Depletion Estimation */}
              <div className="mt-3 bg-[#F6F8FA] rounded-xl p-3 text-xs space-y-1.5 border border-[#E5E9EE]">
                <div className="flex justify-between text-[#6B7280]">
                  <span>일일 평균 소비량:</span>
                  <strong className="text-[#2E2E2E] font-bold tabular-nums">
                    {selectedStation.dailyOutflowAvg.toFixed(1)} 톤/일
                  </strong>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>안전재고 미달 잔여일수:</span>
                  <strong
                    className={`font-black ${
                      selectedStation.daysRemaining <= 5
                        ? 'text-[#E05342]'
                        : selectedStation.daysRemaining <= 10
                        ? 'text-[#D97706]'
                        : 'text-[#0D6F8F]'
                    }`}
                  >
                    약 {selectedStation.daysRemaining}일 남음
                  </strong>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>최종 텔레메트리 상태:</span>
                  <span className="text-[#10B981] font-semibold">{selectedStation.telemetryLastReceived}</span>
                </div>
              </div>
            </div>

            {/* Bottom Dual Action Buttons (MS GAS Styled) */}
            <div className="grid grid-cols-2 gap-2.5 mt-5 pt-3 border-t border-[#E5E9EE]">
              <button
                onClick={() => onOpenTelemetryModal(selectedStation)}
                className="bg-white hover:bg-[#F6F8FA] text-[#0D6F8F] border border-[#0D6F8F] rounded-xl py-2 px-3 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                밸브·압력 상세
              </button>

              <button
                onClick={() => onOpenDispatchModal(selectedStation.id)}
                className={`rounded-xl py-2 px-3 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 ${
                  selectedStation.status === 'danger'
                    ? 'bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E]'
                    : 'bg-[#0D6F8F] hover:bg-[#0A5770] text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>배차 지시서 작성</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
