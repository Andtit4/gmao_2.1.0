import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Energy Eye',
        short_name: 'EnergyEye',
        theme_color: '#4DBA87',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'public/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'public/favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext' // or "es2019",
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
