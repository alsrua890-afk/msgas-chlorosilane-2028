export interface TankStation {
  id: string;
  stationCode: string; // e.g. BASE STATION #02
  name: string; // e.g. 충남 천안 사업장 (탱크 1호기)
  category: 'BASE' | 'HQ' | 'BRANCH' | 'CHARGING';
  currentStock: number; // in tons, e.g. 37.2
  maxCapacity: number; // in tons, e.g. 60.0
  safeStock: number; // in tons, e.g. 6.0
  safeStockPercent: number; // e.g. 10%
  dailyOutflowAvg: number; // in tons/day, e.g. 6.2
  daysRemaining: number; // e.g. 5
  status: 'danger' | 'warning' | 'normal';
  statusLabel: string; // '부족 (위험)', '정상 (안정)', etc.
  telemetryLastReceived: string; // e.g. '30초 전 수신 정상'
  sensorStatus: 'normal' | 'delay' | 'error';
  pressureMpa: number; // e.g. 0.85 MPa
  temperatureC: number; // e.g. -196.2 C
  fillLevelPercent: number; // e.g. 62.0
  levelNote: string; // '임계선 근접' or '여유'
  actionButtonLabel: string; // '배차 지시서 작성 >' or '저장고 밸브 및 압력 상세 >'
}

export interface WeeklyForecastRow {
  facilityId: string;
  facilityName: string;
  currentStock: number;
  w0: number; // W+0 (05/19~05/25)
  w1: number; // W+1 (05/26~06/01)
  w2: number; // W+2 (06/02~06/08)
  w3: number; // W+3 (06/09~06/15)
  w4: number; // W+4 (06/16~06/22)
  actionType: 'emergency_dispatch' | 'maintain' | 'rebalance_review';
  actionLabel: string;
  status: 'normal' | 'warning' | 'danger';
}

export interface UnreportedFacility {
  id: string;
  name: string; // 동부 충전소
  lastConfirmedTime: string; // 24시간 전
  managerName: string; // 박수급 대리
  contact: string; // 010-8921-XXXX
  status: 'pending' | 'sent' | 'completed';
  sentTimestamp?: string;
}

export interface TankerTruck {
  id: string;
  truckNo: string; // 82가 1204
  modelName: string; // 16톤 극저온 탱크로리
  capacityTons: number;
  driverName: string;
  driverPhone: string;
  status: 'standby' | 'loading' | 'in_transit' | 'unloading' | 'completed';
  currentLocation: string;
  targetDestination: string;
  eta: string;
}

export interface DispatchOrder {
  id: string;
  orderNo: string;
  sourceStation: string;
  destStation: string;
  truckId: string;
  truckNo: string;
  driverName: string;
  volumeTons: number;
  departureTime: string;
  arrivalTime: string;
  priority: 'emergency' | 'high' | 'normal';
  status: 'scheduled' | 'dispatched' | 'arrived' | 'completed';
  memo: string;
  createdAt: string;
}

export interface CustomerDemand {
  id: string;
  customerName: string; // e.g. 삼성전자 천안캠퍼스
  facilityName: string; // 충남 천안 사업장
  productGrade: 'LN2 초고순도(99.9999%)' | 'LN2 산업용(99.99%)' | '의료용 액화질소';
  dailyDemandTons: number;
  weeklySchedule: string;
  contractStatus: 'active' | 'pending';
  lastDelivered: string;
  specialRequirements: string;
}

export interface SystemAlert {
  id: string;
  level: 'priority_1' | 'warning' | 'info';
  title: string;
  targetFacility: string;
  targetDate: string;
  dailyRate: number;
  description: string;
  isDismissed: boolean;
  timestamp: string;
}
