import { Star } from './Icons.jsx'

const REVIEWS = [
  {
    name: 'Ahmed Al Rashidi',
    role: 'LLC Owner, Dubai Mainland',
    stars: 5,
    text:
      'Saeed Accounting handled our entire corporate tax filing smoothly. Very professional team, clear communication, and delivered within 48 hours exactly as promised.',
  },
  {
    name: 'Sara Al Mansoori',
    role: 'Director, DMCC Free Zone Company',
    stars: 5,
    text:
      'I approached Saeed Accounting for our DMCC free zone CT filing. Their service was exemplary — professional, knowledgeable, and they guided us through every step with confidence.',
  },
  {
    name: 'Khalid Hassan',
    role: 'Sole Establishment, Karama',
    stars: 5,
    text:
      'Fast, efficient, and no fuss. Got my TRN and corporate tax filing done without any hassle. The team was very responsive on WhatsApp throughout. Will definitely use again!',
  },
]

export default function Reviews() {
  return (
    <section className="section client-reviews">
      <div className="container">
        <p className="eyebrow eyebrow--left">Client Reviews</p>
        <h2 className="section__title cr-title">
          What Our Clients Say About <span className="accent">Saeed Accounting</span>
        </h2>

        <div className="cr-grid">
          {REVIEWS.map((r) => (
            <article className="cr-card" key={r.name}>
              <div className="cr-stars" aria-label={`${r.stars} out of 5 stars`}>
                {Array.from({ length: r.stars }, (_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="cr-text">{r.text}</p>
              <div className="cr-author">
                <div className="cr-avatar">{r.name.charAt(0)}</div>
                <div>
                  <div className="cr-name">{r.name}</div>
                  <div className="cr-role">{r.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
