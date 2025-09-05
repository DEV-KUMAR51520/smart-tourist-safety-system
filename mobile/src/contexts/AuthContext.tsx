// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/api/AuthService';

interface Tourist {
  id: string;
  name: string;
  phone: string;
  safety_score: number;
  entry_point: string;
  is_active: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  tourist: Tourist | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (registrationData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const touristData = await AsyncStorage.getItem('tourist_data');

      if (token && touristData) {
        setIsAuthenticated(true);
        setTourist(JSON.parse(touristData));
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      const response = await AuthService.login(phone, password);

      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('tourist_data', JSON.stringify(response.tourist));

      setIsAuthenticated(true);
      setTourist(response.tourist);
    } catch (error) {
      throw error;
    }
  };

  const register = async (registrationData: any) => {
    try {
      const response = await AuthService.register(registrationData);

      await AsyncStorage.setItem('access_token', response.access_token);
      await AsyncStorage.setItem('tourist_data', JSON.stringify(response.tourist));

      setIsAuthenticated(true);
      setTourist(response.tourist);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('tourist_data');

      setIsAuthenticated(false);
      setTourist(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      tourist,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/services/api/AuthService.ts
import { ApiClient } from './ApiClient';

export class AuthService {
  static async login(phone: string, password: string) {
    const response = await ApiClient.post('/auth/login', {
      phone,
      password
    });
    return response.data;
  }

  static async register(registrationData: any) {
    const response = await ApiClient.post('/auth/register', registrationData);
    return response.data;
  }

  static async getProfile() {
    const response = await ApiClient.get('/auth/profile');
    return response.data;
  }
}