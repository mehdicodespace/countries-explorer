import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.REST_COUNTRIES_API_KEY

  return {
    plugins: [vue(), ...(mode === 'development' ? [vueDevTools()] : []), tailwindcss()],
    base: '/',
    build: {
      outDir: 'dist',
      minify: true,
    },
    server: {
      proxy: {
        '/api/countries/v5': {
          target: 'https://api.restcountries.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              if (apiKey) {
                proxyRequest.setHeader('Authorization', `Bearer ${apiKey}`)
              }
            })
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
