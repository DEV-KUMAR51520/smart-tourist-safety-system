// src/services/api/AuthService.ts
import { ApiClient } from './ApiClient';
import { encryptionService } from '../index';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  tourist: {
    id: string;
    name: string;
    phone: string;
    safety_score: number;
    entry_point: string;
    is_active: boolean;
  };
}

interface RegistrationResponse extends LoginResponse {
  digital_id: {
    id: string;
    blockchain_hash: string;
    issued_date: string;
    expiry_date: string;
  };
}

export class AuthService {
  private static apiClient = ApiClient;
  private static API_URL = '/api/auth';

  /**
   * Login with phone number and password
   */
  public static async login(phone: string, password: string): Promise<LoginResponse> {
    try {
      // In a real app, this would be an actual API call
      // For demo purposes, we're simulating the API response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response for demo
      if (phone === '9876543210' && password === 'password') {
        return {
          access_token: 'mock_access_token_' + Date.now(),
          refresh_token: 'mock_refresh_token_' + Date.now(),
          tourist: {
            id: 'tourist-001',
            name: 'John Doe',
            phone: phone,
            safety_score: 95,
            entry_point: 'Guwahati Airport',
            is_active: true
          }
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      // Real implementation would be:
      // const response = await this.apiClient.post(`${this.API_URL}/login`, {
      //   phone,
      //   password: encryptionService.hashPassword(password)
      // });
      // return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Register a new tourist
   */
  public static async register(registrationData: any): Promise<RegistrationResponse> {
    try {
      // In a real app, this would be an actual API call
      // For demo purposes, we're simulating the API response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response for demo
      return {
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        tourist: {
          id: 'tourist-' + Math.floor(1000 + Math.random() * 9000),
          name: registrationData.name,
          phone: registrationData.phone,
          safety_score: 100,
          entry_point: 'Mobile App Registration',
          is_active: true
        },
        digital_id: {
          id: 'TSN-' + Math.floor(1000000000 + Math.random() * 9000000000),
          blockchain_hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          issued_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }
      };
      
      // Real implementation would be:
      // const response = await this.apiClient.post(`${this.API_URL}/register`, {
      //   ...registrationData,
      //   password: encryptionService.hashPassword(registrationData.password)
      // });
      // return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Verify digital ID
   */
  public static async verifyDigitalId(digitalIdNumber: string): Promise<boolean> {
    try {
      // In a real app, this would verify the digital ID on the blockchain
      // For demo purposes, we're simulating the verification
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock verification (always returns true for demo)
      return true;
      
      // Real implementation would be:
      // const response = await this.apiClient.post(`${this.API_URL}/verify-digital-id`, {
      //   digital_id: digitalIdNumber
      // });
      // return response.data.verified;
    } catch (error) {
      console.error('Digital ID verification failed:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  public static async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      // In a real app, this would refresh the authentication token
      // For demo purposes, we're simulating the refresh
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock response
      return {
        access_token: 'mock_refreshed_access_token_' + Date.now()
      };
      
      // Real implementation would be:
      // const response = await this.apiClient.post(`${this.API_URL}/refresh-token`, {
      //   refresh_token: refreshToken
      // });
      // return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
}