// src/services/location/GeofencingService.ts
import { LocationService } from './LocationService';
import { NotificationService } from '../notifications/NotificationService';
import { ApiClient } from '../api/ApiClient';

interface RiskZone {
  id: string;
  name: string;
  zone_type: string;
  coordinates: any; // GeoJSON polygon
  risk_level: number;
  active_alerts?: any;
  description?: string;
}

interface GeofenceViolation {
  zone: RiskZone;
  violation_type: 'entered' | 'exited';
  timestamp: string;
}

export class GeofencingService {
  private static activeZones: RiskZone[] = [];
  private static currentLocation: { latitude: number; longitude: number } | null = null;

  static async initializeGeofencing() {
    // Start location tracking with geofence checking
    LocationService.startLocationTracking(this.onLocationUpdate.bind(this));

    // Load initial risk zones
    await this.loadNearbyRiskZones();
  }

  static async onLocationUpdate(location: { latitude: number; longitude: number }) {
    this.currentLocation = location;

    // Check for geofence violations
    const violations = await this.checkGeofenceViolations(location);

    if (violations.length > 0) {
      this.handleGeofenceViolations(violations);
    }

    // Periodically update nearby zones
    await this.loadNearbyRiskZones();
  }

  static async loadNearbyRiskZones() {
    if (!this.currentLocation) return;

    try {
      const response = await ApiClient.get('/location/nearby-zones', {
        params: {
          lat: this.currentLocation.latitude,
          lng: this.currentLocation.longitude,
          radius: 10 // 10km radius
        }
      });

      this.activeZones = response.data.zones;
    } catch (error) {
      console.error('Failed to load nearby risk zones:', error);
    }
  }

  static async checkGeofenceViolations(location: { latitude: number; longitude: number }): Promise<GeofenceViolation[]> {
    const violations: GeofenceViolation[] = [];

    for (const zone of this.activeZones) {
      const isInside = this.isPointInPolygon(location, zone.coordinates);
      const wasInside = this.wasInZone(zone.id);

      if (isInside && !wasInside) {
        // Entered zone
        violations.push({
          zone,
          violation_type: 'entered',
          timestamp: new Date().toISOString()
        });
        this.setZoneStatus(zone.id, true);
      } else if (!isInside && wasInside) {
        // Exited zone
        violations.push({
          zone,
          violation_type: 'exited',
          timestamp: new Date().toISOString()
        });
        this.setZoneStatus(zone.id, false);
      }
    }

    return violations;
  }

  static handleGeofenceViolations(violations: GeofenceViolation[]) {
    violations.forEach(violation => {
      if (violation.violation_type === 'entered') {
        this.handleZoneEntry(violation.zone);
      } else {
        this.handleZoneExit(violation.zone);
      }
    });
  }

  static handleZoneEntry(zone: RiskZone) {
    let alertMessage = '';
    let alertLevel = 'info';

    switch (zone.zone_type) {
      case 'wildlife':
        alertMessage = `⚠️ You've entered ${zone.name}. Wildlife area - maintain safe distance from animals.`;
        alertLevel = 'warning';
        break;
      case 'restricted':
        alertMessage = `🚫 You've entered a restricted area: ${zone.name}. Please exit immediately.`;
        alertLevel = 'danger';
        break;
      case 'weather':
        alertMessage = `🌪️ Weather alert in ${zone.name}: ${zone.active_alerts?.message || 'Monitor conditions carefully'}`;
        alertLevel = 'warning';
        break;
      default:
        alertMessage = `📍 You've entered ${zone.name} (Risk Level: ${zone.risk_level}/5)`;
    }

    // Show local notification
    NotificationService.showLocalNotification({
      title: 'Geofence Alert',
      body: alertMessage,
      data: { zone_id: zone.id, type: 'geofence_entry' }
    });

    // If high-risk zone, consider automated emergency alert
    if (zone.risk_level >= 4) {
      this.considerEmergencyAlert(zone);
    }
  }

  static handleZoneExit(zone: RiskZone) {
    NotificationService.showLocalNotification({
      title: 'Zone Exit',
      body: `✅ You've safely exited ${zone.name}`,
      data: { zone_id: zone.id, type: 'geofence_exit' }
    });
  }

  static considerEmergencyAlert(zone: RiskZone) {
    // Logic to automatically trigger emergency protocols
    // for extremely high-risk zones
    if (zone.risk_level === 5) {
      setTimeout(() => {
        // Auto-trigger emergency if no user response in 2 minutes
        this.autoTriggerEmergency(zone);
      }, 120000);
    }
  }

  static autoTriggerEmergency(zone: RiskZone) {
    // Implementation for automatic emergency triggering
    console.log(`Auto-triggering emergency for high-risk zone: ${zone.name}`);
  }

  // Utility methods
  static isPointInPolygon(point: { latitude: number; longitude: number }, polygon: any): boolean {
    // Implementation of ray casting algorithm
    // Simplified version - in production, use robust geometry library
    const { coordinates } = polygon;
    const x = point.longitude;
    const y = point.latitude;

    let inside = false;
    const coords = coordinates[0]; // Assuming simple polygon

    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      const xi = coords[i][0], yi = coords[i][1];
      const xj = coords[j][0], yj = coords[j][1];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  static wasInZone(zoneId: string): boolean {
    // Check local storage for previous zone status
    // Implementation needed
    return false;
  }

  static setZoneStatus(zoneId: string, isInside: boolean) {
    // Store zone status in local storage
    // Implementation needed
  }
}