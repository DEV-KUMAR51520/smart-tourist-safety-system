import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Vibration, Dimensions, Platform } from 'react-native';
import { Button } from '../../components/forms';
import { AlertTriangle, Phone, MessageCircle, MapPin, Shield } from 'react-native-feather';

const { width } = Dimensions.get('window');

const EmergencyScreen = ({ navigation }) => {
  const [panicMode, setPanicMode] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [sendingAlert, setSendingAlert] = useState(false);

  useEffect(() => {
    // Get current location
    const getCurrentLocation = async () => {
      try {
        // In a real app, this would use the device's location services
        // const position = await getCurrentPosition();
        
        // Mock location data
        setLocation({
          latitude: 28.6139,
          longitude: 77.2090,
          accuracy: 10,
          timestamp: new Date().getTime(),
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Location Error', 'Unable to get your current location. Please enable location services.');
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    let interval;
    if (panicMode && countdown > 0) {
      // Vibrate pattern for panic mode
      if (Platform.OS === 'android') {
        // Android pattern: wait 100ms, vibrate 200ms, wait 100ms, vibrate 500ms
        Vibration.vibrate([100, 200, 100, 500], true);
      } else {
        // iOS doesn't support patterns or repeat
        Vibration.vibrate();
      }

      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (panicMode && countdown === 0) {
      sendEmergencyAlert();
    }

    return () => {
      clearInterval(interval);
      Vibration.cancel();
    };
  }, [panicMode, countdown]);

  const activatePanicMode = () => {
    setPanicMode(true);
    setCountdown(5);
    Alert.alert(
      'Emergency Mode Activated',
      `Alert will be sent in ${countdown} seconds. Tap 'Cancel' to stop.`,
      [{ text: 'Cancel', onPress: cancelPanicMode, style: 'cancel' }]
    );
  };

  const cancelPanicMode = () => {
    setPanicMode(false);
    setCountdown(5);
    Vibration.cancel();
  };

  const sendEmergencyAlert = async () => {
    setSendingAlert(true);
    try {
      // In a real app, this would be an API call to the backend
      // const response = await emergencyService.sendAlert({
      //   location,
      //   touristId: 'current-user-id',
      //   alertType: 'panic-button',
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Emergency Alert Sent',
        'Your alert has been sent to the nearest police station and your emergency contacts. Stay where you are if possible.',
        [{ text: 'OK' }]
      );

      // Navigate to tracking screen
      navigation.navigate('EmergencyTracking');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert('Alert Failed', 'Failed to send emergency alert. Please try again or call emergency services directly.');
    } finally {
      setPanicMode(false);
      setSendingAlert(false);
      Vibration.cancel();
    }
  };

  const callEmergencyServices = () => {
    // In a real app, this would use Linking to open the phone app
    Alert.alert('Call Emergency', 'This would open the phone app to call emergency services.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Assistance</Text>
        <Text style={styles.subtitle}>Get immediate help in case of emergency</Text>
      </View>

      <View style={styles.panicButtonContainer}>
        <TouchableOpacity
          style={[styles.panicButton, panicMode && styles.panicButtonActive]}
          onPress={panicMode ? cancelPanicMode : activatePanicMode}
          disabled={sendingAlert}
        >
          <AlertTriangle stroke="#fff" width={40} height={40} />
          <Text style={styles.panicButtonText}>
            {panicMode ? `CANCEL (${countdown})` : 'PANIC BUTTON'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.panicDescription}>
          Press and hold to activate emergency response
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Other Emergency Options</Text>
        
        <TouchableOpacity style={styles.optionButton} onPress={callEmergencyServices}>
          <View style={styles.optionIconContainer}>
            <Phone stroke="#fff" width={24} height={24} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Call Emergency Services</Text>
            <Text style={styles.optionDescription}>Directly call local emergency number</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => navigation.navigate('EmergencyContacts')}
        >
          <View style={styles.optionIconContainer} backgroundColor="#5856D6">
            <MessageCircle stroke="#fff" width={24} height={24} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Contact Emergency Contacts</Text>
            <Text style={styles.optionDescription}>Alert your designated emergency contacts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => navigation.navigate('NearbyHelp')}
        >
          <View style={styles.optionIconContainer} backgroundColor="#4CD964">
            <MapPin stroke="#fff" width={24} height={24} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Find Nearby Help</Text>
            <Text style={styles.optionDescription}>Locate nearby police stations and hospitals</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => navigation.navigate('SafetyTips')}
        >
          <View style={styles.optionIconContainer} backgroundColor="#FF9500">
            <Shield stroke="#fff" width={24} height={24} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Safety Tips</Text>
            <Text style={styles.optionDescription}>Quick safety guidelines for emergencies</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your current location will be shared with emergency services when you activate the panic button.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  panicButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  panicButton: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  panicButtonActive: {
    backgroundColor: '#FF0000',
    transform: [{ scale: 1.05 }],
  },
  panicButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  panicDescription: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default EmergencyScreen;