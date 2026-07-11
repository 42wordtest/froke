const typescriptParser = require('@typescript-eslint/parser');

const safetyRules = {
  'no-constant-binary-expression': 'error',
  'no-irregular-whitespace': 'error',
  'no-unsafe-finally': 'error',
  'use-isnan': 'error',
  'valid-typeof': 'error',
};

module.exports = [
  {
    ignores: [
      '.expo/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'web-build/**',
      'assets/**',
      'data/governmentSamplingPoints.json',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: safetyRules,
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: safetyRules,
  },
];
