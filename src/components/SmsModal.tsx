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
    `[MS GAS 관제본부] ${facility.name} ${facility.managerName}님, 금일 오전 09:00 정기 LN2 실측 재고가 미전송되었습니다. 수급 예측 마감을 위해 즉시 재고를 입력해 주시기 바랍니다.`
  );

  const handleSend = () => {
    onSendSms(facility.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm">현장 재고 입력 독촉 SMS 발송</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">수신 사업장</span>
              <span className="font-bold text-slate-800">{facility.name}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">수신 담당자</span>
              <span className="font-semibold text-slate-800">
                {facility.managerName} ({facility.contact})
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">발송 구분</span>
              <span className="text-amber-600 font-bold">1차 독촉 알림 문자</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              발송 메시지 본문
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <div className="text-[10px] text-slate-400 text-right mt-1">
              SMS/LMS 공용 관제 발신 번호: 1588-0000
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>독촉 SMS 즉시 발송</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
