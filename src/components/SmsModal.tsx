import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2 } from 'lucide-react';
import { UnreportedFacility } from '../types/ln2.ts';

interface SmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: UnreportedFacility | null;
  onSendSms: (facilityId: string) => void;
}

export const SmsModal: React.FC<SmsModalProps> = ({
  isOpen,
  onClose,
  facility,
  onSendSms,
}) => {
  if (!isOpen || !facility) return null;

  const [message, setMessage] = useState(
    `[MS GAS 중앙관제팀] ${facility.name} ${facility.managerName}님, 금일 오전 09:00 정기 LN2 실측 재고가 미전송되었습니다. 수급 예측 마감을 위해 즉시 재고를 입력해 주시기 바랍니다.`
  );

  const handleSend = () => {
    onSendSms(facility.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D24]/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl border border-[#E5E9EE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#101D24] text-white flex items-center justify-between border-b border-[#1C2C35]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F8D94F] text-[#2E2E2E] flex items-center justify-center font-bold shadow-xs">
              <Mail className="w-4 h-4 text-[#2E2E2E]" />
            </div>
            <h3 className="font-extrabold text-base text-white">현장 재고 입력 독촉 SMS 발송</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[#2E2E2E]">
              <span className="text-[#6B7280]">수신 사업장</span>
              <span className="font-bold text-[#2E2E2E]">{facility.name}</span>
            </div>
            <div className="flex justify-between text-[#2E2E2E]">
              <span className="text-[#6B7280]">수신 담당자</span>
              <span className="font-bold text-[#0D6F8F]">
                {facility.managerName} ({facility.contact})
              </span>
            </div>
            <div className="flex justify-between text-[#2E2E2E]">
              <span className="text-[#6B7280]">발송 구분</span>
              <span className="text-[#D97706] font-bold">1차 독촉 알림 문자</span>
            </div>
          </div>

          <div>
            <label className="block text-[#2E2E2E] font-bold mb-1.5">
              발송 메시지 본문
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-3.5 text-xs text-[#2E2E2E] font-medium focus:ring-2 focus:ring-[#0D6F8F] focus:outline-hidden"
            />
            <div className="text-[11px] text-[#8A92A0] text-right mt-1.5 font-medium">
              관제 발신 대표번호: 1588-0000 (MS GAS)
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#DCE2E8] text-[#2E2E2E] hover:bg-[#F6F8FA] font-bold cursor-pointer transition-all"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="px-6 py-2.5 rounded-xl bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E] font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-[#2E2E2E]" />
              <span>독촉 SMS 즉시 발송</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
