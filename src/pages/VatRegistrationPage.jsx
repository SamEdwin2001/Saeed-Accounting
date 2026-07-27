import { Link } from 'react-router-dom'
import Img from '../components/Img.jsx'
import Accordion from '../components/Accordion.jsx'
import Reviews from '../components/Reviews.jsx'
import ReviewsCarousel from '../components/ReviewsCarousel.jsx'
import Badges from '../components/Badges.jsx'
import { IMAGES } from '../images.js'
import { WhatsApp, CheckCircle, LedgerIcon, Star, UsersIcon } from '../components/Icons.jsx'

const ELIGIBILITY = [
  {
    title: 'Voluntary VAT Registration',
    text: 'In the UAE, businesses are eligible for VAT registration if they have a business location in the UAE and have made taxable supplies worth over AED 187,500 to member states in the past year. Additionally, companies can apply for VAT registration online if they expect their supply value to exceed the voluntary registration threshold of AED 187,500 within the upcoming 30 days.',
  },
  {
    title: 'Mandatory VAT Registration',
    text: 'Businesses are obligated to register for VAT in the UAE if they have a business location within a UAE emirate and have provided goods worth over AED 375,000 to member states in the last 12 months. Additionally, companies must complete the VAT registration process online if they expect the value of their supplies to surpass the mandatory registration threshold of AED 375,000 within the coming 30 days.',
  },
]

const DOCUMENTS = [
  'Trade license',
  'MOA or AOA ( If Sole establishment not required)',
  'Passport copy of the signatory',
  'Emirates ID of the signatory',
  'Visa Copy of the Signatory (not necessary)',
  'Invoices',
  'Bank Details (Account no/IBAN/Name/Address) (not necessary)',
  'Email Id',
  'Mobile No',
  'Office Address with PO BOX',
]

const FEATURES = [
  { Icon: Star, label: 'Assured Quality' },
  { Icon: LedgerIcon, label: 'Result Driven' },
  { Icon: UsersIcon, label: 'Dedicated Support' },
]

const PRICING = [
  { title: 'VAT Registration UAE', price: 'Starts @ Ð 149 Only', to: '/vat-registration-services' },
  { title: 'Corporate Tax Registration', price: 'Starts @ Ð 149 Only', to: '/corporate-tax-registration' },
]

const FAQS = [
  {
    q: 'How to register for VAT online in the UAE?',
    a: 'To register for VAT online in the UAE, businesses need to create an account on the FTA portal and upload necessary documents such as a trade license, Emirates ID, and financial records.',
  },
  {
    q: 'What are the requirements for VAT registration in the UAE?',
    a: 'The primary VAT registration requirements in the UAE include having an active trade license, meeting the voluntary threshold (AED 187,500) or mandatory threshold (AED 375,000), and submitting the necessary documents.',
  },
  {
    q: 'What is a VAT registration number and why is it important?',
    a: "A VAT registration number (or TRN) is a unique Tax Registration Number issued by the FTA once your registration is approved. It's essential for invoicing, filing returns, and staying compliant with FTA regulations.",
  },
  {
    q: 'How does VAT registration work for businesses in Dubai and the UAE?',
    a: 'For businesses setting up in Dubai or the UAE, VAT registration requires collecting necessary legal documents, financial records, and completing the registration via the FTA portal.',
  },
  {
    q: 'What is the difference between VAT registration and tax registration in the UAE?',
    a: 'VAT registration specifically relates to value-added tax, whereas tax registration in the UAE could refer to various taxes, such as corporate or excise tax.',
  },
  {
    q: 'What are the benefits of VAT registration?',
    a: 'By registering for VAT, you can issue tax invoices and collect 5% VAT from clients, plus reclaim VAT paid on purchases and expenses when filing VAT returns.',
  },
]

import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

const WHATSAPP = WHATSAPP_FALLBACK_HREF

export default function VatRegistrationPage({ carouselReviews = false }) {
  return (
    <div className="vat-page">
      {/* Hero */}
      <section className="hero vat-hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="vat-hero__title">
              FTA VAT
              <br />
              Registration UAE
            </h1>
            <p className="vat-hero__offer">
              Limited Offer Running Starts @ Ð <span className="vat-hero__price">149</span>
            </p>

            <a className="btn btn--whatsapp" href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
              <span className="btn__icon-circle">
                <WhatsApp />
              </span>
              WhatsApp us
            </a>
          </div>

          <div className="hero__media">
            <Img src={IMAGES.hero} alt="VAT registration consultation" className="hero__image" label="Hero image" />
          </div>
        </div>
      </section>

      <Badges />

      {/* Eligibility + documents */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title">
            Eligibility Criteria and Necessary Documents for VAT Registration UAE
          </h2>

          <div className="elig">
            <div className="elig__col">
              {ELIGIBILITY.map((e) => (
                <article className="elig-card" key={e.title}>
                  <h3 className="elig-card__head elig-card__head--orange">{e.title}</h3>
                  <p className="elig-card__text">{e.text}</p>
                </article>
              ))}
            </div>

            <article className="elig-card elig__col">
              <h3 className="elig-card__head elig-card__head--dark">Required Documents To Register For It</h3>
              <ul className="doc-list">
                {DOCUMENTS.map((d) => (
                  <li key={d}>
                    <CheckCircle className="doc-list__icon" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Three features */}
      <section className="features3">
        <div className="container features3__grid">
          {FEATURES.map(({ Icon, label }) => (
            <div className="feature3" key={label}>
              <span className="feature3__icon">
                <Icon />
              </span>
              <p className="feature3__label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark CTA band */}
      <section className="vat-cta">
        <div className="container vat-cta__inner">
          <h2 className="vat-cta__heading">BOOK A FREE 30-MINUTE CONSULTATION!</h2>
          <p className="vat-cta__kicker">Work with us!</p>
          <p className="vat-cta__title">Our Dedicated &amp; Experienced Team</p>

          <a className="btn btn--whatsapp" href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
            <span className="btn__icon-circle">
              <WhatsApp />
            </span>
            WhatsApp us
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section--tight">
        <div className="container pricing">
          {PRICING.map((p) => (
            <Link className="price-card" to={p.to} key={p.title}>
              <span className="card__icon">
                <LedgerIcon />
              </span>
              <h3 className="price-card__title">{p.title}</h3>
              <p className="price-card__price">{p.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title">Frequently Asked Questions</h2>
          <Accordion items={FAQS} />
        </div>
      </section>

      {carouselReviews ? <ReviewsCarousel /> : <Reviews />}
    </div>
  )
}
