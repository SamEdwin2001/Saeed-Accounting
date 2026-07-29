import { Link, useLocation } from 'react-router-dom'
import Img from '../components/Img.jsx'
import Accordion from '../components/Accordion.jsx'
import Reviews from '../components/Reviews.jsx'
import ReviewsCarousel from '../components/ReviewsCarousel.jsx'
import Badges from '../components/Badges.jsx'
import { IMAGES } from '../images.js'
import { WhatsApp, CheckCircle, LedgerIcon, Star, UsersIcon, Dirham } from '../components/Icons.jsx'
import Price from '../components/Price.jsx'

/* Cards carry `landingTitle` / `landingText` where /register-for-vat-online-uae
   words them differently — framed as eligibility, and phrased around the verb
   "register" rather than the noun. Anything without an override falls back to
   the original, and the two service routes always use the original. */
const ELIGIBILITY = [
  {
    title: 'Voluntary VAT Registration',
    landingTitle: 'Voluntary VAT Eligibility',
    text: 'In the UAE, businesses are eligible for VAT registration if they have a business location in the UAE and have made taxable supplies worth over AED 187,500 to member states in the past year. Additionally, companies can apply for VAT registration online if they expect their supply value to exceed the voluntary registration threshold of AED 187,500 within the upcoming 30 days.',
    landingText:
      'You may register by choice once your taxable supplies pass AED 187,500 over the past year, provided your business is based in the UAE. The same applies if you expect to cross that threshold within the next 30 days — you can apply online without waiting for the mandatory limit. Many businesses do so to reclaim the VAT they pay on their own purchases.',
  },
  {
    title: 'Mandatory VAT Registration',
    landingTitle: 'Mandatory VAT Eligibility',
    text: 'Businesses are obligated to register for VAT in the UAE if they have a business location within a UAE emirate and have provided goods worth over AED 375,000 to member states in the last 12 months. Additionally, companies must complete the VAT registration process online if they expect the value of their supplies to surpass the mandatory registration threshold of AED 375,000 within the coming 30 days.',
    landingText:
      'You must register once your taxable supplies pass AED 375,000 over the previous 12 months, or as soon as you expect to cross that figure within the next 30 days. The application goes through the FTA portal, and the deadline is firm — a late filing carries an AED 10,000 penalty.',
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
  {
    title: 'VAT Registration UAE',
    landingTitle: 'Online VAT Services UAE',
    price: 'Starts @ Ð 149 Only',
    to: '/vat-registration-services',
  },
  {
    title: 'Corporate Tax Registration',
    landingTitle: 'Corporate Tax Filing UAE',
    price: 'Starts @ Ð 149 Only',
    to: '/corporate-tax-registration',
  },
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

/* The landing route answers the questions someone mid-application actually
   asks — timing, documents, penalties, cost — rather than restating what VAT
   registration is. Kept separate so the two service routes are untouched. */
const LANDING_FAQS = [
  {
    q: 'How long does the application take?',
    a: 'Preparing and submitting the application usually takes two to three working days once we have your documents. The FTA then reviews it and typically issues the TRN within 20 business days, though a clean submission with no queries often clears sooner.',
  },
  {
    q: 'Which documents do I need to have ready?',
    a: 'Your trade licence, the passport and Emirates ID of the authorised signatory, MOA or AOA (not needed for a sole establishment), sample invoices, bank account details and your office address with PO Box. We tell you exactly what is missing before anything is submitted.',
  },
  {
    q: 'Do I have to register, or is it optional?',
    a: 'Registration is mandatory once your taxable supplies pass AED 375,000 over the previous 12 months, or if you expect to pass it within the next 30 days. Below that, you may register voluntarily from AED 187,500 — useful if you want to reclaim VAT on your own purchases.',
  },
  {
    q: 'What happens if I register late?',
    a: 'The FTA charges a penalty of AED 10,000 for late registration, and you remain liable for VAT on sales made after the date you should have registered. If you think you have already crossed the threshold, it is worth starting now rather than waiting.',
  },
  {
    q: 'Can I do this myself on the FTA portal?',
    a: 'Yes — the EmaraTax portal is open to any business. Most applications that come back to us were rejected over document mismatches or the wrong turnover figures, and each resubmission adds weeks. We handle the classification and the paperwork so it clears the first time.',
  },
  {
    q: 'What does it cost, and what is included?',
    a: 'Our fee starts at AED 149. That covers checking your eligibility, preparing and reviewing the documents, submitting the application through EmaraTax and following up with the FTA until your TRN is issued.',
  },
  {
    q: 'What do I do once the TRN arrives?',
    a: 'From your effective registration date you must charge 5% VAT on taxable supplies, issue compliant tax invoices, keep records for five years and file returns — usually quarterly. We can take on the filing as well if you would rather not manage it in-house.',
  },
]

import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

const WHATSAPP = WHATSAPP_FALLBACK_HREF

/* The three routes onto this page share everything but the H1, which tracks
   the URL each one is targeting. Defaults to the original wording, so only
   /register-for-vat-online-uae passes anything. */
export default function VatRegistrationPage({
  carouselReviews = false,
  heroTitle = (
    <>
      FTA VAT
      <br />
      Registration UAE
    </>
  ),
}) {
  /* The landing route runs a louder offer line than the two service routes;
     scoped here so the CSS can target it without touching the others. */
  const { pathname } = useLocation()
  const landing = pathname === '/register-for-vat-online-uae'

  /* That route targets "online VAT registration", so it leads on that phrase
     wherever the shared copy says plain "VAT registration". Case is kept, so
     headings stay title-case and prose stays sentence-case; the follow-up
     passes fix the article and the sentence-opening capital that inserting a
     word in front of the phrase would otherwise break. Copy that already
     says "online" is left alone rather than doubled. */
  const term = (s) =>
    landing
      ? s
          .replace(
            /(online )?VAT (R|r)egistration((?: \w+)*? online\b)?/g,
            (match, before, r, trailingOnline) =>
              before || trailingOnline
                ? match
                : `${r === 'R' ? 'Online' : 'online'} VAT ${r}egistration`
          )
          .replace(/\b(A|a) (online VAT)/g, '$1n $2')
          .replace(/(^|[.!?] )online VAT/g, '$1Online VAT')
      : s

  return (
    <div className={`vat-page ${landing ? 'vat-page--landing' : ''}`}>
      {/* Hero */}
      <section className="hero vat-hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="vat-hero__title">{heroTitle}</h1>
            <p className="vat-hero__offer">
              Limited Offer Running Starts @ <Dirham />{' '}
              <span className="vat-hero__price">149</span>
            </p>

            <a className="btn btn--whatsapp" href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
              <span className="btn__icon-circle">
                <WhatsApp />
              </span>
              WhatsApp us
            </a>
          </div>

          <div className="hero__media">
            <Img
              src={IMAGES.hero}
              alt={term('VAT registration consultation')}
              className="hero__image"
              label="Hero image"
            />
          </div>
        </div>
      </section>

      <Badges />

      {/* Eligibility + documents */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title">
            {landing
              ? 'Eligibility Criteria and Required Documents for UAE VAT Compliance'
              : 'Eligibility Criteria and Necessary Documents for VAT Registration UAE'}
          </h2>

          <div className="elig">
            <div className="elig__col">
              {ELIGIBILITY.map((e) => (
                <article className="elig-card" key={e.title}>
                  <h3 className="elig-card__head elig-card__head--orange">
                    {landing ? e.landingTitle || e.title : e.title}
                  </h3>
                  <p className="elig-card__text">
                    {landing ? e.landingText || term(e.text) : e.text}
                  </p>
                </article>
              ))}
            </div>

            <article className="elig-card elig__col">
              <h3 className="elig-card__head elig-card__head--dark">Documents Required For Your Application</h3>
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
              <h3 className="price-card__title">
                {landing ? p.landingTitle || p.title : p.title}
              </h3>
              <p className="price-card__price">
                <Price>{p.price}</Price>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title">Frequently Asked Questions</h2>
          <Accordion items={landing ? LANDING_FAQS : FAQS} />
        </div>
      </section>

      {carouselReviews ? <ReviewsCarousel /> : <Reviews />}
    </div>
  )
}
