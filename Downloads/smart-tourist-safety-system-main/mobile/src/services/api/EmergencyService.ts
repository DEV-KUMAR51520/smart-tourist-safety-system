import { ApiClient } from './ApiClient';
import { LocationData } from '../location/LocationService';

interface PanicAlertPayload {
  tourist_id: string | undefined;
  incident_type: string;
  location: LocationData;
  description: string;
}

export class EmergencyService {
  static async triggerPanicButton(payload: PanicAlertPayload) {
    const response = await ApiClient.post('/emergency/panic', payload);
    return response.data;
  }

  static async reportIncident(payload: PanicAlertPayload) {
    const response = await ApiClient.post('/emergency/report', payload);
    return response.data;
  }
}
