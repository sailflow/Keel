# API Contract

OpenAPI-first development. Spec is source of truth.

## Workflow

1. Edit `backend/api/openapi.yaml`
2. Run `bun run generate`
3. Types appear in `packages/api-client/src/schema.d.ts`
4. Use typed client in frontend

## Using the Client

```tsx
import { api } from '@/lib/api';

// GET
const { data, error } = await api.GET('/api/users', {
  params: { query: { page: 1, limit: 10 } },
});

// POST
const { data, error } = await api.POST('/api/users', {
  body: { email: 'user@example.com', name: 'John' },
});

// GET with path param
const { data, error } = await api.GET('/api/users/{id}', {
  params: { path: { id: userId } },
});

// PUT
const { data, error } = await api.PUT('/api/users/{id}', {
  params: { path: { id: userId } },
  body: { name: 'New Name' },
});

// DELETE
const { error } = await api.DELETE('/api/users/{id}', {
  params: { path: { id: userId } },
});
```

## Response Formats

### Success (single item)

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Success (list)

```json
{
  "data": [{ ... }, { ... }],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error

```json
{
  "code": "NOT_FOUND",
  "message": "User not found",
  "details": null,
  "requestId": "uuid"
}
```

## Error Codes

| Code               | HTTP | Meaning            |
| ------------------ | ---- | ------------------ |
| `VALIDATION_ERROR` | 400  | Invalid input      |
| `BAD_REQUEST`      | 400  | Malformed request  |
| `NOT_FOUND`        | 404  | Resource not found |
| `CONFLICT`         | 409  | Duplicate resource |
| `INTERNAL_ERROR`   | 500  | Server error       |

## Adding Endpoints

1. Add path to `backend/api/openapi.yaml`:

```yaml
/api/posts:
  get:
    operationId: listPosts
    responses:
      '200':
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostListResponse'
```

2. Run `bun run generate`

3. Implement handler in `backend/internal/handler/`

4. Use in frontend - fully typed automatically
