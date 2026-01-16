import createClient from 'openapi-fetch';

import type { paths } from './schema';

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export function createApiClient(config: ApiClientConfig) {
  return createClient<paths>({
    baseUrl: config.baseUrl,
    headers: config.headers,
  });
}

export type ApiClient = ReturnType<typeof createApiClient>;
