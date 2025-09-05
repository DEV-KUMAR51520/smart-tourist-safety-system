// src/services/api.ts
import axios from 'axios';
import { Tourist, EmergencyIncident, Alert, RiskZone } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AI_SERVICE_URL = process.env.REACT_APP_AI_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardApi = {
  // Tourist management
  async getTourists(): Promise<Tourist[]> {
    const response = await api.get('/dashboard/tourists');
    return response.data;
  },

  async getTouristById(id: string): Promise<Tourist> {
    const response = await api.get(`/dashboard/tourists/${id}`);
    return response.data;
  },

  async updateTouristStatus(id: string, status: boolean): Promise<void> {
    await api.patch(`/dashboard/tourists/${id}/status`, { is_active: status });
  },

  // Risk zones
  async getRiskZones(): Promise<RiskZone[]> {
    const response = await api.get('/dashboard/risk-zones');
    return response.data;
  },

  async createRiskZone(zone: Omit<RiskZone, 'id'>): Promise<RiskZone> {
    const response = await api.post('/dashboard/risk-zones', zone);
    return response.data;
  },

  async updateRiskZone(id: string, zone: Partial<RiskZone>): Promise<RiskZone> {
    const response = await api.patch(`/dashboard/risk-zones/${id}`, zone);
    return response.data;
  },

  // Alerts
  async getAlerts(limit?: number): Promise<Alert[]> {
    const response = await api.get('/dashboard/alerts', { params: { limit } });
    return response.data;
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    await api.patch(`/dashboard/alerts/${alertId}/acknowledge`);
  },

  // Analytics
  async getTouristHeatmap(): Promise<any> {
    const response = await api.get('/dashboard/analytics/heatmap');
    return response.data;
  },

  async getSafetyStatistics(): Promise<any> {
    const response = await api.get('/dashboard/analytics/safety-stats');
    return response.data;
  },
};

export const emergencyApi = {
  // Incidents
  async getIncidents(): Promise<EmergencyIncident[]> {
    const response = await api.get('/emergency/incidents');
    return response.data;
  },

  async getIncidentById(id: string): Promise<EmergencyIncident> {
    const response = await api.get(`/emergency/incidents/${id}`);
    return response.data;
  },

  async updateIncidentStatus(id: string, status: string, notes?: string): Promise<void> {
    await api.patch(`/emergency/incidents/${id}/status`, { status, notes });
  },

  async assignOfficer(id: string, officerId: string): Promise<void> {
    await api.patch(`/emergency/incidents/${id}/assign`, { officer_id: officerId });
  },

  async createIncident(incident: Omit<EmergencyIncident, 'id' | 'created_at'>): Promise<EmergencyIncident> {
    const response = await api.post('/emergency/incidents', incident);
    return response.data;
  },

  // Emergency contacts
  async notifyEmergencyContacts(touristId: string, message: string): Promise<void> {
    await api.post('/emergency/notify', { tourist_id: touristId, message });
  },

  // Auto-generated reports
  async generateIncidentReport(incidentId: string): Promise<any> {
    const response = await api.get(`/emergency/incidents/${incidentId}/report`);
    return response.data;
  },
};

export const aiApi = {
  // AI predictions
  async predictAnomaly(data: any): Promise<any> {
    const response = await axios.post(`${AI_SERVICE_URL}/predict/anomaly`, data);
    return response.data;
  },

  async assessRisk(data: any): Promise<any> {
    const response = await axios.post(`${AI_SERVICE_URL}/predict/risk`, data);
    return response.data;
  },

  async calculateSafetyScore(data: any): Promise<any> {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze/safety-score`, data);
    return response.data;
  },
};