#!/bin/sh

# Start the Go backend in the background
/app/server &
BACKEND_PID=$!

# Wait for backend to be ready (optional, but good practice)
sleep 2

# Start the Next.js standalone server
# We bind to 0.0.0.0 to be accessible outside the container
# PORT defaults to 3000 for Next.js
export PORT=3000
export HOSTNAME="0.0.0.0"
node /app/frontend/server.js &
FRONTEND_PID=$!

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
