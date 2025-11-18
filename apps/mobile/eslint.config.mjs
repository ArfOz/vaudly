import baseConfig from '@repo/eslint-config/react-internal.js';

export default [
  ...baseConfig,
  {
    ignores: ['.expo/**', 'node_modules/**', 'dist/**'],
  },
];
