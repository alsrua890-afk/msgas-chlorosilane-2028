import React, { useState } from 'react';
import { Clock, RefreshCw, Bell, User, CheckCircle2, ShieldAlert } from 'lucide-react';
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
    <header className="bg-white border-b border-[#E5E9EE] px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Slogan Accent */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D6F8F]" />
            <h1 className="text-lg font-extrabold text-[#2E2E2E] tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-xs text-[#6B7280] font-medium hidden sm:block mt-0.5">
            {subtitle} · <span className="text-[#0D6F8F] font-semibold">가스가 만드는 더 안전한 오늘, 더 나은 내일</span>
          </p>
        </div>
      </div>

      {/* Right Controls in MS GAS Brand Styling */}
      <div className="flex items-center gap-2.5 text-sm text-[#2E2E2E]">
        {/* Timestamp Chip */}
        <div className="hidden md:flex items-center gap-2 text-xs text-[#0D6F8F] bg-[#E6F3F7] border border-[#C5E5EE] px-3.5 py-1.5 rounded-xl font-semibold">
          <Clock className="w-3.5 h-3.5 text-[#0D6F8F]" />
          <span className="tabular-nums">{currentTimeString}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          disabled={isRecalculating}
          title="전국 센서 데이터 갱신"
          className="h-9 px-3.5 rounded-xl border border-[#DCE2E8] bg-white hover:bg-[#F6F8FA] text-[#2E2E2E] flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-[#0D6F8F]' : 'text-[#6B7280]'}`}
          />
          <span className="hidden sm:inline">실시간 갱신</span>
        </button>

        {/* Notifications Button with Alert Badge */}
        <div className="relative">
          <button
            onClick={onOpenAlerts}
            title="수급 위험 알림"
            className="w-9 h-9 rounded-xl border border-[#DCE2E8] bg-white hover:bg-[#F6F8FA] text-[#2E2E2E] flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4 text-[#2E2E2E]" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E05342] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {activeAlerts.length}
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E5E9EE] mx-1" />

        {/* Operator Profile Chip */}
        <div className="flex items-center gap-2 bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl pl-1 pr-3 py-1">
          <div className="w-7 h-7 rounded-lg bg-[#0D6F8F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-xs font-bold text-[#2E2E2E]">김관리 책임</div>
            <div className="text-[10px] text-[#0D6F8F] font-semibold">MS GAS 관제</div>
          </div>
        </div>
      </div>

      {/* Synchronized Toast Message */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#2E2E2E] text-white text-xs px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 border border-[#444950]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-semibold">전국 5개 사업장 액화질소 텔레메트리 데이터 동기화 완료</span>
        </div>
      )}
    </header>
  );
};
