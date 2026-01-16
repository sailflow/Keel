import type { components } from './schema';

// Re-export commonly used types for convenience
export type User = components['schemas']['User'];
export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
export type Pagination = components['schemas']['Pagination'];
export type UserListResponse = components['schemas']['UserListResponse'];
export type APIError = components['schemas']['APIError'];
