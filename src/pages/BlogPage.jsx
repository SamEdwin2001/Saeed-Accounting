import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PageBanner from '../components/PageBanner.jsx'
import Img from '../components/Img.jsx'
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

/**
 * /blog — every published post, with a chip row that filters by category.
 *
 * Posts come from the admin panel rather than a data file, so this fetches on
 * mount. Filtering happens in the browser: the whole published set is already
 * here, and a round trip per chip would make the filter feel slower than it is.
 */
export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [active, setActive] = useState('All')
  const [state, setState] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false

    api.blog
      .list()
      .then(({ posts, categories }) => {
        if (cancelled) return
        setPosts(posts)
        setCategories(categories)
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })

    /* The response can land after a visitor has navigated away — setting state
       on the unmounted page would warn and do nothing useful. */
    return () => {
      cancelled = true
    }
  }, [])

  const shown = useMemo(() => {
    if (active === 'All') return posts
    return posts.filter((p) => p.categories.some((c) => c.toLowerCase() === active.toLowerCase()))
  }, [posts, active])

  return (
    <>
      <PageBanner
        title={
          <>
            Our <span className="accent">Blog</span>
          </>
        }
      />

      <section className="section blog">
        <div className="container">
          {categories.length > 0 && (
            <div className="blog-filters" role="tablist" aria-label="Filter posts by category">
              {['All', ...categories].map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active === c}
                  className={`blog-chip ${active === c ? 'is-active' : ''}`}
                  onClick={() => setActive(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {state === 'loading' && <p className="blog-note">Loading posts…</p>}

          {state === 'error' && (
            <p className="blog-note">
              Posts couldn’t be loaded just now. Please refresh the page to try again.
            </p>
          )}

          {state === 'ready' && shown.length === 0 && (
            <p className="blog-note">
              {posts.length === 0
                ? 'No posts have been published yet. Check back soon.'
                : `No posts in “${active}” yet.`}
            </p>
          )}

          {shown.length > 0 && (
            <div className="blog-grid">
              {shown.map((post) => (
                <article className="blog-card" key={post.slug}>
                  {/* The title below is the real link; this one is the same
                      destination made clickable, so it is hidden from screen
                      readers rather than announced twice. */}
                  <Link
                    className="blog-card__media"
                    to={`/blog/${post.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {/* An empty src would resolve to the page's own URL and
                        fetch the HTML, so a post with no image gets the
                        placeholder box directly instead. */}
                    {post.image ? (
                      <Img src={post.image} alt="" label="No image" />
                    ) : (
                      <span className="blog-card__noimage" />
                    )}
                  </Link>

                  <div className="blog-card__body">
                    {post.categories.length > 0 && (
                      <p className="blog-card__cats">
                        {post.categories.map((c) => (
                          <span className="blog-card__cat" key={c}>
                            {c}
                          </span>
                        ))}
                      </p>
                    )}

                    <h2 className="blog-card__title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {post.date && <p className="blog-card__date">{formatDate(post.date)}</p>}
                    {post.excerpt && <p className="blog-card__text">{post.excerpt}</p>}

                    {/* aria-label names the post: a screen reader listing the
                        page's links would otherwise hear "Read more" once per
                        card with nothing to tell them apart. */}
                    <Link
                      className="card__link blog-card__link"
                      to={`/blog/${post.slug}`}
                      aria-label={`Read more: ${post.title}`}
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
