import { useEffect, useState } from 'react'

const SITE = 'Saeed Accounting'
const DEFAULT_TITLE = `${SITE} — Accounting, VAT & Corporate Tax in UAE`

/** Absolute base for canonical and og:url. Must match the live domain.

    Non-www: www.saeedaccounting.com 301s here, so a canonical pointing at the
    www host named a URL that does not serve the page. Search Console showed it
    as the user-declared canonical on a post and would not index it. The server
    and the sitemap already use this origin — all three have to agree. */
const ORIGIN = 'https://saeedaccounting.com'

function upsert(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(attrs.rel ? 'link' : 'meta')
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  return el
}

function setMeta(name, content) {
  if (!content) return
  upsert(`meta[name="${name}"]`, { name, content })
}

function setProp(property, content) {
  if (!content) return
  upsert(`meta[property="${property}"]`, { property, content })
}

/** Marks the JSON-LD this component owns, so it can find and clear its own. */
const LD_FLAG = 'data-seo-ld'

/**
 * Writes a single FAQPage block, or removes it when `faqs` is empty.
 *
 * Unlike the meta tags above, this one must be cleaned up on navigation: FAQ
 * schema is only valid on a page that actually shows those questions, so
 * leaving it behind would misdescribe every route visited afterwards.
 */
function setFaqSchema(faqs) {
  const existing = document.head.querySelector(`script[${LD_FLAG}="faq"]`)
  if (existing) existing.remove()
  if (!faqs || !faqs.length) return

  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.setAttribute(LD_FLAG, 'faq')
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })
  document.head.appendChild(el)
}

/**
 * Per-route <title>, meta description, canonical and Open Graph tags.
 *
 * Every route otherwise shared the one static title in index.html and shipped
 * no description at all, which is what held the SEO audit down.
 *
 * Because this is a client-rendered SPA, tags are written on mount rather than
 * present in the served HTML. Google renders JS and picks them up; other
 * crawlers may not, so anything that must be seen without JS belongs in
 * index.html instead.
 *
 * Renders nothing — it only touches <head>.
 *
 * @param path      Route pathname, used for canonical/og:url. Falsy → skipped.
 * @param canonical Explicit canonical, overriding the one derived from `path`.
 *                  Absolute URL, or a root-relative path resolved against
 *                  ORIGIN. Blog posts set this from the admin form.
 * @param noindex   Set on pages that must stay out of the index (404).
 */
/**
 * Meta the server saved for this route and inlined into the page it served.
 *
 * The admin panel writes these to the database, and server.js renders them into
 * the HTML — but React would then overwrite them from data/seo.js on mount,
 * putting the build's copy back a moment after a crawler read the saved one.
 * Reading the same values here keeps the two in agreement.
 *
 * Matched on path so a client-side navigation away from the served route falls
 * straight back to that route's own meta.
 */
const overrideFor = (path) => {
  if (typeof window === 'undefined') return null
  const o = window.__PAGE_SEO__
  if (!o) return null
  const here = String(path ?? '').replace(/^\/+|\/+$/g, '')
  return o.path === here ? o : null
}

/**
 * The same overrides, fetched, for the dev server only.
 *
 * In production Express injects window.__PAGE_SEO__ into the HTML it serves,
 * so the values are there before the first render and no request is needed.
 * Vite serves its own index.html and knows nothing about the database, so a
 * page edited in the admin panel would look unchanged while developing —
 * exactly the thing being worked on. Fetch it there instead.
 *
 * One request per session, shared by every <Seo> on the page: the module-level
 * promise is the cache. import.meta.env.DEV is compiled to false in the bundle,
 * so this whole branch is dropped from the production build.
 */
let devOverrides = null

const loadDevOverrides = () => {
  if (!devOverrides) {
    devOverrides = fetch('/api/pages')
      .then((r) => (r.ok ? r.json() : { pages: [] }))
      .then(({ pages }) => new Map(pages.filter((p) => p.override).map((p) => [p.path, p.override])))
      /* The dev API not running is normal — fall back to the code's meta. */
      .catch(() => new Map())
  }
  return devOverrides
}

export default function Seo({
  title: titleProp,
  description: descriptionProp,
  keywords: keywordsProp,
  path,
  canonical: canonicalProp,
  noindex = false,
  faqs: faqsProp,
}) {
  const inlined = overrideFor(path)

  /* Dev only, and only when the server did not inline one — see
     loadDevOverrides(). Held in state so the tags are rewritten once it
     arrives; in production this stays null and never triggers a render. */
  const [fetched, setFetched] = useState(null)
  useEffect(() => {
    if (!import.meta.env.DEV || inlined) return undefined
    let cancelled = false
    const here = String(path ?? '').replace(/^\/+|\/+$/g, '')
    loadDevOverrides().then((map) => {
      if (!cancelled) setFetched(map.get(here) ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [path, inlined])

  /* A blank field is "not overridden", not "set to empty" — that is how the
     admin clears one field without clearing the rest of the page's meta. */
  const saved = inlined || fetched
  const title = saved?.title || titleProp
  const description = saved?.description || descriptionProp
  const keywords = saved?.keywords || keywordsProp
  const canonical = saved?.canonical || canonicalProp
  /* FAQs entered in the admin panel win over a route's own list, so a page can
     be given one from the panel without touching the code that has none. */
  const faqs = saved?.faqs?.length ? saved.faqs : faqsProp

  useEffect(() => {
    /* Titles arrive complete from data/seo.js — the brand suffix is written
       into the ones that want it, rather than appended to all of them. */
    const full = title || DEFAULT_TITLE
    document.title = full

    setMeta('description', description)
    /* Google has ignored meta keywords since 2009; carried because the client's
       SEO sheet specifies them per page, and some smaller engines still read
       them. It costs a tag and changes nothing about how Google ranks a page. */
    setMeta('keywords', keywords)

    /* Canonical: the site serves duplicate content on paired routes
       (/uae-vat-registration mirrors /vat-registration-services), so each
       page must at least declare its own URL as canonical.

       An explicit `canonical` wins over the route's own address — that is the
       point of the per-post field: a post republished from elsewhere can point
       at the original. A bare path is resolved against ORIGIN so the tag is
       always absolute, as Google requires. */
    const explicit = canonical?.trim()
    const url = explicit
      ? explicit.startsWith('/')
        ? `${ORIGIN}${explicit}`
        : explicit
      : path != null
        ? `${ORIGIN}${path === '/' ? '/' : path}`
        : null

    if (url) {
      upsert('link[rel="canonical"]', { rel: 'canonical', href: url })
      setProp('og:url', url)
    }

    setProp('og:title', full)
    setProp('og:description', description)
    setProp('og:site_name', SITE)
    setProp('og:type', 'website')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', full)
    setMeta('twitter:description', description)

    /* robots is only ever added, never removed on unmount — so it must be
       explicitly reset to "index" on indexable pages, or a visit to the 404
       would leave every later route noindexed for that session. */
    setMeta('robots', noindex ? 'noindex, follow' : 'index, follow')

    /* Built from the same `faqs` the page renders, so the two cannot drift —
       Google treats schema that does not match the visible copy as spam. */
    setFaqSchema(faqs)

    /* Cleanup, not just the call above: RouteSeo returns null on /blog/<post>,
       which unmounts this component without re-running the effect. Without
       this the block would survive into the next route — FAQ schema on a page
       that shows no FAQs. */
    return () => setFaqSchema(null)
  }, [title, description, keywords, path, canonical, noindex, faqs])

  return null
}
