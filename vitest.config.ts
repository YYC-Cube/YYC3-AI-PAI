/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@tauri-apps/plugin-fs': path.resolve(__dirname, 'src/__mocks__/tauri-plugin-fs.ts'),
      '@tauri-apps/plugin-shell': path.resolve(__dirname, 'src/__mocks__/tauri-plugin-shell.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'benchmarks/**/*.test.ts', 'e2e/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'e2e/',
        'benchmarks/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/dist/**',
        'src/app/components/ui/**',
        'src/app/lib/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90,
      },
      all: true,
      clean: true,
    },
  },
})
