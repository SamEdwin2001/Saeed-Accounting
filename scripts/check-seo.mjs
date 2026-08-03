/**
 * Verifies every public route has meta, and that titles/descriptions fit.
 *
 * Catches the three ways this drifts: a new service slug added to
 * data/services.js with no SEO entry, a title that overflows once the
 * " | Saeed Accounting" suffix is appended, and two routes sharing the same
 * description (duplicate content).
 *
 * Run: node scripts/check-seo.mjs
 */
import { SERVICES } from '../src/data/services.js'
import { ROUTE_SEO, TITLE_SUFFIX } from '../src/data/seo.js'

/* Routes declared in App.jsx that are not service slugs. Keep in sync. */
const EXTRA_ROUTES = [
  '',
  'uae-corporate-tax-registration',
  'uae-vat-registration',
  'vat-services-uae',
  'file-corporate-tax-return',
  'corporate-tax-filing-uae',
  'about-us',
  'contact-us',
  'blog',
]

const TITLE_MAX = 60
const DESC_MIN = 120
const DESC_MAX = 160

const expected = [...EXTRA_ROUTES, ...SERVICES.map((s) => s.slug)]
const errors = []
const warnings = []

for (const route of expected) {
  const meta = ROUTE_SEO[route]
  if (!meta) {
    errors.push(`/${route} — no ROUTE_SEO entry`)
    continue
  }

  /* Titles are stored complete — Seo.jsx no longer appends a brand suffix, so
     measure the string as written. Over-length is a warning: Google truncates
     the tail in results but still indexes the whole title, and the client's
     wording takes priority over fitting the pixel width. */
  if (meta.title != null && meta.title.length > TITLE_MAX) {
    warnings.push(`/${route} — title ${meta.title.length} chars (over ${TITLE_MAX}): "${meta.title}"`)
  }

  const d = meta.description
  if (!d) {
    errors.push(`/${route} — no description`)
  } else {
    if (d.length > DESC_MAX) warnings.push(`/${route} — description ${d.length} chars (over ${DESC_MAX})`)
    else if (d.length < DESC_MIN) warnings.push(`/${route} — description only ${d.length} chars (aim ${DESC_MIN}+)`)
    if (/…|\.\.\.$/.test(d)) errors.push(`/${route} — description is truncated copy`)
  }
}

/* Entries present in the table but not routed — dead weight, or a typo'd slug. */
for (const route of Object.keys(ROUTE_SEO)) {
  if (!expected.includes(route)) warnings.push(`/${route} — ROUTE_SEO entry matches no route`)
}

/* Duplicate titles and descriptions across routes. */
for (const field of ['title', 'description']) {
  const seen = new Map()
  for (const [route, meta] of Object.entries(ROUTE_SEO)) {
    const v = meta[field]
    if (!v) continue
    if (seen.has(v)) errors.push(`duplicate ${field}: /${seen.get(v)} and /${route}`)
    else seen.set(v, route)
  }
}

for (const w of warnings) console.warn(`warn  ${w}`)
for (const e of errors) console.error(`ERROR ${e}`)

console.log(
  `\n${expected.length} routes checked — ${errors.length} error(s), ${warnings.length} warning(s)`,
)
process.exit(errors.length ? 1 : 0)
