// KPI Type Definitions

export type KPITrend = 'up' | 'down' | 'neutral';
export type KPIUnit = '' | '$' | '%' | 'hrs' | 'days';

export interface KPI {
  id: string;
  name: string;
  startValue?: number;
  value: number;
  target: number;
  unit: KPIUnit;
  trend: KPITrend;
  percentageComplete?: number;
  percentageChange: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  circleId?: number;
  description?: string;
  history?: KPIHistory[];
}

export interface KPIHistory {
  id: string;
  value: number;
  target: number;
  percentageComplete: number;
  recordedAt: string;
}

export interface CreateKPIData {
  name: string;
  startValue?: number;
  currentValue: number;
  targetValue: number;
  unit: KPIUnit;
  description?: string;
}

export interface UpdateKPIData {
  name?: string;
  currentValue?: number;
  targetValue?: number;
  unit?: KPIUnit;
  description?: string;
}

export interface KPIFormData {
  name: string;
  value: number;
  target: number;
  unit: string;
}
