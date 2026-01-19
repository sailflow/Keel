.PHONY: dev build test lint format clean gen-resource

# Development
dev:
	bun run dev

dev-api:
	cd backend && ~/go/bin/air

dev-web:
	bun run dev:web

# Scaffold
gen-resource:
	@if [ -z "$(name)" ]; then echo "Error: name is required. Usage: make gen-resource name=season"; exit 1; fi
	cd backend && go run cmd/scaffold/main.go -name $(name)

gen-sql:
	cd backend && ~/go/bin/sqlc generate

# Building
build:
	bun run build

build-api:
	cd backend && go build -o bin/server ./cmd/server

# Testing
test:
	bun run test

test-api:
	cd backend && go test -v ./...

# Linting & Formatting
lint:
	bun run lint

format:
	bun run format

clean:
	bun run clean
