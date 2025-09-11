// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AuthNavigator from './AuthNavigator';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MapScreen from '../screens/maps/MapScreen';
import EmergencyScreen from '../screens/emergency/EmergencyScreen';
import EmergencyTrackingScreen from '../screens/emergency/EmergencyTrackingScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import DigitalIDScreen from '../screens/auth/DigitalIDScreen';
import GeofencingScreen from '../screens/maps/GeofencingScreen';
import { useAuthContext } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Map':
            iconName = 'map';
            break;
          case 'Emergency':
            iconName = 'warning';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e91e63',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Emergency" component={EmergencyScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="DigitalID" component={DigitalIDScreen} />
    <Stack.Screen name="EmergencyTracking" component={EmergencyTrackingScreen} />
    <Stack.Screen name="Geofencing" component={GeofencingScreen} />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;