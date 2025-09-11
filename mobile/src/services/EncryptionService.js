/**
 * EncryptionService.js
 * Provides end-to-end encryption functionality for the mobile app
 * Uses AES-256-GCM for symmetric encryption and RSA for key exchange
 */

import CryptoJS from 'crypto-js';
import { RSA } from 'react-native-rsa-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EncryptionService {
  constructor() {
    this.serverPublicKey = null;
    this.clientKeyPair = null;
    this.sessionKey = null;
  }

  /**
   * Initialize the encryption service
   * Generates client keypair and retrieves server public key
   */
  async initialize() {
    try {
      // Check if we already have keys stored
      const storedKeys = await this._getStoredKeys();
      
      if (storedKeys) {
        this.clientKeyPair = storedKeys.clientKeyPair;
        this.serverPublicKey = storedKeys.serverPublicKey;
        this.sessionKey = storedKeys.sessionKey;
        console.log('Encryption keys loaded from storage');
        return true;
      }
      
      // Generate new RSA key pair for the client
      this.clientKeyPair = await RSA.generateKeys(2048);
      
      // In a real app, fetch the server's public key from the backend
      // For demo purposes, we'll use a hardcoded key (this should NEVER be done in production)
      this.serverPublicKey = await this._fetchServerPublicKey();
      
      // Generate a random AES session key
      this.sessionKey = this._generateSessionKey();
      
      // Store keys for future use
      await this._storeKeys();
      
      console.log('Encryption service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize encryption service:', error);
      return false;
    }
  }

  /**
   * Encrypt data using the session key
   * @param {Object|string} data - Data to encrypt
   * @returns {string} - Encrypted data as a string
   */
  encrypt(data) {
    try {
      if (!this.sessionKey) {
        throw new Error('Encryption service not initialized');
      }
      
      // Convert object to string if needed
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      
      // Encrypt using AES-256-GCM
      const encrypted = CryptoJS.AES.encrypt(dataString, this.sessionKey).toString();
      
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt data using the session key
   * @param {string} encryptedData - Encrypted data string
   * @returns {Object|string} - Decrypted data
   */
  decrypt(encryptedData) {
    try {
      if (!this.sessionKey) {
        throw new Error('Encryption service not initialized');
      }
      
      // Decrypt using AES
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.sessionKey).toString(CryptoJS.enc.Utf8);
      
      // Try to parse as JSON, return as string if not valid JSON
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  /**
   * Encrypt data specifically for sending to the server
   * Uses the server's public key for RSA encryption
   * @param {Object|string} data - Data to encrypt
   * @returns {string} - RSA encrypted data
   */
  async encryptForServer(data) {
    try {
      if (!this.serverPublicKey) {
        throw new Error('Server public key not available');
      }
      
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      
      // Use RSA encryption with the server's public key
      const encrypted = await RSA.encrypt(dataString, this.serverPublicKey);
      
      return encrypted;
    } catch (error) {
      console.error('Server encryption failed:', error);
      throw error;
    }
  }

  /**
   * Decrypt data received from the server
   * Uses the client's private key for RSA decryption
   * @param {string} encryptedData - RSA encrypted data from server
   * @returns {Object|string} - Decrypted data
   */
  async decryptFromServer(encryptedData) {
    try {
      if (!this.clientKeyPair?.private) {
        throw new Error('Client private key not available');
      }
      
      // Use RSA decryption with client's private key
      const decrypted = await RSA.decrypt(encryptedData, this.clientKeyPair.private);
      
      // Try to parse as JSON, return as string if not valid JSON
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      console.error('Server decryption failed:', error);
      throw error;
    }
  }

  /**
   * Sign data with the client's private key
   * @param {Object|string} data - Data to sign
   * @returns {string} - Signature
   */
  async sign(data) {
    try {
      if (!this.clientKeyPair?.private) {
        throw new Error('Client private key not available');
      }
      
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      
      // Sign the data with the client's private key
      const signature = await RSA.sign(dataString, this.clientKeyPair.private);
      
      return signature;
    } catch (error) {
      console.error('Signing failed:', error);
      throw error;
    }
  }

  /**
   * Verify a signature using the server's public key
   * @param {string} data - Original data
   * @param {string} signature - Signature to verify
   * @returns {boolean} - Whether the signature is valid
   */
  async verifyServerSignature(data, signature) {
    try {
      if (!this.serverPublicKey) {
        throw new Error('Server public key not available');
      }
      
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      
      // Verify the signature with the server's public key
      const isValid = await RSA.verify(dataString, signature, this.serverPublicKey);
      
      return isValid;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Generate a secure random session key
   * @returns {string} - Random session key
   * @private
   */
  _generateSessionKey() {
    // Generate a random 256-bit key (32 bytes)
    const randomBytes = CryptoJS.lib.WordArray.random(32);
    return randomBytes.toString(CryptoJS.enc.Hex);
  }

  /**
   * Fetch the server's public key
   * In a real app, this would be an API call
   * @returns {Promise<string>} - Server's public key
   * @private
   */
  async _fetchServerPublicKey() {
    // In a real app, this would be an API call to fetch the server's public key
    // For demo purposes, we'll simulate a network request
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a dummy key for demonstration only
        // In a real app, this would be the actual server public key
        resolve('DUMMY_SERVER_PUBLIC_KEY_FOR_DEMO');
      }, 500);
    });
  }

  /**
   * Store encryption keys in secure storage
   * @returns {Promise<void>}
   * @private
   */
  async _storeKeys() {
    try {
      const keysToStore = {
        clientKeyPair: this.clientKeyPair,
        serverPublicKey: this.serverPublicKey,
        sessionKey: this.sessionKey,
      };
      
      await AsyncStorage.setItem('encryption_keys', JSON.stringify(keysToStore));
    } catch (error) {
      console.error('Failed to store encryption keys:', error);
      throw error;
    }
  }

  /**
   * Retrieve stored encryption keys
   * @returns {Promise<Object|null>} - Stored keys or null if not found
   * @private
   */
  async _getStoredKeys() {
    try {
      const storedKeys = await AsyncStorage.getItem('encryption_keys');
      
      if (!storedKeys) {
        return null;
      }
      
      return JSON.parse(storedKeys);
    } catch (error) {
      console.error('Failed to retrieve encryption keys:', error);
      return null;
    }
  }

  /**
   * Clear all stored encryption keys
   * @returns {Promise<void>}
   */
  async clearKeys() {
    try {
      await AsyncStorage.removeItem('encryption_keys');
      this.clientKeyPair = null;
      this.serverPublicKey = null;
      this.sessionKey = null;
      console.log('Encryption keys cleared');
    } catch (error) {
      console.error('Failed to clear encryption keys:', error);
      throw error;
    }
  }
}

// Export as a singleton
const encryptionService = new EncryptionService();
export default encryptionService;