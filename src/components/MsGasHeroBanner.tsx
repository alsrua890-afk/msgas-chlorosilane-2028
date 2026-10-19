import React from 'react';
import { ShieldCheck, Leaf, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface MsGasHeroBannerProps {
  onOpenQuickDispatch?: () => void;
  onOpenReport?: () => void;
}

export const MsGasHeroBanner: React.FC<MsGasHeroBannerProps> = ({
  onOpenQuickDispatch,
  onOpenReport,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0D6F8F] via-[#095770] to-[#063C4E] text-white shadow-lg border border-[#0D6F8F]/40 p-6 md:p-8">
      {/* Background Graphic Curves & Spherical Gas Tank Motif (from MS GAS Design System) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#3CC4EC]/15 blur-3xl" />
        
        {/* Decorative Wave Swoosh (MS Graphic Motif) */}
        <svg
          className="absolute right-0 bottom-0 h-full w-2/3 opacity-30 object-cover"
          viewBox="0 0 600 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Yellow swoosh arc */}
          <path
            d="M 100 240 C 250 200 380 90 600 40 L 600 240 Z"
            fill="url(#yellowSwooshGrad)"
            opacity="0.85"
          />
          {/* Deep teal wave */}
          <path
            d="M 0 240 C 180 230 320 130 600 80 L 600 240 Z"
            fill="#063C4E"
            opacity="0.9"
          />
          {/* Spherical Gas Storage Tank Silhouette */}
          <g opacity="0.25">
            <circle cx="480" cy="110" r="75" stroke="#FFFFFF" strokeWidth="2.5" fill="#FFFFFF" fillOpacity="0.05" />
            <path d="M 405 110 Q 480 80 555 110" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M 405 110 Q 480 140 555 110" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="480" y1="35" x2="480" y2="185" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="440" y1="180" x2="440" y2="240" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="520" y1="180" x2="520" y2="240" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <defs>
            <linearGradient id="yellowSwooshGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8D94F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F8D94F" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Top Right Slogan Text */}
        <div className="hidden lg:block absolute right-8 top-6 text-right select-none opacity-80">
          <div className="text-[11px] font-black tracking-widest text-[#F8D94F] uppercase">
            ENERGY · SAFETY · PARTNERSHIP
          </div>
          <div className="text-[10px] font-semibold text-[#C5E5EE] tracking-wider mt-0.5">
            FOR A BETTER TOMORROW
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F8D94F]">
            <Sparkles className="w-3.5 h-3.5 text-[#F8D94F]" />
            <span>MS GAS 질소(LN2) 통합 수급 관제 센터</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              가스가 만드는 <span className="text-[#F8D94F]">더 안전한 오늘</span>,<br className="hidden sm:inline" />
              더 나은 내일
            </h1>
            <p className="text-xs sm:text-sm text-[#C5E5EE] font-medium mt-1.5 tracking-normal">
              Safer Gas, Better Tomorrow — 전국 5개 사업장 및 대형 반도체 고객사 실시간 액화질소 잔량 모니터링
            </p>
          </div>

          {/* 4 Brand Pillars (from MS GAS Design System) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {/* Pillar 1: 안전 */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#0D6F8F] border border-white/40 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white leading-none">안전 (Safety)</div>
                <div className="text-[10px] text-[#C5E5EE] truncate mt-0.5">법정 재고 10% 엄수</div>
              </div>
            </div>

            {/* Pillar 2: 지속가능 */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#F8D94F] text-[#2E2E2E] flex items-center justify-center shrink-0 shadow-xs font-bold">
                <Leaf className="w-4 h-4 text-[#2E2E2E]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white leading-none">지속가능</div>
                <div className="text-[10px] text-[#C5E5EE] truncate mt-0.5">무중단 공급 보장</div>
              </div>
            </div>

            {/* Pillar 3: 전문성 */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#635BFF] flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white leading-none">전문성</div>
                <div className="text-[10px] text-[#C5E5EE] truncate mt-0.5">초고순도 99.9999%</div>
              </div>
            </div>

            {/* Pillar 4: 성장 */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center shrink-0 shadow-xs">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white leading-none">성장</div>
                <div className="text-[10px] text-[#C5E5EE] truncate mt-0.5">고객 파트너십</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (styled in exact MS GAS Button specifications) */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
          {onOpenQuickDispatch && (
            <button
              onClick={onOpenQuickDispatch}
              className="px-5 py-3 rounded-xl bg-[#F8D94F] hover:bg-[#F3CE34] text-[#2E2E2E] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>긴급 배차 지시서 작성</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>수급 리포트 다운로드</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
