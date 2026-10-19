import React, { useState } from 'react';
import { X, Gauge, Thermometer, Activity, Power, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TankStation } from '../types/ln2.ts';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: TankStation | null;
}

export const TelemetryModal: React.FC<TelemetryModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  if (!isOpen || !station) return null;

  const [bottomValveOpen, setBottomValveOpen] = useState(true);
  const [ventValveOpen, setVentValveOpen] = useState(false);
  const [pressure, setPressure] = useState(station.pressureMpa);
  const [isSimulating, setIsSimulating] = useState(false);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    if (!isSimulating) {
      setPressure((p) => +(p + 0.03).toFixed(2));
    } else {
      setPressure(station.pressureMpa);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D24]/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-[24px] max-w-2xl w-full shadow-2xl border border-[#E5E9EE] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#101D24] text-white flex items-center justify-between border-b border-[#1C2C35]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D6F8F] flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  저장고 밸브 및 원격 센서 텔레메트리 상세
                </h3>
                <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-[#7E8E98] mt-0.5">
                {station.name} · MS GAS RTU-LN2-440 모듈
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Key Instrument Grid */}
          <div className="grid grid-cols-3 gap-3.5">
            {/* Pressure Gauge */}
            <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B7280] mb-2">
                <span className="font-bold">탱크 내압 (PT-101)</span>
                <Gauge className="w-4 h-4 text-[#0D6F8F]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#2E2E2E] tabular-nums">
                  {pressure} <span className="text-xs font-bold text-[#6B7280]">MPa</span>
                </div>
                <div className="text-[11px] text-[#10B981] font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>정상 범위 (0.6 ~ 1.2 MPa)</span>
                </div>
              </div>
            </div>

            {/* Cryogenic Temp */}
            <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B7280] mb-2">
                <span className="font-bold">액온 (TT-101)</span>
                <Thermometer className="w-4 h-4 text-[#0D6F8F]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#0D6F8F] tabular-nums">
                  {station.temperatureC} <span className="text-xs font-bold text-[#6B7280]">℃</span>
                </div>
                <div className="text-[11px] text-[#0D6F8F] font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6F8F]" />
                  <span>극저온 액화 유지 (-196℃)</span>
                </div>
              </div>
            </div>

            {/* Differential Level */}
            <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#6B7280] mb-2">
                <span className="font-bold">차압 레벨 (LT-101)</span>
                <Activity className="w-4 h-4 text-[#0D6F8F]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#2E2E2E] tabular-nums">
                  {station.fillLevelPercent.toFixed(1)} <span className="text-xs font-bold text-[#6B7280]">%</span>
                </div>
                <div className="text-[11px] text-[#6B7280] font-bold mt-1.5 flex items-center gap-1">
                  <span>차압식 트랜스미터 정상</span>
                </div>
              </div>
            </div>
          </div>

          {/* Valve Control Matrix */}
          <div className="bg-white border border-[#E5E9EE] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E9EE]">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-[#0D6F8F]" />
                <span className="font-bold text-[#2E2E2E] text-xs">
                  초저온 안전 밸브 및 배관 개폐 상태 (원격 제어 연동)
                </span>
              </div>
              <button
                onClick={toggleSimulation}
                className="text-[11px] text-[#0D6F8F] hover:text-[#0A5770] font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>압력 변동 시뮬레이션 {isSimulating ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {/* Bottom Liquid Fill Valve */}
              <div className="p-3 bg-[#F6F8FA] rounded-xl flex items-center justify-between border border-[#E5E9EE]">
                <div>
                  <div className="font-bold text-[#2E2E2E] text-xs">
                    하부 액체 인입/배출 밸브 (MOV-01)
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    탱크로리 하역 및 기화기 송출용 메인 전동 밸브
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      bottomValveOpen
                        ? 'bg-[#E6F3F7] text-[#0D6F8F] border border-[#C5E5EE]'
                        : 'bg-[#FDE8E6] text-[#E05342] border border-[#FCA5A5]'
                    }`}
                  >
                    {bottomValveOpen ? 'OPEN (개방됨)' : 'CLOSED (차단됨)'}
                  </span>
                  <button
                    onClick={() => setBottomValveOpen(!bottomValveOpen)}
                    className="w-8 h-8 rounded-lg border border-[#DCE2E8] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Power className={`w-3.5 h-3.5 ${bottomValveOpen ? 'text-[#0D6F8F]' : 'text-[#8A92A0]'}`} />
                  </button>
                </div>
              </div>

              {/* Vent Valve */}
              <div className="p-3 bg-[#F6F8FA] rounded-xl flex items-center justify-between border border-[#E5E9EE]">
                <div>
                  <div className="font-bold text-[#2E2E2E] text-xs">
                    상부 BOG 증발가스 벤트 밸브 (VBV-02)
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    탱크 내압 급증 시 비상 감압 방출용 파일럿 밸브
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      ventValveOpen
                        ? 'bg-[#FEF9E7] text-[#D97706] border border-[#FDE68A]'
                        : 'bg-[#F6F8FA] text-[#6B7280] border border-[#E5E9EE]'
                    }`}
                  >
                    {ventValveOpen ? 'VENTING (방출중)' : 'CLOSED (대기상태)'}
                  </span>
                  <button
                    onClick={() => setVentValveOpen(!ventValveOpen)}
                    className="w-8 h-8 rounded-lg border border-[#DCE2E8] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Power className={`w-3.5 h-3.5 ${ventValveOpen ? 'text-[#F59E0B]' : 'text-[#8A92A0]'}`} />
                  </button>
                </div>
              </div>

              {/* Safety Relief Valve */}
              <div className="p-3 bg-[#F6F8FA] rounded-xl flex items-center justify-between border border-[#E5E9EE]">
                <div>
                  <div className="font-bold text-[#2E2E2E] text-xs">
                    안전 방출 밸브 기구 (PSV-101 / PSV-102 듀얼)
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    설정 압력 1.45 MPa 자동 파열판 및 스프링 기계식 안전변
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E6F3F7] text-[#0D6F8F] border border-[#C5E5EE]">
                  정상 준비완료 (SEALED)
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Transmission Log */}
          <div className="bg-[#F6F8FA] border border-[#E5E9EE] rounded-xl p-3.5 text-[11px] text-[#6B7280] flex items-center justify-between">
            <span>마지막 센서 통신 수신: <strong className="text-[#2E2E2E]">{station.telemetryLastReceived}</strong></span>
            <span className="text-[#0D6F8F] font-semibold">MS GAS 산업용 IoT 게이트웨이 #02</span>
          </div>

          {/* Close CTA */}
          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#0D6F8F] hover:bg-[#0A5770] text-white font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              확인 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
