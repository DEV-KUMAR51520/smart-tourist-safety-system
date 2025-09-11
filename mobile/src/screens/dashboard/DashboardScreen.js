import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../components/forms';
import IoTDeviceCard from '../../components/IoTDeviceCard';

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [safetyScore, setSafetyScore] = useState(95);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);

  // Mock data for demonstration
  const mockUserData = {
    name: 'John Doe',
    digitalId: 'TSN-1234567890',
    location: 'Guwahati, Assam',
    tripDuration: '7 days',
    smartBandStatus: 'Connected',
    lastUpdated: new Date().toLocaleTimeString(),
  };

  const mockAlerts = [
    { id: 1, type: 'Weather', message: 'Heavy rain expected in your area', time: '2 hours ago', severity: 'medium' },
    { id: 2, type: 'Geofence', message: 'You are approaching a restricted area', time: '30 minutes ago', severity: 'high' },
    { id: 3, type: 'System', message: 'Smart band battery low (20%)', time: 'Just now', severity: 'low' },
  ];

  const mockServices = [
    { id: 1, name: 'Police Station', distance: '1.2 km', icon: 'local-police' },
    { id: 2, name: 'Hospital', distance: '2.5 km', icon: 'local-hospital' },
    { id: 3, name: 'Tourist Help Desk', distance: '0.8 km', icon: 'help' },
    { id: 4, name: 'Embassy', distance: '5.3 km', icon: 'account-balance' },
  ];

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // const userData = await userService.getUserProfile();
        // const alerts = await alertService.getRecentAlerts();
        // const services = await locationService.getNearbyServices();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setUserData(mockUserData);
        setRecentAlerts(mockAlerts);
        setNearbyServices(mockServices);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        Alert.alert('Error', 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Simulate safety score updates
    const scoreInterval = setInterval(() => {
      setSafetyScore(prevScore => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newScore = Math.max(70, Math.min(100, prevScore + change));
        return newScore;
      });
    }, 10000);

    return () => clearInterval(scoreInterval);
  }, []);

  const handleViewDigitalID = () => {
    navigation.navigate('DigitalID');
  };

  const handleEmergency = () => {
    navigation.navigate('Emergency');
  };

  const handleViewMap = () => {
    navigation.navigate('Map');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userData.name}</Text>
        <Text style={styles.subGreeting}>Welcome to your safety dashboard</Text>
      </View>

      <View style={styles.safetyScoreContainer}>
        <View style={styles.safetyScoreInner}>
          <Text style={styles.safetyScoreLabel}>Safety Score</Text>
          <Text style={styles.safetyScoreValue}>{safetyScore}</Text>
          <View style={[styles.safetyScoreBar, { width: `${safetyScore}%` }]} />
          <Text style={styles.safetyScoreStatus}>
            {safetyScore > 90 ? 'Excellent' : safetyScore > 75 ? 'Good' : 'Caution'}
          </Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewDigitalID}>
          <Icon name="badge" size={24} color="#4a90e2" />
          <Text style={styles.actionText}>Digital ID</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={handleEmergency}>
          <Icon name="warning" size={24} color="#fff" />
          <Text style={[styles.actionText, styles.emergencyText]}>Emergency</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleViewMap}>
          <Icon name="map" size={24} color="#4a90e2" />
          <Text style={styles.actionText}>View Map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Digital ID</Text>
            <Text style={styles.statusValue}>{userData.digitalId}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Location</Text>
            <Text style={styles.statusValue}>{userData.location}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Trip Duration</Text>
            <Text style={styles.statusValue}>{userData.tripDuration}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Last Updated</Text>
            <Text style={styles.statusValue}>{userData.lastUpdated}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Smart Safety Band</Text>
        <IoTDeviceCard 
          onConnect={() => {
            // Update user data when device is connected
            setUserData(prev => ({
              ...prev,
              smartBandStatus: 'Connected',
              lastUpdated: new Date().toLocaleTimeString()
            }));
          }}
          onDisconnect={() => {
            // Update user data when device is disconnected
            setUserData(prev => ({
              ...prev,
              smartBandStatus: 'Disconnected',
              lastUpdated: new Date().toLocaleTimeString()
            }));
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {recentAlerts.length > 0 ? (
          recentAlerts.map(alert => (
            <View key={alert.id} style={[styles.alertItem, styles[`${alert.severity}Alert`]]}>
              <View style={styles.alertIconContainer}>
                <Icon 
                  name={alert.type === 'Weather' ? 'wb-cloudy' : alert.type === 'Geofence' ? 'location-on' : 'system-update'} 
                  size={24} 
                  color={alert.severity === 'high' ? '#F44336' : alert.severity === 'medium' ? '#FF9800' : '#4CAF50'} 
                />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.type} Alert</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent alerts</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Services</Text>
        {nearbyServices.map(service => (
          <TouchableOpacity key={service.id} style={styles.serviceItem}>
            <Icon name={service.icon} size={24} color="#4a90e2" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDistance}>{service.distance}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Button 
          title="View Full Safety Report" 
          onPress={() => Alert.alert('Coming Soon', 'This feature will be available in the next update.')} 
          type="outline"
        />
      </View>
    </ScrollView>
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
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  safetyScoreContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyScoreInner: {
    alignItems: 'center',
  },
  safetyScoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  safetyScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginVertical: 10,
  },
  safetyScoreBar: {
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  safetyScoreStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  emergencyText: {
    color: '#fff',
  },
  section: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '48%',
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  highAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  mediumAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  lowAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  alertIconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    padding: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    margin: 15,
    marginBottom: 30,
  },
});

export default DashboardScreen;