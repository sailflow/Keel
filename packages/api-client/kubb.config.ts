import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  root: '.',
  input: {
    path: '../../backend/api/openapi.yaml',
  },
  output: {
    path: './src/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: 'types.ts' },
      group: { type: 'tag' },
    }),
    pluginReactQuery({
      output: { path: 'hooks.ts' },
      group: { type: 'tag' },
      client: {
        importPath: '../client',
      },
    }),
    pluginZod({
      output: { path: 'zod.ts' },
      group: { type: 'tag' },
    }),
  ],
});
