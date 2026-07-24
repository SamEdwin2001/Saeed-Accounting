import { Star, GoogleG, TrustpilotStar } from './Icons.jsx'

const BADGES = [
  { name: 'Google Reviews', rating: '5/5 Rating', Mark: GoogleG, stars: 5 },
  { name: 'Trustpilot', rating: '4.9/5 Rating', Mark: TrustpilotStar, stars: 5 },
  { name: 'glassdoor', rating: '5.0', stars: 5, green: true },
  { name: 'Gartner', rating: null, wordmark: true },
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
          {BADGES.map(({ name, rating, Mark, stars, green, wordmark }) => (
            <div className={`badge ${wordmark ? 'badge--wordmark' : ''}`} key={name}>
              {Mark && <Mark className="badge__mark" />}
              <div className="badge__body">
                <span className={`badge__name ${green ? 'badge__name--green' : ''}`}>{name}</span>
                {rating && (
                  <span className="badge__meta">
                    <span className="badge__stars" aria-hidden="true">
                      {Array.from({ length: stars || 0 }, (_, i) => (
                        <Star key={i} />
                      ))}
                    </span>
                    <span className="badge__rating">{rating}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
