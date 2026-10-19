import React from 'react';
import { X, AlertTriangle, Info, Bell, Check, Trash2 } from 'lucide-react';
import { SystemAlert } from '../types/ln2.ts';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SystemAlert[];
  onDismissAlert: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onDismissAlert,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#101D24]/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E9EE]">
        {/* Header */}
        <div>
          <div className="p-5 border-b border-[#1C2C35] flex items-center justify-between bg-[#101D24] text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0D6F8F] flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base">관제 알림 센터</h3>
              <span className="bg-[#E05342] text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                {alerts.filter((a) => !a.isDismissed).length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="p-5 space-y-3.5 overflow-y-auto max-h-[calc(100vh-140px)] text-xs">
            {alerts.length === 0 ? (
              <div className="py-16 text-center text-[#8A92A0] font-medium">
                수신된 새로운 관제 경보가 없습니다.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.isDismissed
                      ? 'bg-[#F6F8FA] border-[#E5E9EE] opacity-60'
                      : alert.level === 'priority_1'
                      ? 'bg-[#FFF5F5] border-[#FCA5A5]'
                      : 'bg-[#E6F3F7] border-[#C5E5EE]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {alert.level === 'priority_1' ? (
                        <div className="w-7 h-7 rounded-lg bg-[#E05342] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-[#0D6F8F] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#2E2E2E] text-xs">
                          {alert.title}
                        </div>
                        <p className="text-[11px] text-[#4B5563] mt-1.5 leading-relaxed font-medium">
                          {alert.description}
                        </p>
                        <div className="text-[10px] text-[#8A92A0] mt-2 tabular-nums font-semibold">
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>

                    {!alert.isDismissed && (
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        title="확인 완료"
                        className="w-7 h-7 rounded-lg border border-[#DCE2E8] hover:bg-black/5 flex items-center justify-center text-[#6B7280] hover:text-[#2E2E2E] transition-colors shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5E9EE] bg-[#F6F8FA] flex items-center justify-between">
          <button
            onClick={onClearAll}
            className="text-xs text-[#6B7280] hover:text-[#E05342] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>모든 알림 확인 처리</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
