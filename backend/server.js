/* Imported first: it runs dotenv.config() before db.js (below) builds the MySQL
   pool from DB_* at import time. ES module imports evaluate before top-level
   code, so loading dotenv inline here would run too late. */
import './env.js'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, statSync, readFileSync } from 'node:fs'
import express from 'express'
import cors from 'cors'
import { seedAdmin, init, all, get } from './db.js'
import authRoutes from './routes/auth.js'
import leadRoutes from './routes/leads.js'
import whatsappRoutes from './routes/whatsapp.js'
import blogRoutes, { UPLOAD_DIR } from './routes/blog.js'
import pageRoutes from './routes/pages.js'

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
app.use('/api/pages', pageRoutes)

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

  /**
   * The shell with an empty #root, for the routes rendered per request.
   *
   * dist/index.html is the prerendered homepage — its #root is full — so the
   * blog renderer, which injects a post into an empty one, has to read the copy
   * the prerender step keeps beside it. Falls back to index.html so a build
   * without that step still serves (as an unfilled SPA shell, as before).
   */
  const SHELL = isFile(join(DIST, 'shell.html'))
    ? join(DIST, 'shell.html')
    : join(DIST, 'index.html')

  const escapeHtml = (v) =>
    String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  /* Plain-text summary of a post body, for <meta name="description"> when the
     author left no override. Mirrors excerptOf() in routes/blog.js. */
  const excerptOf = (html) => {
    const text = String(html ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (text.length <= 200) return text
    return `${text.slice(0, 200).replace(/\s+\S*$/, '')}…`
  }

  /**
   * The 404 page, with the status code to match.
   *
   * The SPA shell alone would go out as 200 and carry the site-wide
   * "index, follow", so an address that is not a post looked to a crawler like
   * a real but empty page — the Soft 404 Search Console flagged. React renders
   * its own "Post not found" copy over this once it boots.
   */
  const sendNotFound = (res) => {
    try {
      const shell = readFileSync(SHELL, 'utf8')
      const html = shell
        .replace(/<title>[^<]*<\/title>/, '<title>Post Not Found | Saeed Accounting</title>')
        .replace(/<meta\s+name="robots"[\s\S]*?>/, '<meta name="robots" content="noindex, follow">')
      return res.status(404).set('Cache-Control', 'no-cache').type('html').send(html)
    } catch {
      return res.status(404).type('html').send('<h1>Post not found</h1>')
    }
  }

  /**
   * Server-render /blog/<slug> into the shell.
   *
   * Search Console reported "Soft 404" on every post. The shell it was served
   * carries no post text at all — the title, description and body only appear
   * once React has booted and fetched /api/blog/posts/<slug> — so the first
   * pass saw an empty page and classified it as one. Nothing in the build could
   * fix this: posts are written in the admin panel after the build, so no
   * amount of prerendering at build time can know about them.
   *
   * Splicing the real content in here is the same trick the sitemap route above
   * already uses, and it means publishing a post needs no redeploy. React
   * replaces #root on mount, so the injected markup is what a crawler (and the
   * first paint) sees, and the app takes over unchanged from there.
   *
   * A slug with no published post answers 404 via sendNotFound() rather than
   * falling through to the SPA shell, which would have sent 200.
   */
  /**
   * Server-render /blog, the listing.
   *
   * Same reason as the post route below: the cards are fetched after React
   * mounts, so a crawler reading the HTML saw an empty page with the site-wide
   * title. Posts are written after a build, so this cannot be prerendered
   * either — it is read from the live rows on each request.
   */
  app.get('/blog', async (_req, res, next) => {
    try {
      const rows = await all(
        `SELECT slug, title, image, published_at, content FROM blog_posts
         WHERE published = 1
         ORDER BY COALESCE(published_at, DATE(created_at)) DESC, id DESC`
      )

      const shell = readFileSync(SHELL, 'utf8')
      if (!shell.includes('<div id="root"></div>')) return next()

      const title = 'Blog | Saeed Accounting'
      const description =
        'VAT, corporate tax, bookkeeping and business insights for UAE companies, written by our tax and accounting team.'

      /* Links, not the full articles: the listing links to each post, and a
         crawler following them reaches the post's own rendered page. */
      const body = [
        '<div id="root">',
        '<section class="section blog"><div class="container">',
        `<h1>${escapeHtml(title)}</h1>`,
        ...rows.map((r) =>
          [
            '<article class="blog-card">',
            `<a href="/blog/${encodeURIComponent(r.slug)}">${escapeHtml(r.title)}</a>`,
            `<p>${escapeHtml(excerptOf(r.content))}</p>`,
            '</article>',
          ].join('')
        ),
        '</div></section>',
        '</div>',
      ].join('')

      const head = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}">`,
        `<link rel="canonical" href="${ORIGIN}/blog">`,
      ]
        .map((tag) => '\n    ' + tag)
        .join('')

      const html = shell
        .replace(/<title>[^<]*<\/title>/, '')
        .replace(/<meta\s+name="description"[\s\S]*?>/, '')
        .replace('</head>', `${head}</head>`)
        .replace('<div id="root"></div>', body)

      return res.set('Cache-Control', 'no-cache').type('html').send(html)
    } catch (err) {
      /* The listing matters more than its markup: fall through to the shell,
         which React still fills in correctly for a browser. */
      console.error('blog listing: serving the shell —', err.message)
      return next()
    }
  })

  app.get('/blog/:slug', async (req, res, next) => {
    try {
      const row = await get('SELECT * FROM blog_posts WHERE slug = ? AND published = 1', [
        req.params.slug,
      ])
      /* A slug with no published post must answer 404, not 200. Search Console
         reported "Soft 404" on a renamed post's old URL: the SPA fallback below
         answers every path with 200 and an indexable shell, so a crawler saw a
         page that was OK-but-empty. Returning the real status code — and
         noindex with it — is what tells Google the URL is gone. */
      if (!row) return sendNotFound(res)

      const shell = readFileSync(SHELL, 'utf8')
      if (!shell.includes('<div id="root"></div>')) return next()

      const title = row.meta_title || `${row.title} | Saeed Accounting`
      const description = row.meta_description || excerptOf(row.content)
      const canonical = row.canonical_url || `${ORIGIN}/blog/${encodeURIComponent(row.slug)}`

      /* Several posts open with their own <h1>. The banner supplies one too, so
         emitting both put two <h1>s on the page — a signal Google reads as a
         page unsure what it is about. Defer to the author's when it is there. */
      const bodyHasH1 = /<h1[\s>]/i.test(row.content ?? '')

      /* The body is already sanitised on save (routes/blog.js), which is what
         the client renders too — this injects the same HTML it would. */
      const body = [
        '<div id="root">',
        '<article class="blog-article">',
        bodyHasH1 ? '' : `<h1>${escapeHtml(row.title)}</h1>`,
        row.image ? `<img src="${escapeHtml(row.image)}" alt="${escapeHtml(row.title)}">` : '',
        `<div class="blog-article__body">${row.content ?? ''}</div>`,
        '</article>',
        '</div>',
      ].join('')

      /* The same post the API would return, inlined so the page has its data
         before the first render.
         Without it React mounts into 'loading', and because createRoot()
         discards the server markup rather than hydrating it, the article we
         just injected is replaced by "Loading…" for as long as the fetch takes.
         Googlebot renders the page and scores what it sees at that moment — an
         empty page — which is the Soft 404 the live test still reported after
         the HTML itself was correct.
         </script> inside the body would close this block early, so the one
         sequence that can break out is escaped. */
      const preload = JSON.stringify({
        id: row.id,
        title: row.title,
        slug: row.slug,
        categories: row.categories
          ? row.categories.split(',').map((c) => c.trim()).filter(Boolean)
          : [],
        image: row.image || null,
        date: row.published_at || null,
        published: true,
        excerpt: excerptOf(row.content),
        content: row.content,
        metaTitle: row.meta_title || '',
        metaDescription: row.meta_description || '',
        metaKeywords: row.meta_keywords || '',
        canonical: row.canonical_url || '',
        schema: row.schema_json || '',
      }).replace(/</g, '\\u003c')

      /* Validated on save, but re-checked here: a row could predate that check,
         and Google discards a page's whole structured data over one broken
         object rather than just that object. */
      let postSchema = ''
      if (row.schema_json) {
        try {
          JSON.parse(row.schema_json)
          postSchema = String(row.schema_json)
        } catch {
          console.error(`blog ssr: ignoring invalid schema JSON on /blog/${row.slug}`)
        }
      }

      const head = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}">`,
        `<link rel="canonical" href="${escapeHtml(canonical)}">`,
        row.meta_keywords
          ? `<meta name="keywords" content="${escapeHtml(row.meta_keywords)}">`
          : '',
        /* JSON-LD the author pasted for this post, written into the HTML a
           crawler reads before any JS runs. Carries the attribute Seo.jsx looks
           for, so React replaces this block instead of appending a second one.
           `</script>` inside a string would close the block early, so the one
           sequence that can break out is escaped. */
        postSchema
          ? `<script type="application/ld+json" data-seo-ld="page">${postSchema.replace(
              /</g,
              '\\u003c'
            )}</script>`
          : '',
        `<script>window.__POST__=${preload}</script>`,
      ]
        /* One tag per line, and no blank line where an optional tag was
           skipped — this <head> is the first thing anyone reads when they
           view source on the page. */
        .filter(Boolean)
        .map((tag) => '\n    ' + tag)
        .join('')

      const html = shell
        /* The shell's own <title> and description belong to the site, not this
           post — replace them rather than emitting a second copy of each. */
        .replace(/<title>[^<]*<\/title>/, '')
        .replace(/<meta\s+name="description"[\s\S]*?>/, '')
        .replace('</head>', `${head}</head>`)
        .replace('<div id="root"></div>', body)

      res.set('Cache-Control', 'no-cache').type('html').send(html)
    } catch (err) {
      /* Never let a DB hiccup take the page down — fall through to the shell,
         which still renders correctly for a real browser. */
      console.error('blog ssr: falling back to the shell —', err.message)
      next()
    }
  })

  /* Hashed assets can cache for a year; HTML must revalidate so a new deploy is
     picked up immediately. */
  app.use(
    express.static(DIST, {
      index: false,
      /* Prerendering gives every route a dist/<path>/ directory, and static's
         default is to answer /about-us with a 301 to /about-us/. Canonical URLs
         and the sitemap both use the unslashed form, so that redirect would
         send crawlers away from the address the page claims to live at. The
         handler below resolves the directory's index.html itself. */
      redirect: false,
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
     resolved path is confined to DIST so an encoded ../ can't escape it.

     Before the shell goes out, meta the admin saved for this route is written
     into it. The values are also inlined as window.__PAGE_SEO__ so <Seo> can
     apply them on the first render — without that React would overwrite the
     tags with the ones compiled into the bundle a moment after the crawler
     read them. */
  app.use(async (req, res, next) => {
    if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/api/')) {
      return next()
    }

    const key = req.path.replace(/^\/+|\/+$/g, '')

    /* The prerendered file for this route, or the shell when it has none. Both
       are served the same way: the override below is applied to whichever one
       this is, so a prerendered page is still editable from the panel. The
       resolved path is confined to DIST so an encoded ../ can't escape it. */
    const nested = resolve(DIST, '.' + req.path, 'index.html')
    const page =
      nested.startsWith(DIST + sep) && isFile(nested) ? nested : join(DIST, 'index.html')

    try {
      const row = await get('SELECT * FROM page_seo WHERE path = ?', [key])
      /* No override for this route — serve the file as built. */
      if (!row) return res.sendFile(page)

      const shell = readFileSync(page, 'utf8')

      /* Whatever JSON-LD the admin pasted for this route. It was validated as
         JSON on save, but re-check here: a row could predate that check, and a
         broken block is worse than none — Google discards the whole page's
         structured data rather than just the bad object. */
      let schema = ''
      if (row.schema_json) {
        try {
          JSON.parse(row.schema_json)
          schema = String(row.schema_json)
        } catch {
          console.error(`page seo: ignoring invalid schema JSON on /${key}`)
        }
      }


      const tags = [
        row.title ? `<title>${escapeHtml(row.title)}</title>` : '',
        row.description
          ? `<meta name="description" content="${escapeHtml(row.description)}">`
          : '',
        row.keywords ? `<meta name="keywords" content="${escapeHtml(row.keywords)}">` : '',
        row.canonical ? `<link rel="canonical" href="${escapeHtml(row.canonical)}">` : '',
        /* The pasted JSON-LD, emitted here rather than left to <Seo> so it is
           in the HTML a crawler reads before any JS runs — the same reason the
           meta tags above are. Carries the attribute Seo.jsx looks for, so a
           route that also builds schema in code replaces this block instead of
           appending a second one. `</script>` inside a string would close the
           block early, so the one sequence that can break out is escaped. */
        schema
          ? `<script type="application/ld+json" data-seo-ld="page">${schema.replace(
              /</g,
              '\\u003c'
            )}</script>`
          : '',
        `<script>window.__PAGE_SEO__=${JSON.stringify({
          path: key,
          title: row.title || '',
          description: row.description || '',
          keywords: row.keywords || '',
          canonical: row.canonical || '',
          schema,
        }).replace(/</g, '\\u003c')}</script>`,
      ]
        /* One tag per line, and no blank line where an optional tag was
           skipped — this <head> is the first thing anyone reads when they
           view source on the page. */
        .filter(Boolean)
        .map((tag) => '\n    ' + tag)
        .join('')

      /* Drop the shell's own title/description only where this row replaces
         them, so a half-filled override does not strip a tag and leave nothing
         in its place. */
      let html = shell
      if (row.title) html = html.replace(/<title>[^<]*<\/title>/, '')
      if (row.description) html = html.replace(/<meta\s+name="description"[\s\S]*?>/, '')

      return res
        .set('Cache-Control', 'no-cache')
        .type('html')
        .send(html.replace('</head>', `${tags}</head>`))
    } catch (err) {
      /* The page matters more than its meta: on a DB error serve the file as
         built, which is the prerendered copy where there is one. */
      console.error('page seo: serving the page unmodified —', err.message)
      return res.sendFile(page)
    }
  })
}

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

/* Last-resort handler: log the real error, return a generic one so stack
   traces and SQL details never reach the browser.

   A route that rejects its input sets err.status itself — that message is
   written for the person who typed the value and has to reach them, or they
   are told "something went wrong" about a stray comma they could fix. */
app.use((err, _req, res, _next) => {
  console.error('[api]', err)
  if (err?.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message })
  }
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
