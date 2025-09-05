// src/screens/emergency/EmergencyScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocationService } from '../../services/location/LocationService';
import { EmergencyService } from '../../services/api/EmergencyService';
import { useAuthContext } from '../../contexts/AuthContext';

const EmergencyScreen: React.FC = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const { tourist } = useAuthContext();

  useEffect(() => {
    if (emergencyActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (emergencyActive && countdown === 0) {
      triggerEmergency();
    }
  }, [emergencyActive, countdown]);

  useEffect(() => {
    // Pulse animation for emergency button
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    if (emergencyActive) {
      pulse();
    }
  }, [emergencyActive]);

  const handlePanicButton = () => {
    if (emergencyActive) {
      // Cancel emergency
      setEmergencyActive(false);
      setCountdown(0);
      return;
    }

    Alert.alert(
      'Emergency Alert',
      'This will send an emergency alert to local authorities and your emergency contacts. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: '5 Second Delay',
          onPress: () => startEmergencyCountdown(5),
        },
        {
          text: 'Immediate',
          onPress: () => triggerEmergency(),
          style: 'destructive',
        },
      ]
    );
  };

  const startEmergencyCountdown = (seconds: number) => {
    setEmergencyActive(true);
    setCountdown(seconds);
    Vibration.vibrate([0, 500, 200, 500]);
  };

  const triggerEmergency = async () => {
    try {
      setEmergencyActive(false);
      setCountdown(0);

      // Get current location
      const location = await LocationService.getCurrentLocation();

      // Send emergency alert
      await EmergencyService.triggerPanicButton({
        location,
        tourist_id: tourist?.id,
        incident_type: 'panic',
        description: 'Panic button activated by user',
      });

      Alert.alert(
        'Emergency Alert Sent',
        'Your emergency alert has been sent to local authorities and your emergency contacts.',
        [{ text: 'OK' }]
      );

      // Continue location tracking with high frequency
      LocationService.startLocationTracking(() => {});

    } catch (error) {
      Alert.alert(
        'Alert Failed',
        'Failed to send emergency alert. Please try again or call emergency services directly.',
        [{ text: 'OK' }]
      );
      console.error('Emergency alert failed:', error);
    }
  };

  const handleQuickEmergency = (type: string) => {
    Alert.alert(
      `${type} Emergency`,
      `Send ${type.toLowerCase()} emergency alert?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          onPress: () => sendQuickEmergency(type),
          style: 'destructive',
        },
      ]
    );
  };

  const sendQuickEmergency = async (type: string) => {
    try {
      const location = await LocationService.getCurrentLocation();

      await EmergencyService.reportIncident({
        location,
        tourist_id: tourist?.id,
        incident_type: type.toLowerCase(),
        description: `${type} emergency reported by user`,
      });

      Alert.alert('Alert Sent', `${type} emergency alert sent successfully.`);
    } catch (error) {
      Alert.alert('Alert Failed', `Failed to send ${type.toLowerCase()} alert.`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Services</Text>
        <Text style={styles.subtitle}>
          Your safety is our priority. Use these buttons only in real emergencies.
        </Text>
      </View>

      <View style={styles.panicButtonContainer}>
        <Animated.View style={[styles.panicButton, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.panicButtonInner,
              emergencyActive && styles.panicButtonActive
            ]}
            onPress={handlePanicButton}
            activeOpacity={0.8}
          >
            <Icon 
              name={emergencyActive ? "cancel" : "warning"} 
              size={80} 
              color="white" 
            />
            <Text style={styles.panicButtonText}>
              {emergencyActive ? `Cancel (${countdown}s)` : 'PANIC\nBUTTON'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Emergency Reports</Text>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#ff6b6b' }]}
            onPress={() => handleQuickEmergency('Medical')}
          >
            <Icon name="local-hospital" size={40} color="white" />
            <Text style={styles.quickActionText}>Medical</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#4ecdc4' }]}
            onPress={() => handleQuickEmergency('Wildlife')}
          >
            <Icon name="pets" size={40} color="white" />
            <Text style={styles.quickActionText}>Wildlife</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#45b7d1' }]}
            onPress={() => handleQuickEmergency('Weather')}
          >
            <Icon name="cloud" size={40} color="white" />
            <Text style={styles.quickActionText}>Weather</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: '#f7b731' }]}
            onPress={() => handleQuickEmergency('Lost')}
          >
            <Icon name="location-off" size={40} color="white" />
            <Text style={styles.quickActionText}>Lost/Found</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.emergencyContactsContainer}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Icon name="phone" size={24} color="#e74c3c" />
          <Text style={styles.contactText}>Police: 100</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Icon name="local-hospital" size={24} color="#e74c3c" />
          <Text style={styles.contactText}>Medical: 108</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Icon name="warning" size={24} color="#e74c3c" />
          <Text style={styles.contactText}>Emergency: 112</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  panicButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  panicButton: {
    width: 200,
    height: 200,
  },
  panicButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  panicButtonActive: {
    backgroundColor: '#c0392b',
  },
  panicButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emergencyContactsContainer: {
    marginTop: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  contactText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default EmergencyScreen;