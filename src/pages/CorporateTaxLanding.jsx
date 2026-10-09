import { Link } from 'react-router-dom'

import Img from '../components/Img.jsx'
import Accordion from '../components/Accordion.jsx'
import Reviews from '../components/Reviews.jsx'
import ReviewsCarousel from '../components/ReviewsCarousel.jsx'
import Stats from '../components/Stats.jsx'
import Badges from '../components/Badges.jsx'
import { Accented } from './ServicePage.jsx'
import { WhatsApp, CheckCircle } from '../components/Icons.jsx'

import Price from '../components/Price.jsx'
import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

const WHATSAPP = WHATSAPP_FALLBACK_HREF

/**
 * The lead paragraph, with named phrases linked.
 *
 * Splits on each phrase rather than taking HTML from the data, so the copy
 * stays plain text and a stray tag in it cannot reach the page. A phrase that
 * does not occur is skipped — a typo costs its link, not the sentence.
 *
 * Phrases are taken longest-first and each match consumes its span, so a short
 * phrase that also occurs inside a longer one links the remaining occurrence
 * rather than cutting the longer link in half.
 */
function Lead({ text, links }) {
  const wanted = (links ?? []).filter((l) => l?.text && l?.href)
  if (!wanted.length) return <p className="page__lead">{text}</p>

  /* Claim a span per phrase, longest first, skipping any that would overlap
     one already claimed. */
  const spans = []
  for (const link of [...wanted].sort((a, b) => b.text.length - a.text.length)) {
    let from = 0
    for (;;) {
      const at = text.indexOf(link.text, from)
      if (at < 0) break
      const end = at + link.text.length
      if (!spans.some((s) => at < s.end && end > s.at)) {
        spans.push({ at, end, link })
        break
      }
      from = at + 1
    }
  }

  if (!spans.length) return <p className="page__lead">{text}</p>

  spans.sort((a, b) => a.at - b.at)

  const parts = []
  let cursor = 0
  spans.forEach((s, i) => {
    if (s.at > cursor) parts.push(text.slice(cursor, s.at))
    parts.push(
      <Link to={s.link.href} key={`${s.link.href}-${i}`}>
        {text.slice(s.at, s.end)}
      </Link>
    )
    cursor = s.end
  })
  if (cursor < text.length) parts.push(text.slice(cursor))

  return <p className="page__lead">{parts}</p>
}

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
    pill, heroTitle, heroSub, heroChecks, heroOffer, heroImage, heroImageAlt, penaltyLine,
    heading, headingAccent, lead, leadLinks,
    cardLeft, cardRight, cardBottom,
    notesHeading, notesAccent, notes, stepsHeading, steps,
    faqs, faqHeading, faqHeadingAccent,
    entryHeading, entryAccent, entryLead, priceTitle, priceAmount,
    showStats, carouselReviews,
  } = data

  return (
    <div className="ct-page">

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

            <p className="ct-hero__offer">
              <Price>{heroOffer}</Price>
            </p>
            <WhatsAppButton />
          </div>

          <div className="hero__media">
            {/* Not the LCP element on mobile (the hero copy is), so it loads
                eagerly but must not outrank the fonts/CSS for bandwidth. */}
            {/* Describes the photo. Falling back to heroTitle would repeat the
                <h1> above it word for word. */}
            <Img
              src={heroImage}
              alt={heroImageAlt || `${heroTitle} services at Saeed Accounting`}
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
            <p className="penalty__text">
              <Price>{penaltyLine}</Price>
            </p>
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
          <Lead text={lead} links={leadLinks} />

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

      {/* Cost and deadline, then the EmaraTax steps. Both optional: a page
          whose data omits them renders neither section. */}
      {/* Cost, deadline and the EmaraTax steps, three across. Optional: a page
          whose data omits them renders nothing here. */}
      {(notes?.length || steps?.length) && (
        <section className="section section--tight">
          <div className="container">
            {notesHeading && (
              <h2 className="section__title ct-title">
                <Accented text={notesHeading} accent={notesAccent} />
              </h2>
            )}

            <div className="ct-notes">
              {notes?.map((note) => (
                <article className="ct-note" key={note.title}>
                  <h3 className="ct-note__title">{note.title}</h3>

                  {/* A card carries any of three shapes: points, a paragraph,
                      or label/value pairs. Points come first — they are the
                      takeaway, and the paragraph is the detail behind it. */}
                  {note.lines?.length > 0 && (
                    <ul className="ct-note__lines">
                      {note.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}

                  {note.body && <p className="ct-note__body">{note.body}</p>}

                  {note.items?.length > 0 && (
                    /* An <ol>: these are numbered on screen, so the numbering
                       should be in the markup rather than only in the CSS. */
                    <ol className="ct-note__items">
                      {note.items.map((item) => (
                        <li key={item.label}>
                          <strong>{item.label}:</strong> {item.value}
                        </li>
                      ))}
                    </ol>
                  )}
                </article>
              ))}

              {steps?.length > 0 && (
                <article className="ct-note ct-note--steps">
                  <h3 className="ct-note__title">{stepsHeading}</h3>
                  {/* An ordered list, not styled divs: the order is the
                      instruction, and a screen reader should announce it. */}
                  <ol className="ct-steps__list">
                    {steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              )}
            </div>
          </div>
        </section>
      )}

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
            <p className="ct-price__amount">
              <Price>{priceAmount}</Price>
            </p>
            <WhatsAppButton />
          </div>
        </div>
      </section>

      {carouselReviews ? <ReviewsCarousel /> : <Reviews />}
      {showStats && <Stats />}
    </div>
  )
}
