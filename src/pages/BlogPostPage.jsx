import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import PageBanner from '../components/PageBanner.jsx'
import Seo from '../components/Seo.jsx'
import { api } from '../admin/api.js'
import './blog.css'

const formatDate = (d) =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

const escapeHtml = (v) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* Inline markup an author may use partway through a line of otherwise plain
   text — a link on a phrase, a bold run. Only these tags survive; everything
   around them is still escaped, so prose containing < or > can't turn into
   markup by accident. What is kept has already been through the server's
   sanitiser on save (backend/routes/blog.js). */
const INLINE_TAG = /<\/?(?:a|strong|b|em|i|u|small|sup|sub|span|br)\b[^>]*>/gi

const renderText = (line) => {
  let html = ''
  let last = 0

  for (const match of line.matchAll(INLINE_TAG)) {
    html += escapeHtml(line.slice(last, match.index)) + match[0]
    last = match.index + match[0].length
  }

  return html + escapeHtml(line.slice(last))
}

/**
 * The admin form accepts either plain text or HTML.
 *
 * A post written entirely as HTML passes straight through. Otherwise it is
 * plain text, whose line breaks would collapse into one run-on block, so blank
 * lines become paragraphs and single newlines become <br>.
 *
 * The unit inside a block is the line, not the block: an author marking one
 * line up as a heading — `<h2 class="plain">…</h2>` for the outline search
 * engines read — should get that element, with the prose around it rendered
 * exactly as before. Detecting HTML across the whole body instead (the earlier
 * rule) meant a single tag anywhere dropped every line break in the post.
 */
const toHtml = (content) => {
  const text = String(content ?? '')
  if (/^\s*</.test(text)) return text

  const out = []

  for (const block of text.split(/\n{2,}/)) {
    /* Trimmed once, per block, rather than per paragraph: a blank line the
       author left directly above a heading is spacing between two pieces of
       prose and has to survive, even though the heading splits the paragraph
       at exactly that point. */
    const lines = block.split('\n').map((line) => line.trim())
    while (lines.length && !lines[0]) lines.shift()
    while (lines.length && !lines[lines.length - 1]) lines.pop()
    if (!lines.length) continue

    let paragraph = []
    const flush = () => {
      if (paragraph.some(Boolean)) out.push(`<p>${paragraph.map(renderText).join('<br>')}</p>`)
      paragraph = []
    }

    for (const line of lines) {
      if (line.startsWith('<')) {
        flush()
        out.push(line)
      } else {
        paragraph.push(line)
      }
    }

    flush()
  }

  return out.join('')
}

/**
 * /blog/<slug> — one post, addressed by the slug typed into the admin form.
 *
 * Renders its own <Seo> rather than relying on the ROUTE_SEO table, because the
 * title and description belong to the post and only exist once it has loaded.
 * App.jsx skips its route-level SEO for this path so the two never fight.
 *
 * The body is HTML the admin wrote, sanitised on the server before it was
 * stored — see the note in backend/routes/blog.js.
 */
export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [state, setState] = useState('loading') // 'loading' | 'ready' | 'missing' | 'error'

  /**
   * A link the author put in the post body is a plain <a>: the body is injected
   * as HTML, so react-router's <Link> can't be used there. Catching the click
   * here routes it in-app instead, so a link to /contact-us behaves like every
   * other link on the site rather than reloading the whole page.
   *
   * Left alone: modified clicks (open in a new tab), external URLs, anything
   * with target set, and anything a handler already dealt with.
   */
  const routeInternalLinks = (e) => {
    const link = e.target.closest?.('a')
    if (!link || e.defaultPrevented || e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    const href = link.getAttribute('href') || ''
    if (link.target || !href.startsWith('/')) return

    e.preventDefault()
    navigate(href)
  }

  useEffect(() => {
    let cancelled = false
    setState('loading')
    setPost(null)

    api.blog
      .bySlug(slug)
      .then(({ post }) => {
        if (cancelled) return
        setPost(post)
        setState('ready')
      })
      .catch((err) => {
        if (cancelled) return
        /* An unknown slug is a missing page, not a broken site — the two need
           different copy, and only the first should stay out of the index. */
        setState(/not found/i.test(err.message) ? 'missing' : 'error')
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (state === 'loading') {
    return (
      <>
        {/* Search Console reported "'noindex' detected in 'robots' meta tag" on
            live posts. This branch rendered no <Seo> at all, so the robots value
            left behind by the previous route stayed in <head> — and a crawler
            arriving cold saw whatever the 404 path had set. Declaring
            index/follow while the fetch is in flight keeps the page indexable
            from first paint; the ready branch below then fills in the real
            title and description. */}
        <Seo title="Blog" description={null} path={`/blog/${slug}`} />
        <PageBanner title="Blog" parent={{ label: 'Blog', to: '/blog' }} />
        <section className="section blog">
          <div className="container">
            <p className="blog-note">Loading…</p>
          </div>
        </section>
      </>
    )
  }

  if (state !== 'ready') {
    return (
      <>
        {/* noindex only for a slug that genuinely does not exist. A failed
            fetch is a live post the API could not serve this second — telling
            a crawler "noindex" then would drop a good page out of the index
            over a blip, and the next crawl is what should decide. This is the
            other half of the fix in the loading branch above: the catch that
            sets these two states already treats them differently, and the tag
            has to follow. */}
        <Seo
          title={state === 'missing' ? 'Post Not Found' : 'Blog'}
          description={null}
          path={`/blog/${slug}`}
          noindex={state === 'missing'}
        />
        <PageBanner
          title={state === 'missing' ? 'Post not found' : 'Something went wrong'}
          parent={{ label: 'Blog', to: '/blog' }}
        />
        <section className="section blog">
          <div className="container">
            <p className="blog-note">
              {state === 'missing'
                ? 'That post has been moved or removed.'
                : 'The post couldn’t be loaded just now. Please refresh the page to try again.'}
            </p>
            <p>
              <Link className="card__link" to="/blog">
                Back to all posts
              </Link>
            </p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Each field falls back to what the page used before the admin form
          gained them, so a post with no SEO overrides is unchanged. */}
      <Seo
        title={post.metaTitle || `${post.title} | Saeed Accounting`}
        description={post.metaDescription || post.excerpt}
        keywords={post.metaKeywords || undefined}
        canonical={post.canonical || undefined}
        path={`/blog/${post.slug}`}
      />

      <PageBanner title={post.title} parent={{ label: 'Blog', to: '/blog' }} />

      <section className="section blog">
        <div className="container">
          <article className="blog-article">
            {(post.date || post.categories.length > 0) && (
              <p className="blog-article__meta">
                {post.date && <span>{formatDate(post.date)}</span>}
                {post.categories.map((c) => (
                  <Link className="blog-card__cat" to="/blog" key={c}>
                    {c}
                  </Link>
                ))}
              </p>
            )}

            {post.image && (
              <img className="blog-article__hero" src={post.image} alt={post.title} />
            )}

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions --
                the handler only upgrades links that are already keyboard
                reachable; it adds no interaction of its own. */}
            <div
              className="blog-article__body"
              onClick={routeInternalLinks}
              dangerouslySetInnerHTML={{ __html: toHtml(post.content) }}
            />

            <p className="blog-article__back">
              <Link className="card__link" to="/blog">
                Back to all posts
              </Link>
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
