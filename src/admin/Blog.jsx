import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api.js'
import { EditIcon, Trash, Plus, Close } from '../components/Icons.jsx'

/* Mirrors the server's slugify, so the "/blog/…" preview under the slug box
   shows the address the post will actually get. */
const slugify = (v) =>
  String(v ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/* The date input wants yyyy-mm-dd, and a new post defaults to today. */
const todayISO = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const emptyForm = () => ({
  title: '',
  slug: '',
  categories: '',
  date: todayISO(),
  content: '',
  image: '',
  published: true,
  /* SEO overrides — all optional. Left blank, the article falls back to its own
     title and an excerpt of the body (see BlogPostPage). */
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  canonical: '',
})

/* Google truncates around these lengths in the results page. Shown as a live
   count so the author sees the overflow while typing, not after publishing. */
const META_TITLE_BEST = 60
const META_DESC_BEST = 160

const formatDate = (d) =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

export default function Blog() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* null = the list. Otherwise { mode: 'create'|'edit', id, values } and the
     form takes over the page — the post body needs far more room than a modal
     gives it. */
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)

  /* Delete confirmation: null | row. */
  const [pending, setPending] = useState(null)
  const [confirmBusy, setConfirmBusy] = useState(false)

  const fileInput = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { posts } = await api.blog.admin.list()
      setRows(posts)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setFormError('')
    setForm({ mode: 'create', id: null, values: emptyForm() })
  }

  /* The list omits each post's body to keep it light, so the edit form fetches
     the full row before it opens. */
  const openEdit = async (row) => {
    setFormError('')
    setError('')
    try {
      const { post } = await api.blog.admin.one(row.id)
      setForm({
        mode: 'edit',
        id: post.id,
        values: {
          title: post.title,
          slug: post.slug,
          categories: post.categories.join(', '),
          date: post.date || '',
          content: post.content,
          image: post.image || '',
          published: post.published,
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          metaKeywords: post.metaKeywords || '',
          canonical: post.canonical || '',
        },
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const closeForm = () => setForm(null)

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, values: { ...f.values, [key]: e.target.value } }))

  const pickImage = async (e) => {
    const file = e.target.files?.[0]
    /* Reset immediately so re-picking the same file still fires a change. */
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setFormError('')
    try {
      const url = await api.blog.admin.uploadImage(file)
      setForm((f) => ({ ...f, values: { ...f.values, image: url } }))
    } catch (err) {
      setFormError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    const { title, content } = form.values
    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are required.')
      return
    }

    setSaving(true)
    try {
      if (form.mode === 'create') await api.blog.admin.create(form.values)
      else await api.blog.admin.update(form.id, form.values)
      closeForm()
      load()
    } catch (err) {
      setFormError(err.message || 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  /* Publish/unpublish from the list, without opening the post. */
  const togglePublished = async (row) => {
    try {
      await api.blog.admin.update(row.id, { published: !row.published })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const runDelete = async () => {
    setConfirmBusy(true)
    try {
      await api.blog.admin.remove(pending.id)
      setPending(null)
      load()
    } catch (err) {
      setError(err.message)
      setPending(null)
    } finally {
      setConfirmBusy(false)
    }
  }

  /* ---------- Form ---------- */
  if (form) {
    const { values } = form
    const preview = slugify(values.slug) || slugify(values.title)

    return (
      <>
        <div className="adm-head">
          <div>
            <h1 className="adm-h1">Blog</h1>
            <p className="adm-crumb">
              {form.mode === 'create' ? 'New post' : `Editing “${values.title || 'post'}”`}
            </p>
          </div>
        </div>

        <form className="blg-form" onSubmit={save}>
          <div className="blg-form__media">
            <div className="blg-thumb blg-thumb--lg">
              {values.image ? (
                <img src={values.image} alt="" />
              ) : (
                <span className="blg-thumb__empty">No image</span>
              )}
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={pickImage}
            />
            <button
              type="button"
              className="adm-btn blg-upload"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : values.image ? 'Replace image' : 'Upload image'}
            </button>

            {values.image && (
              <button
                type="button"
                className="blg-remove"
                onClick={() => setForm((f) => ({ ...f, values: { ...f.values, image: '' } }))}
              >
                Remove image
              </button>
            )}
          </div>

          <div className="blg-form__fields">
            <label className="adm-field">
              <span>Title</span>
              <input type="text" value={values.title} onChange={setField('title')} required />
            </label>

            <label className="adm-field">
              <span>
                URL slug{' '}
                <em className="blg-hint">
                  (the /blog/… address — leave blank to make one from the title)
                </em>
              </span>
              <input
                type="text"
                value={values.slug}
                onChange={setField('slug')}
                placeholder="best-pre-workout-foods"
              />
              <code className="blg-slug">/blog/{preview || '…'}</code>
            </label>

            <label className="adm-field">
              <span>
                Categories <em className="blg-hint">(separate with commas)</em>
              </span>
              <input
                type="text"
                value={values.categories}
                onChange={setField('categories')}
                placeholder="VAT, Corporate Tax, Bookkeeping"
              />
            </label>

            <label className="adm-field">
              <span>Date</span>
              <input type="date" value={values.date} onChange={setField('date')} />
            </label>

            <label className="adm-field">
              <span>
                Content{' '}
                <em className="blg-hint">
                  (the full post — plain text, or HTML for headings, bold, lists, images)
                </em>
              </span>
              <textarea
                rows={14}
                value={values.content}
                onChange={setField('content')}
                placeholder="Write the post here…"
                required
              />
            </label>

            <fieldset className="blg-seo">
              <legend className="blg-seo__title">Search engine (SEO)</legend>
              <p className="blg-seo__note">
                All four are optional. Left blank, the post uses its own title and the first
                lines of the content — exactly as it does today.
              </p>

              <label className="adm-field">
                <span>
                  Meta title{' '}
                  <em
                    className={`blg-hint ${
                      values.metaTitle.length > META_TITLE_BEST ? 'blg-hint--over' : ''
                    }`}
                  >
                    ({values.metaTitle.length}/{META_TITLE_BEST} — the blue link in Google)
                  </em>
                </span>
                <input
                  type="text"
                  value={values.metaTitle}
                  onChange={setField('metaTitle')}
                  maxLength={255}
                  placeholder={
                    values.title
                      ? `${values.title} | Saeed Accounting`
                      : 'Corporate Tax Consultants in Dubai | Saeed Accounting'
                  }
                />
              </label>

              <label className="adm-field">
                <span>
                  Meta description{' '}
                  <em
                    className={`blg-hint ${
                      values.metaDescription.length > META_DESC_BEST ? 'blg-hint--over' : ''
                    }`}
                  >
                    ({values.metaDescription.length}/{META_DESC_BEST} — the grey text under the
                    link)
                  </em>
                </span>
                <textarea
                  rows={3}
                  value={values.metaDescription}
                  onChange={setField('metaDescription')}
                  maxLength={500}
                  placeholder="One or two sentences describing the post, written for the person reading the search results."
                />
              </label>

              <label className="adm-field">
                <span>
                  Meta keywords <em className="blg-hint">(separate with commas)</em>
                </span>
                <input
                  type="text"
                  value={values.metaKeywords}
                  onChange={setField('metaKeywords')}
                  maxLength={500}
                  placeholder="corporate tax dubai, tax registration uae, vat filing"
                />
              </label>

              <label className="adm-field">
                <span>
                  Canonical URL{' '}
                  <em className="blg-hint">
                    (only when the same article also lives at another address — otherwise leave
                    blank)
                  </em>
                </span>
                <input
                  type="text"
                  value={values.canonical}
                  onChange={setField('canonical')}
                  maxLength={500}
                  placeholder="https://www.saeedaccounting.com/blog/…"
                />
                <code className="blg-slug">
                  Blank → https://www.saeedaccounting.com/blog/{preview || '…'}
                </code>
              </label>
            </fieldset>

            <label className="blg-check">
              <input
                type="checkbox"
                checked={values.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, values: { ...f.values, published: e.target.checked } }))
                }
              />
              <span>
                Published <em className="blg-hint">(unticked = a draft, hidden from the site)</em>
              </span>
            </label>

            {formError && (
              <p className="adm-alert" role="alert">
                {formError}
              </p>
            )}

            <div className="blg-form__foot">
              <button type="submit" className="wa-save" disabled={saving || uploading}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="adm-btn" onClick={closeForm} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </>
    )
  }

  /* ---------- List ---------- */
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-h1">Blog</h1>
          <p className="adm-crumb">Posts shown at /blog on the website</p>
        </div>
        <button className="wa-add" onClick={openCreate}>
          <Plus />
          Add post
        </button>
      </div>

      {error && (
        <p className="adm-alert" role="alert">
          {error}
        </p>
      )}

      <section className="adm-panel">
        <div className="adm-panel__head">
          <h2 className="adm-panel__title">All posts</h2>
          <span className="adm-panel__count">{rows.length} total</span>
        </div>

        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>URL</th>
                <th>Categories</th>
                <th>Date</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td className="adm-empty" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="adm-empty" colSpan={6}>
                    No posts yet. Click “Add post” to write your first one.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="blg-row">
                        <div className="blg-thumb">
                          {r.image ? (
                            <img src={r.image} alt="" />
                          ) : (
                            <span className="blg-thumb__empty">No image</span>
                          )}
                        </div>
                        <span className="adm-strong">{r.title}</span>
                      </div>
                    </td>
                    <td>
                      <a
                        className="adm-link"
                        href={`/blog/${r.slug}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        /blog/{r.slug}
                      </a>
                    </td>
                    <td>
                      {r.categories.length ? (
                        <span className="blg-cats">
                          {r.categories.map((c) => (
                            <span className="blg-cat" key={c}>
                              {c}
                            </span>
                          ))}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="adm-nowrap adm-dim">{formatDate(r.date)}</td>
                    <td>
                      <span
                        className={`wa-badge ${r.published ? 'wa-badge--active' : 'wa-badge--inactive'}`}
                      >
                        {r.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="wa-actions">
                        <button
                          className={`wa-switch ${r.published ? 'is-on' : ''}`}
                          onClick={() => togglePublished(r)}
                          role="switch"
                          aria-checked={r.published}
                          aria-label={r.published ? 'Unpublish post' : 'Publish post'}
                          title={r.published ? 'Unpublish' : 'Publish'}
                        >
                          <span className="wa-switch__knob" />
                        </button>
                        <button
                          className="wa-icon-btn wa-icon-btn--edit"
                          onClick={() => openEdit(r)}
                          aria-label={`Edit ${r.title}`}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="wa-icon-btn wa-icon-btn--danger"
                          onClick={() => setPending(r)}
                          aria-label={`Delete ${r.title}`}
                          title="Delete"
                        >
                          <Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {pending && (
        <div className="wa-overlay" onMouseDown={() => !confirmBusy && setPending(null)}>
          <div
            className="wa-dialog wa-dialog--confirm"
            role="alertdialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="wa-dialog__head">
              <h3 className="wa-dialog__title">Delete post</h3>
              <button
                className="wa-dialog__close"
                onClick={() => !confirmBusy && setPending(null)}
                aria-label="Close"
              >
                <Close />
              </button>
            </div>

            <div className="wa-confirm">
              <p className="wa-confirm__text">
                Delete <strong>{pending.title}</strong>? The page at{' '}
                <strong>/blog/{pending.slug}</strong> will stop working. This cannot be undone.
              </p>

              <div className="wa-dialog__foot">
                <button
                  type="button"
                  className="adm-btn"
                  onClick={() => setPending(null)}
                  disabled={confirmBusy}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="wa-save wa-save--danger"
                  onClick={runDelete}
                  disabled={confirmBusy}
                >
                  {confirmBusy ? 'Working…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
