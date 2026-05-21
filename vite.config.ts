import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // 调整chunk大小警告阈值
    chunkSizeWarningLimit: 600,

    // 代码分割策略 - 使用Vite默认分割避免循环依赖
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react'
            if (id.includes('recharts')) return 'vendor-recharts'
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) return 'vendor-monaco'
            if (id.includes('yjs') || id.includes('y-indexeddb') || id.includes('y-webrtc') || id.includes('y-websocket')) return 'vendor-yjs'
            if (id.includes('motion')) return 'vendor-motion'
            if (id.includes('@radix-ui')) return 'vendor-ui'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('zustand') || id.includes('immer')) return 'vendor-state'
          }
        },
      },
    },

    // 优化配置
    minify: 'esbuild',
  },
})
