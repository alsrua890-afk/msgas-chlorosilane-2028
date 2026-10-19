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
    <div className="p-6 space-y-5 max-w-[1520px] mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-blue-600 rounded-xs"></div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              고객사 액화질소(LN2) 수요 입력 및 계약 할당 관리
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            반도체, 2차전지, 제약 등 각 사업장 관할 고객사의 일일 소진 예정량을 등록하여 과부족 예측 모델에 실시간 반영합니다.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 수요처 등록</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">조회 기준 일일 총소진량</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {totalDemand.toFixed(1)} 톤/일
            </span>
            <span className="text-xs text-blue-600 font-semibold">정상 배관/탱크 인입</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">등록 고객사 수</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {filtered.length} 개소
            </span>
            <span className="text-xs text-emerald-600 font-semibold">100% 정상 가동</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">초고순도(반도체용) 공급 비중</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 tabular-nums">76.8%</span>
            <span className="text-xs text-slate-500 font-medium">99.9999% 등급</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Facility Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'ALL', label: '전체 사업장' },
            { id: '천안', label: '충남 천안' },
            { id: '부산', label: '부산 본사' },
            { id: '청주', label: '충북 청주' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFacility(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedFacility === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="고객사명 또는 규격 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Demands Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="py-3 px-4 font-semibold">고객사명</th>
              <th className="py-3 px-3 font-semibold">공급 기지</th>
              <th className="py-3 px-3 font-semibold">질소 규격/품명</th>
              <th className="py-3 px-3 font-semibold text-right">일일 소진량</th>
              <th className="py-3 px-3 font-semibold">공급 방식</th>
              <th className="py-3 px-3 font-semibold">최근 입고 실적</th>
              <th className="py-3 px-4 font-semibold">품질/특이사항</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{d.customerName}</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-semibold text-slate-600">
                  {d.facilityName}
                </td>
                <td className="py-3 px-3 font-medium text-slate-700">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {d.productGrade}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                  {d.dailyDemandTons.toFixed(1)} 톤/일
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">
                  {d.weeklySchedule}
                </td>
                <td className="py-3 px-3 text-slate-500 tabular-nums">
                  {d.lastDelivered}
                </td>
                <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate" title={d.specialRequirements}>
                  {d.specialRequirements}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">신규 고객사 질소 수요 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">고객사 명칭</label>
                <input
                  type="text"
                  required
                  placeholder="예: 현대모비스 충주 수소연료전지 공장"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">공급 관할 기지</label>
                  <select
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                  >
                    <option value="충남 천안 사업장">충남 천안 사업장</option>
                    <option value="부산 본사 (메인)">부산 본사 (메인)</option>
                    <option value="충북 청주공장">충북 청주공장</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">질소 제품 등급</label>
                  <select
                    value={productGrade}
                    onChange={(e) => setProductGrade(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                  >
                    <option value="LN2 초고순도(99.9999%)">LN2 초고순도(99.9999%)</option>
                    <option value="LN2 산업용(99.99%)">LN2 산업용(99.99%)</option>
                    <option value="의료용 액화질소">의료용 액화질소</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">일일 수요량 (톤/일)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={dailyDemandTons}
                    onChange={(e) => setDailyDemandTons(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">납품 주기</label>
                  <input
                    type="text"
                    value={weeklySchedule}
                    onChange={(e) => setWeeklySchedule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">품질 기준 및 납품 특이사항</label>
                <input
                  type="text"
                  placeholder="예: 반도체 청정도 등급 Class 10 유지"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-xs hover:bg-blue-700"
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
