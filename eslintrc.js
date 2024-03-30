/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked'
  ],
  plugins: [
    '@typescript-eslint',
    'unused-imports'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports below
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error", {
        "argsIgnorePattern": "^_"
      }
    ]
  },
  root: true,
};