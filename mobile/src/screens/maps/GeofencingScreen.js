import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Switch, Alert, ScrollView } from 'react-native';
import { Button } from '../../components/forms';
import MapView, { Marker, Circle } from 'react-native-maps';

const GeofencingScreen = () => {
  const [geofencingEnabled, setGeofencingEnabled] = useState(true);
  const [safeZones, setSafeZones] = useState([]);
  const [restrictedZones, setRestrictedZones] = useState([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // Mock data for zones
  const mockSafeZones = [
    { id: 1, name: 'Tourist Hub', latitude: 28.6129, longitude: 77.2295, radius: 1000 },
    { id: 2, name: 'City Center', latitude: 28.6331, longitude: 77.2190, radius: 800 },
  ];
  
  const mockRestrictedZones = [
    { id: 1, name: 'High Risk Area', latitude: 28.5933, longitude: 77.2500, radius: 500, riskLevel: 'high' },
    { id: 2, name: 'Restricted Forest', latitude: 28.6433, longitude: 77.1890, radius: 700, riskLevel: 'medium' },
  ];

  useEffect(() => {
    // Load zones from API in a real app
    setSafeZones(mockSafeZones);
    setRestrictedZones(mockRestrictedZones);
    
    // Check if user is in any restricted zone
    checkUserInRestrictedZone();
    
    // Set up location tracking
    const locationInterval = setInterval(() => {
      // In a real app, this would use the device's location services
      // Simulate user movement
      setUserLocation(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));
    }, 5000);
    
    return () => clearInterval(locationInterval);
  }, []);
  
  // Check if user location is within any restricted zone
  useEffect(() => {
    if (geofencingEnabled) {
      checkUserInRestrictedZone();
    }
  }, [userLocation, geofencingEnabled]);
  
  const checkUserInRestrictedZone = () => {
    if (!geofencingEnabled) return;
    
    restrictedZones.forEach(zone => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        zone.latitude,
        zone.longitude
      );
      
      if (distance <= zone.radius / 1000) { // Convert radius from meters to km
        // User is inside a restricted zone
        showGeofenceAlert(zone);
      }
    });
  };
  
  const showGeofenceAlert = (zone) => {
    Alert.alert(
      'Geofence Alert',
      `You have entered a ${zone.riskLevel} risk area: ${zone.name}. Please be cautious or consider leaving this area.`,
      [
        { text: 'Ignore', style: 'cancel' },
        { text: 'View Safe Routes', onPress: () => navigateToSafeRoutes() },
        { text: 'Emergency', onPress: () => navigateToEmergency() }
      ]
    );
  };
  
  const navigateToSafeRoutes = () => {
    // Navigate to safe routes screen
    console.log('Navigate to safe routes');
  };
  
  const navigateToEmergency = () => {
    // Navigate to emergency screen
    console.log('Navigate to emergency');
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
  
  const toggleGeofencing = () => {
    if (geofencingEnabled) {
      Alert.alert(
        'Disable Geofencing?',
        'Disabling geofencing will stop alerts when you enter high-risk or restricted areas. This may affect your safety.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', onPress: () => setGeofencingEnabled(false) }
        ]
      );
    } else {
      setGeofencingEnabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Geofencing</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Geofencing Alerts</Text>
          <Switch
            value={geofencingEnabled}
            onValueChange={toggleGeofencing}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={geofencingEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={userLocation}
          showsUserLocation
          showsMyLocationButton
        >
          {/* User marker */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
          
          {/* Safe zones */}
          {safeZones.map(zone => (
            <React.Fragment key={`safe-${zone.id}`}>
              <Circle
                center={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                radius={zone.radius}
                fillColor="rgba(0, 255, 0, 0.1)"
                strokeColor="rgba(0, 255, 0, 0.5)"
                strokeWidth={2}
              />
              <Marker
                coordinate={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                title={zone.name}
                description="Safe Zone"
                pinColor="green"
              />
            </React.Fragment>
          ))}
          
          {/* Restricted zones */}
          {restrictedZones.map(zone => (
            <React.Fragment key={`restricted-${zone.id}`}>
              <Circle
                center={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                radius={zone.radius}
                fillColor="rgba(255, 0, 0, 0.1)"
                strokeColor="rgba(255, 0, 0, 0.5)"
                strokeWidth={2}
              />
              <Marker
                coordinate={{
                  latitude: zone.latitude,
                  longitude: zone.longitude,
                }}
                title={zone.name}
                description={`${zone.riskLevel.toUpperCase()} Risk Area`}
                pinColor="red"
              />
            </React.Fragment>
          ))}
        </MapView>
      </View>
      
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Active Geofences</Text>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 255, 0, 0.5)' }]} />
            <Text style={styles.legendText}>Safe Zones</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.5)' }]} />
            <Text style={styles.legendText}>Restricted Zones</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Safe Zones</Text>
        {safeZones.map(zone => (
          <View key={`safe-info-${zone.id}`} style={styles.zoneItem}>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.zoneDescription}>Radius: {zone.radius}m</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Restricted Zones</Text>
        {restrictedZones.map(zone => (
          <View key={`restricted-info-${zone.id}`} style={styles.zoneItem}>
            <Text style={styles.zoneName}>{zone.name}</Text>
            <Text style={styles.zoneDescription}>
              Risk Level: <Text style={{ color: zone.riskLevel === 'high' ? '#FF3B30' : '#FF9500' }}>
                {zone.riskLevel.toUpperCase()}
              </Text>
            </Text>
            <Text style={styles.zoneDescription}>Radius: {zone.radius}m</Text>
          </View>
        ))}
        
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Geofencing alerts will notify you when you enter high-risk or restricted areas.
            Keep this feature enabled for your safety.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  mapContainer: {
    height: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  zoneItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
    color: '#666',
  },
  noteContainer: {
    backgroundColor: '#fffaf0',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
    marginVertical: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default GeofencingScreen;