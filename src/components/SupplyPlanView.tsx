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
    <div className="p-6 space-y-5 max-w-[1520px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-blue-600 rounded-xs"></div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              초저온 탱크로리 배차 및 공급 운송 계획
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ASU 생산기지에서 전국 저장기지 및 대형 고객사로 이어지는 LN2 극저온 운송 차량의 관제 상태와 배차 지시를 관리합니다.
          </p>
        </div>

        <button
          onClick={onOpenNewDispatch}
          className="self-start md:self-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 배차 지시서 작성</span>
        </button>
      </div>

      {/* Fleet Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">전체 보유 탱크로리</span>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
            {trucks.length} 대
          </div>
          <span className="text-[11px] text-slate-400">총 적재 가능량: 74.0톤</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">출동 대기 (즉시 배차 가능)</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
            {standbyCount} 대
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">비상 대응 가동 가능</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">운송 중 (고속도로/국도)</span>
          <div className="text-2xl font-black text-blue-600 mt-1 tabular-nums">
            {inTransitCount} 대
          </div>
          <span className="text-[11px] text-blue-500 font-semibold">GPS 실시간 추적 중</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">ASU 기지 적재/충전 중</span>
          <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
            {loadingCount} 대
          </div>
          <span className="text-[11px] text-amber-600 font-medium">인입 충전 90% 완료</span>
        </div>
      </div>

      {/* Active Dispatches Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              실시간 배차 지시 현황 및 운송 현황
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            총 {dispatches.length}건 배차 진행 중
          </span>
        </div>

        {dispatches.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            현재 진행 중인 배차 지시가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">배차 번호</th>
                  <th className="py-2.5 px-3 font-semibold">우선순위</th>
                  <th className="py-2.5 px-3 font-semibold">구간 (출발지 → 도착지)</th>
                  <th className="py-2.5 px-3 font-semibold">배정 차량/기사</th>
                  <th className="py-2.5 px-3 font-semibold text-right">운송 중량</th>
                  <th className="py-2.5 px-3 font-semibold">출발/도착 예정</th>
                  <th className="py-2.5 px-3 font-semibold">진행 상태</th>
                  <th className="py-2.5 px-3 font-semibold text-center">관제 승인</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispatches.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {disp.orderNo}
                    </td>
                    <td className="py-3 px-3">
                      {disp.priority === 'emergency' ? (
                        <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded">
                          긴급 (PRIORITY 1)
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                          일반 정기
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{disp.sourceStation}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-blue-700">{disp.destStation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-semibold">{disp.truckNo}</span> ({disp.driverName})
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {disp.volumeTons.toFixed(1)} 톤
                    </td>
                    <td className="py-3 px-3 text-slate-500 tabular-nums">
                      {disp.departureTime} ~ {disp.arrivalTime}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <span>{disp.status === 'dispatched' ? '운행 중' : '배차 확정'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onCompleteDispatch(disp.id)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
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
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm mb-3">
          보유 극저온 탱크로리 차량 및 운전자 현황
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-start justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-200/90 text-slate-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {truck.truckNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        truck.status === 'standby'
                          ? 'bg-emerald-100 text-emerald-800'
                          : truck.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {truck.status === 'standby'
                        ? '대기중'
                        : truck.status === 'in_transit'
                        ? '운송중'
                        : '적재중'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {truck.modelName} (적재: {truck.capacityTons}톤)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 mt-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>현재 위치: {truck.currentLocation}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-800">{truck.driverName}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
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
