import React, { useState } from 'react';
import { Clock, RefreshCw, Bell, User, CheckCircle2 } from 'lucide-react';
import { SystemAlert } from '../types/ln2.ts';

interface HeaderProps {
  title: string;
  subtitle: string;
  currentTimeString: string;
  isRecalculating: boolean;
  onRefresh: () => void;
  alerts: SystemAlert[];
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  currentTimeString,
  isRecalculating,
  onRefresh,
  alerts,
  onOpenAlerts,
}) => {
  const [showToast, setShowToast] = useState(false);
  const activeAlerts = alerts.filter((a) => !a.isDismissed);

  const handleRefreshClick = () => {
    onRefresh();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Subtitle */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        <span className="text-xs text-slate-500 font-medium">
          {subtitle}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 text-sm text-slate-600">
        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-md">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="tabular-nums font-medium">{currentTimeString}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          disabled={isRecalculating}
          title="실시간 센서 데이터 갱신"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-blue-600' : ''}`}
          />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onOpenAlerts}
            title="관제 알림 센터"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* Divider & User */}
        <div className="h-4 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
            김관리 책임
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>전 사업장 LN2 센서 텔레메트리 데이터 동기화 완료</span>
        </div>
      )}
    </header>
  );
};
