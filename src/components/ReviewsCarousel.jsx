import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Quote } from './Icons.jsx'

const REVIEWS = [
  {
    text: 'Good Service .Good staff and very very supportive. feel nice to work with UAE Vat Registration',
    stars: 5,
    /* Names the old service wording, which the online-registration landing
       page has moved away from. Reviews are customers' own words, so it is
       held back there rather than edited. */
    hideOnLanding: true,
  },
  { text: 'Very professional team. They handled our corporate tax registration quickly and kept us informed at every step.', stars: 5 },
  { text: 'Reliable bookkeeping and always on time with the VAT returns. Highly recommended for new businesses in Dubai.', stars: 5 },
]

/** Single-card review carousel with prev/next arrows. */
export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0)
  const { pathname } = useLocation()

  const reviews =
    pathname === '/register-for-vat-online-uae' ? REVIEWS.filter((r) => !r.hideOnLanding) : REVIEWS

  /* Wrapped rather than clamped, so an index carried over from the unfiltered
     list still lands on a real review. */
  const current = index % reviews.length
  const review = reviews[current]

  const go = (step) => setIndex(() => (current + step + reviews.length) % reviews.length)

  return (
    <section className="section reviews">
      <div className="container">
        <p className="eyebrow">Clients Feedback</p>
        <h2 className="section__title">Our Clients Reviews</h2>

        <div className="reviews__stage">
          <article className="review-card">
            <div className="reviews__nav">
              <button className="reviews__arrow" onClick={() => go(-1)} aria-label="Previous review">
                <ChevronLeft />
              </button>
              <button className="reviews__arrow" onClick={() => go(1)} aria-label="Next review">
                <ChevronRight />
              </button>
            </div>

            <div className="review-card__body">
              <p className="review-card__text">
                <Quote className="review-card__quote" />
                {review.text}
              </p>
              <div className="review-card__stars" aria-label={`${review.stars} out of 5 stars`}>
                {Array.from({ length: review.stars }, (_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
