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

1.  **Install dependencies & tools:**

    ```bash
    bun install
    bun run setup
    ```

2.  **Start development server:**

    ```bash
    bun run dev
    ```

    This kicks off:
    - **Frontend:** `http://localhost:3000`
    - **Backend:** `http://localhost:8080` (with hot reload enabled)

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
bun run setup       # Install Go tools (one-time)
bun run dev         # Start all (frontend + backend)
bun run dev:web     # Frontend only
bun run dev:api     # Backend only
bun run build       # Build all
bun run lint        # Lint all
bun run test        # Run tests
bun run clean       # Clean up
bun run generate    # Regenerate API client
```

## Adding Features

1. **New API endpoint**: Add to `backend/api/openapi.yaml`, run `bun run generate`
2. **New page**: Add to `frontend/src/app/`
3. **New component**: Add to `packages/ui/src/components/`

## Patterns

- All pages use: `AppShell > Page > PageHeader > Section`
- All forms use: `Form` + `Field` + `FormActions` (react-hook-form + zod)
- All lists use: `DataTable` with pagination
- All async UI has: `LoadingState`, `ErrorState`, `EmptyState`

See `docs/` for detailed architecture.
