import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: '../../backend/api/openapi.yaml',
  output: {
    path: 'src',
  },
  postProcess: ['eslint', 'prettier'],
  plugins: [
    '@tanstack/react-query',
    {
      name: '@hey-api/schemas',
      type: 'json',
    },
    {
      name: '@hey-api/typescript',
      enums: 'javascript',
    },
  ],
});
