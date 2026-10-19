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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                액화질소(LN2) 탱크로리 배차 지시서 작성
              </h3>
              <p className="text-[11px] text-slate-300">
                기지별 재고 균형 및 긴급 수요 대응을 위한 운송 지시를 승인합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Priority Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              배차 우선순위 (Priority)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('emergency')}
                className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'emergency'
                    ? 'bg-red-500 text-white border-red-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>긴급 (PRIORITY 1)</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>우선 배차</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  priority === 'normal'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>일반 정기 배차</span>
              </button>
            </div>
          </div>

          {/* Route Section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                출발지 (ASU 생산기지 / 저장소)
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="서산 ASU 생산기지">서산 ASU 생산기지 (충청)</option>
                <option value="부산 본사 (메인 탱크)">부산 본사 (메인 저장소)</option>
                <option value="여수 대형 분리 플랜트">여수 대형 분리 플랜트</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                도착지 (대상 사업장)
              </label>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="동부 충전소">동부 충전소</option>
              </select>
            </div>
          </div>

          {/* Truck & Driver Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              배정 탱크로리 차량 및 기사
            </label>
            <select
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.status === 'standby' ? '대기중' : '운행중'}] {t.truckNo} ({t.modelName}) - {t.driverName} ({t.currentLocation})
                </option>
              ))}
            </select>
            {selectedTruck && (
              <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                <span>차량 최대적재: {selectedTruck.capacityTons}톤</span>
                <span>기사 연락처: {selectedTruck.driverPhone}</span>
              </div>
            )}
          </div>

          {/* Volume Slider & Numeric Input */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">배차 공급 물량 (LN2)</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="5"
                  max="24"
                  step="0.5"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-right font-black text-sm text-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-500 tabular-nums"
                />
                <span className="font-bold text-slate-600">톤</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="24"
              step="0.5"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>최소 5.0톤</span>
              <span>권장 16.0톤 (1대분)</span>
              <span>최대 24.0톤 (트레일러)</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              관제 특이사항 및 하역 지시 메모
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 천안 1호 탱크 입고 전 진공압력 확인 필수"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
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
