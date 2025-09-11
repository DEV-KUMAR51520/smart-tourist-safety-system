import apiService from './ApiService';
import { EncryptionService } from './EncryptionService';

// Create a singleton instance of EncryptionService
const encryptionService = new EncryptionService();

export {
  apiService,
  encryptionService
};