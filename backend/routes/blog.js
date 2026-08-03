import { Router } from 'express'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { all, get, run } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()

const __dirname = dirname(fileURLToPath(import.meta.url))

/* Uploaded post images live outside dist/ so a rebuild can't wipe them, and
   are served back through /api/uploads (see server.js) — routing them under
   /api means Vite's dev proxy covers them too, so the same URL works in
   development and in production. */
export const UPLOAD_DIR = join(__dirname, '..', 'uploads')
mkdirSync(UPLOAD_DIR, { recursive: true })

/* Extension is taken from the Content-Type, never from the client's filename —
   a name like "x.php" must not decide what lands on disk. */
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

const clean = (v, max) => String(v ?? '').trim().slice(0, max)

/**
 * Title → URL slug. Used when the author leaves the slug box empty, and to
 * normalise whatever they do type, so a slug can never contain a space or a
 * character that would need escaping in the URL.
 */
const slugify = (v) =>
  String(v ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200)

/* "Health, Recipes,, Gifting " → "Health, Recipes, Gifting". Blanks and
   duplicates are dropped so the filter chips on /blog stay clean. */
const cleanCategories = (v) => {
  const list = String(v ?? '')
    .split(',')
    .map((c) => c.trim().replace(/\s+/g, ' '))
    .filter(Boolean)

  const seen = new Set()
  const unique = list.filter((c) => {
    const key = c.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return unique.join(', ').slice(0, 255)
}

/* Date input sends yyyy-mm-dd; anything else (including '') stores NULL and
   the post falls back to its created_at for ordering. */
const cleanDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v ?? '').trim()) ? String(v).trim() : null)

/**
 * The post body is admin-authored HTML, so this is a backstop rather than a
 * defence against a hostile author: it strips the tags and attributes that
 * would turn a pasted snippet into stored XSS for every visitor. Runs on write,
 * so the stored row is already safe and the public route needn't re-scan it.
 */
const sanitizeHtml = (v) =>
  String(v ?? '')
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>/gi, '')
    /* on*= handlers, quoted or bare. */
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    /* javascript: in href/src. */
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')

/**
 * First ~200 characters of the post as plain text — the card blurb on /blog
 * and the meta description on the article. Derived rather than stored so it
 * can never drift out of sync with an edited body.
 */
const excerptOf = (html) => {
  const text = String(html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= 200) return text
  /* Cut on a word boundary so the blurb doesn't end mid-word. */
  return `${text.slice(0, 200).replace(/\s+\S*$/, '')}…`
}

/** Row → the shape the website consumes. `content` is omitted from lists. */
const toPost = (row, { withContent = false } = {}) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  categories: row.categories ? row.categories.split(',').map((c) => c.trim()).filter(Boolean) : [],
  image: row.image || null,
  date: row.published_at || null,
  published: !!row.published,
  excerpt: excerptOf(row.content),
  ...(withContent ? { content: row.content } : {}),
})

/* Newest first. A post with no date falls back to when it was created, so
   undated drafts don't all pile up at the bottom in an arbitrary order. */
const ORDER = 'ORDER BY COALESCE(published_at, DATE(created_at)) DESC, id DESC'

/**
 * Reserves a unique slug. MySQL rejects a duplicate at the UNIQUE index, but
 * failing the save outright would lose the author's draft — so a clashing slug
 * gets -2, -3 … appended instead. `exceptId` lets an edit keep its own slug.
 */
async function uniqueSlug(desired, exceptId = null) {
  const base = desired || 'post'
  let candidate = base

  for (let n = 2; ; n += 1) {
    const clash = await get(
      `SELECT id FROM blog_posts WHERE slug = ?${exceptId ? ' AND id <> ?' : ''}`,
      exceptId ? [candidate, exceptId] : [candidate]
    )
    if (!clash) return candidate
    /* Keep the whole suffix inside the column's 200 chars. */
    const suffix = `-${n}`
    candidate = `${base.slice(0, 200 - suffix.length)}${suffix}`
  }
}

/* ── PUBLIC ────────────────────────────────────────────────────────────────
   The /blog listing and each /blog/<slug> article read from here. Drafts are
   filtered out in SQL, not in the client, so an unpublished post is never sent
   to the browser at all. These two routes sit above requireAuth on purpose. */

/** Listing. Returns every published post plus the category set for the chips. */
router.get('/posts', async (req, res) => {
  const rows = await all(`SELECT * FROM blog_posts WHERE published = 1 ${ORDER}`)
  const posts = rows.map((r) => toPost(r))

  /* Categories come from the posts themselves — the chip row can't offer a
     filter that would return nothing. Case-insensitive de-dupe keeps "VAT" and
     "vat" as one chip, first spelling wins. */
  const seen = new Map()
  for (const post of posts) {
    for (const category of post.categories) {
      const key = category.toLowerCase()
      if (!seen.has(key)) seen.set(key, category)
    }
  }

  res.json({ posts, categories: [...seen.values()].sort((a, b) => a.localeCompare(b)) })
})

/** One article, by the slug the author set in the admin form. */
router.get('/posts/:slug', async (req, res) => {
  const row = await get('SELECT * FROM blog_posts WHERE slug = ? AND published = 1', [
    req.params.slug,
  ])
  if (!row) return res.status(404).json({ error: 'Post not found.' })
  res.json({ post: toPost(row, { withContent: true }) })
})

/* ── ADMIN ─────────────────────────────────────────────────────────────────
   Everything below requires a valid token. */
router.use(requireAuth)

/** Every post, drafts included. */
router.get('/admin/posts', async (_req, res) => {
  const rows = await all(`SELECT * FROM blog_posts ${ORDER}`)
  res.json({ posts: rows.map((r) => toPost(r)) })
})

/** One post with its body, for the edit form. */
router.get('/admin/posts/:id', async (req, res) => {
  const row = await get('SELECT * FROM blog_posts WHERE id = ?', [req.params.id])
  if (!row) return res.status(404).json({ error: 'Post not found.' })
  res.json({ post: toPost(row, { withContent: true }) })
})

/**
 * Image upload. The file is POSTed as a raw body with its own image/* content
 * type — no multipart parser and no base64 round-trip, so no new dependency and
 * no 33% size inflation. Returns the URL to store on the post.
 */
router.post(
  '/admin/upload',
  express.raw({ type: Object.keys(IMAGE_TYPES), limit: MAX_IMAGE_BYTES }),
  (req, res) => {
    const ext = IMAGE_TYPES[String(req.headers['content-type'] || '').split(';')[0].trim()]
    if (!ext) return res.status(415).json({ error: 'Upload a JPG, PNG, WebP, GIF, AVIF or SVG image.' })
    if (!Buffer.isBuffer(req.body) || !req.body.length) {
      return res.status(400).json({ error: 'No image received.' })
    }

    /* Random name: two posts uploading "hero.jpg" must not overwrite each
       other, and an unguessable path keeps a draft's image out of sight until
       the post goes live. */
    const filename = `${randomUUID()}.${ext}`
    writeFileSync(join(UPLOAD_DIR, filename), req.body)

    res.status(201).json({ url: `/api/uploads/${filename}` })
  }
)

/* express.raw() rejects an oversized body with a 413 that would otherwise fall
   through to the generic 500 handler and tell the author nothing useful. */
router.use('/admin/upload', (err, _req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'That image is over 8 MB. Please upload a smaller file.' })
  }
  next(err)
})

/** Create a post. */
router.post('/admin/posts', async (req, res) => {
  const { title, slug, categories, date, content, published = true } = req.body || {}

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Title and content are required.' })
  }

  const values = {
    title: clean(title, 200),
    /* Blank slug box → derive one from the title, exactly as the form's hint
       promises. */
    slug: await uniqueSlug(slugify(slug) || slugify(title)),
    categories: cleanCategories(categories),
    image: clean(req.body?.image, 255),
    content: sanitizeHtml(content),
    published: published ? 1 : 0,
    published_at: cleanDate(date),
  }

  const info = await run(
    `INSERT INTO blog_posts (title, slug, categories, image, content, published, published_at)
     VALUES (:title, :slug, :categories, :image, :content, :published, :published_at)`,
    values
  )

  const row = await get('SELECT * FROM blog_posts WHERE id = ?', [info.insertId])
  res.status(201).json({ post: toPost(row, { withContent: true }) })
})

/** Partial update — the edit form and the published toggle both use this. */
router.patch('/admin/posts/:id', async (req, res) => {
  const existing = await get('SELECT * FROM blog_posts WHERE id = ?', [req.params.id])
  if (!existing) return res.status(404).json({ error: 'Post not found.' })

  const { title, slug, categories, date, content, image, published } = req.body || {}

  const nextTitle = title !== undefined ? clean(title, 200) : existing.title
  const nextContent = content !== undefined ? sanitizeHtml(content) : existing.content
  if (!nextTitle.trim() || !nextContent.trim()) {
    return res.status(400).json({ error: 'Title and content are required.' })
  }

  /* Only re-derive the slug when the author actually sent one — a PATCH that
     just flips `published` must not silently change the post's public URL. */
  let nextSlug = existing.slug
  if (slug !== undefined) {
    nextSlug = await uniqueSlug(slugify(slug) || slugify(nextTitle), existing.id)
  }

  const values = {
    title: nextTitle,
    slug: nextSlug,
    categories: categories !== undefined ? cleanCategories(categories) : existing.categories,
    image: image !== undefined ? clean(image, 255) : existing.image,
    content: nextContent,
    published: published !== undefined ? (published ? 1 : 0) : existing.published,
    published_at: date !== undefined ? cleanDate(date) : existing.published_at,
    id: existing.id,
  }

  await run(
    `UPDATE blog_posts
        SET title = :title, slug = :slug, categories = :categories, image = :image,
            content = :content, published = :published, published_at = :published_at
      WHERE id = :id`,
    values
  )

  const row = await get('SELECT * FROM blog_posts WHERE id = ?', [existing.id])
  res.json({ post: toPost(row, { withContent: true }) })
})

/** Delete a post. */
router.delete('/admin/posts/:id', async (req, res) => {
  const info = await run('DELETE FROM blog_posts WHERE id = ?', [req.params.id])
  if (!info.changes) return res.status(404).json({ error: 'Post not found.' })
  res.json({ ok: true })
})

export default router
