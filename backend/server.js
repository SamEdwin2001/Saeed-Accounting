/* Imported first: it runs dotenv.config() before db.js (below) builds the MySQL
   pool from DB_* at import time. ES module imports evaluate before top-level
   code, so loading dotenv inline here would run too late. */
import './env.js'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, statSync, readFileSync } from 'node:fs'
import express from 'express'
import cors from 'cors'
import { seedAdmin, init, all } from './db.js'
import authRoutes from './routes/auth.js'
import leadRoutes from './routes/leads.js'
import whatsappRoutes from './routes/whatsapp.js'
import blogRoutes, { UPLOAD_DIR } from './routes/blog.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))

/* Lead and admin payloads are small, so 100kb is a deliberate ceiling on what
   the API will read. Blog posts are the one exception: a long article — more so
   one with an inline data: image pasted into its HTML — runs past it honestly,
   and rejecting the save would lose the author's work. */
const jsonSmall = express.json({ limit: '100kb' })
const jsonPost = express.json({ limit: '4mb' })
app.use((req, res, next) =>
  (req.path.startsWith('/api/blog/admin/posts') ? jsonPost : jsonSmall)(req, res, next)
)

/* Blog post images. Mounted above the no-store rule below because these are
   static files, not API data: their names are random and never reused, so a
   long immutable cache is safe and saves re-downloading every image on each
   visit. Lives under /api only so Vite's dev proxy forwards it — in production
   it is the same origin either way. */
app.use(
  '/api/uploads',
  express.static(UPLOAD_DIR, { maxAge: '1y', immutable: true, index: false, fallthrough: false })
)

/* API responses are dynamic and must never be cached. Without this the browser
   (or a reverse proxy) can replay a stale GET after an edit/toggle — e.g. the
   WhatsApp admin re-reads the list, gets the cached body, and keeps showing the
   old Active/number even though the server was already updated. */
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/blog', blogRoutes)

/* In production this same process also serves the built frontend (dist/), so a
   single CloudPanel reverse-proxy target covers the whole site. In development
   dist/ doesn't exist and Vite serves the UI, so this whole block is skipped. */
/* Routes that have moved. A 301 keeps existing inbound links and the search
   ranking they carry pointing at the current URL. */
const MOVED = {
  '/register-for-vat-online-uae': '/vat-services-uae',
}

/* Must match scripts/build-sitemap.mjs, or the appended blog URLs would sit on
   a different host from the static ones in the same file. */
const ORIGIN = 'https://saeedaccounting.com'

const DIST = join(__dirname, '..', 'dist')
if (existsSync(join(DIST, 'index.html'))) {
  app.use((req, res, next) => {
    const to = MOVED[req.path.replace(/\/+$/, '') || '/']
    return to ? res.redirect(301, to) : next()
  })

  /* The build writes the static routes into dist/sitemap.xml, but posts are
     written in the admin panel after that build, so a file generated at build
     time can never list them. Serving the sitemap from here instead splices the
     published posts in on every request — publish a post and it is listed
     immediately, with no redeploy.
     Declared before express.static so it wins over the file on disk. */
  app.get('/sitemap.xml', async (_req, res, next) => {
    try {
      const rows = await all(
        'SELECT slug, published_at, updated_at FROM blog_posts WHERE published = 1'
      )
      const base = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')

      const entries = rows
        .map((r) => {
          const d = r.updated_at || r.published_at
          const lastmod = d ? new Date(d).toISOString().slice(0, 10) : null
          return [
            '  <url>',
            `    <loc>${ORIGIN}/blog/${encodeURIComponent(r.slug)}</loc>`,
            ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
            '    <priority>0.7</priority>',
            '  </url>',
          ].join('\n')
        })
        .join('\n')

      res.type('application/xml').set('Cache-Control', 'no-cache')
      /* Nothing to add, or the marker is missing → serve the file unchanged
         rather than risk emitting malformed XML. */
      if (!entries || !base.includes('</urlset>')) return res.send(base)
      res.send(base.replace('</urlset>', `${entries}\n</urlset>`))
    } catch (err) {
      console.error('sitemap: falling back to the static file —', err.message)
      next()
    }
  })

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
        /* Express types .xsl as application/xml, which browsers will not apply
           as a stylesheet — the sitemap then renders as a raw document tree. */
        if (filePath.endsWith('.xsl')) res.setHeader('Content-Type', 'text/xsl; charset=utf-8')
        /* The sitemap must revalidate too, or a year-long cache would pin
           crawlers to the URL list from whichever deploy they first saw. */
        if (filePath.endsWith('sitemap.xml')) res.setHeader('Cache-Control', 'no-cache')
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

/* Create tables + seed the admin, then start listening. If the database can't
   be reached the process exits so PM2 restarts it rather than serving with a
   broken DB. */
init()
  .then(seedAdmin)
  .then(() => app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('[startup] database init failed:', err)
    process.exit(1)
  })
