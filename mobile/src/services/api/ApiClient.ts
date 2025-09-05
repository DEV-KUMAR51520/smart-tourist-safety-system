import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://localhost:5000/api';

const ApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

ApiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check for 401 Unauthorized errors and attempt to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // You would typically have a separate API for refreshing tokens
        const newToken = await refreshAuthToken();
        await AsyncStorage.setItem('access_token', newToken);
        ApiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return ApiClient(originalRequest);
      } catch (refreshError) {
        // Handle token refresh failure
        Alert.alert('Session Expired', 'Please log in again.');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Mock function for token refresh, for a hackathon demo
const refreshAuthToken = async (): Promise<string> => {
    return 'new_mock_token';
};

export { ApiClient };
