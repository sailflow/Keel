import { createApiClient } from '@keel/api-client';

import { env } from '@/env';

const apiBaseUrl = env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = createApiClient({
  baseUrl: apiBaseUrl,
});
