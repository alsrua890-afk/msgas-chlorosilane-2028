import React from 'react';
import {
  Flame,
  FileEdit,
  Truck,
  ShieldAlert,
  LogOut,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { MsGasLogo } from './MsGasLogo.tsx';

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
      label: '수급 관제 현황판',
      sublabel: '실시간 잔량 & 4주 전망',
      icon: Flame,
      badge: urgentAlertCount > 0 ? urgentAlertCount : undefined,
    },
    {
      id: 'demand' as NavTab,
      label: '고객 수요 입력',
      sublabel: '반도체/산업가스 소진량',
      icon: FileEdit,
    },
    {
      id: 'supply' as NavTab,
      label: '탱크로리 배차 공급',
      sublabel: 'ASU 출하 & 수송 스케줄',
      icon: Truck,
    },
    {
      id: 'master' as NavTab,
      label: '안전·기준정보 설정',
      sublabel: '법정 안전재고 & 임계치',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <aside className="w-64 bg-[#101D24] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-[#1C2C35] select-none shadow-xl">
      <div>
        {/* Official MS GAS Logo Header */}
        <div className="p-5 border-b border-[#1C2C35] bg-[#0C171D]">
          <div className="flex items-center justify-between">
            <MsGasLogo variant="white" size="md" withKorean={true} />
          </div>
          <div className="mt-2.5 px-2 py-1 rounded-lg bg-[#0D6F8F]/20 border border-[#0D6F8F]/40 flex items-center justify-between text-[10px]">
            <span className="text-[#C5E5EE] font-semibold">LN2 초저온 수급 관제</span>
            <span className="text-[#F8D94F] font-bold">ERP v2.4</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3.5 py-4">
          <div className="text-[10px] font-black tracking-widest text-[#7E8E98] uppercase px-3 mb-2.5 flex items-center justify-between">
            <span>관제 제어 메뉴</span>
            <span className="text-[#0D6F8F] font-bold">MS CONTROL</span>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0D6F8F] text-white font-bold shadow-md shadow-[#0D6F8F]/20'
                      : 'text-[#C5CFD6] hover:text-white hover:bg-white/8 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-white/20 text-[#F8D94F]' : 'bg-[#182730] text-[#7E8E98]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold leading-tight">{item.label}</div>
                      <div
                        className={`text-[10px] leading-none mt-0.5 ${
                          isActive ? 'text-[#C5E5EE]' : 'text-[#7E8E98]'
                        }`}
                      >
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="bg-[#E05342] text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Live Sensor Status */}
      <div className="p-3.5 border-t border-[#1C2C35] bg-[#0A1318]">
        {/* Real-time Status */}
        <div className="flex items-center justify-between px-2 mb-2.5 text-xs">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>전국 5개 기지 정상 수신</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-[#F8D94F] border border-[#F8D94F]/40 px-2 py-0.5 rounded-md bg-[#F8D94F]/10">
            ONLINE
          </span>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#14232B] border border-[#1C2C35] hover:bg-[#1A2E38] transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0D6F8F] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              MS
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">김관리 수급책임</div>
              <div className="text-[10px] text-[#7E8E98] truncate">중앙관제팀 / 천안</div>
            </div>
          </div>
          <button
            title="로그아웃"
            className="text-[#7E8E98] hover:text-[#E05342] p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
