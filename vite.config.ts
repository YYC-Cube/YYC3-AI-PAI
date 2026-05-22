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
    // 🔧 调整chunk大小警告阈值 - 从600KB降到300KB以获得更好的分割
    chunkSizeWarningLimit: 300,

    // 代码分割策略 - 优化后避免循环依赖
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // 🔧 更细粒度和优化的代码分割
          if (id.includes('node_modules')) {
            // React核心库 - 🔧 修复循环依赖问题
            if (id.includes('react') || id.includes('react-dom') || id.includes('react/')) {
              return 'react-vendor' // 🔧 合并所有React相关到一个包，避免循环依赖
            }

            // UI组件库 - 分离不同的UI库
            if (id.includes('@radix-ui')) return 'ui-radix'
            if (id.includes('@mui')) return 'ui-mui'
            if (id.includes('lucide-react')) return 'ui-icons'

            // 样式和动画库
            if (id.includes('@emotion')) return 'styles-emotion'
            if (id.includes('motion') || id.includes('framer-motion')) return 'animation-motion'

            // 编辑器相关 - 通常很大，需要单独分离
            if (id.includes('monaco-editor') || id.includes('@monaco-editor')) return 'editor-monaco'

            // 数据处理和协作
            if (id.includes('yjs') || id.includes('y-indexeddb') || id.includes('y-webrtc') || id.includes('y-websocket')) {
              return 'data-collab'
            }

            // 状态管理
            if (id.includes('zustand') || id.includes('immer')) return 'state-management'

            // 工具库
            if (id.includes('date-fns')) return 'utils-date'
            if (id.includes('recharts')) return 'viz-charts'

            // AI和Transformers相关 - 大型依赖
            if (id.includes('@huggingface') || id.includes('@xenova') || id.includes('transformers')) {
              return 'ai-transformers'
            }

            // 其他大型依赖
            if (id.includes('react-router')) return 'routing'
            if (id.includes('react-dnd')) return 'dnd-system'
          }
        },
      },
    },

    // 🔧 优化配置 - 使用esbuild以提高构建速度
    minify: 'esbuild',
    sourcemap: false,          // 🔧 生产环境关闭sourcemap

    // 如果需要使用terser获得更激进的压缩，可以切换配置：
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: true,    // 🔧 生产环境移除console
    //     drop_debugger: true,   // 🔧 移除debugger语句
    //     pure_funcs: [          // 🔧 移除特定函数调用
    //       'console.log',
    //       'console.info',
    //       'console.debug',
    //       'console.warn',
    //     ],
    //     dead_code: true,
    //     unused: true,
    //   },
    //   format: {
    //     comments: false,       // 🔧 移除注释
    //   },
    // },
  },
})
