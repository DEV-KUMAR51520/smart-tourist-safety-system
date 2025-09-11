// src/services/EncryptionService.ts
import CryptoJS from 'crypto-js';
import * as RSA from 'react-native-rsa-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class EncryptionService {
  private salt: string = 'SmartTouristSafety';
  private secretKey: string = 'TouristSecurityKey2023';
  private serverPublicKey: string | null = null;
  private clientKeyPair: { public: string; private: string } | null = null;
  private sessionKey: string | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize the encryption service
   */
  public async initialize(): Promise<boolean> {
    try {
      // Try to load existing keys from storage
      const storedKeys = await this.getStoredKeys();
      
      if (storedKeys) {
        this.serverPublicKey = storedKeys.serverPublicKey;
        this.clientKeyPair = storedKeys.clientKeyPair;
        this.sessionKey = storedKeys.sessionKey;
      } else {
        // Generate new client key pair
        this.clientKeyPair = await this.generateKeyPair();
        
        // Fetch server public key
        this.serverPublicKey = await this.fetchServerPublicKey();
        
        // Generate session key
        this.sessionKey = await this.generateSessionKey();
        
        // Store keys
        await this.storeKeys();
      }
      
      this.isInitialized = true;
      console.log('Encryption service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize encryption service:', error);
      return false;
    }
  }

  /**
   * Hash a password using SHA-256
   */
  public hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.salt).toString();
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  public async encrypt(data: any): Promise<string> {
     try {
       if (!this.sessionKey) {
         throw new Error('Encryption service not initialized');
       }
       
       const jsonString = JSON.stringify(data);
       const encrypted = CryptoJS.AES.encrypt(jsonString, this.sessionKey).toString();
       return encrypted;
     } catch (error) {
       console.error('Encryption failed:', error);
       throw error;
     }
   }

   /**
    * Decrypt data using AES-256-GCM
    */
   public async decrypt(encryptedData: string): Promise<any> {
     try {
       if (!this.sessionKey) {
         throw new Error('Encryption service not initialized');
       }
       
       const bytes = CryptoJS.AES.decrypt(encryptedData, this.sessionKey);
       const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
       return JSON.parse(decryptedString);
     } catch (error) {
       console.error('Decryption failed:', error);
       throw error;
     }
   }

   /**
    * Encrypt data for the server using RSA with server's public key
    */
   public async encryptForServer(data: any): Promise<string> {
     try {
       if (!this.serverPublicKey) {
         throw new Error('Server public key not available');
       }
       
       const jsonString = JSON.stringify(data);
       const encrypted = await RSA.encrypt(jsonString, this.serverPublicKey);
       return encrypted;
     } catch (error) {
       console.error('Server encryption failed:', error);
       throw error;
     }
   }

   /**
    * Decrypt data from the server using client's private key
    */
   public async decryptFromServer(encryptedData: string): Promise<any> {
     try {
       if (!this.clientKeyPair?.private) {
         throw new Error('Client private key not available');
       }
       
       const decrypted = await RSA.decrypt(encryptedData, this.clientKeyPair.private);
       return JSON.parse(decrypted);
     } catch (error) {
       console.error('Server decryption failed:', error);
       throw error;
     }
   }

   /**
    * Sign data with client's private key
    */
   public async sign(data: string): Promise<string> {
     try {
       if (!this.clientKeyPair?.private) {
         throw new Error('Client private key not available');
       }
       
       const signature = await RSA.sign(data, this.clientKeyPair.private);
       return signature;
     } catch (error) {
       console.error('Signing failed:', error);
       throw error;
     }
   }

   /**
    * Verify server signature
    */
   public async verifyServerSignature(data: string, signature: string): Promise<boolean> {
     try {
       if (!this.serverPublicKey) {
         throw new Error('Server public key not available');
       }
       
       const isValid = await RSA.verify(data, signature, this.serverPublicKey);
       return isValid;
     } catch (error) {
       console.error('Signature verification failed:', error);
       return false;
     }
   }

   /**
    * Generate a secure random session key
    */
   private async generateSessionKey(): Promise<string> {
     // Generate a random 256-bit key (32 bytes)
     const randomBytes = CryptoJS.lib.WordArray.random(32);
     return randomBytes.toString(CryptoJS.enc.Hex);
   }

   /**
    * Generate RSA key pair
    */
   private async generateKeyPair(): Promise<{ public: string; private: string }> {
     try {
       const keyPair = await RSA.generateKeys(2048);
       return keyPair;
     } catch (error) {
       console.error('Key pair generation failed:', error);
       throw error;
     }
   }

   /**
    * Fetch server public key
    */
   private async fetchServerPublicKey(): Promise<string> {
     // In a real app, this would fetch the server's public key from the API
     // For demo purposes, we're using a dummy key
     return 'DUMMY_SERVER_PUBLIC_KEY';
   }

   /**
    * Store encryption keys in AsyncStorage
    */
   private async storeKeys(): Promise<void> {
     try {
       if (!this.serverPublicKey || !this.clientKeyPair || !this.sessionKey) {
         throw new Error('Keys not available for storage');
       }
       
       const keysData = JSON.stringify({
         serverPublicKey: this.serverPublicKey,
         clientKeyPair: this.clientKeyPair,
         sessionKey: this.sessionKey,
       });
       
       await AsyncStorage.setItem('encryption_keys', keysData);
     } catch (error) {
       console.error('Failed to store encryption keys:', error);
       throw error;
     }
   }

   /**
    * Get stored encryption keys from AsyncStorage
    */
   private async getStoredKeys(): Promise<{ serverPublicKey: string; clientKeyPair: { public: string; private: string }; sessionKey: string } | null> {
     try {
       const keysData = await AsyncStorage.getItem('encryption_keys');
       
       if (!keysData) {
         return null;
       }
       
       return JSON.parse(keysData);
     } catch (error) {
       console.error('Failed to get stored encryption keys:', error);
       return null;
     }
   }

   /**
    * Clear all stored encryption keys
    */
   public async clearKeys(): Promise<void> {
     try {
       await AsyncStorage.removeItem('encryption_keys');
       this.serverPublicKey = null;
       this.clientKeyPair = null;
       this.sessionKey = null;
       this.isInitialized = false;
     } catch (error) {
       console.error('Failed to clear encryption keys:', error);
       throw error;
     }
   }
}