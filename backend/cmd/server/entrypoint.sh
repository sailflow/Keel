#!/bin/sh
set -e

# Default APP_NAME if not set
export APP_NAME=${APP_NAME:-Keel}

# Default DATABASE_URL if not set, using APP_NAME
# Note: We lowercase APP_NAME for the filename to match convention
APP_NAME_LOWER=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]')
export DATABASE_URL=${DATABASE_URL:-"file:/app/data/${APP_NAME_LOWER}.db?_foreign_keys=on"}

# Execute the main container command
exec "$@"
