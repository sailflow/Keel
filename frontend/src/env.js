import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),
    AUTH_MICROSOFT_ENTRA_ID_ID: z.string().optional(),
    AUTH_MICROSOFT_ENTRA_ID_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default('Keel'),
    NEXT_PUBLIC_ENABLE_AUTH: z
      .string()
      .transform((s) => s === 'true')
      .pipe(z.boolean())
      .default('false'),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_ENABLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_AUTH,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
