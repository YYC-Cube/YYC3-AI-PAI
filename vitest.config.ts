/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
    include: ['src/**/*.test.{ts,tsx}', 'benchmarks/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
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
        'src/app/components/ui/**', // Radix UI组件不需要测试
        'src/app/lib/**', // 工具库可选择性测试
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      statements: 90,  // 语句覆盖率目标
      branches: 80,    // 分支覆盖率目标
      functions: 85,   // 函数覆盖率目标
      lines: 90,       // 行覆盖率目标
      all: true,
      clean: true,
    },
  },
})
