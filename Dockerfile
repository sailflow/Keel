# Multi-target Dockerfile
# Build: docker build --target api -t keel-api .
# Build: docker build --target web -t keel-web .

# =============================================================================
# API (Go)
# =============================================================================
FROM golang:1.22-alpine AS api-builder
WORKDIR /app
RUN apk add --no-cache gcc musl-dev
COPY backend/go.mod backend/go.sum* ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=1 GOOS=linux go build -o server ./cmd/server

FROM alpine:3.19 AS api
WORKDIR /app
RUN apk add --no-cache ca-certificates sqlite
RUN mkdir -p /app/data
COPY --from=api-builder /app/server /app/server
EXPOSE 8080
CMD ["/app/server"]

# =============================================================================
# WEB (Next.js)
# =============================================================================
FROM node:20-alpine AS web-base
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM web-base AS web-deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-client/package.json ./packages/api-client/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

FROM web-base AS web-builder
WORKDIR /app
COPY --from=web-deps /app/node_modules ./node_modules
COPY --from=web-deps /app/packages/config/node_modules ./packages/config/node_modules
COPY --from=web-deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=web-deps /app/packages/api-client/node_modules ./packages/api-client/node_modules
COPY --from=web-deps /app/frontend/node_modules ./frontend/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @keel/web build

FROM web-base AS web
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=web-builder /app/frontend/public ./frontend/public
COPY --from=web-builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=web-builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
CMD ["node", "frontend/server.js"]
