import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n, { changeLocale, getCurrentLocale, getAvailableLocales } from '../../i18n';

// Language names mapping
const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  mr: 'मराठी (Marathi)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  or: 'ଓଡ଼ିଆ (Odia)',
};

const LanguageSelector = ({ style, textStyle, iconSize = 20, showLabel = true }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());
  const [availableLocales, setAvailableLocales] = useState([]);

  useEffect(() => {
    // Get available locales when component mounts
    setAvailableLocales(getAvailableLocales());
  }, []);

  const handleLanguageChange = async (locale) => {
    const success = await changeLocale(locale);
    if (success) {
      setCurrentLocale(locale);
      setModalVisible(false);
    }
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.languageItem, currentLocale === item && styles.selectedLanguage]}
      onPress={() => handleLanguageChange(item)}
    >
      <Text style={[styles.languageText, currentLocale === item && styles.selectedLanguageText]}>
        {LANGUAGE_NAMES[item] || item}
      </Text>
      {currentLocale === item && (
        <Ionicons name="checkmark" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="language" size={iconSize} color="#007AFF" />
        {showLabel && (
          <Text style={[styles.buttonText, textStyle]}>
            {LANGUAGE_NAMES[currentLocale] || currentLocale}
          </Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{i18n.t('common.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableLocales}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item}
              style={styles.languageList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageList: {
    flexGrow: 0,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#f0f7ff',
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default LanguageSelector;