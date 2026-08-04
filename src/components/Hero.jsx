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
            Saeed Accounting delivers expert financial advisory services from the heart of Dubai,
            Business Bay. With 30 years of proven experience, our specialists tailor their approach
            to each client&apos;s needs across a wide range of industries. Our team of professional
            accountants handles complex engagements by applying the latest standards and
            regulations. We believe in close, consistent communication with our local and
            international clients to make sure their expectations are exceeded.
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
            alt="Saeed Accounting team meeting with a client to discuss accounting and tax services in Dubai"
            className="hero__image"
            label="Hero image"
          />
        </div>
      </div>
    </section>
  )
}
