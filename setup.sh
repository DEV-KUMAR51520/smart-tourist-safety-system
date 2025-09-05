#!/bin/bash

# Smart Tourist Safety System - Quick Setup Script
# This script sets up the complete project structure and installs dependencies

set -e  # Exit on any error

echo "🚀 Setting up Smart Tourist Safety System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.9+ from https://python.org/"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker from https://docker.com/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose"
        exit 1
    fi
    
    print_success "All required tools are installed"
}

# Create project directory structure
create_directory_structure() {
    print_status "Creating project directory structure..."
    
    # Main directories
    mkdir -p {docs/{api,architecture,deployment,user-guides},config,scripts}
    
    # Backend structure
    mkdir -p backend/{app/{models,routes,services,utils,tasks},migrations,tests}
    
    # Mobile app structure  
    mkdir -p mobile/src/{components/{common,forms,maps},screens/{auth,dashboard,emergency,maps,profile},navigation,services/{api,location,notifications},contexts,hooks,utils,types}
    mkdir -p mobile/{android,ios,__tests__/{components,screens,services}}
    
    # Dashboard structure
    mkdir -p dashboard/src/{components,pages,services,store/slices,utils,types,hooks}
    mkdir -p dashboard/public
    
    # AI service structure
    mkdir -p ai-service/{api,training,inference,data/{synthetic,processed,raw},tests,models}
    
    # Blockchain structure
    mkdir -p blockchain/{contracts,scripts,tests,build}
    
    # IoT simulation structure
    mkdir -p iot-simulation/{simulators,data-processing,tests}
    
    # Infrastructure structure
    mkdir -p infrastructure/{docker,nginx/{ssl,sites-available},k8s,monitoring/{grafana/dashboards},scripts}
    
    # Testing structure
    mkdir -p tests/{integration,performance,security,e2e}
    
    # Demo structure
    mkdir -p demo/{data,presentation/{slides,videos,screenshots/{mobile,dashboard,blockchain}},scenarios,setup}
    
    print_success "Directory structure created"
}

# Create essential configuration files
create_config_files() {
    print_status "Creating configuration files..."
    
    # Create .env.example
    cat > .env.example << 'EOF'
# Database Configuration
DB_PASSWORD=your_secure_db_password
REDIS_PASSWORD=your_secure_redis_password

# JWT & Security
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
ENCRYPTION_KEY=your_encryption_key_here

# Blockchain Configuration
BLOCKCHAIN_MNEMONIC="your twelve word mnemonic phrase goes here for demo"
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com/
DEPLOYER_PRIVATE_KEY=your_private_key_here_for_demo_only

# External Services
RABBITMQ_PASSWORD=your_rabbitmq_password
GRAFANA_PASSWORD=your_grafana_password

# API Keys (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WEATHER_API_KEY=your_weather_api_key
SMS_API_KEY=your_sms_service_api_key

# Production Settings
PRODUCTION_DOMAIN=localhost
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
FLASK_ENV=development
EOF

    # Copy to actual .env file
    cp .env.example .env
    
    # Create .gitignore
    cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.production
.env.staging

# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
pip-log.txt
pip-delete-this-directory.txt
.venv/
venv/

# Database
*.db
*.sqlite
*.sqlite3

# Logs
*.log
logs/

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build outputs
build/
dist/
*.egg-info/

# Mobile
mobile/android/app/build/
mobile/ios/build/
mobile/ios/Pods/

# Blockchain
blockchain/build/
*.secret

# AI Models (if large)
*.pkl
*.h5
*.model

# Docker
.dockerignore

# Temporary files
*.tmp
*.temp
.cache/

# Testing
.coverage
htmlcov/
.pytest_cache/
.nyc_output
coverage/

# Production secrets
ssl/
certificates/
secrets/
EOF

    # Create main README.md
    cat > README.md << 'EOF'
# Smart Tourist Safety Monitoring & Incident Response System

A comprehensive digital ecosystem that leverages AI, Blockchain, and IoT technologies to ensure tourist safety in remote and high-risk areas.

## 🚀 Quick Start

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

### Access Points
- **Mobile App**: Run on device/emulator via React Native
- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **AI Service**: http://localhost:5001

## 📋 System Components

1. **Mobile App** (React Native) - Tourist safety interface
2. **Web Dashboard** (React.js) - Emergency response center  
3. **Backend API** (Flask) - Core business logic
4. **AI Service** (TensorFlow) - Anomaly detection & risk assessment
5. **Blockchain** (Polygon) - Digital identity & immutable records
6. **IoT Simulation** - Smart device integration

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

- [System Architecture](docs/architecture/system-overview.md)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment/)
- [User Guides](docs/user-guides/)

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

**Team**: [Your Team Name]
**Institution**: [Your Institution]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

For technical support or questions:
- Email: [your-email@example.com]
- GitHub Issues: [Create an issue]

---

⭐ **Star this repository if you find it helpful!**
EOF

    print_success "Configuration files created"
}

# Create package.json files
create_package_files() {
    print_status "Creating package.json files..."
    
    # Mobile package.json
    cat > mobile/package.json << 'EOF'
{
  "name": "SmartTouristSafety",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "dependencies": {
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@react-navigation/stack": "^6.3.17",
    "react": "18.2.0",
    "react-native": "0.72.4",
    "react-native-screens": "^3.22.1",
    "react-native-safe-area-context": "^4.7.1",
    "react-native-maps": "^1.7.1",
    "react-native-geolocation-service": "^5.3.1",
    "@react-native-async-storage/async-storage": "^1.19.1",
    "react-native-keychain": "^8.1.2",
    "@react-native-firebase/app": "^18.3.0",
    "@react-native-firebase/messaging": "^18.3.0",
    "axios": "^1.5.0",
    "react-native-vector-icons": "^10.0.0",
    "react-native-background-job": "^2.3.4",
    "react-native-push-notification": "^8.1.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native/eslint-config": "^0.72.2",
    "@react-native/metro-config": "^0.72.9",
    "@tsconfig/react-native": "^3.0.0",
    "@types/react": "^18.0.24",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.2.1",
    "eslint": "^8.19.0",
    "jest": "^29.2.1",
    "metro-react-native-babel-preset": "0.76.7",
    "prettier": "^2.4.1",
    "react-test-renderer": "18.2.0",
    "typescript": "4.8.4"
  },
  "jest": {
    "preset": "react-native"
  }
}
EOF

    # Dashboard package.json
    cat > dashboard/package.json << 'EOF'
{
  "name": "smart-tourist-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@mui/material": "^5.14.5",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.3",
    "@mui/x-date-pickers": "^6.10.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "axios": "^1.5.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "recharts": "^2.8.0",
    "socket.io-client": "^4.7.2",
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.2",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    "react-hot-toast": "^2.4.1",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@types/node": "^16.18.39",
    "@types/react": "^18.2.17",
    "@types/react-dom": "^18.2.7",
    "@types/leaflet": "^1.9.3",
    "@types/lodash": "^4.14.195",
    "@typescript-eslint/eslint-plugin": "^6.2.1",
    "@typescript-eslint/parser": "^6.2.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000"
}
EOF

    print_success "Package files created"
}

# Create requirements.txt files
create_requirements_files() {
    print_status "Creating Python requirements files..."
    
    # Backend requirements
    cat > backend/requirements.txt << 'EOF'
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-JWT-Extended==4.5.2
Flask-CORS==4.0.0
Flask-SocketIO==5.3.5
psycopg2-binary==2.9.7
redis==4.6.0
celery==5.3.1
python-dotenv==1.0.0
bcrypt==4.0.1
requests==2.31.0
web3==6.9.0
geopy==2.3.0
python-dateutil==2.8.2
marshmallow==3.20.1
pytest==7.4.0
pytest-flask==1.2.0
gunicorn==21.2.0
Werkzeug==2.3.7
cryptography==41.0.3
validators==0.22.0
EOF

    # AI service requirements
    cat > ai-service/requirements.txt << 'EOF'
Flask==2.3.3
Flask-CORS==4.0.0
tensorflow==2.13.0
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
joblib==1.3.1
redis==4.6.0
requests==2.31.0
python-dotenv==1.0.0
geopy==2.3.0
fasttext==0.9.2
folium==0.14.0
plotly==5.15.0
celery==5.3.1
python-decouple==3.8
pickle-mixin==1.0.2
pytest==7.4.0
gunicorn==21.2.0
matplotlib==3.7.2
seaborn==0.12.2
scipy==1.11.1
xgboost==1.7.6
lightgbm==4.0.0
EOF

    # IoT simulation requirements  
    cat > iot-simulation/requirements.txt << 'EOF'
asyncio==3.4.3
requests==2.31.0
websockets==11.0.3
numpy==1.24.3
pandas==2.0.3
python-dotenv==1.0.0
redis==4.6.0
geopy==2.3.0
schedule==1.2.0
psutil==5.9.5
threading==0.1.0
json==2.0.9
random==1.0.1
datetime==5.2
logging==0.4.9.6
time==0.1.0
EOF

    # Blockchain requirements
    cat > blockchain/requirements.txt << 'EOF'
web3==6.9.0
brownie-eth==1.20.0
py-solc-x==1.12.0
eth-brownie==1.20.0
pytest==7.4.0
python-dotenv==1.0.0
requests==2.31.0
cryptography==41.0.3
eth-account==0.9.0
eth-utils==2.2.0
hexbytes==0.3.1
eth-abi==4.2.1
EOF

    print_success "Requirements files created"
}

# Create Docker files
create_docker_files() {
    print_status "Creating Docker configuration..."
    
    # Main docker-compose.yml
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Database Services
  postgres:
    image: postgres:15
    container_name: tourist_safety_db
    environment:
      POSTGRES_DB: tourist_safety
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - tourist_safety_network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: tourist_safety_redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - tourist_safety_network
    restart: unless-stopped

  # Backend Services
  flask_backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tourist_safety_backend
    environment:
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/tourist_safety
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
      - JWT_SECRET_KEY=${JWT_SECRET}
      - FLASK_ENV=development
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
    networks:
      - tourist_safety_network
    restart: unless-stopped

  ai_service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    container_name: tourist_safety_ai
    environment:
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/1
      - MODEL_PATH=/app/models
    ports:
      - "5001:5001"
    depends_on:
      - redis
    volumes:
      - ./ai-service:/app
      - ai_models:/app/models
    networks:
      - tourist_safety_network
    restart: unless-stopped

  # Frontend Services
  react_dashboard:
    build:
      context: ./dashboard
      dockerfile: Dockerfile
    container_name: tourist_safety_dashboard
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
      - REACT_APP_AI_URL=http://localhost:5001
    ports:
      - "3000:3000"
    depends_on:
      - flask_backend
    networks:
      - tourist_safety_network
    restart: unless-stopped

networks:
  tourist_safety_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  ai_models:
EOF

    # Development docker-compose
    cat > docker-compose.dev.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: tourist_safety_dev
      POSTGRES_USER: admin  
      POSTGRES_PASSWORD: devpassword123
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass devpassword123
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data

volumes:
  postgres_dev_data:
  redis_dev_data:
EOF

    print_success "Docker files created"
}

# Create essential scripts
create_scripts() {
    print_status "Creating utility scripts..."
    
    # Development runner
    cat > scripts/run-development.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Smart Tourist Safety System - Development Mode"

# Start databases
echo "📊 Starting databases..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Wait for databases
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Start backend
echo "🖥️ Starting backend service..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_ENV=development
export DATABASE_URL=postgresql://admin:devpassword123@localhost:5432/tourist_safety_dev
export REDIS_URL=redis://:devpassword123@localhost:6379/0
flask run &
BACKEND_PID=$!
cd ..

# Start AI service  
echo "🤖 Starting AI service..."
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &
AI_PID=$!
cd ..

# Start dashboard
echo "📱 Starting dashboard..."
cd dashboard
npm install
npm start &
DASHBOARD_PID=$!
cd ..

echo "✅ All services started!"
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000/api"
echo "🤖 AI Service: http://localhost:5001"
echo ""
echo "📱 To start mobile app:"
echo "   cd mobile && npm install && npx react-native run-android"
echo ""
echo "🛑 To stop all services: ./scripts/stop-development.sh"

# Create stop script
cat > scripts/stop-development.sh << 'STOP_EOF'
#!/bin/bash
echo "🛑 Stopping all services..."
kill $BACKEND_PID $AI_PID $DASHBOARD_PID 2>/dev/null
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped"
STOP_EOF

chmod +x scripts/stop-development.sh
EOF

    chmod +x scripts/run-development.sh

    # Production runner
    cat > scripts/run-production.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Smart Tourist Safety System - Production Mode"

# Build and start all services
docker-compose up --build -d

echo "✅ Production environment started!"
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000/api"
echo "🤖 AI Service: http://localhost:5001"
echo ""
echo "📊 Monitor with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
EOF

    chmod +x scripts/run-production.sh

    # Health check script
    cat > scripts/health-check.sh << 'EOF'
#!/bin/bash

echo "🔍 Performing system health check..."

# Check backend
echo -n "Backend API: "
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

# Check AI service
echo -n "AI Service: "
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"  
fi

# Check dashboard
echo -n "Dashboard: "
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

# Check databases
echo -n "PostgreSQL: "
if docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not running"
fi

echo -n "Redis: "
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not running"
fi

echo "🏁 Health check complete"
EOF

    chmod +x scripts/health-check.sh

    print_success "Utility scripts created"
}

# Main execution
main() {
    echo "🎯 Smart Tourist Safety System - Automated Setup"
    echo "================================================"
    
    check_requirements
    create_directory_structure
    create_config_files
    create_package_files
    create_requirements_files
    create_docker_files
    create_scripts
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    print_success "Project structure created successfully"
    print_success "Configuration files generated"
    print_success "Package files and dependencies configured"
    print_success "Docker environment ready"
    print_success "Utility scripts created"
    
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Review and update .env file with your settings"
    echo "2. Start development: ./scripts/run-development.sh"
    echo "3. Check system health: ./scripts/health-check.sh"
    echo "4. Begin implementing code from the 8-day guide"
    echo ""
    echo "📚 Key Files to Implement:"
    echo "- backend/app/models/tourist.py (Day 3)"
    echo "- mobile/src/screens/emergency/EmergencyScreen.tsx (Day 4)"  
    echo "- ai-service/training/anomaly_detection.py (Day 5)"
    echo "- dashboard/src/components/TouristMonitoringDashboard.tsx (Day 6)"
    echo ""
    echo "📖 Full implementation guide available in provided code files"
    echo "🏆 Ready for Smart India Hackathon development!"
}

# Run main function
main