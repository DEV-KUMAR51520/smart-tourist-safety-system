# Smart Tourist Safety System - Developer Guide

## Introduction

This developer guide provides comprehensive information for developers who want to understand, maintain, or extend the Smart Tourist Safety System. It covers the system architecture, codebase organization, development environment setup, and best practices for contributing to the project.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Development Environment Setup](#development-environment-setup)
4. [Codebase Organization](#codebase-organization)
5. [Key Components](#key-components)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Contributing Guidelines](#contributing-guidelines)
11. [Troubleshooting](#troubleshooting)

## System Architecture

The Smart Tourist Safety System follows a microservices architecture with the following main components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Mobile App     │◄────┤  API Gateway    │◄────┤  Dashboard      │
│  (React Native) │     │  (Express.js)   │     │  (Next.js)      │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Auth Service   │◄────┤  Microservices  │◄────┤  IoT Devices    │
│  (JWT)          │     │  (Node.js)      │     │  (Smart Bands)  │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────┐
│                                             │
│              Database Layer                 │
│              (MongoDB)                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Communication Flow

1. **Client-Server Communication**: RESTful APIs for most operations, WebSockets for real-time updates
2. **Inter-Service Communication**: HTTP/REST for synchronous operations, message queues for asynchronous operations
3. **IoT Communication**: MQTT protocol for device-to-server communication, WebSockets for real-time data streaming

## Technology Stack

### Frontend

- **Mobile Application**: React Native, Redux, React Navigation
- **Dashboard**: Next.js, React, Tailwind CSS, Leaflet.js

### Backend

- **API Gateway**: Express.js, Node.js
- **Microservices**: Node.js, Express.js
- **Authentication**: JWT, bcrypt

### Database

- **Primary Database**: MongoDB
- **Caching**: Redis

### IoT

- **Device Simulation**: Python
- **Data Processing**: Node.js

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions

## Development Environment Setup

### Prerequisites

- Node.js (v14+)
- npm (v6+) or yarn (v1.22+)
- Python (v3.8+)
- Docker and Docker Compose
- MongoDB
- Git

### Clone the Repository

```bash
git clone https://github.com/your-organization/smart-tourist-safety-system.git
cd smart-tourist-safety-system
```

### Setup Script

Run the setup script to initialize the development environment:

```bash
./setup.sh
```

This script will:
1. Install dependencies for all services
2. Set up environment variables
3. Initialize the database with sample data
4. Build Docker images

### Manual Setup

If you prefer to set up manually, follow these steps:

#### 1. API Gateway and Backend Services

```bash
cd api-gateway
npm install

cd ../auth-service
npm install

cd ../user-service
npm install

cd ../emergency-service
npm install

cd ../iot-service
npm install
```

#### 2. Frontend Dashboard

```bash
cd frontend/dashboard
npm install
```

#### 3. Mobile Application

```bash
cd mobile
npm install
```

#### 4. IoT Simulation

```bash
cd iot-simulation
pip install -r requirements.txt
```

#### 5. Environment Variables

Copy the example environment files and update them with your configuration:

```bash
cp .env.example .env
```

### Running the Development Environment

Start all services using Docker Compose:

```bash
docker-compose up
```

Or start individual services for development:

#### API Gateway

```bash
cd api-gateway
npm run dev
```

#### Dashboard

```bash
cd frontend/dashboard
npm run dev
```

#### Mobile App

```bash
cd mobile
npm start
```

In a separate terminal:

```bash
cd mobile
npm run android  # or npm run ios
```

#### IoT Simulation

```bash
cd iot-simulation
python smart_band_simulator_enhanced.py
```

## Codebase Organization

```
smart-tourist-safety-system/
├── api-gateway/              # API Gateway service
├── auth-service/             # Authentication service
├── user-service/             # User management service
├── emergency-service/        # Emergency handling service
├── iot-service/              # IoT data processing service
├── frontend/
│   ├── dashboard/            # Admin dashboard (Next.js)
├── mobile/                   # Mobile application (React Native)
├── iot-simulation/           # IoT device simulation
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project overview
```

### Key Directories and Files

#### API Gateway

```
api-gateway/
├── src/
│   ├── routes/               # API route definitions
│   ├── middleware/           # Custom middleware
│   ├── services/             # Service connectors
│   └── utils/                # Utility functions
├── package.json
└── server.js                 # Entry point
```

#### Backend Services (Common Structure)

```
service-name/
├── src/
│   ├── controllers/          # Request handlers
│   ├── models/               # Data models
│   ├── routes/               # Route definitions
│   ├── services/             # Business logic
│   └── utils/                # Utility functions
├── package.json
└── server.js                 # Entry point
```

#### Dashboard

```
frontend/dashboard/
├── app/                      # Next.js app directory
│   ├── page.js               # Main dashboard page
│   ├── layout.js             # Layout component
│   └── globals.css           # Global styles
├── components/               # Reusable components
│   ├── DashboardCard.jsx     # Dashboard card component
│   └── MapComponent.jsx      # Map visualization component
├── lib/                      # Utility libraries
│   └── services/             # API services
├── public/                   # Static assets
└── package.json
```

#### Mobile Application

```
mobile/
├── src/
│   ├── screens/              # App screens
│   ├── components/           # Reusable components
│   ├── navigation/           # Navigation configuration
│   ├── services/             # API and device services
│   ├── store/                # State management
│   ├── utils/                # Utility functions
│   └── i18n/                 # Internationalization
├── assets/                   # Images, fonts, etc.
└── package.json
```

#### IoT Simulation

```
iot-simulation/
├── smart_band_simulator.py           # Basic simulator
├── smart_band_simulator_enhanced.py  # Enhanced simulator with real-time features
└── requirements.txt                   # Python dependencies
```

## Key Components

### Mobile Application

#### Authentication Flow

The authentication flow is handled by the `AuthNavigator` and related screens:

```javascript
// mobile/src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
```

#### Emergency Features

The emergency features are implemented in the `EmergencyScreen`:

```javascript
// mobile/src/screens/EmergencyScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { triggerEmergency } from '../store/actions/emergencyActions';
import LocationService from '../services/LocationService';

const EmergencyScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(null);
  const [location, setLocation] = useState(null);
  
  // Emergency button handler with countdown
  const handleEmergencyPress = () => {
    setCountdown(5);
    
    // Get current location
    LocationService.getCurrentLocation()
      .then(location => setLocation(location))
      .catch(error => console.error('Location error:', error));
  };
  
  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown === 0) {
      // Trigger emergency
      if (location) {
        dispatch(triggerEmergency({
          location,
          type: 'panic',
          message: 'Emergency assistance needed'
        }));
      }
      setCountdown(null);
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, location, dispatch]);
  
  // Cancel emergency
  const cancelEmergency = () => {
    setCountdown(null);
    Alert.alert(t('emergency.cancelled'), t('emergency.cancelledMessage'));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('emergency.title')}</Text>
      
      {countdown !== null ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            {t('emergency.sendingIn')} {countdown}
          </Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={cancelEmergency}
          >
            <Text style={styles.cancelButtonText}>{t('emergency.cancel')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
          activeOpacity={0.7}
        >
          <Text style={styles.emergencyButtonText}>{t('emergency.button')}</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.instructions}>{t('emergency.instructions')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles implementation
});

export default EmergencyScreen;
```

### Dashboard

#### Map Component

The `MapComponent` handles both marker-based tourist tracking and heat map visualization:

```jsx
// frontend/dashboard/components/MapComponent.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet.heat';

const MapComponent = ({ tourists, incidents, onMarkerClick, center, zoom }) => {
  const [mapMode, setMapMode] = useState('markers'); // 'markers' or 'heatmap'
  const markersLayerRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  
  // Map update component
  const MapUpdater = ({ tourists, incidents, mapMode }) => {
    const map = useMap();
    
    useEffect(() => {
      // Center map if coordinates provided
      if (center) {
        map.setView(center, zoom || map.getZoom());
      }
      
      // Update heatmap if in heatmap mode
      if (mapMode === 'heatmap' && tourists.length > 0) {
        // Remove existing heatmap layer if it exists
        if (heatmapLayerRef.current) {
          map.removeLayer(heatmapLayerRef.current);
        }
        
        // Create heatmap data points
        const heatData = tourists.map(tourist => [
          tourist.location.lat,
          tourist.location.lng,
          // Intensity based on status (higher for warning/critical)
          tourist.status === 'critical' ? 1.0 :
          tourist.status === 'warning' ? 0.7 :
          0.3
        ]);
        
        // Create and add heatmap layer
        heatmapLayerRef.current = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: {
            0.3: 'blue',
            0.5: 'lime',
            0.7: 'yellow',
            1.0: 'red'
          }
        }).addTo(map);
      } else if (heatmapLayerRef.current) {
        // Remove heatmap layer if not in heatmap mode
        map.removeLayer(heatmapLayerRef.current);
        heatmapLayerRef.current = null;
      }
    }, [map, tourists, incidents, mapMode, center, zoom]);
    
    return null;
  };
  
  // Get marker icon based on tourist status
  const getMarkerIcon = (status) => {
    const iconUrl = status === 'critical' ? '/markers/red-marker.png' :
                   status === 'warning' ? '/markers/yellow-marker.png' :
                   '/markers/green-marker.png';
    
    return L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  };
  
  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 z-10 bg-white p-2 rounded shadow-md">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${mapMode === 'markers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMapMode('markers')}
          >
            Markers
          </button>
          <button
            className={`px-3 py-1 rounded ${mapMode === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMapMode('heatmap')}
          >
            Heat Map
          </button>
        </div>
      </div>
      
      <MapContainer
        center={center || [26.9124, 75.7873]} // Default to Jaipur
        zoom={zoom || 12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater tourists={tourists} incidents={incidents} mapMode={mapMode} />
        
        {mapMode === 'markers' && (
          <MarkerClusterGroup ref={markersLayerRef}>
            {tourists.map((tourist) => (
              <Marker
                key={tourist.id}
                position={[tourist.location.lat, tourist.location.lng]}
                icon={getMarkerIcon(tourist.status)}
                eventHandlers={{
                  click: () => onMarkerClick(tourist)
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{tourist.name}</h3>
                    <p>Status: {tourist.status}</p>
                    <p>Device ID: {tourist.deviceId}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {incidents.map((incident) => (
              <Marker
                key={`incident-${incident.id}`}
                position={[incident.location.lat, incident.location.lng]}
                icon={L.icon({
                  iconUrl: '/markers/incident-marker.png',
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32]
                })}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold text-red-600">Incident</h3>
                    <p>Type: {incident.type}</p>
                    <p>Status: {incident.status}</p>
                    <p>Time: {new Date(incident.timestamp).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
      
      <div className="absolute bottom-2 left-2 z-10 bg-white p-2 rounded shadow-md text-xs">
        {mapMode === 'markers' ? 
          'Showing individual tourist locations. Click markers for details.' : 
          'Heat map showing tourist density. Red areas indicate higher concentration.'}
      </div>
    </div>
  );
};

export default MapComponent;
```

### IoT Integration

#### IoT Data Service

The IoT data service handles real-time data from smart bands/tags:

```javascript
// backend/services/iotDataService.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iot-data');

// IoT Data Schema
const IoTDataSchema = new mongoose.Schema({
  deviceId: String,
  userId: String,
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number,
    accuracy: Number
  },
  healthData: {
    heartRate: Number,
    bodyTemperature: Number,
    steps: Number
  },
  environmentData: {
    temperature: Number,
    humidity: Number,
    airQuality: Number
  },
  batteryLevel: Number,
  status: { type: String, enum: ['safe', 'warning', 'critical'], default: 'safe' },
  alerts: [{
    type: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

const IoTData = mongoose.model('IoTData', IoTDataSchema);

// Connected clients
const clients = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
  const clientId = generateClientId();
  clients.set(clientId, ws);
  
  console.log(`Client connected: ${clientId}`);
  
  // Send initial system status
  ws.send(JSON.stringify({
    type: 'system_status',
    data: {
      connectedDevices: getConnectedDevicesCount(),
      systemHealth: getSystemHealth()
    }
  }));
  
  // Message handler
  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      
      switch (parsedMessage.type) {
        case 'subscribe_device':
          // Handle device subscription
          handleDeviceSubscription(clientId, parsedMessage.deviceId);
          break;
          
        case 'device_command':
          // Handle device command
          handleDeviceCommand(parsedMessage.deviceId, parsedMessage.command);
          break;
          
        case 'request_heatmap_data':
          // Handle heatmap data request
          const heatmapData = await generateHeatmapData();
          ws.send(JSON.stringify({
            type: 'heatmap_data',
            data: heatmapData
          }));
          break;
          
        default:
          console.log(`Unknown message type: ${parsedMessage.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Close handler
  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });
});

// API Routes

// Get all IoT data
app.get('/api/iot-data', async (req, res) => {
  try {
    const data = await IoTData.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get latest IoT data for a specific device
app.get('/api/iot-data/:deviceId/latest', async (req, res) => {
  try {
    const data = await IoTData.findOne({ deviceId: req.params.deviceId }).sort({ timestamp: -1 });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Post new IoT data
app.post('/api/iot-data', async (req, res) => {
  try {
    // Calculate status based on data
    const status = calculateStatus(req.body);
    
    // Create new IoT data record
    const newData = new IoTData({
      ...req.body,
      status
    });
    
    // Check for alerts
    const alerts = generateAlerts(req.body);
    if (alerts.length > 0) {
      newData.alerts = alerts;
    }
    
    // Save to database
    await newData.save();
    
    // Broadcast to subscribed clients
    broadcastUpdate(newData);
    
    res.json({ success: true, dataId: newData._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper Functions

// Generate unique client ID
function generateClientId() {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get connected devices count
function getConnectedDevicesCount() {
  // In a real implementation, this would query the database
  return Math.floor(Math.random() * 50) + 100; // Mock data
}

// Get system health
function getSystemHealth() {
  return {
    cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
    memory: Math.floor(Math.random() * 40) + 30, // 30-70%
    storage: Math.floor(Math.random() * 30) + 50, // 50-80%
    network: Math.random() > 0.9 ? 'warning' : 'normal',
    uptime: Math.floor(Math.random() * 100) + 100 // 100-200 hours
  };
}

// Calculate status based on data
function calculateStatus(data) {
  let status = 'safe';
  
  // Check health data
  if (data.healthData) {
    const { heartRate, bodyTemperature } = data.healthData;
    
    if ((heartRate && (heartRate > 120 || heartRate < 40)) ||
        (bodyTemperature && (bodyTemperature > 38.5 || bodyTemperature < 35.5))) {
      status = 'critical';
    } else if ((heartRate && (heartRate > 100 || heartRate < 50)) ||
               (bodyTemperature && (bodyTemperature > 37.8 || bodyTemperature < 36.0))) {
      status = 'warning';
    }
  }
  
  // Check environment data
  if (status !== 'critical' && data.environmentData) {
    const { temperature, airQuality } = data.environmentData;
    
    if ((temperature && (temperature > 45 || temperature < 0)) ||
        (airQuality && airQuality > 300)) {
      status = 'critical';
    } else if ((temperature && (temperature > 40 || temperature < 5)) ||
               (airQuality && airQuality > 200)) {
      status = 'warning';
    }
  }
  
  // Check battery level
  if (status !== 'critical' && data.batteryLevel && data.batteryLevel < 10) {
    status = 'warning';
  }
  
  return status;
}

// Generate alerts based on data
function generateAlerts(data) {
  const alerts = [];
  
  // Health alerts
  if (data.healthData) {
    const { heartRate, bodyTemperature } = data.healthData;
    
    if (heartRate && heartRate > 120) {
      alerts.push({
        type: 'health',
        message: 'High heart rate detected'
      });
    } else if (heartRate && heartRate < 40) {
      alerts.push({
        type: 'health',
        message: 'Low heart rate detected'
      });
    }
    
    if (bodyTemperature && bodyTemperature > 38.5) {
      alerts.push({
        type: 'health',
        message: 'High body temperature detected'
      });
    } else if (bodyTemperature && bodyTemperature < 35.5) {
      alerts.push({
        type: 'health',
        message: 'Low body temperature detected'
      });
    }
  }
  
  // Environment alerts
  if (data.environmentData) {
    const { temperature, airQuality } = data.environmentData;
    
    if (temperature && temperature > 45) {
      alerts.push({
        type: 'environment',
        message: 'Extreme high temperature detected'
      });
    } else if (temperature && temperature < 0) {
      alerts.push({
        type: 'environment',
        message: 'Extreme low temperature detected'
      });
    }
    
    if (airQuality && airQuality > 300) {
      alerts.push({
        type: 'environment',
        message: 'Hazardous air quality detected'
      });
    }
  }
  
  // Battery alert
  if (data.batteryLevel && data.batteryLevel < 10) {
    alerts.push({
      type: 'device',
      message: 'Low battery level'
    });
  }
  
  return alerts;
}

// Handle device subscription
function handleDeviceSubscription(clientId, deviceId) {
  // In a real implementation, this would store the subscription
  console.log(`Client ${clientId} subscribed to device ${deviceId}`);
}

// Handle device command
function handleDeviceCommand(deviceId, command) {
  // In a real implementation, this would send the command to the device
  console.log(`Command ${command.type} sent to device ${deviceId}`);
}

// Broadcast update to subscribed clients
function broadcastUpdate(data) {
  const message = JSON.stringify({
    type: 'device_update',
    data
  });
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Generate heatmap data
async function generateHeatmapData() {
  try {
    // Get recent IoT data
    const recentData = await IoTData.find()
      .sort({ timestamp: -1 })
      .limit(1000);
    
    // Transform to heatmap format
    return recentData.map(data => ({
      lat: data.location.lat,
      lng: data.location.lng,
      intensity: data.status === 'critical' ? 1.0 :
                data.status === 'warning' ? 0.7 :
                0.3
    }));
  } catch (error) {
    console.error('Error generating heatmap data:', error);
    return [];
  }
}

// Start server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`IoT Data Service running on port ${PORT}`);
});

module.exports = { app, server };
```

## API Documentation

### Authentication API

#### Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "phone": "+919876543210"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "userId": "60d21b4667d0d8992e610c85"
  }
  ```

#### Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### IoT Data API

#### Send IoT Data

- **URL**: `/api/iot-data`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "deviceId": "SB-12345678",
    "userId": "60d21b4667d0d8992e610c85",
    "location": {
      "lat": 26.9124,
      "lng": 75.7873,
      "accuracy": 5.0
    },
    "healthData": {
      "heartRate": 75,
      "bodyTemperature": 36.8,
      "steps": 1250
    },
    "environmentData": {
      "temperature": 32.5,
      "humidity": 65.0,
      "airQuality": 120
    },
    "batteryLevel": 85
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "IoT data received",
    "dataId": "60d21b4667d0d8992e610c86"
  }
  ```

#### Get Latest IoT Data

- **URL**: `/api/iot-data/latest`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "deviceId": "SB-12345678",
        "userId": "60d21b4667d0d8992e610c85",
        "timestamp": "2023-06-15T10:30:00Z",
        "location": {
          "lat": 26.9124,
          "lng": 75.7873,
          "accuracy": 5.0
        },
        "healthData": {
          "heartRate": 75,
          "bodyTemperature": 36.8,
          "steps": 1250
        },
        "environmentData": {
          "temperature": 32.5,
          "humidity": 65.0,
          "airQuality": 120
        },
        "batteryLevel": 85,
        "status": "safe"
      }
    ]
  }
  ```

## Database Schema

### User Collection

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],
  digitalId: {
    idNumber: String,
    issuedDate: Date,
    expiryDate: Date,
    verificationStatus: String
  },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### IoT Data Collection

```javascript
const IoTDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number }
  },
  healthData: {
    heartRate: Number,
    bodyTemperature: Number,
    steps: Number
  },
  environmentData: {
    temperature: Number,
    humidity: Number,
    airQuality: Number
  },
  batteryLevel: Number,
  status: { type: String, enum: ['safe', 'warning', 'critical'], default: 'safe' },
  alerts: [{
    type: { type: String, enum: ['health', 'environment', 'device'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
});
```

### Incident Collection

```javascript
const IncidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number }
  },
  type: { type: String, enum: ['panic', 'health', 'environment', 'geofence'], required: true },
  status: { type: String, enum: ['active', 'acknowledged', 'resolved'], default: 'active' },
  description: String,
  responder: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    contactInfo: String
  },
  resolutionDetails: {
    resolvedAt: Date,
    notes: String
  }
});
```

## Testing

### Unit Testing

Unit tests are written using Jest for JavaScript/TypeScript code and pytest for Python code.

#### Example Unit Test for Authentication Service

```javascript
// auth-service/tests/auth.test.js
const request = require('supertest');
const { app } = require('../src/server');
const User = require('../src/models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/test-auth');
});

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
});

afterAll(async () => {
  // Disconnect from test database
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '+919876543210'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userId');
      
      // Check if user was created in database
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user.name).toEqual('Test User');
    });
    
    it('should return error for missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com'
          // Missing password and phone
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '+919876543210'
        });
    });
    
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
    });
    
    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
```

### Integration Testing

Integration tests verify that different components work together correctly.

#### Example Integration Test for Emergency Flow

```javascript
// tests/integration/emergency.test.js
const request = require('supertest');
const { app: apiGateway } = require('../../api-gateway/src/server');
const { app: emergencyService } = require('../../emergency-service/src/server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock user for testing
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Test User',
  email: 'test@example.com'
};

// Generate test token
const testToken = jwt.sign(
  { id: testUser._id, email: testUser.email },
  process.env.JWT_SECRET || 'test-secret',
  { expiresIn: '1h' }
);

describe('Emergency Flow Integration', () => {
  it('should trigger emergency alert through API gateway', async () => {
    // Trigger emergency alert
    const alertRes = await request(apiGateway)
      .post('/api/emergency/alert')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        userId: testUser._id.toString(),
        location: {
          lat: 26.9124,
          lng: 75.7873,
          accuracy: 5.0
        },
        type: 'panic',
        message: 'Need immediate help'
      });
    
    expect(alertRes.statusCode).toEqual(200);
    expect(alertRes.body).toHaveProperty('success', true);
    expect(alertRes.body).toHaveProperty('alertId');
    
    // Check if incident was created
    const incidentRes = await request(emergencyService)
      .get(`/api/incidents/${alertRes.body.alertId}`)
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(incidentRes.statusCode).toEqual(200);
    expect(incidentRes.body).toHaveProperty('success', true);
    expect(incidentRes.body.data).toHaveProperty('type', 'panic');
    expect(incidentRes.body.data).toHaveProperty('status', 'active');
  });
});
```

## Deployment

### Docker Compose

The system is deployed using Docker Compose for development and testing:

```yaml
# docker-compose.yml
version: '3'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - AUTH_SERVICE_URL=http://auth-service:3001
      - USER_SERVICE_URL=http://user-service:3002
      - EMERGENCY_SERVICE_URL=http://emergency-service:3003
      - IOT_SERVICE_URL=http://iot-service:3004
    depends_on:
      - auth-service
      - user-service
      - emergency-service
      - iot-service

  auth-service:
    build: ./auth-service
    environment:
      - NODE_ENV=development
      - PORT=3001
      - MONGODB_URI=mongodb://mongo:27017/auth
      - JWT_SECRET=your_jwt_secret
      - JWT_EXPIRY=1h
      - REFRESH_TOKEN_SECRET=your_refresh_token_secret
      - REFRESH_TOKEN_EXPIRY=7d

  user-service:
    build: ./user-service
    environment:
      - NODE_ENV=development
      - PORT=3002
      - MONGODB_URI=mongodb://mongo:27017/users

  emergency-service:
    build: ./emergency-service
    environment:
      - NODE_ENV=development
      - PORT=3003
      - MONGODB_URI=mongodb://mongo:27017/emergency

  iot-service:
    build: ./iot-service
    ports:
      - "3004:3004"
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - PORT=3004
      - WS_PORT=8080
      - MONGODB_URI=mongodb://mongo:27017/iot

  dashboard:
    build: ./frontend/dashboard
    ports:
      - "3005:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:3000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8080

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Production Deployment

For production deployment, consider using Kubernetes for better scalability and management:

1. Create Kubernetes manifests for each service
2. Set up proper resource limits and requests
3. Configure horizontal pod autoscaling
4. Use a managed database service instead of containerized MongoDB
5. Set up proper monitoring and logging

## Contributing Guidelines

### Code Style

- Follow the ESLint configuration for JavaScript/TypeScript code
- Use Prettier for code formatting
- Follow PEP 8 for Python code

### Git Workflow

1. Create a feature branch from `develop`
2. Make your changes
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request to `develop`

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation if necessary
3. The PR requires approval from at least one reviewer
4. Once approved, the PR can be merged

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore

Example: `feat(auth): add refresh token functionality`

## Troubleshooting

### Common Development Issues

#### MongoDB Connection Issues

**Problem**: Services cannot connect to MongoDB

**Solution**:
1. Check if MongoDB container is running: `docker ps | grep mongo`
2. Verify MongoDB connection string in service environment variables
3. Try connecting to MongoDB directly: `mongo mongodb://localhost:27017`

#### WebSocket Connection Issues

**Problem**: WebSocket connections fail or disconnect frequently

**Solution**:
1. Check if the WebSocket server is running
2. Verify WebSocket URL in client configuration
3. Check for network issues or firewalls blocking WebSocket connections
4. Increase WebSocket ping interval for better connection stability

#### Mobile App Build Issues

**Problem**: React Native build fails

**Solution**:
1. Clear React Native cache: `npx react-native start --reset-cache`
2. Rebuild the app: `npx react-native run-android` or `npx react-native run-ios`
3. Check for native module compatibility issues
4. Update React Native and dependencies if necessary

### Debugging Tips

#### Backend Services

1. Enable debug logging by setting `DEBUG=true` in environment variables
2. Use Node.js debugger: `node --inspect server.js`
3. Monitor API requests using tools like Postman or Insomnia

#### Frontend

1. Use React DevTools for React/React Native debugging
2. Enable source maps for better error tracking
3. Use browser developer tools for dashboard debugging

#### IoT Simulation

1. Run the simulator with verbose logging: `python smart_band_simulator.py --verbose`
2. Monitor WebSocket messages using browser developer tools
3. Check IoT data in MongoDB to verify data flow

---

This developer guide provides a comprehensive overview of the Smart Tourist Safety System codebase and development process. For more detailed information on specific components, refer to the inline documentation in the code.