import { Link } from 'react-router-dom'

/**
 * Breadcrumb + page title strip that sits under the transparent header
 * on every inner page. Reuses the hero's cream/orange gradient.
 */
export default function PageBanner({ title }) {
  return (
    <section className="banner">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb__current" aria-current="page">
            {title}
          </span>
        </nav>
        <h1 className="banner__title">{title}</h1>
      </div>
    </section>
  )
}
