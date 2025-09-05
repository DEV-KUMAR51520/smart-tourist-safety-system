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
