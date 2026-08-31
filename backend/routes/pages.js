/**
 * Per-route meta the admin can edit.
 *
 * The list of pages is not stored: it is read from the same src/data files the
 * site routes off, so adding a route to the code puts it in the admin panel
 * with no migration and no second list to keep in step. The database holds
 * only what an admin has actually changed — one row per edited route — and a
 * route with no row falls back to the meta compiled into the bundle.
 *
 * Reads are public because server.js renders these into the HTML it serves.
 * Everything that writes needs a token.
 */
import { Router } from 'express'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { all, get, run } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()
const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '..', '..', 'src')

const clean = (v, max) => String(v ?? '').trim().slice(0, max)

/**
 * Routes the site declares, read out of the source rather than duplicated here.
 *
 * These files are plain data — `export const ROUTE_SEO = { 'about-us': {…} }`
 * and a list of `slug:` fields — so they are parsed with a regex instead of
 * imported: backend/ is CommonJS-adjacent and importing JSX-adjacent modules
 * from src/ at runtime would drag Vite's resolution rules into the API.
 *
 * Read once per process. A new route ships in a deploy, and the deploy restarts
 * the process, so there is nothing a cache can go stale against.
 */
let cachedRoutes = null

const readRoutes = () => {
  if (cachedRoutes) return cachedRoutes

  const seoFile = readFileSync(join(SRC, 'data', 'seo.js'), 'utf8')

  /* Entries in ROUTE_SEO, which is every static route that has meta today.
     Matched at two-space indentation so nested keys inside an entry (title,
     description) can't be mistaken for routes of their own. */
  const entries = [...seoFile.matchAll(/^ {2}'([^']*)':\s*\{/gm)].map((m) => m[1])

  const labelFor = (path) => {
    if (path === '') return 'Home'
    return path
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  cachedRoutes = entries.map((path) => ({
    path,
    url: `/${path}`,
    label: labelFor(path),
  }))

  return cachedRoutes
}

/**
 * The JSON-LD block an admin pasted for a route, as text.
 *
 * Stored verbatim rather than parsed into a shape of our own: schema.org has
 * dozens of types and the point of the field is that a new one can be added
 * without a code change. It is validated as JSON on save — see below — so what
 * comes back out is always something a browser can parse.
 */
const parseSchema = (raw) => (raw ? String(raw) : '')

/** Row → the shape the admin form and the renderer both read. */
const toOverride = (row) => ({
  title: row.title || '',
  description: row.description || '',
  keywords: row.keywords || '',
  canonical: row.canonical || '',
  schema: parseSchema(row.schema_json),
})

/**
 * Every route, each with the override stored for it when there is one.
 *
 * Public: server.js calls the single-path form below on every page render.
 * The list form is what the admin table is built from.
 */
router.get('/', async (_req, res) => {
  const rows = await all('SELECT * FROM page_seo')
  const bySlug = new Map(rows.map((r) => [r.path, r]))

  res.json({
    pages: readRoutes().map((r) => ({
      ...r,
      edited: bySlug.has(r.path),
      override: bySlug.has(r.path) ? toOverride(bySlug.get(r.path)) : null,
    })),
  })
})

/**
 * One route's override, or null when it has none.
 *
 * The path arrives URL-encoded because it contains slashes for nothing today
 * but would the moment a nested route is added. '' (the homepage) cannot be a
 * path segment, so it is spelled `home` on the wire.
 */
router.get('/one/:path', async (req, res) => {
  const path = req.params.path === 'home' ? '' : req.params.path
  const row = await get('SELECT * FROM page_seo WHERE path = ?', [path])
  res.json({ override: row ? toOverride(row) : null })
})

router.use(requireAuth)

/**
 * Save one route's meta.
 *
 * Upsert rather than insert-or-update in two round trips: the admin form saves
 * the whole record every time, and a row either exists or does not.
 *
 * A field left blank is stored blank, which the renderer reads as "fall back to
 * the value in the code" — that is how an admin undoes an override without a
 * separate delete.
 */
router.put('/one/:path', async (req, res) => {
  const path = req.params.path === 'home' ? '' : req.params.path

  const known = readRoutes().some((r) => r.path === path)
  if (!known) return res.status(404).json({ error: 'That page does not exist.' })

  const schema = String(req.body.schema ?? '').trim()

  /* Reject malformed JSON on the way in rather than emitting a broken
     <script type="application/ld+json"> that Google silently ignores. The
     admin gets told which character is wrong while the page is still open. */
  if (schema) {
    try {
      JSON.parse(schema)
    } catch (e) {
      return res.status(400).json({ error: `Schema is not valid JSON — ${e.message}` })
    }
  }

  const values = {
    path,
    title: clean(req.body.title, 255),
    description: clean(req.body.description, 500),
    keywords: clean(req.body.keywords, 500),
    canonical: clean(req.body.canonical, 500),
    /* Null rather than '' so "no schema" is one value, not two. */
    schema_json: schema || null,
  }

  /* A canonical has to be absolute for Google to read it, and a relative one
     silently points at the wrong host — reject rather than store it. */
  if (values.canonical && !/^https?:\/\//i.test(values.canonical)) {
    return res.status(400).json({ error: 'Canonical must start with https://' })
  }

  await run(
    `INSERT INTO page_seo (path, title, description, keywords, canonical, schema_json)
     VALUES (:path, :title, :description, :keywords, :canonical, :schema_json)
     ON DUPLICATE KEY UPDATE
       title = :title, description = :description,
       keywords = :keywords, canonical = :canonical, schema_json = :schema_json`,
    values
  )

  res.json({ override: toOverride(values) })
})

/** Drop an override so the route goes back to the meta in the code. */
router.delete('/one/:path', async (req, res) => {
  const path = req.params.path === 'home' ? '' : req.params.path
  await run('DELETE FROM page_seo WHERE path = ?', [path])
  res.json({ ok: true })
})

export default router
