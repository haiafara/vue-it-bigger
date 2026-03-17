import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  root: 'demo',
  base: '/vue-it-bigger/',

  build: {
    outDir: '../gh-pages',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'demo/index.html'),
        advanced: resolve(__dirname, 'demo/advanced.html')
      }
    }
  },

  server: {
    port: 1805
  },

  resolve: {
    alias: {
      'vue-it-bigger': resolve(__dirname, 'src/index.js')
    }
  }
})
