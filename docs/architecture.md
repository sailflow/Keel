# Architecture

## Overview

```
Browser → Next.js (frontend/) → Go API (backend/) → SQLite
```

## Directory Structure

```
keel/
├── frontend/              # Next.js 14 (App Router)
│   └── src/app/           # Pages and layouts
├── backend/               # Go API
│   ├── api/openapi.yaml   # API contract (source of truth)
│   ├── cmd/server/        # Entry point
│   └── internal/          # Handlers, services, repos
├── packages/
│   ├── ui/                # Shared React components
│   ├── config/            # ESLint, TS, Tailwind presets
│   └── api-client/        # Generated TypeScript types
```

## Frontend

**Tech**: Next.js 14, TypeScript, TailwindCSS, Radix UI

**Page structure** (required pattern):

```tsx
<AppShell>
  <Page>
    <Breadcrumb />
    <PageHeader title="..." actions={...} />
    <Section>
      {/* Content */}
    </Section>
  </Page>
</AppShell>
```

**Data fetching**: Use `api` client from `@/lib/api`

```tsx
const { data, error } = await api.GET('/api/users');
```

## Backend

**Tech**: Go 1.22, Chi router, SQLite

**Layer structure**:

```
Handler (HTTP) → Service (business logic) → Repository (data)
```

**Standard error response**:

```json
{
  "code": "NOT_FOUND",
  "message": "User not found",
  "requestId": "uuid"
}
```

**Standard pagination**:

```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

## API Contract

- Defined in `backend/api/openapi.yaml`
- TypeScript types generated to `packages/api-client/src/schema.d.ts`
- Run `bun run generate` after changing the spec

## Key Files

| Purpose       | Location                            |
| ------------- | ----------------------------------- |
| API spec      | `backend/api/openapi.yaml`          |
| API client    | `packages/api-client/src/client.ts` |
| UI components | `packages/ui/src/components/`       |
| Root layout   | `frontend/src/app/layout.tsx`       |
| API entry     | `backend/cmd/server/main.go`        |
