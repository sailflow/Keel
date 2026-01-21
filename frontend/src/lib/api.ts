import { client } from '@keel/api-client';

import { env } from '@/env';

const apiBaseUrl = env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

client.setConfig({
  baseUrl: apiBaseUrl,
});

export { client as api };
