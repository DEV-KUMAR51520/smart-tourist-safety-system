import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IoTService } from '../services/IoTService';

interface IoTDeviceCardProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const IoTDeviceCard: React.FC<IoTDeviceCardProps> = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<any>(null);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);
  
  const iotService = IoTService.getInstance();
  
  useEffect(() => {
    // Check if device is already connected
    const checkConnection = async () => {
      const isDeviceConnected = iotService.isDeviceConnected();
      setIsConnected(isDeviceConnected);
      
      if (isDeviceConnected) {
        updateDeviceData();
      }
    };
    
    checkConnection();
    
    // Set up interval to update device data every 30 seconds if connected
    const interval = setInterval(() => {
      if (iotService.isDeviceConnected()) {
        syncData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const updateDeviceData = () => {
    const data = iotService.getSmartBandData();
    setDeviceData(data);
    
    if (data?.lastSynced) {
      const date = new Date(data.lastSynced);
      setLastSynced(date.toLocaleTimeString());
    }
  };
  
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      await iotService.startScan();
      // The connection will be handled by the IoTService when a device is found
      // We'll check the connection status after a delay
      setTimeout(() => {
        const isDeviceConnected = iotService.isDeviceConnected();
        setIsConnected(isDeviceConnected);
        setIsConnecting(false);
        
        if (isDeviceConnected) {
          updateDeviceData();
          if (onConnect) onConnect();
        }
      }, 4000); // Give enough time for scanning and connecting
    } catch (error) {
      console.error('Failed to connect to IoT device:', error);
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      const success = await iotService.disconnect();
      if (success) {
        setIsConnected(false);
        setDeviceData(null);
        if (onDisconnect) onDisconnect();
      }
    } catch (error) {
      console.error('Failed to disconnect from IoT device:', error);
    }
  };
  
  const syncData = async () => {
    if (!isConnected || syncInProgress) return;
    
    setSyncInProgress(true);
    
    try {
      await iotService.syncData();
      updateDeviceData();
    } catch (error) {
      console.error('Failed to sync data:', error);
    } finally {
      setSyncInProgress(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Safety Band</Text>
        {isConnected ? (
          <View style={styles.connectedIndicator}>
            <Icon name="bluetooth-connect" size={16} color="#fff" />
            <Text style={styles.connectedText}>Connected</Text>
          </View>
        ) : (
          <View style={styles.disconnectedIndicator}>
            <Icon name="bluetooth-off" size={16} color="#fff" />
            <Text style={styles.connectedText}>Disconnected</Text>
          </View>
        )}
      </View>
      
      {isConnected && deviceData ? (
        <View style={styles.deviceInfo}>
          <View style={styles.infoRow}>
            <Icon name="devices" size={20} color="#555" />
            <Text style={styles.infoText}>Device ID: {deviceData.deviceId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="battery" size={20} color={getBatteryColor(deviceData.batteryLevel)} />
            <Text style={styles.infoText}>Battery: {deviceData.batteryLevel}%</Text>
          </View>
          
          {deviceData.heartRate && (
            <View style={styles.infoRow}>
              <Icon name="heart-pulse" size={20} color="#e74c3c" />
              <Text style={styles.infoText}>Heart Rate: {deviceData.heartRate} BPM</Text>
            </View>
          )}
          
          {deviceData.steps !== undefined && (
            <View style={styles.infoRow}>
              <Icon name="walk" size={20} color="#3498db" />
              <Text style={styles.infoText}>Steps: {deviceData.steps}</Text>
            </View>
          )}
          
          <View style={styles.syncContainer}>
            <Text style={styles.lastSyncText}>Last synced: {lastSynced}</Text>
            <TouchableOpacity style={styles.syncButton} onPress={syncData} disabled={syncInProgress}>
              {syncInProgress ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="sync" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.connectContainer}>
          {isConnecting ? (
            <View style={styles.connectingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.connectingText}>Searching for devices...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Icon name="bluetooth-search" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Connect Smart Band</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const getBatteryColor = (level: number): string => {
  if (level > 50) return '#27ae60'; // Green
  if (level > 20) return '#f39c12'; // Orange
  return '#e74c3c'; // Red
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  connectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  disconnectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  deviceInfo: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  syncContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  lastSyncText: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  syncButton: {
    backgroundColor: '#3498db',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  connectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  connectButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  connectingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  connectingText: {
    marginTop: 10,
    color: '#3498db',
    fontSize: 14,
  },
});

export default IoTDeviceCard;