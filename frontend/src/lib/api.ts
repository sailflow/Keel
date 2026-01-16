import { createApiClient } from '@keel/api-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = createApiClient({
  baseUrl: apiBaseUrl,
});
