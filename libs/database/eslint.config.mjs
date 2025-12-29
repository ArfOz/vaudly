import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['src/prisma/**'],
    rules: {
      // Allow local generated client imports within the same lib
    },
  },
  {
    files: ['**/*.json'],
    rules: {
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    ignores: ['**/out-tsc'],
  },
];
