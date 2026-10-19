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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div>
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm">관제 알림 센터</h3>
              <span className="bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {alerts.filter((a) => !a.isDismissed).length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] text-xs">
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                수신된 새로운 관제 경보가 없습니다.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.isDismissed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : alert.level === 'priority_1'
                      ? 'bg-red-50/80 border-red-200'
                      : 'bg-blue-50/80 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {alert.level === 'priority_1' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {alert.title}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="text-[10px] text-slate-400 mt-1.5 tabular-nums">
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>

                    {!alert.isDismissed && (
                      <button
                        onClick={() => onDismissAlert(alert.id)}
                        title="확인 완료"
                        className="text-slate-400 hover:text-slate-700 p-1 rounded"
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={onClearAll}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>모든 알림 읽음 처리</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
