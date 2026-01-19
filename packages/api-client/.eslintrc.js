module.exports = {
  extends: [require.resolve('@keel/config/eslint')],
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['src/gen/**/*'],
  overrides: [
    {
      files: ['src/gen/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
  ],
};
