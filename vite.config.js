import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueItBigger',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'vue-it-bigger.mjs'
        if (format === 'cjs') return 'vue-it-bigger.cjs'
      }
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-it-bigger.css'
          return assetInfo.name
        }
      }
    }
  },

  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/index.js']
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/components')
    }
  }
})
