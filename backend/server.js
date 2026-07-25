import dotenv from 'dotenv'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, statSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
/* Load backend/.env by absolute path so it works no matter which directory
   the server is started from (npm run api launches from the project root). */
dotenv.config({ path: join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import { seedAdmin } from './db.js'
import authRoutes from './routes/auth.js'
import leadRoutes from './routes/leads.js'
import whatsappRoutes from './routes/whatsapp.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/whatsapp', whatsappRoutes)

/* In production this same process also serves the built frontend (dist/), so a
   single CloudPanel reverse-proxy target covers the whole site. In development
   dist/ doesn't exist and Vite serves the UI, so this whole block is skipped. */
const DIST = join(__dirname, '..', 'dist')
if (existsSync(join(DIST, 'index.html'))) {
  const isFile = (p) => {
    try {
      return statSync(p).isFile()
    } catch {
      return false
    }
  }

  /* Hashed assets can cache for a year; HTML must revalidate so a new deploy is
     picked up immediately. */
  app.use(
    express.static(DIST, {
      index: false,
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache')
      },
    })
  )

  /* Any non-API GET that isn't a real file resolves to the prerendered route
     (dist/<path>/index.html) when one exists, otherwise the SPA shell. The
     resolved path is confined to DIST so an encoded ../ can't escape it. */
  app.use((req, res, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/api/')) {
      return next()
    }
    const nested = resolve(DIST, '.' + req.path, 'index.html')
    if (nested.startsWith(DIST + sep) && isFile(nested)) return res.sendFile(nested)
    return res.sendFile(join(DIST, 'index.html'))
  })
}

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

/* Last-resort handler: log the real error, return a generic one so stack
   traces and SQL details never reach the browser. */
app.use((err, _req, res, _next) => {
  console.error('[api]', err)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

seedAdmin()
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`))
