import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';

export default defineConfig([
  {
    ignores: ['coverage/**', 'dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      jest: jestPlugin,
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
    },
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);
