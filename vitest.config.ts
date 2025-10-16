import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    exclude: ['node_modules', '.next']
  }
});
