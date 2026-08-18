#!/bin/bash

# KyrozPlus Local Server Setup Script
# This script sets up the local edge server for KyrozPlus with offline-first capabilities.

set -e

echo "=========================================="
echo "   KYROZ-PLUS LOCAL SERVER SETUP          "
echo "=========================================="

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker and Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "ERROR: Docker Compose is not installed. Please install it."
    exit 1
fi

echo "Pulling latest images (if necessary)..."

# Determine compose command
COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

# Build and start services using local compose file
echo "Building and starting local server stack..."
$COMPOSE_CMD -f docker-compose.local.yml up -d --build

echo ""
echo "=========================================="
echo "   LOCAL SERVER IS RUNNING                "
echo "=========================================="
echo "MongoDB:    localhost:27017"
echo "Backend:    http://localhost:5000"
echo "Frontend:   http://localhost:3000"
echo ""
echo "NOTE: To access the POS from other devices on the same network,"
echo "use the IP address of this computer instead of 'localhost'."
echo "(e.g. http://192.168.1.100:3000)"
echo ""
echo "To view logs: $COMPOSE_CMD -f docker-compose.local.yml logs -f"
echo "To stop:      $COMPOSE_CMD -f docker-compose.local.yml down"
