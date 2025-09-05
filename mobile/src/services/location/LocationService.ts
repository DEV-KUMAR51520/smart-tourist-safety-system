// src/services/location/LocationService.ts
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { ApiClient } from '../api/ApiClient';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  bearing?: number;
}

export class LocationService {
  private static watchId: number | null = null;
  private static backgroundGeolocationConfigured = false;

  static async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Tourist Safety Location Permission',
            message: 'This app needs location access for safety monitoring and emergency services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            bearing: position.coords.heading || undefined,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  static startLocationTracking(onLocationUpdate: (location: LocationData) => void) {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
          bearing: position.coords.heading || undefined,
        };

        onLocationUpdate(locationData);
        this.sendLocationToServer(locationData);
      },
      (error) => {
        console.error('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 30000,    // Update every 30 seconds
        fastestInterval: 10000, // Fastest update: 10 seconds
      }
    );

    this.watchId = watchId;
    return watchId;
  }

  static stopLocationTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  static async sendLocationToServer(locationData: LocationData) {
    try {
      const deviceInfo = {
        battery_level: await this.getBatteryLevel(),
        network_type: await this.getNetworkType(),
      };

      await ApiClient.post('/location/update', {
        ...locationData,
        ...deviceInfo,
      });
    } catch (error) {
      console.error('Failed to send location to server:', error);
      // Store locally for retry
      this.storeLocationLocally(locationData);
    }
  }

  static async startBackgroundLocationTracking() {
    if (this.backgroundGeolocationConfigured) {
      BackgroundGeolocation.start();
      return;
    }

    // Configure the background geolocation service
    await BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 30000, // 30 seconds
      fastestInterval: 15000,
      stopOnStillActivity: false,
      
      // Activity recognition
      activityType: 'OtherNavigation',
      
      // Notification config for Android
      notificationTitle: 'Tourist Safety System',
      notificationText: 'Tracking location in the background for your safety.',
      notificationIcon: 'ic_launcher',
      
      // URLs for location updates
      url: ApiClient.baseURL + '/location/update',
      httpHeaders: {
        'Authorization': `Bearer ${await ApiClient.getAuthToken()}`,
      },
      
      // Logging
      debug: false, // Set to true for debugging
    });

    BackgroundGeolocation.on('location', (location) => {
      // Handle background location updates here
      console.log('Background location:', location);
      const locationData: LocationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        altitude: location.altitude,
        speed: location.speed,
        bearing: location.bearing,
      };
      this.sendLocationToServer(locationData);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.error('Background Geolocation Error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('Background Geolocation service started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('Background Geolocation service stopped');
    });

    this.backgroundGeolocationConfigured = true;
    BackgroundGeolocation.start();
  }

  static stopBackgroundLocationTracking() {
    BackgroundGeolocation.stop();
    this.backgroundGeolocationConfigured = false;
  }

  private static async getBatteryLevel(): Promise<number> {
    // A more robust implementation would use a battery status library
    return 100; // Placeholder
  }

  private static async getNetworkType(): Promise<string> {
    // A more robust implementation would use a network info library
    return 'wifi'; // Placeholder
  }

  private static storeLocationLocally(locationData: LocationData) {
    // Store in AsyncStorage for retry when connection restored
    // Implementation needed
  }
}