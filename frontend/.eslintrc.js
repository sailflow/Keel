module.exports = {
  extends: [require.resolve('@keel/config/eslint/nextjs')],
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
};
