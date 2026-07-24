import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner.jsx'
import Seo from '../components/Seo.jsx'
import Img from '../components/Img.jsx'
import { IMAGES } from '../images.js'
import { LedgerIcon, FileIcon, GearIcon, InvoiceIcon, EditIcon } from '../components/Icons.jsx'

const HIGHLIGHTS = [
  {
    Icon: LedgerIcon,
    title: 'VAT Registration',
    text: "Value Added Tax is a tax assessed on each step in which a product's value is added across the supply chain.",
  },
  {
    Icon: FileIcon,
    title: 'VAT Filling',
    text: 'Small business entrepreneurs frequently lack the time and energy to devote to learning about the Tax Code.',
  },
]

const SERVICES = [
  { Icon: GearIcon, label: 'VAT services', to: '/vat-registration-uae' },
  { Icon: InvoiceIcon, label: 'TAX services', to: '/corporate-tax-registration' },
  { Icon: EditIcon, label: 'Audit services', to: '/vat-audit' },
  { Icon: FileIcon, label: 'Accounting services', to: '/accounting-bookkeeping' },
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Us"
        description="Saeed Accounting is a UAE-based team of accountants and tax consultants supporting mainland and free zone businesses with bookkeeping, VAT, corporate tax and PRO services."
      />
      <PageBanner title="About Us" />

      {/* Welcome — collage left, copy right */}
      <section className="section welcome">
        <div className="container welcome__inner">
          <div className="welcome__media">
            <Img src={IMAGES.collage} alt="The Saeed Accounting team at work" label="Collage image" />
          </div>

          <div className="welcome__copy">
            <span className="pill-label">About Company</span>
            <h2 className="welcome__title">Welcome To Saeed Accounting</h2>
            <p className="welcome__text">
              Our highly qualified and experienced Charted Accountants provide the greatest level of
              professionalism in all areas of VAT , TAX , Auditing, Accountancy &amp; Bookkeeping ,
              and Financial Planning. Wherever possible we aim to be of vital assistance to our
              clients. We work with like-minded people who challenge the process and make a
              difference. We follow International Accounting Standards/ International Financial
              Reporting Standards and committed to keep highest levels of professional standards and
              quality.
            </p>

            <div className="welcome__cards">
              {HIGHLIGHTS.map(({ Icon, title, text }) => (
                <article className="mini-card" key={title}>
                  <span className="mini-card__icon">
                    <Icon />
                  </span>
                  <h3 className="mini-card__title">{title}</h3>
                  <p className="mini-card__text">{text}</p>
                </article>
              ))}
            </div>

            <div className="welcome__cta">
              <Link className="btn btn--orange" to="/contact-us">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to take the next step */}
      <section className="section section--tight">
        <div className="container">
          <h2 className="section__title next-step__title">Ready to Take the Next Step?</h2>
          <p className="next-step__text">
            Every business is different – but what every business needs is expert financial advice
            and accountancy. Taxly is an ISO 9001-2015 certified firm of experienced Chartered
            Accountants, auditors and specialist service teams offering a wide range of services
            including Auditing , Accounting, Feasibility studies and Management and Software
            Consultancy services tailored to client&apos;s needs.
          </p>
        </div>
      </section>

      {/* Service tiles */}
      <section className="service-strip">
        <div className="container service-strip__grid">
          {SERVICES.map(({ Icon, label, to }) => (
            <Link className="service-tile" to={to} key={label}>
              <span className="service-tile__icon">
                <Icon />
              </span>
              <p className="service-tile__label">{label}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
