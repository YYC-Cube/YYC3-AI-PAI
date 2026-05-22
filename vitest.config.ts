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
        'src/app/store/__tests__/**', // 测试文件本身
        '**/mockdata/**', // 模拟数据
        '**/types/**/*.ts', // 纯类型文件
        '**/constants.ts', // 常量文件
        '**/ide-mock-data.ts', // Mock数据文件
      ],
      // 🔧 优化后的覆盖率目标 - 平衡质量与维护成本
      statements: 75,  // 语句覆盖率 75% (行业标准)
      branches: 70,    // 分支覆盖率 70% (降低维护成本)
      functions: 75,   // 函数覆盖率 75% (更现实)
      lines: 75,       // 行覆盖率 75% (一致性)
      all: true,
      clean: true,
    },
  },
})
