import React, { useState } from 'react';
import { Plus, Search, Building2, CheckCircle2, TrendingUp, Filter, Sparkles } from 'lucide-react';
import { CustomerDemand } from '../types/ln2.ts';

interface DemandInputViewProps {
  demands: CustomerDemand[];
  onAddDemand: (demand: Omit<CustomerDemand, 'id'>) => void;
}

export const DemandInputView: React.FC<DemandInputViewProps> = ({
  demands,
  onAddDemand,
}) => {
  const [selectedFacility, setSelectedFacility] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Demand Form State
  const [customerName, setCustomerName] = useState('');
  const [facilityName, setFacilityName] = useState('충남 천안 사업장');
  const [productGrade, setProductGrade] = useState<'LN2 초고순도(99.9999%)' | 'LN2 산업용(99.99%)' | '의료용 액화질소'>('LN2 초고순도(99.9999%)');
  const [dailyDemandTons, setDailyDemandTons] = useState(3.0);
  const [weeklySchedule, setWeeklySchedule] = useState('매일 연속 공급');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const filtered = demands.filter((d) => {
    const matchFacility = selectedFacility === 'ALL' || d.facilityName.includes(selectedFacility);
    const matchSearch =
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFacility && matchSearch;
  });

  const totalDemand = filtered.reduce((acc, curr) => acc + curr.dailyDemandTons, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    onAddDemand({
      customerName,
      facilityName,
      productGrade,
      dailyDemandTons: Number(dailyDemandTons),
      weeklySchedule,
      contractStatus: 'active',
      lastDelivered: '신규 등록 (배송 대기)',
      specialRequirements: specialRequirements || '표준 공급 규격 준수',
    });

    setIsModalOpen(false);
    setCustomerName('');
    setSpecialRequirements('');
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1520px] mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-[#0D6F8F] rounded-full" />
            <h2 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
              고객사 액화질소(LN2) 수요 입력 및 계약 할당 관리
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            반도체, 2차전지, 제약 등 각 사업장 관할 고객사의 일일 소진 예정량을 등록하여 MS GAS 수급 예측 모델에 실시간 반영합니다.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-center bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 수요처 등록</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">조회 기준 일일 총소진량</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-[#2E2E2E] tabular-nums">
              {totalDemand.toFixed(1)} 톤/일
            </span>
            <span className="text-xs text-[#0D6F8F] font-bold">정상 배관/탱크 인입</span>
          </div>
        </div>

        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">등록 고객사 수</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-[#2E2E2E] tabular-nums">
              {filtered.length} 개소
            </span>
            <span className="text-xs text-[#10B981] font-bold">100% 정상 가동</span>
          </div>
        </div>

        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs">
          <span className="text-xs text-[#6B7280] font-medium">초고순도(반도체용) 공급 비중</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-[#2E2E2E] tabular-nums">76.8%</span>
            <span className="text-xs text-[#6B7280] font-bold">99.9999% 등급</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Facility Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F6F8FA] p-1.5 rounded-xl border border-[#E5E9EE] flex-wrap">
          {[
            { id: 'ALL', label: '전체 사업장' },
            { id: '천안', label: '충남 천안' },
            { id: '화성', label: '경기 화성' },
            { id: '청주', label: '충북 청주' },
            { id: '부산', label: '부산 본사' },
            { id: '동부', label: '동부 충전소' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFacility(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedFacility === tab.id
                  ? 'bg-[#0D6F8F] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#0D6F8F] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8A92A0] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="고객사명 또는 관할 기지 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2E2E2E] placeholder-[#8A92A0] focus:outline-hidden focus:ring-2 focus:ring-[#0D6F8F]"
          />
        </div>
      </div>

      {/* Customer Demands List */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F6F8FA] text-[#6B7280] border-b border-[#E5E9EE]">
                <th className="py-3 px-4 font-bold rounded-l-lg">고객사명</th>
                <th className="py-3 px-3 font-bold">관할 공급 기지</th>
                <th className="py-3 px-3 font-bold">가스 품위 등급</th>
                <th className="py-3 px-3 font-bold text-right">일일 수요량</th>
                <th className="py-3 px-3 font-bold">납품 주기</th>
                <th className="py-3 px-3 font-bold">최근 입고 상태</th>
                <th className="py-3 px-4 font-bold rounded-r-lg">특이 요구사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9EE]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F8FA] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#2E2E2E]">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#0D6F8F]" />
                      <span>{item.customerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#2E2E2E] font-medium">{item.facilityName}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                        item.productGrade.includes('초고순도')
                          ? 'bg-[#E6F3F7] text-[#0D6F8F] border border-[#C5E5EE]'
                          : 'bg-[#FEF9E7] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {item.productGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-[#2E2E2E] tabular-nums">
                    {item.dailyDemandTons.toFixed(1)} 톤/일
                  </td>
                  <td className="py-3.5 px-3 text-[#4B5563]">{item.weeklySchedule}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[#10B981] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{item.lastDelivered}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280] font-medium max-w-xs truncate">
                    {item.specialRequirements}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding demand */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D24]/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl border border-[#E5E9EE] overflow-hidden">
            <div className="px-6 py-5 bg-[#101D24] text-white flex items-center justify-between border-b border-[#1C2C35]">
              <h3 className="font-extrabold text-base">신규 고객사 수요 등록</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#2E2E2E] font-bold mb-1.5">고객사 명칭</label>
                <input
                  type="text"
                  required
                  placeholder="예: SK하이닉스 이천공장 M16 라인"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-3 text-xs text-[#2E2E2E] font-medium focus:ring-2 focus:ring-[#0D6F8F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#2E2E2E] font-bold mb-1.5">공급 관할 기지</label>
                  <select
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs font-semibold text-[#2E2E2E]"
                  >
                    <option value="충남 천안 사업장">충남 천안 사업장</option>
                    <option value="경기 화성 공장">경기 화성 공장</option>
                    <option value="충북 청주공장">충북 청주공장</option>
                    <option value="부산 본사 (메인)">부산 본사 (메인)</option>
                    <option value="동부 충전소">동부 충전소</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#2E2E2E] font-bold mb-1.5">질소 제품 등급</label>
                  <select
                    value={productGrade}
                    onChange={(e) => setProductGrade(e.target.value as any)}
                    className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs font-semibold text-[#2E2E2E]"
                  >
                    <option value="LN2 초고순도(99.9999%)">LN2 초고순도(99.9999%)</option>
                    <option value="LN2 산업용(99.99%)">LN2 산업용(99.99%)</option>
                    <option value="의료용 액화질소">의료용 액화질소</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#2E2E2E] font-bold mb-1.5">일일 수요량 (톤/일)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={dailyDemandTons}
                    onChange={(e) => setDailyDemandTons(Number(e.target.value))}
                    className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs font-black text-[#0D6F8F]"
                  />
                </div>
                <div>
                  <label className="block text-[#2E2E2E] font-bold mb-1.5">납품 주기</label>
                  <input
                    type="text"
                    required
                    value={weeklySchedule}
                    onChange={(e) => setWeeklySchedule(e.target.value)}
                    className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs font-semibold text-[#2E2E2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2E2E2E] font-bold mb-1.5">품질 기준 및 납품 특이사항</label>
                <input
                  type="text"
                  placeholder="예: 반도체 청정도 등급 Class 10 유지"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-2.5 text-xs text-[#2E2E2E]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#DCE2E8] rounded-xl text-[#2E2E2E] font-bold hover:bg-[#F6F8FA]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0D6F8F] text-white font-bold rounded-xl shadow-xs hover:bg-[#0A5770]"
                >
                  수요 등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
