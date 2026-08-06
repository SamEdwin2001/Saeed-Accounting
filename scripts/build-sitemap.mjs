/**
 * Writes public/sitemap.xml from the routes declared in the app.
 *
 * Generated rather than hand-maintained so a new service slug can't be added
 * to data/services.js and quietly go unlisted. Runs as part of `npm run build`,
 * before Vite copies public/ into dist/.
 *
 * Run: node scripts/build-sitemap.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SERVICES } from '../src/data/services.js'

const ORIGIN = 'https://saeedaccounting.com'

/* Routes declared in App.jsx that are not service slugs. Keep in sync with the
   same list in check-seo.mjs. Excludes /admin (login-only) and the 404. */
const EXTRA_ROUTES = [
  '',
  'about-us',
  'contact-us',
  /* The listing only. Individual /blog/<slug> posts live in the database and
     are created after a build, so they can't be enumerated here — a crawler
     reaches them by following the links on this page. */
  'blog',
  'uae-corporate-tax-registration',
  'uae-vat-registration',
  'vat-services-uae',
  'corporate-tax-filing-uae',
  'file-corporate-tax-return',
]

/* The home page is the entry point, the standalone landing pages convert, and
   the service articles sit below both. Priority is a hint, not a ranking. */
const priorityFor = (path) => {
  if (path === '') return '1.0'
  if (EXTRA_ROUTES.includes(path)) return '0.9'
  return '0.8'
}

const paths = [...EXTRA_ROUTES, ...SERVICES.map((s) => s.slug)]

const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i)
if (duplicates.length) {
  console.error(`sitemap: duplicate routes — ${duplicates.join(', ')}`)
  process.exit(1)
}

/* Date only: Google ignores a lastmod that changes on every deploy without the
   content changing, and a build timestamp would do exactly that. */
const lastmod = new Date().toISOString().slice(0, 10)

/* No <?xml-stylesheet?> here. It only prettified the file for humans, but
   Search Console reported "Sitemap is HTML — 0 discovered pages": when Googlebot
   applies the XSL it sees the rendered table rather than the urlset. A sitemap
   Google can read matters more than one that looks tidy in a browser. */
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((p) =>
    [
      '  <url>',
      `    <loc>${ORIGIN}/${p}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${priorityFor(p)}</priority>`,
      '  </url>',
    ].join('\n')
  )
  .join('\n')}
</urlset>
`

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml')
writeFileSync(out, xml, 'utf8')
console.log(`sitemap: wrote ${paths.length} URLs to public/sitemap.xml`)
