#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}        🚀 Trailshield Build 🚀        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

step=1
total=4

echo -e "${YELLOW}Step $step/$total: Installing dependencies for api-gateway...${NC}"
cd api-gateway && npm install --silent && cd ..
echo -e "${GREEN}✓ api-gateway done${NC}\n"
((step++))

echo -e "${YELLOW}Step $step/$total: Installing dependencies for blockchain microservice...${NC}"
cd microservices/blockchain && npm install --silent && cd ../..
echo -e "${GREEN}✓ blockchain done${NC}\n"
((step++))

echo -e "${YELLOW}Step $step/$total: Installing dependencies for dashboard frontend...${NC}"
cd frontend/dashboard && npm install --silent && cd ../..
echo -e "${GREEN}✓ dashboard done${NC}\n"
((step++))

echo -e "${YELLOW}Step $step/$total: Installing dependencies for landing frontend...${NC}"
cd frontend/landing && npm install --silent && cd ../..
echo -e "${GREEN}✓ landing done${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   ✅ Trailshield build completed! ✅   ${NC}"
echo -e "${BLUE}========================================${NC}"
