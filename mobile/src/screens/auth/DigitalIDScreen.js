import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Share } from 'react-native';
import { Button } from '../../components/forms';
import { useAuthContext } from '../../contexts/AuthContext';
import QRCode from 'react-native-qrcode-svg';

const DigitalIDScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [digitalId, setDigitalId] = useState(null);
  const { tourist } = useAuthContext();
  
  useEffect(() => {
    const fetchDigitalId = async () => {
      try {
        // Check if digital ID was passed from registration screen
        if (route.params?.digitalId) {
          // Format the digital ID data
          const formattedDigitalId = {
            id: route.params.digitalId.id,
            name: tourist?.name || 'Tourist',
            validFrom: new Date(route.params.digitalId.issued_date).toLocaleDateString(),
            validUntil: new Date(route.params.digitalId.expiry_date).toLocaleDateString(),
            blockchainTxHash: route.params.digitalId.blockchain_hash,
            safetyScore: tourist?.safety_score || 100,
            qrCodeUrl: `https://api.tourist-safety-system.com/qr/${route.params.digitalId.id}`,
          };
          
          setDigitalId(formattedDigitalId);
        } else {
          // If not from registration, fetch from API
          // In a real app, this would be an API call
          import { authService } from '../../services';
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create mock digital ID based on authenticated user
          const mockDigitalId = {
            id: `TSN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            name: tourist?.name || 'Tourist',
            validFrom: new Date().toLocaleDateString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            blockchainTxHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            safetyScore: tourist?.safety_score || 95,
            qrCodeUrl: 'https://api.tourist-safety-system.com/qr/mock-id',
          };
          
          setDigitalId(mockDigitalId);
        }
      } catch (error) {
        console.error('Failed to fetch digital ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDigitalId();
  }, [route.params, tourist]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Tourist Digital ID: ${digitalId.id}\nValid from ${digitalId.validFrom} to ${digitalId.validUntil}`,
        title: 'Tourist Digital ID',
      });
    } catch (error) {
      console.error('Error sharing digital ID:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading your digital ID...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Tourist ID</Text>
        <Text style={styles.subtitle}>Your secure blockchain-based identity</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View>
            <Text style={styles.cardTitle}>Tourist Safety System</Text>
            <Text style={styles.cardSubtitle}>Digital ID</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={digitalId.id}
            size={200}
            backgroundColor="white"
            color="black"
          />
        </View>

        <View style={styles.infoContainer}>
          <InfoRow label="ID Number" value={digitalId.id} />
          <InfoRow label="Name" value={digitalId.name} />
          <InfoRow label="Valid From" value={digitalId.validFrom} />
          <InfoRow label="Valid Until" value={digitalId.validUntil} />
          <InfoRow label="Safety Score" value={`${digitalId.safetyScore}/100`} />
        </View>

        <View style={styles.verificationContainer}>
          <Text style={styles.verificationText}>Blockchain Verified</Text>
          <Text style={styles.hashText} numberOfLines={1} ellipsizeMode="middle">
            {digitalId.blockchainTxHash}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Share ID"
          onPress={handleShare}
          type="outline"
          style={styles.button}
        />
        <Button
          title="Go to Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
          style={styles.button}
        />
      </View>

      <View style={styles.securityNote}>
        <Text style={styles.securityText}>
          This digital ID is securely stored on the blockchain and is valid only for the duration of your trip.
          Present this ID when requested by authorities.
        </Text>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    marginBottom: 20,
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
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  verificationContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  hashText: {
    fontSize: 12,
    color: '#666',
    width: '100%',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  securityNote: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fffaf0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default DigitalIDScreen;