/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    require.resolve('./index.js'),
    'plugin:@next/next/recommended',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
  },
};
