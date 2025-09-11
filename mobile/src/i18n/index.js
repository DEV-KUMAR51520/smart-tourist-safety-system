import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en';
import hi from './translations/hi';

// Create a new I18n instance
const i18n = new I18n({
  en,
  hi,
});

// Set the locale once at the beginning of your app
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Function to initialize the locale from storage or device settings
export const initLocale = async () => {
  try {
    // Try to get the saved locale from AsyncStorage
    const savedLocale = await AsyncStorage.getItem('userLocale');
    
    if (savedLocale) {
      // If we have a saved locale, use it
      i18n.locale = savedLocale;
    } else {
      // Otherwise use the device locale with fallback to English
      const deviceLocale = Localization.locale.split('-')[0];
      i18n.locale = Object.keys(i18n.translations).includes(deviceLocale) 
        ? deviceLocale 
        : 'en';
      
      // Save the selected locale for future app launches
      await AsyncStorage.setItem('userLocale', i18n.locale);
    }
  } catch (error) {
    console.error('Error initializing locale:', error);
    i18n.locale = 'en'; // Fallback to English on error
  }
};

// Function to change the locale
export const changeLocale = async (locale) => {
  try {
    if (Object.keys(i18n.translations).includes(locale)) {
      i18n.locale = locale;
      await AsyncStorage.setItem('userLocale', locale);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error changing locale:', error);
    return false;
  }
};

// Function to get the current locale
export const getCurrentLocale = () => i18n.locale;

// Function to get all available locales
export const getAvailableLocales = () => Object.keys(i18n.translations);

// Export the i18n instance as default
export default i18n;