import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Always use the repository name as base path for GitHub Pages
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
