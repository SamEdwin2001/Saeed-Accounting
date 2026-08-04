import { Link } from 'react-router-dom'
import Img from './Img.jsx'
import { IMAGES } from '../images.js'

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__inner">
        <div className="about__media">
          <Img
            src={IMAGES.about}
            alt="Professional accounting and tax advisory team at Saeed Accounting, UAE"
            label="About image"
          />
        </div>

        <div className="about__copy">
          <p className="eyebrow eyebrow--left">Saeed Accounting</p>
          <h2 className="about__title">
            Get Tax, Accounting &amp;
            <br />
            Auditing Services in Dubai
          </h2>
          <p className="about__text">
            Saeed Accounting is a leading financial consultancy and business advisory firm in the
            heart of Dubai. We strive to deliver a hundred percent on every{' '}
            <strong>tax advisory</strong>, <strong>auditing</strong>,{' '}
            <strong>accounting &amp; bookkeeping</strong>, and other{' '}
            <strong>financial services</strong>.
          </p>
          <Link className="btn btn--orange" to="/about-us">
            LEARN MORE
          </Link>
        </div>
      </div>
    </section>
  )
}
