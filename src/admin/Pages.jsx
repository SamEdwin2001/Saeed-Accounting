import { useEffect, useState } from 'react'

import { api } from './api.js'

/* Same targets the blog form uses, and the same reason: they are the widths
   Google renders before it truncates, so going over is a warning rather than
   an error — the client's wording wins. */
const TITLE_BEST = 60
const DESC_BEST = 160

const EMPTY = { title: '', description: '', keywords: '', canonical: '', schema: '' }

/* A FAQPage, because that is the block these pages need most often — but the
   field takes any schema.org type, so the example is a starting point rather
   than a template to fill in. */
const SCHEMA_PLACEHOLDER = `{
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
const schemaNote = (text) => {
  const v = text.trim()
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

/**
 * Meta for the site's own pages.
 *
 * The list is not stored anywhere: the server reads it from the routes the site
 * declares, so a page added in code appears here by itself. What the database
 * holds is only what has been edited — a page left alone keeps the meta that
 * ships in the bundle, and "Reset" puts it back to exactly that.
 *
 * Blog posts are deliberately absent. Their meta already has a home on the Blog
 * screen, next to the body it describes.
 */
export default function PagesPage() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* The page being edited, by path. '' is the homepage and is a real key, so
     "nothing open" has to be null rather than a falsy path. */
  const [openPath, setOpenPath] = useState(null)
  const [values, setValues] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')

  const load = () => {
    setLoading(true)
    api.pages
      .list()
      .then(({ pages }) => {
        setPages(pages)
        setError('')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const open = (page) => {
    setOpenPath(page.path)
    setValues(page.override ?? EMPTY)
    setSaved('')
    setError('')
  }

  const close = () => {
    setOpenPath(null)
    setValues(EMPTY)
    setSaved('')
  }

  const setField = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      await api.pages.save(openPath, values)
      /* Re-read rather than patching the row in place: the server is what
         decides whether a page counts as edited, and it trims the values. */
      const { pages: fresh } = await api.pages.list()
      setPages(fresh)
      setSaved('Saved — live on the site now.')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const reset = async () => {
    setSaving(true)
    setError('')
    try {
      await api.pages.reset(openPath)
      const { pages: fresh } = await api.pages.list()
      setPages(fresh)
      setValues(EMPTY)
      setSaved('Reset — this page uses its built-in meta again.')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="adm-note">Loading pages…</p>

  return (
    <section className="pg">
      <div className="pg__head">
        <div>
          <h2 className="pg__title">Pages</h2>
          <p className="pg__sub">
            {pages.length} pages, read from the site&rsquo;s own routes. Add a page in code and it
            appears here on its own. Changes go live as soon as you save — no deploy.
          </p>
        </div>
      </div>

      {error && <p className="adm-error">{error}</p>}

      <div className="pg__list">
        {pages.map((p) => (
          <div className={`pg-row ${openPath === p.path ? 'is-open' : ''}`} key={p.path || 'home'}>
            <button className="pg-row__head" onClick={() => (openPath === p.path ? close() : open(p))}>
              <span className="pg-row__main">
                <span className="pg-row__label">{p.label}</span>
                <code className="pg-row__url">{p.url === '/' ? '/' : p.url}</code>
              </span>
              <span className={`pg-tag ${p.edited ? 'pg-tag--edited' : ''}`}>
                {p.edited ? 'Custom' : 'Default'}
              </span>
            </button>

            {openPath === p.path && (
              <div className="pg-form">
                <p className="pg-form__note">
                  Leave a field blank to keep what the page already uses. Only what you type here
                  replaces it.
                </p>

                <label className="adm-field">
                  <span>
                    Meta title{' '}
                    <em className={`blg-hint ${values.title.length > TITLE_BEST ? 'blg-hint--over' : ''}`}>
                      ({values.title.length}/{TITLE_BEST} — the blue line in search results)
                    </em>
                  </span>
                  <input
                    type="text"
                    value={values.title}
                    onChange={setField('title')}
                    maxLength={255}
                    placeholder="Leave blank to keep the current title"
                  />
                </label>

                <label className="adm-field">
                  <span>
                    Meta description{' '}
                    <em
                      className={`blg-hint ${
                        values.description.length > DESC_BEST ? 'blg-hint--over' : ''
                      }`}
                    >
                      ({values.description.length}/{DESC_BEST} — the grey text under the link)
                    </em>
                  </span>
                  <textarea
                    rows={3}
                    value={values.description}
                    onChange={setField('description')}
                    maxLength={500}
                    placeholder="Leave blank to keep the current description"
                  />
                </label>

                <label className="adm-field">
                  <span>
                    Meta keywords <em className="blg-hint">(separate with commas)</em>
                  </span>
                  <input
                    type="text"
                    value={values.keywords}
                    onChange={setField('keywords')}
                    maxLength={500}
                    placeholder="vat services uae, tax consultant dubai"
                  />
                </label>

                <label className="adm-field">
                  <span>
                    Canonical URL{' '}
                    <em className="blg-hint">
                      (only when this page also lives at another address — otherwise leave blank)
                    </em>
                  </span>
                  <input
                    type="text"
                    value={values.canonical}
                    onChange={setField('canonical')}
                    maxLength={500}
                    placeholder={`https://saeedaccounting.com${p.url === '/' ? '/' : p.url}`}
                  />
                </label>

                <label className="adm-field">
                  <span>
                    Schema (JSON-LD){' '}
                    <em className="blg-hint">
                      (paste the block for this page — FAQPage, Service, Article, anything
                      schema.org defines. Leave blank if the page needs none.)
                    </em>
                  </span>
                  <textarea
                    className="pg-schema"
                    rows={10}
                    value={values.schema}
                    onChange={setField('schema')}
                    spellCheck={false}
                    placeholder={SCHEMA_PLACEHOLDER}
                  />
                  <em className="blg-hint">
                    {schemaNote(values.schema)}
                  </em>
                </label>

                {saved && <p className="pg-form__ok">{saved}</p>}

                <div className="pg-form__foot">
                  <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  {p.edited && (
                    <button className="adm-btn" onClick={reset} disabled={saving}>
                      Reset to default
                    </button>
                  )}
                  <a className="adm-btn" href={p.url} target="_blank" rel="noreferrer">
                    View page
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
