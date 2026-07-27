/* Each platform ships as a single logo-plus-rating image, so the marks, star
   rows and rating text that used to be composed here now live in the artwork.
   alt carries the rating for anyone who can't see the image. */
const BADGES = [
  {
    name: 'Google Reviews',
    alt: 'Google Reviews — 5 out of 5 rating',
    src: 'https://res.cloudinary.com/dekhukonj/image/upload/v1785133939/google-review-image_notske.webp',
  },
  {
    name: 'Trustpilot',
    alt: 'Trustpilot — 4.9 out of 5 rating',
    src: 'https://res.cloudinary.com/dekhukonj/image/upload/v1785133939/trust-pilot_ylhxfp.webp',
  },
  {
    name: 'Glassdoor',
    alt: 'Glassdoor — 5.0 rating',
    src: 'https://res.cloudinary.com/dekhukonj/image/upload/v1785133939/download_oxdsm6.webp',
  },
  {
    name: 'Gartner',
    alt: 'Gartner',
    src: 'https://res.cloudinary.com/dekhukonj/image/upload/v1785133939/Gartner_logo.svg-removebg-preview-768x176_sckn6l.webp',
  },
]

/**
 * Review-platform strip. `boxed` wraps the logos in a single white card
 * (Corporate Tax pages); otherwise each sits in its own card on a grey band
 * (VAT registration pages).
 */
export default function Badges({ boxed = false }) {
  return (
    <section className={`badges ${boxed ? 'badges--plain' : ''}`}>
      <div className="container">
        <div className={boxed ? 'badges__box' : 'badges__grid'}>
          {BADGES.map(({ name, alt, src }) => (
            <div className="badge" key={name}>
              <img className="badge__logo" src={src} alt={alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
