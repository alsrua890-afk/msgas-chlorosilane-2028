import React, { useState } from 'react';
import { X, Truck, AlertTriangle, ShieldCheck, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { TankerTruck, TankStation } from '../types/ln2.ts';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: TankStation[];
  trucks: TankerTruck[];
  targetFacilityId?: string;
  onSubmitDispatch: (data: {
    sourceStation: string;
    destStation: string;
    truckId: string;
    volumeTons: number;
    departureTime: string;
    arrivalTime: string;
    priority: 'emergency' | 'high' | 'normal';
    memo: string;
  }) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  stations,
  trucks,
  targetFacilityId,
  onSubmitDispatch,
}) => {
  if (!isOpen) return null;

  const defaultDest =
    stations.find((s) => s.id === targetFacilityId)?.name ||
    '충남 천안 사업장 (탱크 1호기)';

  const [source, setSource] = useState('서산 ASU 생산기지');
  const [dest, setDest] = useState(defaultDest);
  const [truckId, setTruckId] = useState(trucks[0]?.id || '');
  const [volume, setVolume] = useState(16.0);
  const [priority, setPriority] = useState<'emergency' | 'high' | 'normal'>(
    targetFacilityId === 'station-cheonan' ? 'emergency' : 'normal'
  );
  const [memo, setMemo] = useState(
    targetFacilityId === 'station-cheonan'
      ? '천안 사업장 잔여 5일 긴급 안전재고 미달 방지 보충 건 (최우선 배차)'
      : '정기 수급 안정화 보충 배차'
  );

  const selectedTruck = trucks.find((t) => t.id === truckId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const departure = `${now.getHours().toString().padStart(2, '0')}:${(now.getMinutes() + 15).toString().padStart(2, '0')}`;
    const arrival = `${(now.getHours() + 2).toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    onSubmitDispatch({
      sourceStation: source,
      destStation: dest,
      truckId,
      volumeTons: Number(volume),
      departureTime: departure,
      arrivalTime: arrival,
      priority,
      memo,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D24]/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-[24px] max-w-xl w-full shadow-2xl border border-[#E5E9EE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#101D24] text-white flex items-center justify-between border-b border-[#1C2C35]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D6F8F] flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                액화질소(LN2) 탱크로리 배차 지시서 작성
              </h3>
              <p className="text-xs text-[#7E8E98] mt-0.5">
                MS GAS ASU 기지 출하 및 긴급 수급 균형 배차 승인
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Priority Selection */}
          <div>
            <label className="block text-[#2E2E2E] font-bold mb-2">
              배차 우선순위 (Priority Level)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPriority('emergency')}
                className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'emergency'
                    ? 'bg-[#E05342] text-white border-[#E05342] shadow-xs'
                    : 'bg-[#F6F8FA] text-[#2E2E2E] border-[#E5E9EE] hover:bg-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>긴급 (PRIORITY 1)</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-[#F8D94F] text-[#2E2E2E] border-[#F8D94F] shadow-xs'
                    : 'bg-[#F6F8FA] text-[#2E2E2E] border-[#E5E9EE] hover:bg-white'
                }`}
              >
                <span>우선 배차</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'normal'
                    ? 'bg-[#0D6F8F] text-white border-[#0D6F8F] shadow-xs'
                    : 'bg-[#F6F8FA] text-[#2E2E2E] border-[#E5E9EE] hover:bg-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>일반 정기 배차</span>
              </button>
            </div>
          </div>

          {/* Section: Origin -> Destination */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[#4B5563] font-bold mb-1.5">
                출발지 (ASU 공급 생산기지)
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs text-[#2E2E2E] font-bold focus:ring-2 focus:ring-[#0D6F8F]"
              >
                <option value="서산 ASU 생산기지">서산 ASU 생산기지 (충남)</option>
                <option value="부산 본사 (메인 탱크)">부산 본사 (메인 저장탱크)</option>
                <option value="충북 청주공장">충북 청주공장</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4B5563] font-bold mb-1.5">
                도착지 (보충 대상 사업장)
              </label>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs text-[#2E2E2E] font-bold focus:ring-2 focus:ring-[#0D6F8F]"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.statusLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Assignment */}
          <div>
            <label className="block text-[#4B5563] font-bold mb-1.5">
              배정 탱크로리 차량 및 기사
            </label>
            <select
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs text-[#2E2E2E] font-bold focus:ring-2 focus:ring-[#0D6F8F]"
            >
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.truckNo} ({truck.modelName}) · {truck.driverName} (
                  {truck.status === 'standby' ? '출동 가능' : '운행 중'})
                </option>
              ))}
            </select>
            {selectedTruck && (
              <div className="mt-1.5 text-[11px] text-[#0D6F8F] font-semibold flex items-center gap-1.5 bg-[#E6F3F7] p-2 rounded-lg">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>차량 현재 위치: {selectedTruck.currentLocation}</span>
              </div>
            )}
          </div>

          {/* Volume Slider & Numeric Input */}
          <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2E2E2E]">배차 공급 물량 (LN2)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="5"
                  max="24"
                  step="0.5"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 bg-white border border-[#DCE2E8] rounded-lg px-3 py-1 text-right font-black text-sm text-[#0D6F8F] focus:outline-hidden focus:ring-2 focus:ring-[#0D6F8F] tabular-nums"
                />
                <span className="font-bold text-[#4B5563]">톤</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="24"
              step="0.5"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[#0D6F8F] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#8A92A0] font-medium">
              <span>최소 5.0톤</span>
              <span>권장 16.0톤 (1대분)</span>
              <span>최대 24.0톤 (트레일러)</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[#4B5563] font-bold mb-1.5">
              관제 특이사항 및 하역 지시 메모
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 천안 1호 탱크 입고 전 진공압력 확인 필수"
              className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-3 text-xs text-[#2E2E2E] font-medium focus:ring-2 focus:ring-[#0D6F8F] focus:outline-hidden"
            />
          </div>

          {/* Action Buttons: MS GAS Button Pattern */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#DCE2E8] text-[#2E2E2E] hover:bg-[#F6F8FA] font-bold cursor-pointer transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>배차 승인 및 전송</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
