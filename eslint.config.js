import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        fetch: 'readonly'
      }
    },
    plugins: {
      react
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'windows'],  // Changed to 'windows' to allow CRLF
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': 'off'  // Temporarily disable to avoid false positives with JSX
    }
  }
];