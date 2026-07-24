import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    /* Lets the dashboard call /api/... on the dev server and reach the
       Express backend on :4000 — same-origin in the browser, so no CORS
       preflight and the same relative paths work in production. */
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
