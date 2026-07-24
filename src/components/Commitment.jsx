import Img from './Img.jsx'
import { IMAGES } from '../images.js'

const SKILLS = [
  { label: 'Confidentiality', value: 100 },
  { label: 'Commitment', value: 96 },
  { label: 'Timely Response', value: 98 },
  { label: 'Team Work', value: 97 },
]

export default function Commitment() {
  return (
    <section className="section commitment">
      <div className="container commitment__inner">
        <div className="skills">
          {SKILLS.map((s, i) => (
            <div className="skill" key={s.label}>
              <span className="skill__label">{s.label}</span>
              <div className="skill__track">
                <div
                  className={`skill__fill ${i % 2 === 0 ? 'skill__fill--orange' : 'skill__fill--dark'}`}
                  style={{ width: `${s.value}%` }}
                  role="progressbar"
                  aria-valuenow={s.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={s.label}
                >
                  <span className="skill__value">{s.value}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="collage">
          <Img
            src={IMAGES.collage}
            alt="The Saeed Accounting team at work"
            className="collage__image"
            label="Collage image"
          />
        </div>

        <h2 className="commitment__title">
          We are
          <br />
          committed to
          <br />
          your success
        </h2>
      </div>
    </section>
  )
}
