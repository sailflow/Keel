import type { components } from './schema';

// Export all schemas automatically
export type Schemas = components['schemas'];

// Helper to extract a specific schema type if needed
export type Schema<T extends keyof Schemas> = Schemas[T];

// Re-export commonly used types for convenience (optional, but good for backward compat if any)
export type User = Schema<'User'>;
export type CreateUserRequest = Schema<'CreateUserRequest'>;
export type UpdateUserRequest = Schema<'UpdateUserRequest'>;
export type Pagination = Schema<'Pagination'>;
export type UserListResponse = Schema<'UserListResponse'>;
export type APIError = Schema<'APIError'>;

// You can also just use Schemas['Name'] in your code if you prefer.
