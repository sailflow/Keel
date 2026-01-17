module.exports = {
  extends: [require.resolve('@keel/config/eslint')],
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
