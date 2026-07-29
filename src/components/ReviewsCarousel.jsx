import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from './Icons.jsx'

const REVIEWS = [
  { text: 'Good Service .Good staff and very very supportive. feel nice to work with', stars: 5 },
  { text: 'Very professional team. They handled our corporate tax filing quickly and kept us informed at every step.', stars: 5 },
  { text: 'Reliable bookkeeping and always on time with the tax returns. Highly recommended for new businesses in Dubai.', stars: 5 },
]

/** Single-card review carousel with prev/next arrows. */
export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0)

  const review = REVIEWS[index]

  const go = (step) => setIndex((i) => (i + step + REVIEWS.length) % REVIEWS.length)

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
