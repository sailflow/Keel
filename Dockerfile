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
# Next.js export will output to 'out' directory
RUN bun run build

# Build stage for Go backend
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./backend/
# Copy built frontend assets to the expected location for embedding
# main.go expects "dist", but Next.js "export" outputs to "out"
COPY --from=frontend-builder /app/frontend/out ./backend/cmd/server/dist

WORKDIR /app/backend
# Build static binary
ENV CGO_ENABLED=1
RUN apk add --no-cache build-base
RUN go build -ldflags="-w -s" -trimpath -o server ./cmd/server

# Final stage - distroless
FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache sqlite ca-certificates

# Copy binary
COPY --from=backend-builder /app/backend/server /app/server
# Create data directory for SQLite
RUN mkdir -p /app/data

# Environment variables
ENV PORT=8080
ENV DATABASE_URL="file:/app/data/keel.db?_foreign_keys=on"

EXPOSE 8080
VOLUME ["/app/data"]

ENTRYPOINT ["/app/server"]
