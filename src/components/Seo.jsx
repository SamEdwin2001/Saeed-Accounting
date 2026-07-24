import { useEffect } from 'react'

const SITE = 'Saeed Accounting'

function setMeta(name, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Per-route <title> and meta description.
 *
 * Every route otherwise shared the one static title in index.html and shipped
 * no description at all, which is what held the SEO audit down.
 *
 * Renders nothing — it only touches <head>.
 */
export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} — Accounting, VAT & Corporate Tax in UAE`
    setMeta('description', description)
  }, [title, description])

  return null
}
