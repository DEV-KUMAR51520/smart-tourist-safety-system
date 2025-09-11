# Smart Tourist Safety Monitoring & Incident Response System

A comprehensive digital ecosystem that leverages AI, Blockchain, and IoT technologies to ensure tourist safety in remote and high-risk areas. The system now features enhanced real-time tourist tracking with heat maps and complete IoT integration for smart bands/tags.

## 🚀 Quick Start
TO deploy contract on Amoy chain
```
npx hardhat run scripts/deploy.js --network amoy
```


### Prerequisites
- Node.js 16+
- Python 3.9+
- Docker & Docker Compose
- Git

### Setup
```bash
# Clone repository
git clone <your-repo-url>
cd smart-tourist-safety-system

# Run setup script
./scripts/setup.sh

# Start development environment
./scripts/run-development.sh
```

<!-- ### Access Points
- **Mobile App**: Run on device/emulator via React Native
- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **AI Service**: http://localhost:5001 -->

## 📋 System Components

1. **Mobile App** (React Native) - Tourist safety interface
2. **Web Dashboard** (Next.js) - Emergency response center with real-time tracking and heat maps
3. **Backend API** (Express.js) - Core business logic
4. **AI Service** (TensorFlow) - Anomaly detection & risk assessment
5. **Blockchain** (Polygon) - Digital identity & immutable records
6. **IoT Integration** - Smart band/tag connectivity with real-time data processing

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Mobile App  │    │  Dashboard  │    │ IoT Devices │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
              ┌──────────▼───────────┐
              │     API Gateway      │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Backend │    │Blockchain│    │AI Service│
    │   API   │    │  Layer  │    │         │
    └─────────┘    └─────────┘    └─────────┘
```

## 📖 Documentation

- [System Documentation](docs/system_documentation.md) - Technical overview and architecture
- [User Guide](docs/user_guide.md) - Guide for tourists and administrators
- [Developer Guide](docs/developer_guide.md) - Guide for developers

## 🛠️ Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
flask run
```

### Mobile Development
```bash
cd mobile
npm install
npx react-native run-android
```

### Dashboard Development
```bash
cd dashboard
npm install
npm start
```

### AI Service Development
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## 🧪 Testing

```bash
# Run all tests
./scripts/run-tests.sh

# Run specific test suites
cd backend && python -m pytest tests/
cd mobile && npm test
cd dashboard && npm test
```

## 🚀 Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
docker-compose up -d
```

## 📊 Features

- ✅ Digital Tourist ID with blockchain verification
- ✅ Real-time location tracking with geofencing
- ✅ AI-powered anomaly detection
- ✅ Emergency response system with panic button
- ✅ Multi-platform dashboard for authorities
- ✅ IoT device integration
- ✅ Multilingual support

## 🏆 Built for Smart India Hackathon 2025

**Problem Statement**: Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital ID

**Team**: [Team Syntax]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


