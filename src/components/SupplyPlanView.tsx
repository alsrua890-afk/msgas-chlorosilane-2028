import React from 'react';
import { Truck, MapPin, Plus, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Navigation } from 'lucide-react';
import { TankerTruck, DispatchOrder } from '../types/ln2.ts';

interface SupplyPlanViewProps {
  trucks: TankerTruck[];
  dispatches: DispatchOrder[];
  onOpenNewDispatch: () => void;
  onCompleteDispatch: (id: string) => void;
}

export const SupplyPlanView: React.FC<SupplyPlanViewProps> = ({
  trucks,
  dispatches,
  onOpenNewDispatch,
  onCompleteDispatch,
}) => {
  const standbyCount = trucks.filter((t) => t.status === 'standby').length;
  const inTransitCount = trucks.filter((t) => t.status === 'in_transit').length;
  const loadingCount = trucks.filter((t) => t.status === 'loading').length;

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1520px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-[#0D6F8F] rounded-full" />
            <h2 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
              초저온 탱크로리 배차 및 공급 운송 계획
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            서산 ASU 생산기지에서 전국 저장기지 및 대형 고객사로 이어지는 MS GAS LN2 극저온 운송 차량의 관제 상태와 배차 지시를 관리합니다.
          </p>
        </div>

        <button
          onClick={onOpenNewDispatch}
          className="self-start md:self-center bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 배차 지시서 작성</span>
        </button>
      </div>

      {/* Fleet Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">전체 보유 탱크로리</span>
          <div className="text-3xl font-black text-[#2E2E2E] mt-1 tabular-nums">
            {trucks.length} 대
          </div>
          <span className="text-[11px] text-[#8A92A0] font-medium">총 적재 가능량: 74.0톤</span>
        </div>

        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">출동 대기 (즉시 배차 가능)</span>
          <div className="text-3xl font-black text-[#10B981] mt-1 tabular-nums">
            {standbyCount} 대
          </div>
          <span className="text-[11px] text-[#10B981] font-bold">비상 대응 가동 가능</span>
        </div>

        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">운송 중 (고속도로/국도)</span>
          <div className="text-3xl font-black text-[#0D6F8F] mt-1 tabular-nums">
            {inTransitCount} 대
          </div>
          <span className="text-[11px] text-[#0D6F8F] font-bold">GPS 실시간 추적 중</span>
        </div>

        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">ASU 기지 적재/충전 중</span>
          <div className="text-3xl font-black text-[#D97706] mt-1 tabular-nums">
            {loadingCount} 대
          </div>
          <span className="text-[11px] text-[#D97706] font-bold">인입 충전 90% 완료</span>
        </div>
      </div>

      {/* Active Dispatches Table */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E9EE] mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#0D6F8F]" />
            <h3 className="font-extrabold text-[#2E2E2E] text-sm">
              실시간 배차 지시 현황 및 운송 현황
            </h3>
          </div>
          <span className="text-xs text-[#8A92A0] font-medium">
            총 {dispatches.length}건 배차 진행 중
          </span>
        </div>

        {dispatches.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8A92A0] font-medium">
            현재 진행 중인 배차 지시가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F6F8FA] text-[#6B7280] border-b border-[#E5E9EE]">
                  <th className="py-3 px-4 font-bold rounded-l-lg">배차 번호</th>
                  <th className="py-3 px-3 font-bold">우선순위</th>
                  <th className="py-3 px-3 font-bold">구간 (출발지 → 도착지)</th>
                  <th className="py-3 px-3 font-bold">배정 차량/기사</th>
                  <th className="py-3 px-3 font-bold text-right">운송 중량</th>
                  <th className="py-3 px-3 font-bold">출발/도착 예정</th>
                  <th className="py-3 px-3 font-bold">진행 상태</th>
                  <th className="py-3 px-4 font-bold text-center rounded-r-lg">관제 승인</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9EE]">
                {dispatches.map((disp) => (
                  <tr key={disp.id} className="hover:bg-[#F6F8FA] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2E2E2E]">
                      {disp.orderNo}
                    </td>
                    <td className="py-3.5 px-3">
                      {disp.priority === 'emergency' ? (
                        <span className="bg-[#FDE8E6] text-[#E05342] border border-[#FCA5A5] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          긴급 (PRIORITY 1)
                        </span>
                      ) : (
                        <span className="bg-[#F6F8FA] text-[#4B5563] border border-[#E5E9EE] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          일반 정기
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#2E2E2E]">
                      <div className="flex items-center gap-1.5">
                        <span>{disp.sourceStation}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8A92A0]" />
                        <span className="text-[#0D6F8F]">{disp.destStation}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-[#2E2E2E]">
                      <span className="font-bold">{disp.truckNo}</span> ({disp.driverName})
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-[#2E2E2E] tabular-nums">
                      {disp.volumeTons.toFixed(1)} 톤
                    </td>
                    <td className="py-3.5 px-3 text-[#6B7280] tabular-nums font-medium">
                      {disp.departureTime} ~ {disp.arrivalTime}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D6F8F] bg-[#E6F3F7] px-2.5 py-0.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-[#0D6F8F] animate-pulse"></span>
                        <span>{disp.status === 'dispatched' ? '운행 중' : '배차 확정'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onCompleteDispatch(disp.id)}
                        className="bg-[#E8F9F3] text-[#10B981] hover:bg-[#D1F3E7] border border-[#A7E9D3] px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                      >
                        하역 완료 처리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fleet Directory */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs">
        <h3 className="font-extrabold text-[#2E2E2E] text-sm mb-4">
          MS GAS 보유 극저온 탱크로리 차량 및 운전자 현황
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 flex items-start justify-between"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E9EE] text-[#0D6F8F] flex items-center justify-center shrink-0 shadow-2xs">
                  <Truck className="w-5 h-5 text-[#0D6F8F]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2E2E2E] text-sm">
                      {truck.truckNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        truck.status === 'standby'
                          ? 'bg-[#E8F9F3] text-[#10B981]'
                          : truck.status === 'in_transit'
                          ? 'bg-[#E6F3F7] text-[#0D6F8F]'
                          : 'bg-[#FEF9E7] text-[#D97706]'
                      }`}
                    >
                      {truck.status === 'standby'
                        ? '대기중'
                        : truck.status === 'in_transit'
                        ? '운송중'
                        : '적재중'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1 font-medium">
                    {truck.modelName} (적재: {truck.capacityTons}톤)
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4B5563] mt-2.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#0D6F8F]" />
                    <span>현재 위치: {truck.currentLocation}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-[#2E2E2E]">{truck.driverName}</div>
                <div className="text-[11px] text-[#8A92A0] font-mono mt-0.5 font-medium">
                  {truck.driverPhone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
