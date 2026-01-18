const nextPlugin = require('@next/eslint-plugin-next');

// Patch to remove "name" property incompatible with ESLint 8
const recommended = { ...nextPlugin.configs.recommended };
delete recommended.name;

module.exports = {
  extends: [require.resolve('./index.js')],
  plugins: ['@next/next'],
  rules: {
    ...recommended.rules,
    '@next/next/no-html-link-for-pages': 'error',
  },
};
