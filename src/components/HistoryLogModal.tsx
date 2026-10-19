import React, { useState } from 'react';
import { X, History, Building2, CheckCircle2, Clock, PlusCircle } from 'lucide-react';
import { UnreportedFacility } from '../types/ln2.ts';

interface HistoryLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreported: UnreportedFacility[];
  onManualInventorySubmit: (facilityId: string, tons: number) => void;
}

export const HistoryLogModal: React.FC<HistoryLogModalProps> = ({
  isOpen,
  onClose,
  unreported,
  onManualInventorySubmit,
}) => {
  if (!isOpen) return null;

  const [selectedFacility, setSelectedFacility] = useState(unreported[0]?.id || 'unreported-dongbu');
  const [manualTons, setManualTons] = useState(24.5);
  const [showManualForm, setShowManualForm] = useState(false);

  const historyLogs = [
    { date: '2025-05-19', facility: '충남 천안 사업장', time: '08:42:10', stock: '37.2톤', status: '정상 전송' },
    { date: '2025-05-19', facility: '부산 본사 (메인)', time: '08:50:00', stock: '84.0톤', status: '정상 전송' },
    { date: '2025-05-19', facility: '충북 청주공장', time: '08:55:18', stock: '45.0톤', status: '정상 전송' },
    { date: '2025-05-19', facility: '동부 충전소', time: '-', stock: '미제출', status: '지연 (09:00 마감초과)' },
    { date: '2025-05-18', facility: '동부 충전소', time: '09:12:00', stock: '26.8톤', status: '지연 제출' },
    { date: '2025-05-17', facility: '동부 충전소', time: '08:35:10', stock: '29.1톤', status: '정상 전송' },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onManualInventorySubmit(selectedFacility, Number(manualTons));
    setShowManualForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                사업장 재고 보고 이력 로그 및 현장 대행 입력
              </h3>
              <p className="text-[11px] text-slate-300">
                매일 오전 09:00 정기 마감 기준 실측 데이터 보고 추적
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Quick Manual Entry Banner */}
          {!showManualForm ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-800 text-xs">
                  현장 유선 확인 후 관제실 직접 수동 등록이 필요하십니까?
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  미입력 사업장의 전화 구두 보고치를 관제실에서 즉시 전산 반영할 수 있습니다.
                </div>
              </div>
              <button
                onClick={() => setShowManualForm(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>수동 실측치 입력</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>관제 대행 수동 재고 입력</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">대상 사업장</label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                  >
                    {unreported.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (담당: {u.managerName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">현장 실측 잔량 (톤)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={manualTons}
                      onChange={(e) => setManualTons(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800"
                    />
                    <span className="font-bold text-slate-600">톤</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                >
                  실측치 확정 저장
                </button>
              </div>
            </form>
          )}

          {/* Table of History */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100/70 px-4 py-2 font-bold text-slate-700 text-xs">
              최근 3일 재고 입력 송신 이력
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">보고 일자</th>
                  <th className="py-2.5 px-3 font-semibold">사업장</th>
                  <th className="py-2.5 px-3 font-semibold">전송 완료 시각</th>
                  <th className="py-2.5 px-3 font-semibold text-right">보고 재고량</th>
                  <th className="py-2.5 px-3 font-semibold text-center">전송 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {historyLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 tabular-nums">{log.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{log.facility}</td>
                    <td className="py-2.5 px-3 text-slate-600 tabular-nums">{log.time}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-800 tabular-nums">
                      {log.stock}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status.includes('정상')
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
