# Build stage for frontend
FROM oven/bun:latest AS frontend-builder
WORKDIR /app
COPY frontend/package.json ./frontend/
COPY packages/ ./packages/
# Install dependencies for all workspaces
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY frontend/ ./frontend/
COPY packages/ ./packages/

# Build frontend
WORKDIR /app/frontend
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
ENV SKIP_ENV_VALIDATION=1
RUN bun run build

# Build stage for Go backend
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./backend/

WORKDIR /app/backend
# Build static binary
ENV CGO_ENABLED=1
RUN apk add --no-cache build-base
RUN go build -ldflags="-w -s" -trimpath -o server ./cmd/server

# Final stage - Node.js Alpine for Next.js Standalone + Go Binary
FROM node:20-alpine
WORKDIR /app

# Install dependencies
RUN apk add --no-cache sqlite ca-certificates

# Copy Go binary
COPY --from=backend-builder /app/backend/server /app/server

# Copy Next.js standalone build
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Environment variables
ENV PORT=3000
ENV DATABASE_URL="file:/app/data/keel.db?_foreign_keys=on"

EXPOSE 3000 8080
VOLUME ["/app/data"]

ENTRYPOINT ["/app/start.sh"]
