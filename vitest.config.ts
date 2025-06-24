import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['apps/web/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'tests/e2e/**', 
      'node_modules/**',
      '**/node_modules/**',
      'apps/web/node_modules/**',
      'apps/web/__tests__/**', // Exclude old Jest tests
      '**/*.{config,setup}.{js,ts}',
      '**/dist/**'
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/web'),
      '@church-admin/ui': resolve(__dirname, './packages/ui/src'),
    },
  },
});