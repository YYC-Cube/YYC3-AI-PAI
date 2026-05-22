/**
 * @file eslint.config.mjs
 * @description YYC3 AI Code ESLint flat config (v10+)
 * @version 4.8.1
 */
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Global ignores
  { ignores: ['dist/', 'node_modules/', '*.config.*', 'coverage/', 'playwright-report/'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React Hooks
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // React Refresh (Vite HMR)
  {
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Project-specific overrides - 🔧 加强代码质量规则
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // 🔧 TypeScript严格性 - 逐步启用
      '@typescript-eslint/no-explicit-any': 'warn', // 从off改为warn，鼓励明确类型
      '@typescript-eslint/no-unused-vars': ['warn', { // 改为warn并提供配置
        argsIgnorePattern: '^_', // 允许使用_开头的未使用参数
        varsIgnorePattern: '^_', // 允许使用_开头的未使用变量
        ignoreRestSiblings: true, // 允许解构中的剩余参数
      }],
      '@typescript-eslint/no-empty-function': 'warn', // 从off改为warn
      '@typescript-eslint/ban-ts-comment': 'warn', // 从off改为warn，但仍允许特殊情况
      '@typescript-eslint/no-non-null-assertion': 'warn', // 新增：警告非空断言
      '@typescript-eslint/strict-boolean-expressions': 'off', // 保持关闭，避免过于严格

      // 🔧 代码质量
      'no-console': ['warn', { allow: ['warn', 'error'] }], // 保持现有
      'prefer-const': 'error', // 从warn改为error
      'no-var': 'error', // 新增：禁止使用var
      'eqeqeq': ['error', 'always'], // 新增：强制使用===和!==
      'no-duplicate-imports': 'error', // 新增：禁止重复导入

      // 🔧 React Hooks规则 - 逐步启用更严格的检查
      'react-hooks/preserve-manual-memoization': 'warn', // 从off改为warn
      'react-hooks/set-state-in-effect': 'warn', // 从off改为warn
      'react-hooks/purity': 'warn', // 从off改为warn
      'react-hooks/refs': 'warn', // 从off改为warn
      'react-hooks/immutability': 'warn', // 从off改为warn

      // 🔧 其他React规则
      'react/prop-types': 'off', // TypeScript项目中不需要
      'react/react-in-jsx-scope': 'off', // React 17+不需要
      '@typescript-eslint/no-namespace': 'off', // 保持关闭
    },
  },

  // Test file overrides - 🔧 测试文件允许更灵活的规则
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**', 'e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 测试中允许any
      'no-console': 'off', // 测试中允许console
      '@typescript-eslint/no-empty-function': 'off', // 测试中允许空函数
      'react-hooks/rules-of-hooks': 'off', // 测试中允许hooks规则违规
    },
  },

  // Prettier compat (must be last)
  prettier
);
