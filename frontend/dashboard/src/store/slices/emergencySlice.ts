import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmergencyIncident } from '../../types';

interface EmergencyState {
  incidents: EmergencyIncident[];
  loading: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  incidents: [],
  loading: false,
  error: null,
};

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setIncidents: (state, action: PayloadAction<EmergencyIncident[]>) => {
      state.incidents = action.payload;
    },
    addIncident: (state, action: PayloadAction<EmergencyIncident>) => {
      state.incidents.unshift(action.payload);
    },
    updateIncidentStatus: (state, action: PayloadAction<{ incidentId: string; status: string; notes?: string }>) => {
      const { incidentId, status, notes } = action.payload;
      const incident = state.incidents.find((i) => i.id === incidentId);
      if (incident) {
        incident.status = status;
        // In a real app, we would add notes to an incident history log
      }
    },
    assignOfficer: (state, action: PayloadAction<{ incidentId: string; officerId: string }>) => {
      const { incidentId, officerId } = action.payload;
      const incident = state.incidents.find((i) => i.id === incidentId);
      if (incident) {
        incident.assigned_officer = officerId;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setIncidents, addIncident, updateIncidentStatus, assignOfficer, setLoading, setError } = emergencySlice.actions;
export default emergencySlice.reducer;
