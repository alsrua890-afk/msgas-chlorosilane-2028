import React from 'react';
import {
  BarChart3,
  FileEdit,
  Truck,
  SlidersHorizontal,
  LogOut,
  Radio,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'demand' | 'supply' | 'master';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreportedCount: number;
  urgentAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  urgentAlertCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: '수급 현황판',
      icon: BarChart3,
      badge: urgentAlertCount > 0 ? urgentAlertCount : undefined,
    },
    {
      id: 'demand' as NavTab,
      label: '수요 입력',
      icon: FileEdit,
    },
    {
      id: 'supply' as NavTab,
      label: '공급 계획',
      icon: Truck,
    },
    {
      id: 'master' as NavTab,
      label: '기준정보',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <aside className="w-64 bg-[#0c1e34] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none">
      <div>
        {/* Logo & Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1474d2] flex items-center justify-center font-black text-white text-base shadow-inner tracking-tight">
            MS
          </div>
          <div>
            <div className="font-extrabold text-white text-lg tracking-tight leading-none">
              MS GAS
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              질소 수급 관제
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
            CONTROL PANEL
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1474d2] text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Live Status */}
      <div className="p-3 border-t border-slate-800/80 bg-[#091728]/70">
        {/* Status Line */}
        <div className="flex items-center justify-between px-2 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>정상 작동중</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-emerald-400/90 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-950/40">
            LIVE
          </span>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#1b3b64] text-blue-200 font-bold flex items-center justify-center text-sm">
              김
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-white">
                통합관제 김관리
              </div>
              <div className="text-[11px] text-slate-400">총괄 책임자</div>
            </div>
          </div>
          <button
            title="사용자 정보"
            onClick={() => alert('통합관제 총괄 관리자 (김관리) 세션입니다.')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
