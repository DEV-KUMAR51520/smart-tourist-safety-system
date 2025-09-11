import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../components/forms';

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const [nearbyTourists, setNearbyTourists] = useState([]);
  const [safetyPoints, setSafetyPoints] = useState([]);
  const [mapType, setMapType] = useState('standard');

  // Mock data for demonstration
  const mockUserLocation = {
    latitude: 26.1445,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mockGeofences = [
    { id: 1, name: 'Safe Zone', latitude: 26.1445, longitude: 77.2090, radius: 1000, type: 'safe' },
    { id: 2, name: 'Caution Zone', latitude: 26.1545, longitude: 77.2190, radius: 500, type: 'caution' },
    { id: 3, name: 'Restricted Zone', latitude: 26.1345, longitude: 77.1990, radius: 300, type: 'restricted' },
  ];

  const mockNearbyTourists = [
    { id: 1, name: 'Jane Doe', latitude: 26.1465, longitude: 77.2110, status: 'safe' },
    { id: 2, name: 'Bob Smith', latitude: 26.1425, longitude: 77.2070, status: 'safe' },
    { id: 3, name: 'Alice Johnson', latitude: 26.1505, longitude: 77.2150, status: 'warning' },
  ];

  const mockSafetyPoints = [
    { id: 1, name: 'Police Station', latitude: 26.1525, longitude: 77.2050, type: 'police' },
    { id: 2, name: 'Hospital', latitude: 26.1405, longitude: 77.2130, type: 'hospital' },
    { id: 3, name: 'Tourist Help Center', latitude: 26.1485, longitude: 77.2020, type: 'help' },
  ];

  useEffect(() => {
    // Simulate API call to fetch map data
    const fetchMapData = async () => {
      try {
        // In a real app, these would be API calls
        // const userLocation = await locationService.getCurrentLocation();
        // const geofences = await geofenceService.getGeofences();
        // const nearbyTourists = await touristService.getNearbyTourists();
        // const safetyPoints = await safetyService.getSafetyPoints();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setUserLocation(mockUserLocation);
        setGeofences(mockGeofences);
        setNearbyTourists(mockNearbyTourists);
        setSafetyPoints(mockSafetyPoints);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
        Alert.alert('Error', 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();

    // Simulate location updates
    const locationInterval = setInterval(() => {
      setUserLocation(prev => {
        if (!prev) return mockUserLocation;
        
        return {
          ...prev,
          latitude: prev.latitude + (Math.random() * 0.001 - 0.0005),
          longitude: prev.longitude + (Math.random() * 0.001 - 0.0005),
        };
      });
    }, 10000);

    return () => clearInterval(locationInterval);
  }, []);

  const handleGeofencePress = (geofence) => {
    Alert.alert(
      geofence.name,
      `Type: ${geofence.type}\nRadius: ${geofence.radius}m`,
      [{ text: 'OK' }]
    );
  };

  const handleTouristPress = (tourist) => {
    Alert.alert(
      tourist.name,
      `Status: ${tourist.status}`,
      [{ text: 'OK' }]
    );
  };

  const handleSafetyPointPress = (point) => {
    Alert.alert(
      point.name,
      `Type: ${point.type}`,
      [{ text: 'OK' }]
    );
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const centerOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const navigateToGeofencing = () => {
    navigation.navigate('Geofencing');
  };

  if (loading || !userLocation) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={userLocation}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {/* Geofences */}
        {geofences.map(geofence => (
          <Circle
            key={`geofence-${geofence.id}`}
            center={{ latitude: geofence.latitude, longitude: geofence.longitude }}
            radius={geofence.radius}
            strokeWidth={2}
            strokeColor={geofence.type === 'safe' ? '#4CAF50' : geofence.type === 'caution' ? '#FF9800' : '#F44336'}
            fillColor={geofence.type === 'safe' ? 'rgba(76, 175, 80, 0.2)' : geofence.type === 'caution' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)'}
            onPress={() => handleGeofencePress(geofence)}
          />
        ))}

        {/* Nearby Tourists */}
        {nearbyTourists.map(tourist => (
          <Marker
            key={`tourist-${tourist.id}`}
            coordinate={{ latitude: tourist.latitude, longitude: tourist.longitude }}
            title={tourist.name}
            description={`Status: ${tourist.status}`}
            pinColor={tourist.status === 'safe' ? 'green' : 'orange'}
            onPress={() => handleTouristPress(tourist)}
          />
        ))}

        {/* Safety Points */}
        {safetyPoints.map(point => (
          <Marker
            key={`safety-${point.id}`}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={point.name}
            description={`Type: ${point.type}`}
            pinColor={point.type === 'police' ? 'blue' : point.type === 'hospital' ? 'red' : 'purple'}
            onPress={() => handleSafetyPointPress(point)}
          />
        ))}
      </MapView>

      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapButton} onPress={toggleMapType}>
          <Icon name={mapType === 'standard' ? 'satellite' : 'map'} size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={centerOnUser}>
          <Icon name="my-location" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Map Legend</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(76, 175, 80, 0.5)' }]} />
          <Text style={styles.legendText}>Safe Zone</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 152, 0, 0.5)' }]} />
          <Text style={styles.legendText}>Caution Zone</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(244, 67, 54, 0.5)' }]} />
          <Text style={styles.legendText}>Restricted Zone</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Manage Geofences" 
          onPress={navigateToGeofencing}
          type="outline"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
  },
  mapButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
});

export default MapScreen;