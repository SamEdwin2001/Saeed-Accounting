import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner.jsx'

export default function NotFound() {
  return (
    <>
      <PageBanner title="Page Not Found" />

      <section className="section page">
        <div className="container page__inner">
          <p className="page__text">
            Sorry, we couldn&apos;t find the page you were looking for.
          </p>
          <Link className="btn btn--orange" to="/">
            BACK TO HOME
          </Link>
        </div>
      </section>
    </>
  )
}
