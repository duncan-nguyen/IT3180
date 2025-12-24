#!/bin/bash

# Ensure script fails on first error
set -e

echo "Starting Database Initialization..."

# Build the init-db image (and pull db if needed)
echo "Building Docker images..."
docker compose build init-db

# Run the initialization
# This will automatically start the 'db' service because of depends_on
echo "Running initialization..."
docker compose run --rm init-db

echo "Database initialization completed successfully!"
