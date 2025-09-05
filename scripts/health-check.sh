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
