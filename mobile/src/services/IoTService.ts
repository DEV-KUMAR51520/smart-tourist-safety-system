// src/services/IoTService.ts
import { Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiClient } from './api/ApiClient';

interface SmartBandData {
  deviceId: string;
  batteryLevel: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  heartRate?: number;
  temperature?: number;
  steps?: number;
  lastSynced: Date;
}

export class IoTService {
  private static instance: IoTService;
  private bleManager: BleManager;
  private connectedDevice: Device | null = null;
  private apiClient: ApiClient;
  private isScanning: boolean = false;
  private smartBandData: SmartBandData | null = null;
  
  private constructor() {
    this.bleManager = new BleManager();
    this.apiClient = new ApiClient();
    
    // Initialize BLE manager
    if (Platform.OS === 'android') {
      this.requestAndroidPermissions();
    }
  }
  
  public static getInstance(): IoTService {
    if (!IoTService.instance) {
      IoTService.instance = new IoTService();
    }
    return IoTService.instance;
  }
  
  private async requestAndroidPermissions(): Promise<void> {
    // In a real implementation, request necessary Android permissions
    // For demo purposes, we'll skip this
    console.log('Requesting Android BLE permissions');
  }
  
  /**
   * Start scanning for nearby smart bands/tags
   */
  public async startScan(): Promise<void> {
    if (this.isScanning) return;
    
    try {
      this.isScanning = true;
      
      // In a real implementation, this would scan for BLE devices
      // For demo purposes, we'll simulate finding a device
      console.log('Started scanning for smart bands');
      
      // Simulate finding a device after 2 seconds
      setTimeout(() => {
        this.onDeviceFound({
          id: 'TSB-' + Math.floor(1000 + Math.random() * 9000),
          name: 'Tourist Smart Band',
          localName: 'TSB',
        } as Device);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to start scanning:', error);
      this.isScanning = false;
      throw error;
    }
  }
  
  /**
   * Stop scanning for devices
   */
  public stopScan(): void {
    if (!this.isScanning) return;
    
    this.bleManager.stopDeviceScan();
    this.isScanning = false;
    console.log('Stopped scanning for smart bands');
  }
  
  /**
   * Handle device found during scanning
   */
  private onDeviceFound(device: Device): void {
    console.log('Found device:', device.name || device.id);
    
    // Check if this is a tourist smart band (in a real app, check for service UUID)
    if (device.name?.includes('Tourist Smart Band') || device.localName?.includes('TSB')) {
      this.stopScan();
      this.connectToDevice(device);
    }
  }
  
  /**
   * Connect to a smart band/tag
   */
  public async connectToDevice(device: Device): Promise<boolean> {
    try {
      // In a real implementation, this would connect to the BLE device
      // For demo purposes, we'll simulate a connection
      console.log('Connecting to device:', device.id);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.connectedDevice = device;
      
      // Save device ID to AsyncStorage
      await AsyncStorage.setItem('connected_device_id', device.id);
      
      // Initialize smart band data
      this.smartBandData = {
        deviceId: device.id,
        batteryLevel: Math.floor(70 + Math.random() * 30), // 70-100%
        heartRate: Math.floor(60 + Math.random() * 40), // 60-100 bpm
        steps: Math.floor(Math.random() * 10000), // 0-10000 steps
        lastSynced: new Date()
      };
      
      // Register device with backend
      await this.registerDeviceWithBackend(device.id);
      
      console.log('Connected to device:', device.id);
      return true;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }
  
  /**
   * Disconnect from the connected device
   */
  public async disconnect(): Promise<boolean> {
    if (!this.connectedDevice) return false;
    
    try {
      // In a real implementation, this would disconnect from the BLE device
      // For demo purposes, we'll simulate disconnection
      console.log('Disconnecting from device:', this.connectedDevice.id);
      
      // Simulate disconnection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.connectedDevice = null;
      this.smartBandData = null;
      
      // Remove device ID from AsyncStorage
      await AsyncStorage.removeItem('connected_device_id');
      
      console.log('Disconnected from device');
      return true;
    } catch (error) {
      console.error('Failed to disconnect from device:', error);
      return false;
    }
  }
  
  /**
   * Register the device with the backend
   */
  private async registerDeviceWithBackend(deviceId: string): Promise<void> {
    try {
      // In a real implementation, this would register the device with the backend
      // For demo purposes, we'll simulate a successful registration
      console.log('Registering device with backend:', deviceId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Real implementation would be:
      // await this.apiClient.post('/api/iot/devices', { device_id: deviceId });
      
      console.log('Device registered with backend:', deviceId);
    } catch (error) {
      console.error('Failed to register device with backend:', error);
      throw error;
    }
  }
  
  /**
   * Send SOS signal from the smart band
   */
  public async sendSOS(): Promise<boolean> {
    if (!this.connectedDevice) return false;
    
    try {
      // In a real implementation, this would send an SOS signal to the backend
      // For demo purposes, we'll simulate sending an SOS
      console.log('Sending SOS signal from device:', this.connectedDevice.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Real implementation would be:
      // await this.apiClient.post('/api/incidents', {
      //   type: 'sos',
      //   device_id: this.connectedDevice.id,
      //   location: this.smartBandData?.location
      // });
      
      console.log('SOS signal sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send SOS signal:', error);
      return false;
    }
  }
  
  /**
   * Get the current smart band data
   */
  public getSmartBandData(): SmartBandData | null {
    return this.smartBandData;
  }
  
  /**
   * Update the smart band's location
   */
  public async updateLocation(latitude: number, longitude: number, accuracy: number): Promise<void> {
    if (!this.smartBandData) return;
    
    this.smartBandData = {
      ...this.smartBandData,
      location: {
        latitude,
        longitude,
        accuracy
      },
      lastSynced: new Date()
    };
    
    // In a real implementation, this would send the location to the backend
    // For demo purposes, we'll simulate sending the location
    console.log('Updating location for device:', this.smartBandData.deviceId);
    
    // Real implementation would be:
    // await this.apiClient.post('/api/tracking/location', {
    //   device_id: this.smartBandData.deviceId,
    //   latitude,
    //   longitude,
    //   accuracy
    // });
  }
  
  /**
   * Sync data with the smart band
   */
  public async syncData(): Promise<boolean> {
    if (!this.connectedDevice || !this.smartBandData) return false;
    
    try {
      // In a real implementation, this would sync data with the smart band
      // For demo purposes, we'll simulate syncing data
      console.log('Syncing data with device:', this.connectedDevice.id);
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update mock data
      this.smartBandData = {
        ...this.smartBandData,
        batteryLevel: Math.max(this.smartBandData.batteryLevel - Math.floor(Math.random() * 5), 0),
        heartRate: Math.floor(60 + Math.random() * 40),
        steps: (this.smartBandData.steps || 0) + Math.floor(Math.random() * 100),
        lastSynced: new Date()
      };
      
      // Real implementation would be:
      // await this.apiClient.post('/api/iot/data', {
      //   device_id: this.smartBandData.deviceId,
      //   battery_level: this.smartBandData.batteryLevel,
      //   heart_rate: this.smartBandData.heartRate,
      //   steps: this.smartBandData.steps,
      //   timestamp: new Date().toISOString()
      // });
      
      console.log('Data synced successfully');
      return true;
    } catch (error) {
      console.error('Failed to sync data:', error);
      return false;
    }
  }
  
  /**
   * Check if a device is connected
   */
  public isDeviceConnected(): boolean {
    return this.connectedDevice !== null;
  }
  
  /**
   * Get the connected device ID
   */
  public getConnectedDeviceId(): string | null {
    return this.connectedDevice?.id || null;
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stopScan();
    this.disconnect();
    this.bleManager.destroy();
  }
}