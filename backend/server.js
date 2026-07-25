import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
/* Load backend/.env by absolute path so it works no matter which directory
   the server is started from (npm run api launches from the project root). */
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') })

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

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

/* Last-resort handler: log the real error, return a generic one so stack
   traces and SQL details never reach the browser. */
app.use((err, _req, res, _next) => {
  console.error('[api]', err)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

seedAdmin()
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`))
