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
    /* Build artifacts and large reports aren't source. On Windows they can be
       locked by the OS (a zip mid-write, a report open elsewhere), which makes
       the native file watcher throw EBUSY and crash the dev server. Skip them. */
    watch: {
      ignored: [
        '**/dist/**',
        '**/*.zip',
        '**/*lighthouse-report*',
        '**/backend/data/**',
      ],
    },
  },
})
