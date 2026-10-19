import React, { useState } from 'react';
import { SlidersHorizontal, Shield, Bell, Database, CheckCircle2, Save, Radio } from 'lucide-react';
import { TankStation } from '../types/ln2.ts';

interface MasterInfoViewProps {
  tanks: TankStation[];
  onUpdateTankSpecs: (updatedTanks: TankStation[]) => void;
}

export const MasterInfoView: React.FC<MasterInfoViewProps> = ({
  tanks,
  onUpdateTankSpecs,
}) => {
  const [stationList, setStationList] = useState<TankStation[]>(tanks);
  const [safeStockRatio, setSafeStockRatio] = useState(10);
  const [dangerLeadDays, setDangerLeadDays] = useState(5);
  const [warningLeadDays, setWarningLeadDays] = useState(10);
  const [sensorIntervalSec, setSensorIntervalSec] = useState(30);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleCapacityChange = (id: string, newCapacity: number) => {
    setStationList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const safe = (newCapacity * safeStockRatio) / 100;
          return {
            ...s,
            maxCapacity: newCapacity,
            safeStock: safe,
            fillLevelPercent: +(s.currentStock / newCapacity * 100).toFixed(1),
          };
        }
        return s;
      })
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTankSpecs(stationList);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1520px] mx-auto text-xs">
      {/* Header */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-4 bg-[#0D6F8F] rounded-full" />
            <h2 className="text-base font-extrabold text-[#2E2E2E] tracking-tight">
              관제 기준정보 및 안전재고 파라미터 설정
            </h2>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-medium">
            고압가스안전관리법 및 산업안전보건 기준에 따른 MS GAS 기지별 법정 안전재고, 위험 도달 경보 임계치, 센서 수신 주기를 관리합니다.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="self-start md:self-center bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>설정 저장 및 전산 반영</span>
        </button>
      </div>

      {/* Global Thresholds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 법정 안전재고율 */}
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#2E2E2E] font-bold">
            <Shield className="w-4 h-4 text-[#0D6F8F]" />
            <span>법정 의무 안전재고율 (비상 비축)</span>
          </div>
          <p className="text-[#6B7280] text-[11px] font-medium">
            탱크 총용량 대비 긴급 비축 하한 기준 (기본 10%)
          </p>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="number"
              min="5"
              max="25"
              value={safeStockRatio}
              onChange={(e) => setSafeStockRatio(Number(e.target.value))}
              className="w-24 bg-[#F6F8FA] border border-[#DCE2E8] rounded-xl p-2.5 font-bold text-sm text-[#2E2E2E] text-center tabular-nums"
            />
            <span className="font-bold text-[#4B5563]">% (총용량 기준)</span>
          </div>
        </div>

        {/* Card 2: 위험 알림 잔여일수 */}
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#2E2E2E] font-bold">
            <Bell className="w-4 h-4 text-[#E05342]" />
            <span>긴급 알림(PRIORITY 1) 기준</span>
          </div>
          <p className="text-[#6B7280] text-[11px] font-medium">
            안전재고 미달 예상 잔여일수 시 관제 경보 발생
          </p>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="number"
              min="1"
              max="15"
              value={dangerLeadDays}
              onChange={(e) => setDangerLeadDays(Number(e.target.value))}
              className="w-24 bg-[#F6F8FA] border border-[#DCE2E8] rounded-xl p-2.5 font-black text-sm text-[#E05342] text-center tabular-nums"
            />
            <span className="font-bold text-[#4B5563]">일 미만 도달 시 긴급</span>
          </div>
        </div>

        {/* Card 3: 센서 수신 주기 */}
        <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#2E2E2E] font-bold">
            <Radio className="w-4 h-4 text-[#10B981]" />
            <span>원격 텔레메트리 센서 핑 주기</span>
          </div>
          <p className="text-[#6B7280] text-[11px] font-medium">
            현장 RTU 게이트웨이 폴링 및 차압/온도 동기화 주기
          </p>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="number"
              min="10"
              max="300"
              step="10"
              value={sensorIntervalSec}
              onChange={(e) => setSensorIntervalSec(Number(e.target.value))}
              className="w-24 bg-[#F6F8FA] border border-[#DCE2E8] rounded-xl p-2.5 font-bold text-sm text-[#0D6F8F] text-center tabular-nums"
            />
            <span className="font-bold text-[#4B5563]">초 간격 (실시간 스트림)</span>
          </div>
        </div>
      </div>

      {/* Facility Tank Specifications Master Table */}
      <div className="bg-white rounded-[22px] border border-[#E5E9EE] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E9EE] mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0D6F8F]" />
            <h3 className="font-extrabold text-[#2E2E2E] text-sm">
              전국 사업장 저장탱크 제원 및 안전재고 파라미터 마스터
            </h3>
          </div>
          <span className="text-xs text-[#8A92A0]">
            총 {stationList.length}개소 저장탱크 운용
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F6F8FA] text-[#6B7280] border-b border-[#E5E9EE]">
                <th className="py-3 px-4 font-bold rounded-l-lg">사업장 코드</th>
                <th className="py-3 px-3 font-bold">사업장 명칭</th>
                <th className="py-3 px-3 font-bold">구분</th>
                <th className="py-3 px-3 font-bold text-right">탱크 총용량(톤)</th>
                <th className="py-3 px-3 font-bold text-right">법정 안전재고(톤)</th>
                <th className="py-3 px-3 font-bold text-right">현재 잔량(톤)</th>
                <th className="py-3 px-3 font-bold text-right">충전율(%)</th>
                <th className="py-3 px-4 font-bold text-center rounded-r-lg">원격 게이트웨이</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9EE]">
              {stationList.map((tank) => (
                <tr key={tank.id} className="hover:bg-[#F6F8FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2E2E2E]">
                    {tank.stationCode}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#2E2E2E]">
                    {tank.name}
                  </td>
                  <td className="py-3.5 px-3 text-[#4B5563]">
                    <span className="bg-[#E6F3F7] text-[#0D6F8F] px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      {tank.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <input
                      type="number"
                      step="5"
                      min="10"
                      max="300"
                      value={tank.maxCapacity}
                      onChange={(e) =>
                        handleCapacityChange(tank.id, Number(e.target.value))
                      }
                      className="w-20 bg-[#F6F8FA] border border-[#DCE2E8] rounded-lg px-2 py-1 text-right font-black text-[#2E2E2E] tabular-nums"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#E05342] tabular-nums">
                    {tank.safeStock.toFixed(1)}톤 ({safeStockRatio}%)
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-[#2E2E2E] tabular-nums">
                    {tank.currentStock.toFixed(1)}톤
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-[#0D6F8F] tabular-nums">
                    {tank.fillLevelPercent.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                      <span>정상 수신</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 bg-[#2E2E2E] text-white text-xs px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 border border-[#444950]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-semibold">법정 안전재고 파라미터 및 기지 제원이 전산에 저장되었습니다.</span>
        </div>
      )}
    </div>
  );
};
