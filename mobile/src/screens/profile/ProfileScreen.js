import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthContext } from '../../contexts/AuthContext';
import LanguageSelector from '../../components/common/LanguageSelector';
import i18n from '../../i18n';

const ProfileScreen = ({ navigation }) => {
  const { tourist, logout } = useAuthContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [emergencyContactsVisible, setEmergencyContactsVisible] = useState(false);
  
  // Mock data for the profile
  const profileData = {
    name: tourist?.name || 'John Doe',
    email: tourist?.email || 'john.doe@example.com',
    phone: tourist?.phone || '+91 9876543210',
    touristId: tourist?.id || 'TID12345678',
    nationality: tourist?.nationality || 'Indian',
    emergencyContacts: [
      { name: 'Jane Doe', relation: 'Spouse', phone: '+91 9876543211' },
      { name: 'Sam Smith', relation: 'Friend', phone: '+91 9876543212' },
    ],
    tripDetails: {
      startDate: '15/06/2023',
      endDate: '25/06/2023',
      entryPoint: 'Manali',
      itinerary: 'Manali - Rohtang - Leh - Pangong',
    },
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t('profile.logoutTitle'),
      i18n.t('profile.logoutConfirmation'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.yes'),
          onPress: () => logout(),
        },
      ],
    );
  };

  const toggleEmergencyContacts = () => {
    setEmergencyContactsVisible(!emergencyContactsVisible);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/profile-placeholder.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Icon name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.touristId}>{i18n.t('profile.touristIdLabel')}: {profileData.touristId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t('profile.personalInfo')}</Text>
        <View style={styles.infoItem}>
          <Icon name="email" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.email')}:</Text>
          <Text style={styles.infoValue}>{profileData.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="phone" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.phone')}:</Text>
          <Text style={styles.infoValue}>{profileData.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="flag" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.nationality')}:</Text>
          <Text style={styles.infoValue}>{profileData.nationality}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t('profile.tripDetails')}</Text>
        <View style={styles.infoItem}>
          <Icon name="event" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.startDate')}:</Text>
          <Text style={styles.infoValue}>{profileData.tripDetails.startDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="event" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.endDate')}:</Text>
          <Text style={styles.infoValue}>{profileData.tripDetails.endDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="place" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.entryPoint')}:</Text>
          <Text style={styles.infoValue}>{profileData.tripDetails.entryPoint}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="map" size={22} color="#007AFF" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>{i18n.t('profile.itinerary')}:</Text>
          <Text style={styles.infoValue}>{profileData.tripDetails.itinerary}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.section} 
        onPress={toggleEmergencyContacts}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{i18n.t('profile.emergencyContacts')}</Text>
          <Icon 
            name={emergencyContactsVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#333" 
          />
        </View>
        
        {emergencyContactsVisible && profileData.emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelation}>{contact.relation}</Text>
            </View>
            <TouchableOpacity style={styles.contactCallButton}>
              <Icon name="phone" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        ))}
        
        {emergencyContactsVisible && (
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>{i18n.t('profile.addEmergencyContact')}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{i18n.t('profile.settings')}</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Icon name="notifications" size={22} color="#007AFF" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>{i18n.t('profile.notifications')}</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#d1d1d6', true: '#4cd964' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Icon name="location-on" size={22} color="#007AFF" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>{i18n.t('profile.locationTracking')}</Text>
          </View>
          <Switch
            value={locationTrackingEnabled}
            onValueChange={setLocationTrackingEnabled}
            trackColor={{ false: '#d1d1d6', true: '#4cd964' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Icon name="language" size={22} color="#007AFF" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>{i18n.t('profile.language')}</Text>
          </View>
          <LanguageSelector />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DigitalID')}>
          <Icon name="credit-card" size={22} color="#007AFF" style={styles.menuIcon} />
          <Text style={styles.menuText}>{i18n.t('profile.viewDigitalID')}</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help" size={22} color="#007AFF" style={styles.menuIcon} />
          <Text style={styles.menuText}>{i18n.t('profile.helpSupport')}</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info" size={22} color="#007AFF" style={styles.menuIcon} />
          <Text style={styles.menuText}>{i18n.t('profile.about')}</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="exit-to-app" size={22} color="#FF3B30" style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>{i18n.t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>{i18n.t('profile.version')} 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  touristId: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  contactRelation: {
    fontSize: 14,
    color: '#666',
  },
  contactCallButton: {
    backgroundColor: '#4cd964',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 15,
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen;