import { Link, useLocation } from 'react-router-dom'
import { withBold } from './ServicePage.jsx'
import Img from '../components/Img.jsx'
import Accordion from '../components/Accordion.jsx'
import Reviews from '../components/Reviews.jsx'
import ReviewsCarousel from '../components/ReviewsCarousel.jsx'
import Badges from '../components/Badges.jsx'
import { IMAGES } from '../images.js'
import { WhatsApp, CheckCircle, LedgerIcon, Star, UsersIcon, Dirham } from '../components/Icons.jsx'
import Price from '../components/Price.jsx'

/* Cards carry `landingTitle` / `landingText` where /vat-services-uae
   words them differently — framed as eligibility, and phrased around the verb
   "register" rather than the noun. Anything without an override falls back to
   the original, and the two service routes always use the original. */
const ELIGIBILITY = [
  {
    title: 'Voluntary VAT Registration',
    landingTitle: 'Voluntary Eligibility',
    text: 'In the UAE, businesses are eligible for VAT registration if they have a business location in the UAE and have made taxable supplies worth over AED 187,500 to member states in the past year. Additionally, companies can apply for **VAT registration online** if they expect their supply value to exceed the voluntary registration threshold of AED 187,500 within the upcoming 30 days.',
    landingText:
      'You may register by choice once your taxable supplies pass AED 187,500 over the past year, provided your business is based in the UAE. The same applies if you expect to cross that threshold within the next 30 days — you can apply online without waiting for the mandatory limit. Many businesses do so to reclaim the tax they pay on their own purchases.',
  },
  {
    title: 'Mandatory VAT Registration',
    landingTitle: 'Mandatory Eligibility',
    text: 'Businesses are obligated to register for VAT in the UAE if they have a business location within a UAE emirate and have provided goods worth over AED 375,000 to member states in the last 12 months. Additionally, companies must complete the **VAT registration process online** if they expect the value of their supplies to surpass the mandatory registration threshold of AED 375,000 within the coming 30 days.',
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

/* Only rendered off the landing route, so no landingTitle overrides here. */
const PRICING = [
  { title: 'VAT Registration UAE', price: 'Starts @ Ð 149 Only', to: '/vat-registration-services' },
  { title: 'Corporate Tax Registration', price: 'Starts @ Ð 149 Only', to: '/corporate-tax-registration' },
]

/* The ten from the client's FAQ sheet lead, in its order — they carry the real
   thresholds, deadlines and penalty figures, which is what people search for.
   Four of the original questions follow; the two the sheet supersedes (generic
   "requirements" and "how does it work") were dropped rather than left to
   contradict the more specific answers above them. */
const FAQS = [
  {
    q: 'Who needs to register for VAT in the UAE?',
    a: 'UAE businesses must register for VAT once taxable supplies and imports exceed AED 375,000 in the past 12 months (or expected in the next 30 days). Voluntary registration is available above AED 187,500. Non-resident businesses must register regardless of turnover.',
  },
  {
    q: 'What is the VAT registration threshold in the UAE for 2026?',
    a: "The mandatory VAT registration threshold is AED 375,000 and the voluntary threshold is AED 187,500, both measured on taxable supplies and imports (including zero-rated supplies, which do count toward the threshold even though they're taxed at 0%).",
  },
  {
    q: 'How long does VAT registration take in the UAE?',
    a: "Straightforward VAT registration applications through the FTA's EmaraTax portal are typically approved within 5–20 business days. Applications missing documents or triggering an FTA query for clarification can take 3–4 weeks, so submitting a complete, consistent document set upfront is the biggest factor in speed.",
  },
  {
    q: "What happens if I don't register for VAT on time?",
    a: 'Missing the 30-day registration deadline after crossing the AED 375,000 threshold triggers a flat AED 10,000 late-registration penalty, and the business becomes retroactively liable for VAT on every taxable supply made from the date it should have registered — not just from the date it actually registers.',
  },
  {
    q: 'What documents are required for VAT registration in the UAE?',
    a: 'Standard requirements include the trade license, Emirates ID and passport copies of the owner(s)/authorized signatory, Memorandum of Association (MOA), proof of business address, bank account details, and financial records supporting the turnover figure (invoices, contracts, or bank statements showing taxable supplies). Free zone and group VAT applications require additional supporting documents.',
  },
  {
    q: 'Can a small business or freelancer register for VAT voluntarily?',
    a: 'Yes. Any UAE business — including freelancers and startups — with taxable supplies, imports, or expenses above AED 187,500 can opt into voluntary VAT registration. This is common for early-stage businesses with high startup costs, since it allows them to reclaim input VAT on expenses like rent, equipment, and professional fees before they hit the mandatory threshold.',
  },
  {
    q: 'How often do I need to file VAT returns after registering?',
    a: 'Most VAT-registered businesses file quarterly, with the return due within 28 days of the end of the tax period. Businesses with annual turnover above AED 150 million are required to file monthly instead. The FTA assigns your filing frequency at the point of registration.',
  },
  {
    q: 'Can I deregister from VAT if my turnover drops?',
    a: 'Yes — a business must apply for VAT deregistration within 20 business days of ceasing taxable supplies, or if turnover falls below the AED 187,500 voluntary threshold for 12 consecutive months. All outstanding returns must be filed and tax settled before the FTA approves deregistration. Missing the deregistration deadline carries a penalty of AED 1,000, rising by AED 1,000 per month to a cap of AED 10,000.',
  },
  {
    q: 'Do I need a local tax agent to register for VAT in the UAE?',
    a: "It isn't legally mandatory — you can register directly through EmaraTax — but an FTA-registered tax agent reduces the risk of rejected applications, incorrect threshold calculations, and missed retroactive liabilities, and can represent you in FTA correspondence or audits.",
  },
  {
    q: 'What is EmaraTax and do I need an account to register?',
    a: "EmaraTax is the FTA's official online portal for all UAE tax registration, filing, and payment — VAT registration in the UAE is only done through EmaraTax; there is no manual or paper-based route. You'll need to create an EmaraTax account before submitting a VAT registration application.",
  },
  {
    q: 'How to register for VAT online in the UAE?',
    a: 'To register for VAT online in the UAE, businesses need to create an account on the FTA portal and upload necessary documents such as a trade license, Emirates ID, and financial records.',
  },
  {
    q: 'What is a VAT registration number and why is it important?',
    a: "A VAT registration number (or TRN) is a unique Tax Registration Number issued by the FTA once your registration is approved. It's essential for invoicing, filing returns, and staying compliant with FTA regulations.",
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
   /vat-services-uae passes anything. */
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
  const landing = pathname === '/vat-services-uae'

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
            {/* Describes the photograph itself — it is the same meeting shot
                used on the home page, not artwork specific to VAT. */}
            <Img
              src={IMAGES.hero}
              alt="Business consultant assisting a client with VAT registration in the UAE"
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
              ? 'Eligibility Criteria and Required Documents for UAE Tax Compliance'
              : 'Eligibility Criteria and Necessary Documents for VAT Registration UAE'}
          </h2>

          <div className="elig">
            <div className="elig__col">
              {ELIGIBILITY.map((e) => (
                <article className="elig-card" key={e.title}>
                  <h3 className="elig-card__head elig-card__head--orange">
                    {landing ? e.landingTitle || e.title : e.title}
                  </h3>
                  {/* withBold runs last: term() rewrites the phrase on the
                      landing route, so bolding has to read the final wording. */}
                  <p className="elig-card__text">
                    {withBold(landing ? e.landingText || term(e.text) : e.text)}
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

      {/* Pricing — dropped on /vat-services-uae, which keeps the visitor on the
          WhatsApp CTA rather than offering links off to the service pages. */}
      {!landing && (
        <section className="section section--tight">
          <div className="container pricing">
            {PRICING.map((p) => (
              <Link className="price-card" to={p.to} key={p.title}>
                <span className="card__icon">
                  <LedgerIcon />
                </span>
                <h3 className="price-card__title">{p.title}</h3>
                <p className="price-card__price">
                  <Price>{p.price}</Price>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
