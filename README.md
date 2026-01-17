# Keel

A starter template for building AI-powered web applications. Clone this repo to skip the boilerplate and start building.

## What's Included

- **Frontend** (`frontend/`) - Next.js 14 + TypeScript + TailwindCSS + Radix UI
- **Backend** (`backend/`) - Go API with Chi router + SQLite
- **Shared UI** (`packages/ui/`) - ~20 reusable React components
- **Type-safe API** (`packages/api-client/`) - Generated from OpenAPI spec

## Prerequisites

- **Bun** 1.0+ ([install](https://bun.sh/))
- **Go** 1.22+ ([install](https://go.dev/dl/))

## Quick Start

```bash
make setup      # Install Bun, air, golangci-lint (one-time)
make install    # Install project dependencies
make dev        # Start frontend (:3000) + backend (:8080)
```

## Structure

```
keel/
├── frontend/         # Next.js app
├── backend/          # Go API
├── packages/
│   ├── ui/           # Shared components
│   ├── config/       # ESLint/TS/Tailwind configs
│   └── api-client/   # Generated API types
└── docs/             # Architecture docs (for AI context)
```

## Commands

```bash
make setup        # Install Bun + Go tools (one-time)
make install      # Install project dependencies
make dev          # Start all
make dev-web      # Frontend only
make dev-api      # Backend only
make build        # Build all
make lint         # Lint all
make generate     # Regenerate API types
```

## Adding Features

1. **New API endpoint**: Add to `backend/api/openapi.yaml`, run `make generate`
2. **New page**: Add to `frontend/src/app/`
3. **New component**: Add to `packages/ui/src/components/`

## Patterns

- All pages use: `AppShell > Page > PageHeader > Section`
- All forms use: `Form` + `Field` + `FormActions` (react-hook-form + zod)
- All lists use: `DataTable` with pagination
- All async UI has: `LoadingState`, `ErrorState`, `EmptyState`

See `docs/` for detailed architecture.
