import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { Button } from '../../components/forms';
import MapView, { Marker, Circle } from 'react-native-maps';

const EmergencyTrackingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [emergencyStatus, setEmergencyStatus] = useState('pending');
  const [responderLocation, setResponderLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  
  useEffect(() => {
    // Simulate API call to get emergency status
    const fetchEmergencyStatus = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await emergencyService.getStatus(emergencyId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setEmergencyStatus('acknowledged');
        setResponderLocation({
          latitude: 28.6239,
          longitude: 77.2190,
        });
        setEstimatedArrival(8); // minutes
        setLoading(false);
        
        // Simulate responder movement
        startResponderMovement();
      } catch (error) {
        console.error('Error fetching emergency status:', error);
        Alert.alert('Error', 'Failed to get emergency response status.');
        setLoading(false);
      }
    };

    fetchEmergencyStatus();
    
    // Cleanup function
    return () => {
      // Clear any intervals or subscriptions
    };
  }, []);
  
  const startResponderMovement = () => {
    // Simulate responder moving towards user
    const interval = setInterval(() => {
      if (responderLocation) {
        // Move responder closer to user
        setResponderLocation(prev => {
          if (!prev) return null;
          
          const newLat = prev.latitude + (userLocation.latitude - prev.latitude) * 0.1;
          const newLng = prev.longitude + (userLocation.longitude - prev.longitude) * 0.1;
          
          // Check if responder has arrived (within 100 meters)
          const distance = calculateDistance(
            newLat,
            newLng,
            userLocation.latitude,
            userLocation.longitude
          );
          
          if (distance < 0.1) { // 100 meters
            clearInterval(interval);
            setEmergencyStatus('arrived');
            return {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            };
          }
          
          return {
            latitude: newLat,
            longitude: newLng,
          };
        });
        
        // Update estimated arrival time
        setEstimatedArrival(prev => {
          if (prev <= 1) return 'Less than 1';
          return prev - 1;
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  };
  
  // Calculate distance between two coordinates in km (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };
  
  const getStatusColor = () => {
    switch (emergencyStatus) {
      case 'pending':
        return '#FF9500'; // Orange
      case 'acknowledged':
        return '#34C759'; // Green
      case 'arrived':
        return '#007AFF'; // Blue
      default:
        return '#FF3B30'; // Red
    }
  };
  
  const getStatusText = () => {
    switch (emergencyStatus) {
      case 'pending':
        return 'Alert Sent - Waiting for Response';
      case 'acknowledged':
        return 'Help is on the way';
      case 'arrived':
        return 'Responders have arrived';
      default:
        return 'Unknown Status';
    }
  };
  
  const cancelEmergency = async () => {
    Alert.alert(
      'Cancel Emergency?',
      'Are you sure you want to cancel this emergency alert? Only do this if you are no longer in danger.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          onPress: async () => {
            setLoading(true);
            try {
              // In a real app, this would be an API call
              // await emergencyService.cancelEmergency(emergencyId);
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert(
                'Emergency Cancelled',
                'Your emergency alert has been cancelled.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Error cancelling emergency:', error);
              Alert.alert('Error', 'Failed to cancel emergency alert.');
              setLoading(false);
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting emergency response status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={userLocation}
          showsUserLocation
        >
          {/* User marker */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="Emergency Alert Active"
            pinColor="red"
          />
          
          {/* 100m radius around user */}
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={100}
            fillColor="rgba(255, 0, 0, 0.1)"
            strokeColor="rgba(255, 0, 0, 0.5)"
          />
          
          {/* Responder marker */}
          {responderLocation && (
            <Marker
              coordinate={{
                latitude: responderLocation.latitude,
                longitude: responderLocation.longitude,
              }}
              title="Emergency Responder"
              description={`ETA: ${estimatedArrival} minutes`}
              pinColor="blue"
            />
          )}
        </MapView>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Emergency Response Details</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[styles.infoValue, { color: getStatusColor() }]}>
            {emergencyStatus.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Alert ID:</Text>
          <Text style={styles.infoValue}>EM-{Math.floor(Math.random() * 10000)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Responder ETA:</Text>
          <Text style={styles.infoValue}>
            {estimatedArrival} {typeof estimatedArrival === 'number' && estimatedArrival !== 1 ? 'minutes' : 'minute'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Responder Type:</Text>
          <Text style={styles.infoValue}>Police Unit</Text>
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            • Stay where you are if it's safe to do so
          </Text>
          <Text style={styles.instructionsText}>
            • Keep your phone on and charged
          </Text>
          <Text style={styles.instructionsText}>
            • If you must move, update your location using the button below
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Update My Location"
            onPress={() => Alert.alert('Location Updated', 'Your location has been updated.')}
            type="outline"
            style={styles.button}
          />
          <Button
            title="Cancel Emergency"
            onPress={cancelEmergency}
            type="danger"
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 50,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mapContainer: {
    height: 250,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  instructionsContainer: {
    marginTop: 20,
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginBottom: 12,
  },
});

export default EmergencyTrackingScreen;