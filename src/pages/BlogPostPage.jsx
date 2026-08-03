import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

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

/**
 * The admin form accepts either plain text or HTML. Plain text carries no tags,
 * so its line breaks would collapse into one run-on block — split it into
 * paragraphs first. Anything with a tag in it is already HTML and passes
 * through untouched.
 */
const toHtml = (content) => {
  const text = String(content ?? '')
  if (/<[a-z][\s\S]*>/i.test(text)) return text

  return text
    .split(/\n{2,}/)
    .filter((block) => block.trim())
    .map((block) => `<p>${escapeHtml(block.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('')
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
  const [post, setPost] = useState(null)
  const [state, setState] = useState('loading') // 'loading' | 'ready' | 'missing' | 'error'

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
        <Seo
          title={state === 'missing' ? 'Post Not Found' : 'Blog'}
          description={null}
          path={`/blog/${slug}`}
          noindex
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
      <Seo
        title={`${post.title} | Saeed Accounting`}
        description={post.excerpt}
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

            <div
              className="blog-article__body"
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
