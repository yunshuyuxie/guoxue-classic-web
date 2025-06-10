import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/guoxue-classic-web/' : '/',
  plugins: [vue(), vueJsx(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  build: {
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 禁用源码映射
    sourcemap: false,
    // 压缩选项
    minify: 'esbuild',
    // 启用依赖预打包
    assetsInlineLimit: 4096,
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 提取Vue相关库为单独的chunk
          vue: ['vue', 'vue-router', 'pinia'],
          // 提取UI库为单独的chunk
          tiny: ['@opentiny/vue'],
        },
        // 设置静态资源目录
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 开启gzip压缩
    reportCompressedSize: false,
    // 限制chunk大小警告的阈值
    chunkSizeWarningLimit: 1000,
  },
  // 预加载选项
  optimizeDeps: {
    // 预加载的依赖
    include: ['vue', 'vue-router', 'pinia', '@opentiny/vue'],
    // 排除不需要预加载的依赖
    exclude: [],
  },
})
