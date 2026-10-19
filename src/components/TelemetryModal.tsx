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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0c1e34] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">
                  저장고 밸브 및 원격 센서 텔레메트리 상세
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {station.name} · 센서 모듈 RTU-LN2-440
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Key Instrument Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Pressure Gauge */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="font-semibold">탱크 내압 (PT-101)</span>
                <Gauge className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {pressure} <span className="text-xs font-semibold text-slate-500">MPa</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>정상 범위 (0.6 ~ 1.2 MPa)</span>
                </div>
              </div>
            </div>

            {/* Cryogenic Temperature */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="font-semibold">극저온 액상온도 (TT-102)</span>
                <Thermometer className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-700 tabular-nums">
                  {station.temperatureC} <span className="text-xs font-semibold text-slate-500">℃</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  LN2 포화상태 정상 유지
                </div>
              </div>
            </div>

            {/* Vacuum Jacket */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="font-semibold">외조 진공도 (VT-103)</span>
                <ShieldAlert className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  0.001 <span className="text-xs font-semibold text-slate-500">mbar</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                  단열 진공도 최상 (단열 손실 없음)
                </div>
              </div>
            </div>
          </div>

          {/* Valve Control Matrix */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100/80 px-4 py-2 font-bold text-slate-700 flex items-center justify-between">
              <span>원격 전동 밸브 제어 및 상태 모니터링 (P&ID)</span>
              <button
                onClick={toggleSimulation}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>압력 변동 시뮬레이션 {isSimulating ? '중지' : '실행'}</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {/* Bottom Liquid Filling Valve */}
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-xs">
                    하부 액체 인입/배출 밸브 (MOV-01)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    탱크 하부 매니폴드 주공급 밸브 · 안전인터록 연동
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      bottomValveOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {bottomValveOpen ? '개방 (OPEN 100%)' : '차단 (CLOSED)'}
                  </span>
                  <button
                    onClick={() => setBottomValveOpen(!bottomValveOpen)}
                    className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                  >
                    <Power className={`w-3.5 h-3.5 ${bottomValveOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* Top Gas Vent Valve */}
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-xs">
                    상부 기화가스 방출/벤트 밸브 (MOV-02)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    과압 발생 시 BOG(Boil-Off Gas) 자동 배출 통로
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      ventValveOpen
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {ventValveOpen ? '배출 중 (VENTING)' : '대기 (CLOSED)'}
                  </span>
                  <button
                    onClick={() => setVentValveOpen(!ventValveOpen)}
                    className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                  >
                    <Power className={`w-3.5 h-3.5 ${ventValveOpen ? 'text-amber-600' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* Safety Relief Valve */}
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-xs">
                    안전 방출 밸브 기구 (PSV-101 / PSV-102 듀얼)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    설정 압력 1.45 MPa 자동 파열판 및 스프링 기계식 안전변
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  정상 준비완료 (SEALED)
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Transmission Log */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between">
            <span>마지막 센서 통신 수신: <strong>{station.telemetryLastReceived}</strong></span>
            <span className="text-slate-400">LTE-M 산업용 IoT 게이트웨이 #02-KR</span>
          </div>

          {/* Close */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer transition-colors"
            >
              확인 닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
