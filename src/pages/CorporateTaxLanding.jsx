import Img from '../components/Img.jsx'
import Accordion from '../components/Accordion.jsx'
import Reviews from '../components/Reviews.jsx'
import ReviewsCarousel from '../components/ReviewsCarousel.jsx'
import Stats from '../components/Stats.jsx'
import Badges from '../components/Badges.jsx'
import Seo from '../components/Seo.jsx'
import { Accented } from './ServicePage.jsx'
import { WhatsApp, CheckCircle } from '../components/Icons.jsx'

import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

const WHATSAPP = WHATSAPP_FALLBACK_HREF
// Assured Quality, Result Driven, Dedicated Support — matched to FEATURES order.
const FEATURE_IMAGES = [
  '/images/services/feature-quality.png',
  '/images/services/feature-result.png',
  '/images/services/feature-support.jpg',
]

function WhatsAppButton() {
  return (
    <a
      className="btn btn--whatsapp"
      href={WHATSAPP}
      onClick={handleWhatsappClick}
      target="_blank"
      rel="noreferrer"
    >
      <span className="btn__icon-circle">
        <WhatsApp />
      </span>
      WhatsApp us
    </a>
  )
}

/**
 * Shared layout for /corporate-tax-filing and /corporate-tax-registration.
 * Sections keyed off the data: `penaltyLine`, `cardBottom` and `faqs` are
 * optional and their sections disappear when null.
 */
export default function CorporateTaxLanding({ data }) {
  const {
    pill, heroTitle, heroSub, heroChecks, heroOffer, heroImage, penaltyLine,
    heading, headingAccent, lead,
    cardLeft, cardRight, cardBottom,
    features, faqs, faqHeading, faqHeadingAccent,
    entryHeading, entryAccent, entryLead, priceTitle, priceAmount,
    showStats, carouselReviews,
  } = data

  return (
    <div className="ct-page">
      <Seo title={heroTitle} description={heroSub} />

      {/* Hero */}
      <section className="hero ct-hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="ct-pill">{pill}</span>
            <h1 className="ct-hero__title">{heroTitle}</h1>
            <p className="ct-hero__sub">{heroSub}</p>

            <ul className="ct-checks">
              {heroChecks.map((c) => (
                <li key={c}>
                  <CheckCircle className="ct-checks__icon" />
                  {c}
                </li>
              ))}
            </ul>

            <p className="ct-hero__offer">{heroOffer}</p>
            <WhatsAppButton />
          </div>

          <div className="hero__media">
            {/* Not the LCP element on mobile (the hero copy is), so it loads
                eagerly but must not outrank the fonts/CSS for bandwidth. */}
            <Img
              src={heroImage}
              alt={heroTitle}
              className="ct-hero__image"
              label="Hero image"
              loading="eager"
              fetchpriority="low"
              width="480"
              height="320"
            />
          </div>
        </div>
      </section>

      {penaltyLine && (
        <div className="penalty">
          <div className="container">
            <p className="penalty__text">{penaltyLine}</p>
          </div>
        </div>
      )}

      <Badges boxed />

      {/* Heading + lead + cards */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title ct-title">
            <Accented text={heading} accent={headingAccent} />
          </h2>
          <p className="page__lead">{lead}</p>

          <div className="ct-cards">
            <article className="ct-card ct-card--peach">
              <img
                className="ct-badge-img"
                src="/images/services/ct-badge-1.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width="96"
                height="96"
              />
              <h3 className="ct-card__title">{cardLeft.title}</h3>
              <ul className="ct-list">
                {cardLeft.items.map((item) => (
                  <li key={item.label}>
                    <CheckCircle className="ct-list__icon" />
                    <div>
                      <p className="ct-list__label">{item.label}</p>
                      {item.text && <p className="ct-list__text">{item.text}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <article className="ct-card ct-card--red">
              <img
                className="ct-badge-img"
                src="/images/services/ct-badge-2.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width="96"
                height="96"
              />
              <h3 className="ct-card__title">{cardRight.title}</h3>
              <ul className="ct-list">
                {cardRight.items.map((item) => (
                  <li key={item}>
                    <CheckCircle className="ct-list__icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {cardBottom && (
            <article className="ct-card ct-card--peach ct-card--wide">
              <img
                className="ct-badge-img ct-badge-img--center"
                src="/images/services/ct-badge-1.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width="96"
                height="96"
              />
              <h3 className="ct-card__title">{cardBottom.title}</h3>
              <ul className="ct-list">
                {cardBottom.items.map((item) => (
                  <li key={item}>
                    <CheckCircle className="ct-list__icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </section>

      {/* Three features */}
      <section className="features3">
        <div className="container features3__grid">
          {features.map((label, i) => (
            <div className="feature3" key={label}>
              <img
                className="feature3__img"
                src={FEATURE_IMAGES[i]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width="74"
                height="74"
              />
              <p className="feature3__label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band over a photo */}
      <section className="ct-cta">
        <div className="container ct-cta__inner">
          <span className="ct-pill">Work with us!</span>
          <h2 className="ct-cta__title">
            Our Dedicated &amp; <span className="accent">Experienced</span> Team
          </h2>
          <p className="ct-cta__line">BOOK A FREE 30-MINUTE CONSULTATION!</p>
          <WhatsAppButton />
        </div>
      </section>

      {faqs && (
        <section className="section section--tight">
          <div className="container">
            <h2 className="section__title">
              <Accented text={faqHeading} accent={faqHeadingAccent} />
            </h2>
            <Accordion items={faqs} />
          </div>
        </section>
      )}

      {/* Date of entry + price */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title ct-title">
            <Accented text={entryHeading} accent={entryAccent} />
          </h2>
          <p className="page__lead">{entryLead}</p>

          <div className="ct-price">
            <h3 className="ct-price__title">{priceTitle}</h3>
            <p className="ct-price__amount">{priceAmount}</p>
            <WhatsAppButton />
          </div>
        </div>
      </section>

      {carouselReviews ? <ReviewsCarousel /> : <Reviews />}
      {showStats && <Stats />}
    </div>
  )
}
