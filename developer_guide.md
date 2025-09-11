# Smart Tourist Safety System - Developer Guide

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Backend Services](#backend-services)
4. [Frontend Applications](#frontend-applications)
5. [Mobile Application](#mobile-application)
6. [IoT Integration](#iot-integration)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Deployment Guide](#deployment-guide)
10. [Testing](#testing)

## System Architecture

The Smart Tourist Safety System follows a microservices architecture with the following components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Mobile App     │◄────┤  API Gateway    │◄────┤  Admin Dashboard│
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Auth Service   │◄────┤  Core Services  │◄────┤  IoT Service    │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Database  │     │  Main Database  │     │  Time Series DB │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Technology Stack

### Backend
- **Node.js** with Express.js for REST API services
- **Python** for data processing and analytics
- **MongoDB** for main database (tourist data, incidents, etc.)
- **Redis** for caching and real-time data
- **InfluxDB** for time-series IoT data
- **Kafka** for event streaming and message queue
- **WebSockets** for real-time communication

### Frontend
- **React.js** with Next.js for admin dashboard
- **Tailwind CSS** for styling
- **Mapbox** for map visualization
- **Chart.js** for data visualization

### Mobile
- **React Native** for cross-platform mobile app
- **Redux** for state management
- **React Navigation** for navigation
- **MapLibre** for offline maps

### IoT
- **MQTT** for IoT communication protocol
- **AWS IoT Core** for device management
- **ESP32** for smart bands/tags
- **LoRaWAN** for long-range, low-power communication

### DevOps
- **Docker** and **Kubernetes** for containerization and orchestration
- **GitHub Actions** for CI/CD
- **Prometheus** and **Grafana** for monitoring
- **ELK Stack** for logging

## Backend Services

### Auth Service

Handles user authentication, registration, and authorization.

#### Key Features
- JWT-based authentication
- Role-based access control
- Digital ID generation and verification
- Blockchain integration for ID security

#### API Endpoints
- `POST /api/auth/register` - Register a new tourist
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/verify-digital-id` - Verify a digital ID
- `POST /api/auth/refresh-token` - Refresh authentication token

### Tourist Service

Manages tourist profiles, trips, and safety scores.

#### Key Features
- Tourist profile management
- Trip tracking and history
- Safety score calculation
- Emergency contact management

#### API Endpoints
- `GET /api/tourists/:id` - Get tourist profile
- `PUT /api/tourists/:id` - Update tourist profile
- `GET /api/tourists/:id/trips` - Get tourist trip history
- `POST /api/tourists/:id/emergency-contacts` - Add emergency contact

### Tracking Service

Handles real-time location tracking and geofencing.

#### Key Features
- Real-time location updates
- Geofence creation and monitoring
- Movement history
- Heat map generation

#### API Endpoints
- `POST /api/tracking/location` - Update tourist location
- `GET /api/tracking/tourists` - Get all active tourist locations
- `GET /api/tracking/heatmap` - Get tourist density heat map
- `POST /api/tracking/geofence` - Create a geofence

### Incident Service

Manages safety incidents, alerts, and emergency responses.

#### Key Features
- Incident creation and tracking
- Alert generation and distribution
- Emergency response coordination
- Incident resolution workflow

#### API Endpoints
- `POST /api/incidents` - Create a new incident
- `GET /api/incidents` - Get all incidents
- `PUT /api/incidents/:id` - Update incident status
- `POST /api/incidents/:id/resolve` - Resolve an incident

### IoT Service

Manages IoT devices, data collection, and processing.

#### Key Features
- Device registration and management
- Data collection and processing
- Battery status monitoring
- Firmware updates

#### API Endpoints
- `POST /api/iot/devices` - Register a new device
- `GET /api/iot/devices/:id` - Get device information
- `POST /api/iot/data` - Submit IoT data
- `GET /api/iot/devices/:id/battery` - Get device battery status

## Frontend Applications

### Admin Dashboard

The admin dashboard provides a comprehensive interface for system administrators, safety personnel, and tourism authorities.

#### Key Features
- Real-time tourist tracking
- Incident management
- Heat map visualization
- Analytics and reporting
- Geofence management
- Alert configuration

#### Components
- **MapComponent** - Displays tourist locations, incidents, and geofences
- **IncidentList** - Shows active and resolved incidents
- **TouristTable** - Lists all registered tourists
- **AnalyticsDashboard** - Displays key metrics and trends
- **AlertManager** - Configures and sends alerts

### Tourist Web Portal

A web interface for tourists to manage their profiles and view information.

#### Key Features
- Profile management
- Digital ID access
- Trip history
- Safety guidelines

#### Components
- **ProfileManager** - Allows tourists to update their information
- **DigitalIDViewer** - Displays the tourist's digital ID
- **TripHistory** - Shows past and current trips
- **SafetyGuide** - Provides safety information and guidelines

## Mobile Application

The mobile app is the primary interface for tourists to interact with the safety system.

### Key Features
- User registration and authentication
- Digital ID display and sharing
- Real-time location tracking
- Emergency SOS functionality
- Offline maps and navigation
- Safety alerts and notifications
- Nearby services and points of interest

### App Structure

```
mobile/
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth, Location, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # App screens
│   │   ├── auth/          # Authentication screens
│   │   ├── dashboard/     # Main dashboard
│   │   ├── emergency/     # Emergency features
│   │   ├── maps/          # Maps and navigation
│   │   └── profile/       # User profile
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── App.js             # App entry point
├── android/               # Android-specific code
└── ios/                   # iOS-specific code
```

### Key Screens

- **LoginScreen** - User authentication
- **RegisterScreen** - New user registration
- **DashboardScreen** - Main app dashboard
- **DigitalIDScreen** - Displays digital ID
- **MapScreen** - Interactive safety map
- **EmergencyScreen** - SOS and emergency contacts
- **ProfileScreen** - User profile management

## IoT Integration

### Smart Band/Tag

Wearable devices provided to tourists for tracking and emergency alerts.

#### Features
- GPS location tracking
- SOS button
- Battery status monitoring
- Vibration alerts
- Bluetooth connectivity to mobile app
- LoRaWAN for remote areas

#### Technical Specifications
- ESP32 microcontroller
- GPS module
- LoRa transceiver
- Bluetooth Low Energy
- 500mAh LiPo battery
- IP67 water resistance

### Gateway Devices

Installed at strategic locations to relay data from smart bands/tags.

#### Features
- LoRaWAN gateway
- Wi-Fi/4G connectivity
- Local data caching
- Solar power option for remote areas

### Data Flow

1. Smart band collects GPS data and sensor readings
2. Data is transmitted to mobile app via Bluetooth or to gateway via LoRaWAN
3. Mobile app or gateway forwards data to IoT service
4. IoT service processes and stores data
5. Processed data is made available to other services

## API Documentation

Complete API documentation is available in the `/docs/api` directory in OpenAPI (Swagger) format.

### Authentication

All API endpoints except for registration and login require authentication using JWT tokens.

```
Authorization: Bearer <token>
```

### Error Handling

API errors follow a standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Database Schema

### User Schema

```javascript
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'admin', 'safety_officer'], default: 'tourist' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
```

### Tourist Schema

```javascript
const TouristSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nationality: { type: String, required: true },
  id_type: { type: String, enum: ['aadhaar', 'passport'], required: true },
  id_number: { type: String, required: true },
  emergency_contacts: [{
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true }
  }],
  safety_score: { type: Number, default: 100 },
  entry_point: { type: String },
  is_active: { type: Boolean, default: true },
  digital_id: {
    id: { type: String, required: true, unique: true },
    blockchain_hash: { type: String },
    issued_date: { type: Date, default: Date.now },
    expiry_date: { type: Date, required: true }
  },
  current_location: {
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
    },
    last_updated: { type: Date }
  },
  device_id: { type: String },  // IoT device ID if assigned
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
```

### Incident Schema

```javascript
const IncidentSchema = new Schema({
  type: { type: String, enum: ['sos', 'geofence_breach', 'system_alert', 'manual_report'], required: true },
  status: { type: String, enum: ['active', 'acknowledged', 'resolved'], default: 'active' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  tourist_id: { type: Schema.Types.ObjectId, ref: 'Tourist' },
  location: {
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
    },
    accuracy: { type: Number }
  },
  description: { type: String },
  reported_by: { type: Schema.Types.ObjectId, ref: 'User' },
  assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
  resolved_by: { type: Schema.Types.ObjectId, ref: 'User' },
  resolved_at: { type: Date },
  resolution_notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
```

## Deployment Guide

### Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (for production)
- MongoDB instance
- Redis instance
- InfluxDB instance
- AWS account (for IoT Core)

### Development Environment

1. Clone the repository
   ```
   git clone https://github.com/your-org/smart-tourist-safety-system.git
   cd smart-tourist-safety-system
   ```

2. Install dependencies
   ```
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend/dashboard
   npm install

   # Mobile
   cd ../mobile
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development servers
   ```
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd ../frontend/dashboard
   npm run dev

   # Mobile
   cd ../mobile
   npm run start
   ```

### Production Deployment

1. Build Docker images
   ```
   docker-compose build
   ```

2. Deploy to Kubernetes
   ```
   kubectl apply -f k8s/
   ```

## Testing

### Backend Testing

```
cd backend
npm run test
```

### Frontend Testing

```
cd frontend/dashboard
npm run test
```

### Mobile Testing

```
cd mobile
npm run test
```

### End-to-End Testing

```
npm run test:e2e
```

---

For additional information or support, contact the development team at dev@tourist-safety-system.com.