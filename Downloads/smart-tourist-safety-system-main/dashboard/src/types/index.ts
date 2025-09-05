export interface Tourist {
  id: string;
  name: string;
  phone: string;
  safety_score: number;
  entry_point: string;
  is_active: boolean;
  blockchain_id?: string;
  created_at: string;
  last_location?: LocationData;
}

export interface LocationData {
  id: string;
  tourist_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  battery_level?: number;
  network_type?: string;
}

export interface RiskZone {
  id: string;
  name: string;
  zone_type: 'wildlife' | 'restricted' | 'weather' | 'geological';
  coordinates: any; // GeoJSON
  risk_level: number;
  active_alerts?: any;
  description?: string;
}

export interface EmergencyIncident {
  id: string;
  tourist_id: string;
  incident_type: 'panic' | 'medical' | 'wildlife' | 'weather' | 'lost' | 'anomaly' | 'low_battery' | 'iot_alert';
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  assigned_officer?: string;
}

export interface Alert {
  id: string;
  tourist_id: string;
  type: 'anomaly' | 'low_safety_score' | 'high_risk' | 'geofence' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: string;
  location?: LocationData;
  timestamp: string;
  acknowledged: boolean;
}
