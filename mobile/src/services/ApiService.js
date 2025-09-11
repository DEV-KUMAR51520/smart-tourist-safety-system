/**
 * ApiService.js
 * Provides secure API communication with end-to-end encryption
 */

import axios from 'axios';
import encryptionService from './EncryptionService';

// Base URL for API requests
const API_BASE_URL = 'https://api.smarttouristsafety.com/v1'; // Replace with actual API URL

class ApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    this.isInitialized = false;
  }

  /**
   * Initialize the API service with encryption
   */
  async initialize() {
    try {
      // Initialize encryption service
      const encryptionInitialized = await encryptionService.initialize();
      
      if (!encryptionInitialized) {
        throw new Error('Failed to initialize encryption service');
      }
      
      // Set up request interceptor to encrypt outgoing data
      this.axiosInstance.interceptors.request.use(
        async (config) => {
          // Don't encrypt auth requests as they use a different encryption scheme
          if (config.url.includes('/auth/')) {
            return config;
          }
          
          // Only encrypt if there's a request body
          if (config.data) {
            // Add client public key to headers for the server to use for response encryption
            config.headers['X-Client-Public-Key'] = encryptionService.clientKeyPair?.public || '';
            
            // Encrypt the request data
            const encryptedData = await encryptionService.encrypt(config.data);
            
            // Sign the encrypted data
            const signature = await encryptionService.sign(encryptedData);
            
            // Replace the original data with encrypted data and add signature
            config.data = {
              encryptedData,
              signature,
            };
          }
          
          return config;
        },
        (error) => Promise.reject(error)
      );
      
      // Set up response interceptor to decrypt incoming data
      this.axiosInstance.interceptors.response.use(
        async (response) => {
          // Don't decrypt auth responses as they use a different encryption scheme
          if (response.config.url.includes('/auth/')) {
            return response;
          }
          
          // Only decrypt if there's a response body with encrypted data
          if (response.data && response.data.encryptedData) {
            const { encryptedData, signature } = response.data;
            
            // Verify the signature if provided
            if (signature) {
              const isValid = await encryptionService.verifyServerSignature(encryptedData, signature);
              
              if (!isValid) {
                throw new Error('Invalid server signature');
              }
            }
            
            // Decrypt the response data
            const decryptedData = await encryptionService.decrypt(encryptedData);
            
            // Replace the encrypted data with decrypted data
            response.data = decryptedData;
          }
          
          return response;
        },
        (error) => Promise.reject(error)
      );
      
      this.isInitialized = true;
      console.log('API service initialized with encryption');
      return true;
    } catch (error) {
      console.error('Failed to initialize API service:', error);
      return false;
    }
  }

  /**
   * Make a secure API request
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data (for POST, PUT)
   * @param {Object} options - Additional axios options
   * @returns {Promise<Object>} - API response
   */
  async request(method, endpoint, data = null, options = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      const response = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        ...options,
      });
      
      return response.data;
    } catch (error) {
      this._handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional axios options
   * @returns {Promise<Object>} - API response
   */
  async get(endpoint, params = {}, options = {}) {
    return this.request('GET', endpoint, null, { ...options, params });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Additional axios options
   * @returns {Promise<Object>} - API response
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Additional axios options
   * @returns {Promise<Object>} - API response
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional axios options
   * @returns {Promise<Object>} - API response
   */
  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @private
   */
  _handleApiError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
  }

  /**
   * Register a new tourist
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration response
   */
  async registerTourist(userData) {
    return this.post('/auth/register', userData);
  }

  /**
   * Login a tourist
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} - Login response with auth token
   */
  async loginTourist(credentials) {
    return this.post('/auth/login', credentials);
  }

  /**
   * Get tourist digital ID
   * @param {string} touristId - Tourist ID
   * @returns {Promise<Object>} - Digital ID data
   */
  async getTouristDigitalId(touristId) {
    return this.get(`/tourists/${touristId}/digital-id`);
  }

  /**
   * Send emergency alert
   * @param {Object} alertData - Emergency alert data
   * @returns {Promise<Object>} - Alert response
   */
  async sendEmergencyAlert(alertData) {
    return this.post('/emergencies', alertData);
  }

  /**
   * Get emergency status
   * @param {string} emergencyId - Emergency ID
   * @returns {Promise<Object>} - Emergency status
   */
  async getEmergencyStatus(emergencyId) {
    return this.get(`/emergencies/${emergencyId}`);
  }

  /**
   * Cancel emergency alert
   * @param {string} emergencyId - Emergency ID
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelEmergency(emergencyId) {
    return this.put(`/emergencies/${emergencyId}/cancel`);
  }

  /**
   * Get geofencing zones
   * @param {Object} coordinates - User coordinates
   * @returns {Promise<Object>} - Geofencing zones
   */
  async getGeofencingZones(coordinates) {
    return this.get('/geofencing/zones', coordinates);
  }

  /**
   * Update tourist location
   * @param {string} touristId - Tourist ID
   * @param {Object} locationData - Location data
   * @returns {Promise<Object>} - Update response
   */
  async updateTouristLocation(touristId, locationData) {
    return this.put(`/tourists/${touristId}/location`, locationData);
  }

  /**
   * Get tourist safety score
   * @param {string} touristId - Tourist ID
   * @returns {Promise<Object>} - Safety score data
   */
  async getTouristSafetyScore(touristId) {
    return this.get(`/tourists/${touristId}/safety-score`);
  }
}

// Export as a singleton
const apiService = new ApiService();
export default apiService;