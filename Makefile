.PHONY: help setup install dev dev-api dev-web build build-api build-web lint lint-api lint-web fmt typecheck test test-api test-web generate generate-api db-reset docker-api docker-web clean

# Colors
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

.DEFAULT_GOAL := help

# ============================================================================
# HELP
# ============================================================================

help: ## Show available commands
	@echo "$(CYAN)Keel$(RESET) - AI App Template"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-15s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ============================================================================
# SETUP
# ============================================================================

setup: ## Install prerequisites (pnpm, air, golangci-lint)
	@echo "$(CYAN)Installing pnpm...$(RESET)"
	@npm install -g pnpm@9 2>/dev/null || (corepack enable && corepack prepare pnpm@9 --activate)
	@echo "$(CYAN)Installing Go tools...$(RESET)"
	@go install github.com/air-verse/air@latest
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@echo "$(GREEN)Setup complete! Run 'make install' next.$(RESET)"

# ============================================================================
# DEVELOPMENT
# ============================================================================

dev: ## Start frontend + backend
	@$(MAKE) -j2 dev-api dev-web

dev-api: ## Start Go API (hot reload)
	@cd backend && $(HOME)/go/bin/air

dev-web: ## Start Next.js frontend
	@cd frontend && pnpm dev

# ============================================================================
# BUILD
# ============================================================================

install: ## Install all dependencies
	@pnpm install
	@cd backend && go mod download

build: build-api build-web ## Build all

build-api: ## Build Go API
	@cd backend && go build -o bin/server ./cmd/server

build-web: ## Build Next.js
	@pnpm --filter @keel/web build

# ============================================================================
# CODE QUALITY
# ============================================================================

lint: lint-api lint-web ## Lint all

lint-api:
	@cd backend && golangci-lint run ./...

lint-web:
	@pnpm lint

fmt: ## Format all code
	@pnpm format
	@cd backend && go fmt ./...

typecheck: ## TypeScript check
	@pnpm typecheck

# ============================================================================
# TEST
# ============================================================================

test: test-api test-web ## Run all tests

test-api:
	@cd backend && go test -v ./...

test-web:
	@pnpm test

# ============================================================================
# GENERATION
# ============================================================================

generate: generate-api ## Regenerate API types

generate-api: ## Generate TypeScript types from OpenAPI
	@pnpm --filter @keel/api-client generate

# ============================================================================
# DATABASE
# ============================================================================

db-reset: ## Reset SQLite database
	@rm -f backend/data/keel.db
	@echo "Database reset"

# ============================================================================
# DOCKER
# ============================================================================

docker-api: ## Build API Docker image
	@docker build --target api -t keel-api .

docker-web: ## Build Web Docker image
	@docker build --target web -t keel-web .

# ============================================================================
# UTILITIES
# ============================================================================

clean: ## Remove build artifacts
	@rm -rf node_modules .turbo
	@rm -rf frontend/.next frontend/node_modules
	@rm -rf backend/bin backend/tmp
	@rm -rf packages/*/node_modules packages/*/dist
