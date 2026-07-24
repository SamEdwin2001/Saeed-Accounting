import { Link } from 'react-router-dom'
import { CheckCircle, BriefcaseIcon, ScaleIcon, HandshakeIcon } from './Icons.jsx'

const FEATURES = [
  { icon: CheckCircle, text: 'Adapts services to suit your business model' },
  { icon: BriefcaseIcon, text: 'Provides customized advice and actionable insights' },
  { icon: ScaleIcon, text: 'Offers a nuanced understanding of the UAE market and laws' },
  { icon: HandshakeIcon, text: 'Extends continued & personalized support to conquer business challenges' },
]

export default function TeamCta() {
  return (
    <section className="team">
      <div className="container team__inner">
        <div className="team__copy">
          <p className="team__kicker">Work with us!</p>
          <h2 className="team__title">
            Our Dedicated &amp;
            <br />
            Experienced Team
          </h2>
          <Link className="btn btn--orange btn--block" to="/contact-us">
            BOOK A FREE 30-MINUTE CONSULTATION!
          </Link>
        </div>

        <div className="team__grid">
          {FEATURES.map(({ icon: Icon, text }) => (
            <article className="feature" key={text}>
              <span className="feature__icon">
                <Icon />
              </span>
              <p className="feature__text">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
