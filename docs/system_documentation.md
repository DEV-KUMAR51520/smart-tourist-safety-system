# Smart Tourist Safety System - Technical Documentation

## System Overview

The Smart Tourist Safety System is a comprehensive platform designed to enhance the safety and security of tourists through real-time monitoring, emergency response, and proactive safety measures. The system integrates mobile applications, IoT devices, and a centralized dashboard to provide a complete safety solution for tourists and authorities.

### Key Components

1. **Mobile Application**: A cross-platform mobile app for tourists with authentication, digital ID, emergency features, and geofencing capabilities.

2. **IoT Integration**: Smart bands/tags that monitor tourist location, health parameters, and environmental conditions in real-time.

3. **Dashboard**: A centralized monitoring system for authorities to track tourists, view heat maps, and respond to emergencies.

4. **Backend Services**: API gateway, authentication service, and specialized microservices for handling various system functions.

5. **Database**: Secure storage for user data, IoT readings, and system information.

## System Architecture

### High-Level Architecture

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

### Component Details

#### Mobile Application

The mobile application is built using React Native for cross-platform compatibility (iOS and Android). It follows a modular architecture with the following key components:

- **Navigation**: AppNavigator and AuthNavigator manage the routing between screens
- **Screens**: Various screens for authentication, profile, emergency, geofencing, etc.
- **Services**: API client, location service, and other utility services
- **Components**: Reusable UI components
- **Internationalization**: Support for multiple Indian languages

#### Dashboard

The dashboard is built using Next.js and provides a real-time monitoring interface for authorities. Key features include:

- **Real-time Tourist Tracking**: Map visualization with markers and heat maps
- **Incident Management**: Handling and resolving emergency incidents
- **Analytics**: Safety scores and system health monitoring
- **IoT Device Management**: Monitoring connected devices and their status

#### Backend Services

The backend is composed of several microservices:

- **API Gateway**: Entry point for all client requests, handles routing and basic validation
- **Authentication Service**: Manages user registration, login, and JWT token generation
- **User Service**: Handles user profile management and digital ID
- **Emergency Service**: Processes emergency alerts and coordinates response
- **IoT Data Service**: Collects and processes data from smart bands/tags
- **Geofencing Service**: Manages geofence creation and violation alerts

#### IoT Integration

The system integrates with IoT devices (smart bands/tags) that provide:

- **Location Tracking**: Real-time GPS coordinates
- **Health Monitoring**: Heart rate, body temperature, and activity levels
- **Environmental Sensing**: Temperature, humidity, and air quality
- **Emergency Triggering**: Panic button functionality

## Data Flow

### Authentication Flow

1. User registers or logs in through the mobile app
2. Authentication service validates credentials and issues JWT token
3. Token is stored on the device and used for subsequent API calls
4. Token refresh mechanism maintains session security

### Emergency Alert Flow

1. User triggers emergency alert via mobile app or smart band
2. Alert is sent to the emergency service via API gateway
3. Emergency service logs the incident and notifies relevant authorities
4. Dashboard displays the alert in real-time
5. Authorities can track the user's location and respond accordingly

### IoT Data Flow

1. Smart bands collect sensor data (location, health, environment)
2. Data is sent to the IoT data service via WebSocket or HTTP
3. IoT data service processes and stores the data
4. Dashboard receives real-time updates via WebSocket
5. Anomaly detection triggers alerts when thresholds are exceeded

## API Documentation

### Authentication API

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+919876543210"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "60d21b4667d0d8992e610c85"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:

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

```
POST /api/iot-data
Content-Type: application/json
Authorization: Bearer <token>

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

Response:

```json
{
  "success": true,
  "message": "IoT data received",
  "dataId": "60d21b4667d0d8992e610c86"
}
```

#### Get Latest IoT Data

```
GET /api/iot-data/latest
Authorization: Bearer <token>
```

Response:

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

### Emergency API

#### Trigger Emergency Alert

```
POST /api/emergency/alert
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "60d21b4667d0d8992e610c85",
  "location": {
    "lat": 26.9124,
    "lng": 75.7873,
    "accuracy": 5.0
  },
  "type": "panic",
  "message": "Need immediate help"
}
```

Response:

```json
{
  "success": true,
  "message": "Emergency alert triggered",
  "alertId": "60d21b4667d0d8992e610c87",
  "estimatedResponseTime": "5-10 minutes"
}
```

## Database Schema

### User Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "password": String (hashed),
  "phone": String,
  "emergencyContacts": [{
    "name": String,
    "phone": String,
    "relation": String
  }],
  "digitalId": {
    "idNumber": String,
    "issuedDate": Date,
    "expiryDate": Date,
    "verificationStatus": String
  },
  "preferences": {
    "language": String,
    "notifications": Boolean,
    "theme": String
  },
  "createdAt": Date,
  "updatedAt": Date
}
```

### IoT Data Collection

```json
{
  "_id": ObjectId,
  "deviceId": String,
  "userId": ObjectId (ref: User),
  "timestamp": Date,
  "location": {
    "lat": Number,
    "lng": Number,
    "accuracy": Number
  },
  "healthData": {
    "heartRate": Number,
    "bodyTemperature": Number,
    "steps": Number
  },
  "environmentData": {
    "temperature": Number,
    "humidity": Number,
    "airQuality": Number
  },
  "batteryLevel": Number,
  "status": String (enum: ["safe", "warning", "critical"]),
  "alerts": [{
    "type": String,
    "message": String,
    "timestamp": Date
  }]
}
```

### Incident Collection

```json
{
  "_id": ObjectId,
  "userId": ObjectId (ref: User),
  "deviceId": String,
  "timestamp": Date,
  "location": {
    "lat": Number,
    "lng": Number,
    "accuracy": Number
  },
  "type": String (enum: ["panic", "health", "environment", "geofence"]),
  "status": String (enum: ["active", "acknowledged", "resolved"]),
  "description": String,
  "responder": {
    "id": ObjectId,
    "name": String,
    "contactInfo": String
  },
  "resolutionDetails": {
    "resolvedAt": Date,
    "notes": String
  }
}
```

### Geofence Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "type": String (enum: ["safe", "restricted"]),
  "polygon": [{
    "lat": Number,
    "lng": Number
  }],
  "radius": Number (for circular geofences),
  "center": {
    "lat": Number,
    "lng": Number
  },
  "createdBy": ObjectId,
  "createdAt": Date,
  "updatedAt": Date,
  "active": Boolean
}
```

## Security Measures

### Authentication and Authorization

- **JWT-based Authentication**: Secure token-based authentication system
- **Role-based Access Control**: Different access levels for tourists, administrators, and emergency responders
- **Token Expiration**: Short-lived access tokens with refresh token mechanism
- **Password Security**: Bcrypt hashing for password storage

### Data Security

- **End-to-End Encryption**: For sensitive communications
- **Data Encryption at Rest**: For database storage
- **HTTPS/TLS**: For all API communications
- **Input Validation**: To prevent injection attacks
- **Rate Limiting**: To prevent brute force and DoS attacks

### Privacy Considerations

- **Data Minimization**: Collecting only necessary data
- **User Consent**: Clear consent mechanisms for data collection
- **Data Retention Policies**: Automatic deletion of data after specified periods
- **Anonymization**: For analytical data processing

## Deployment

### Infrastructure

The system is deployed using a containerized approach with Docker and orchestrated with Docker Compose or Kubernetes:

```yaml
# docker-compose.yml (simplified)
version: '3'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - user-service
      - emergency-service
      - iot-service

  auth-service:
    build: ./auth-service
    environment:
      - MONGODB_URI=mongodb://mongo:27017/auth
      - JWT_SECRET=your_jwt_secret

  user-service:
    build: ./user-service
    environment:
      - MONGODB_URI=mongodb://mongo:27017/users

  emergency-service:
    build: ./emergency-service
    environment:
      - MONGODB_URI=mongodb://mongo:27017/emergency

  iot-service:
    build: ./iot-service
    ports:
      - "3002:3002"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/iot

  dashboard:
    build: ./frontend/dashboard
    ports:
      - "3001:3000"

  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Scaling Considerations

- **Horizontal Scaling**: Adding more instances of services as load increases
- **Load Balancing**: Distributing traffic across service instances
- **Database Sharding**: For handling large volumes of IoT data
- **Caching**: Redis for frequently accessed data
- **Message Queues**: RabbitMQ or Kafka for asynchronous processing

## Testing

### Testing Strategies

- **Unit Testing**: For individual components and functions
- **Integration Testing**: For service interactions
- **End-to-End Testing**: For complete user flows
- **Load Testing**: For performance under high load
- **Security Testing**: For identifying vulnerabilities

### Test Coverage

The system aims for at least 80% test coverage across all components, with critical security and emergency features having 100% coverage.

## Monitoring and Maintenance

### Monitoring

- **Health Checks**: Regular service health monitoring
- **Performance Metrics**: Response times, error rates, and resource utilization
- **Logging**: Centralized logging with ELK stack (Elasticsearch, Logstash, Kibana)
- **Alerting**: Automated alerts for system issues

### Maintenance

- **Backup Strategy**: Regular database backups
- **Update Procedures**: Scheduled maintenance windows
- **Rollback Plans**: For failed deployments
- **Disaster Recovery**: Procedures for system restoration

## Future Enhancements

1. **AI-powered Anomaly Detection**: Advanced algorithms for identifying potential safety risks
2. **Predictive Analytics**: Forecasting high-risk areas based on historical data
3. **Augmented Reality Navigation**: For tourists to navigate safely in unfamiliar areas
4. **Voice-activated Emergency Response**: For hands-free emergency triggering
5. **Integration with Local Emergency Services**: Direct communication with police, ambulance, and fire services
6. **Blockchain for Digital ID**: Enhanced security and verification for tourist digital IDs

## Troubleshooting Guide

### Common Issues and Solutions

#### Mobile App

1. **Authentication Failures**
   - Check internet connectivity
   - Verify credentials
   - Ensure the authentication service is running

2. **Location Services Not Working**
   - Check if location permissions are granted
   - Verify GPS is enabled on the device
   - Restart the app

#### Dashboard

1. **Real-time Updates Not Appearing**
   - Check WebSocket connection
   - Verify the IoT service is running
   - Check browser console for errors

2. **Map Not Loading**
   - Ensure internet connectivity
   - Check if map API keys are valid
   - Clear browser cache

#### IoT Devices

1. **Device Not Connecting**
   - Check battery level
   - Verify network connectivity
   - Restart the device

2. **Inaccurate Readings**
   - Calibrate sensors
   - Update device firmware
   - Replace if persistent issues occur

## Conclusion

The Smart Tourist Safety System provides a comprehensive solution for enhancing tourist safety through real-time monitoring, emergency response, and proactive safety measures. By integrating mobile applications, IoT devices, and a centralized dashboard, the system creates a connected ecosystem that benefits both tourists and authorities.

This documentation serves as a technical guide for understanding, deploying, and maintaining the system. As the system evolves, this documentation will be updated to reflect new features and improvements.

---

## Appendix

### Glossary

- **JWT**: JSON Web Token, a compact, URL-safe means of representing claims to be transferred between two parties
- **IoT**: Internet of Things, a system of interrelated computing devices with the ability to transfer data over a network
- **Geofencing**: A virtual perimeter for a real-world geographic area
- **E-FIR**: Electronic First Information Report, a digital version of the initial document filed with the police
- **API Gateway**: A server that acts as an API front-end, receiving API requests and routing them to the appropriate backend service

### References

1. React Native Documentation: https://reactnative.dev/docs/getting-started
2. Next.js Documentation: https://nextjs.org/docs
3. MongoDB Documentation: https://docs.mongodb.com/
4. JWT Authentication: https://jwt.io/introduction/
5. WebSocket Protocol: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

### Contact Information

For technical support or inquiries about the Smart Tourist Safety System, please contact:

- **Email**: support@touristsafety.io
- **Phone**: +91-123-456-7890
- **Website**: https://www.touristsafety.io