#!/bin/bash

echo " Restaurant Recommender Startup Script"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "  .env file not found"
    echo " Creating .env file from env.example..."
    cp env.example .env
    echo " .env file created"
    echo " Please edit .env file and fill in your Google Maps API key"
    echo " For detailed instructions, please refer to README.md"
    echo ""
    echo "Press any key to continue..."
    read -n 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo " Installing dependencies..."
    npm install
    echo " Dependencies installed"
fi

echo " Starting application..."
echo " Application will open at http://localhost:3000"
echo ""

npm start
