import { Link } from 'react-router-dom'
import Img from './Img.jsx'
import { IMAGES } from '../images.js'
import { WhatsApp, ArrowRight } from './Icons.jsx'
import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            Saeed
            <br />
            Accounting
          </h1>

          <p className="hero__text">
            Saeed Accounting conveys master monetary warning administrations in the core of Dubai,
            Business Bay. With 30 years of fruitful experience, our experts are custom fitted to
            address every client&apos;s issues across a large number of businesses. A gathering of
            expert bookkeepers handle complex ventures by carrying out the most recent systems and
            regulations. We put stock in coordinated correspondence with our neighborhood or
            worldwide clients to guarantee that their assumptions are surpassed.
          </p>

          <div className="hero__actions">
            <a
              className="btn btn--whatsapp"
              href={WHATSAPP_FALLBACK_HREF}
              onClick={handleWhatsappClick}
              target="_blank"
              rel="noreferrer"
            >
              <span className="btn__icon-circle">
                <WhatsApp />
              </span>
              WhatsApp us
            </a>

            <Link className="btn btn--ghost" to="/about-us">
              READ MORE
              <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="hero__media">
          <Img
            src={IMAGES.hero}
            alt="Business meeting at Saeed Accounting"
            className="hero__image"
            label="Hero image"
          />
        </div>
      </div>
    </section>
  )
}
