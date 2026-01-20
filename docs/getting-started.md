# Getting Started with Keel

This template is designed for **AI-assisted development**. Give your AI a single prompt describing your app, and it will replace the example code with your implementation.

## Quick Start

```bash
# 1. Clone and install
git clone <repo> my-app && cd my-app
bun install

# 2. Configure app name and auth
bun run configure

# 3. Clean example code (removes Users/Items boilerplate)
bun run clean-examples

# 4. Give your AI a prompt like:
#    "Build a task management app with projects and todos"
```

## What Gets Replaced

The template includes **working example code** that demonstrates patterns. When building a new app, these will be replaced:

| Example Code        | Location                                   | Replaced With  |
| ------------------- | ------------------------------------------ | -------------- |
| Users CRUD          | `backend/internal/service/user_service.go` | YOUR entities  |
| Items CRUD          | `backend/internal/service/item_service.go` | YOUR entities  |
| User handlers       | `backend/internal/handler/user_handler.go` | YOUR handlers  |
| Item handlers       | `backend/internal/handler/item_handler.go` | YOUR handlers  |
| Users page          | `frontend/src/app/users/`                  | YOUR pages     |
| User/Item endpoints | `backend/api/openapi.yaml`                 | YOUR endpoints |
| Migrations          | `backend/migrations/*.sql`                 | YOUR schema    |
| SQL queries         | `backend/query/*.sql`                      | YOUR queries   |

## The Keel Development Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        1. OpenAPI Spec                          │
│                   backend/api/openapi.yaml                      │
│              (Define endpoints FIRST - single source of truth)  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────┐     ┌───────────────────────────────┐
│     2. Backend (Go)       │     │   5. Frontend (TypeScript)    │
├───────────────────────────┤     ├───────────────────────────────┤
│ a) Write migrations       │     │ bun run generate:api          │
│    backend/migrations/    │     │ (generates React Query hooks) │
│                           │     │                               │
│ b) Write SQL queries      │     │ Import from @keel/api-client: │
│    backend/query/*.sql    │     │ - useGet[Entity]              │
│                           │     │ - useList[Entities]           │
│ c) Generate store code    │     │ - useCreate[Entity]           │
│    sqlc generate          │     │ - useUpdate[Entity]           │
│                           │     │ - useDelete[Entity]           │
│ d) Create service layer   │     │                               │
│    internal/service/      │     │ Use @keel/ui components       │
│                           │     │ for consistent styling        │
│ e) Create handlers        │     │                               │
│    internal/handler/      │     │                               │
│                           │     │                               │
│ f) Wire in main.go        │     │                               │
└───────────────────────────┘     └───────────────────────────────┘
```

## File Naming Conventions

| Type      | Go File                   | Description                     |
| --------- | ------------------------- | ------------------------------- |
| Service   | `{entity}_service.go`     | Business logic, validation      |
| Handler   | `{entity}_handler.go`     | HTTP handlers, request/response |
| SQL       | `{entity}.sql`            | sqlc queries                    |
| Migration | `{NNN}_{description}.sql` | Schema changes                  |

## Key Commands

```bash
# Development
bun run dev              # Start frontend + backend

# Code Generation
bun run generate:api     # Regenerate TypeScript client from OpenAPI
cd backend && sqlc generate  # Regenerate Go store from SQL

# Testing
bun run typecheck        # TypeScript type checking
bun run lint             # Lint all packages
cd backend && go test ./...  # Go tests

# Build
bun run build            # Production build
```

## Common Patterns

### Adding a New Entity (Backend)

```go
// 1. Migration: backend/migrations/001_{entity}.sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

// 2. Query: backend/query/tasks.sql
-- name: CreateTask :one
INSERT INTO tasks (id, title) VALUES (?, ?) RETURNING *;

-- name: ListTasks :many
SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?;

// 3. Service: backend/internal/service/task_service.go
type TaskService struct {
    queries *store.Queries
    db      *sql.DB
}

// 4. Handler: backend/internal/handler/task_handler.go
func (h *TaskHandler) RegisterRoutes(r chi.Router) {
    r.Get("/tasks", h.List)
    r.Post("/tasks", h.Create)
}
```

### Using Generated Hooks (Frontend)

```tsx
'use client';

import { useListTasks, useCreateTask } from '@keel/api-client';
import { Button, Card } from '@keel/ui';

export default function TasksPage() {
  const { data, isLoading } = useListTasks({ page: 1, limit: 10 });
  const createMutation = useCreateTask();

  // ... render
}
```

### SSR-Safe Pages with React Query

For pages using React Query hooks, wrap with dynamic import:

```tsx
// page.tsx (wrapper)
'use client';

import dynamic from 'next/dynamic';

const TasksClient = dynamic(() => import('./tasks-client'), {
  ssr: false,
});

export default function TasksPage() {
  return <TasksClient />;
}
```

## Development Tips

1. **OpenAPI First** - Always update `openapi.yaml` before writing code
2. **Run Generation** - After changing SQL or OpenAPI, regenerate
3. **Commit Often** - Commit after each feature is working
4. **Check Types** - Run `bun run typecheck` frequently
