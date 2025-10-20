import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  const base = '/vue3-countries-challenge/'

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    base,
    build: {
      outDir: 'dist',
      minify: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
