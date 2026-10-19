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
    { date: '2025-05-19', facility: '경기 화성 공장', time: '08:45:30', stock: '28.0톤', status: '정상 전송' },
    { date: '2025-05-19', facility: '부산 본사 (메인)', time: '08:50:00', stock: '84.0톤', status: '정상 전송' },
    { date: '2025-05-19', facility: '충북 청주공장', time: '08:55:18', stock: '45.0톤', status: '정상 전송' },
    { date: '2025-05-19', facility: '동부 충전소', time: '-', stock: '미제출', status: '지연 (09:00 마감초과)' },
    { date: '2025-05-18', facility: '동부 충전소', time: '09:12:00', stock: '26.8톤', status: '지연 제출' },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onManualInventorySubmit(selectedFacility, Number(manualTons));
    setShowManualForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D24]/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-[24px] max-w-2xl w-full shadow-2xl border border-[#E5E9EE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#101D24] text-white flex items-center justify-between border-b border-[#1C2C35]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D6F8F] flex items-center justify-center shadow-xs">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-white">
                사업장 재고 보고 이력 로그 및 현장 대행 입력
              </h3>
              <p className="text-xs text-[#7E8E98] mt-0.5">
                매일 오전 09:00 정기 마감 기준 실측 데이터 보고 추적
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Quick Action to Manually Enter */}
          <div className="bg-[#E6F3F7] border border-[#C5E5EE] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-extrabold text-[#0D6F8F] text-xs">
                미전송 사업장 (동부 충전소) 긴급 유선 확인 완료 시
              </div>
              <div className="text-[11px] text-[#2E2E2E] mt-0.5">
                현장 안전 관리자와 유선 통화 후 실측 게이지 잔량을 즉시 대행 입력할 수 있습니다.
              </div>
            </div>
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center shrink-0 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{showManualForm ? '입력창 닫기' : '현장 대행 입력 열기'}</span>
            </button>
          </div>

          {/* Form */}
          {showManualForm && (
            <form onSubmit={handleManualSubmit} className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 space-y-3 animate-in fade-in">
              <div className="font-bold text-[#2E2E2E]">현장 실측 재고 대행 등록</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">대상 사업장</label>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full bg-white border border-[#DCE2E8] rounded-xl p-2.5 text-xs text-[#2E2E2E] font-bold"
                  >
                    {unreported.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (담당: {u.managerName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">실측 잔량 (톤)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={manualTons}
                    onChange={(e) => setManualTons(Number(e.target.value))}
                    className="w-full bg-white border border-[#DCE2E8] rounded-xl p-2.5 text-xs text-[#0D6F8F] font-black tabular-nums"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#DCE2E8] text-[#2E2E2E] hover:bg-white font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold shadow-xs"
                >
                  실측치 저장 반영
                </button>
              </div>
            </form>
          )}

          {/* History Table */}
          <div className="border border-[#E5E9EE] rounded-xl overflow-hidden">
            <div className="bg-[#F6F8FA] px-4 py-2.5 font-bold text-[#2E2E2E] text-xs border-b border-[#E5E9EE]">
              최근 재고 입력 송신 이력
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-[11px] text-[#6B7280] border-b border-[#E5E9EE]">
                  <th className="py-2.5 px-4 font-bold">보고 일자</th>
                  <th className="py-2.5 px-3 font-bold">사업장</th>
                  <th className="py-2.5 px-3 font-bold">전송 완료 시각</th>
                  <th className="py-2.5 px-3 font-bold text-right">보고 재고량</th>
                  <th className="py-2.5 px-4 font-bold text-center">전송 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9EE] text-xs">
                {historyLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#F6F8FA]">
                    <td className="py-3 px-4 text-[#6B7280] tabular-nums">{log.date}</td>
                    <td className="py-3 px-3 font-bold text-[#2E2E2E]">{log.facility}</td>
                    <td className="py-3 px-3 text-[#6B7280] tabular-nums">{log.time}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#2E2E2E] tabular-nums">
                      {log.stock}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                          log.status.includes('정상')
                            ? 'bg-[#E6F3F7] text-[#0D6F8F]'
                            : 'bg-[#FDE8E6] text-[#E05342]'
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

          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
