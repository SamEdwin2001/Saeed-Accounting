/**
 * Shared pieces of the JSON-LD field, used by both the Pages and Blog forms.
 *
 * The two screens edit different rows — a route's meta and a post's — but the
 * field itself behaves identically, and a second copy of the example would
 * drift from this one the first time either was corrected.
 */

/* A FAQPage, because that is the block these pages need most often — but the
   field takes any schema.org type, so the example is a starting point rather
   than a template to fill in. */
export const SCHEMA_PLACEHOLDER = `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who needs to register for VAT in the UAE?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Businesses with taxable supplies above AED 375,000 must register."
      }
    }
  ]
}`

/**
 * Says whether what is typed so far is valid JSON, and what type it declares.
 *
 * The server rejects malformed JSON on save, but that is after the click —
 * a note under the box catches a stray comma while the eye is still on it.
 */
export const schemaNote = (text) => {
  const v = String(text ?? '').trim()
  if (!v) return 'No schema on this page.'
  try {
    const parsed = JSON.parse(v)
    const type = Array.isArray(parsed)
      ? parsed.map((o) => o?.['@type']).filter(Boolean).join(', ')
      : parsed?.['@type']
    return type ? `Valid JSON — @type: ${type}` : 'Valid JSON, but no @type declared.'
  } catch (e) {
    return `Not valid JSON yet — ${e.message}`
  }
}
