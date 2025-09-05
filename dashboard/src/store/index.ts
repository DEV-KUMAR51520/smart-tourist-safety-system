// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import emergencyReducer from './slices/emergencySlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    emergency: emergencyReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/store/slices/dashboardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tourist, Alert, RiskZone, LocationData } from '../../types';

interface DashboardState {
  tourists: Tourist[];
  alerts: Alert[];
  riskZones: RiskZone[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  tourists: [],
  alerts: [],
  riskZones: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTourists: (state, action: PayloadAction<Tourist[]>) => {
      state.tourists = action.payload;
    },
    updateTouristLocation: (state, action: PayloadAction<{tourist_id: string, location: LocationData}>) => {
      const { tourist_id, location } = action.payload;
      const tourist = state.tourists.find(t => t.id === tourist_id);
      if (tourist) {
        tourist.last_location = location;
      }
    },
    updateTouristSafetyScore: (state, action: PayloadAction<{tourist_id: string, safety_score: number}>) => {
      const { tourist_id, safety_score } = action.payload;
      const tourist = state.tourists.find(t => t.id === tourist_id);
      if (tourist) {
        tourist.safety_score = safety_score;
      }
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
    },
    acknowledgeAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.acknowledged = true;
      }
    },
    setRiskZones: (state, action: PayloadAction<RiskZone[]>) => {
      state.riskZones = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTourists,
  updateTouristLocation,
  updateTouristSafetyScore,
  addAlert,
  acknowledgeAlert,
  setRiskZones,
  setLoading,
  setError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;