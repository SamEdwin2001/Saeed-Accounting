import { useEffect } from 'react'

const SITE = 'Saeed Accounting'
const DEFAULT_TITLE = `${SITE} — Accounting, VAT & Corporate Tax in UAE`

/** Absolute base for canonical and og:url. Must match the live domain. */
const ORIGIN = 'https://www.saeedaccounting.com'

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
 * @param noindex   Set on pages that must stay out of the index (404).
 */
export default function Seo({ title, description, keywords, path, noindex = false, faqs }) {
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
       page must at least declare its own URL as canonical. */
    if (path != null) {
      const url = `${ORIGIN}${path === '/' ? '/' : path}`
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
  }, [title, description, keywords, path, noindex, faqs])

  return null
}
