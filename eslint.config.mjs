import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: ['public/**'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.node, // ✅ Node.js globals like require, module, __dirname
      },
    },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
]);
