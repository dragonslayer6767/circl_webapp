// KPI Service - API Integration
import api from './authService';
import { KPI, KPIHistory, KPIUnit } from '../types/kpi';

export interface CreateKPIData {
  name: string;
  startValue?: number;
  value: number;
  target: number;
  unit: KPIUnit;
  description?: string;
}

export interface UpdateKPIData {
  name?: string;
  value?: number;
  target?: number;
  unit?: KPIUnit;
  description?: string;
}

export const kpiService = {
  /**
   * Get all KPIs for a circle
   */
  getKPIs: async (circleId: number): Promise<KPI[]> => {
    try {
      const response = await api.get(`/kpi/kpis/`, {
        params: { circle_id: circleId }
      });
      return response.data.results || response.data;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  },

  /**
   * Get a single KPI
   */
  getKPI: async (kpiId: string): Promise<KPI> => {
    try {
      const response = await api.get(`/kpi/kpis/${kpiId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI:', error);
      throw error;
    }
  },

  /**
   * Create a new KPI
   */
  createKPI: async (circleId: number, kpiData: CreateKPIData): Promise<KPI> => {
    try {
      const payload = {
        name: kpiData.name,
        start_value: kpiData.startValue,
        value: kpiData.value,
        target: kpiData.target,
        unit: kpiData.unit,
        description: kpiData.description,
        circle: circleId
      };
      const response = await api.post(`/kpi/kpis/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating KPI:', error);
      throw error;
    }
  },

  /**
   * Update a KPI
   */
  updateKPI: async (kpiId: string, kpiData: UpdateKPIData): Promise<KPI> => {
    try {
      const response = await api.put(`/kpi/kpis/${kpiId}/`, kpiData);
      return response.data;
    } catch (error) {
      console.error('Error updating KPI:', error);
      throw error;
    }
  },

  /**
   * Update only the current value of a KPI (quick update)
   */
  updateKPIValue: async (kpiId: string, currentValue: number): Promise<KPI> => {
    try {
      const response = await api.post(`/kpi/kpis/${kpiId}/update_value/`, {
        value: currentValue
      });
      return response.data;
    } catch (error) {
      console.error('Error updating KPI value:', error);
      throw error;
    }
  },

  /**
   * Get KPI history for charts
   */
  getKPIHistory: async (kpiId: string, days: number = 30): Promise<KPIHistory[]> => {
    try {
      const response = await api.get(`/kpi/kpis/${kpiId}/history/`, {
        params: { days, limit: 100 }
      });
      return response.data.history || response.data;
    } catch (error) {
      console.error('Error fetching KPI history:', error);
      throw error;
    }
  },

  /**
   * Delete a KPI
   */
  deleteKPI: async (kpiId: string): Promise<void> => {
    try {
      await api.delete(`/kpi/kpis/${kpiId}/`);
    } catch (error) {
      console.error('Error deleting KPI:', error);
      throw error;
    }
  }
};
