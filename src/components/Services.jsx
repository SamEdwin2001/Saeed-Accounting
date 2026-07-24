import {
  UserIcon,
  InvoiceIcon,
  LedgerIcon,
  BookIcon,
  FileIcon,
  IdCardIcon,
  EditIcon,
  UsersIcon,
  CheckCircle,
  GearIcon,
} from './Icons.jsx'

const ACCOUNTING = [
  {
    icon: UserIcon,
    title: 'Accounts Receivable Services',
    text: 'Accounts receivable services involve managing and tracking customer payments owed to a business.',
  },
  {
    icon: InvoiceIcon,
    title: 'Accounts Payable Services',
    text: "Accounts payable services involve managing and processing a company's obligations to pay its suppliers and vendors",
  },
  {
    icon: LedgerIcon,
    title: 'Accounting & Bookkeeping',
    text: "Accounting and bookkeeping services involve the systematic recording, classifying, and summarizing of a company's financial transactions",
  },
  {
    icon: BookIcon,
    title: 'CFO Services',
    text: 'CFO (Chief Financial Officer) services provide strategic financial leadership to businesses without the need for a full-time CFO',
  },
]

const VAT = [
  {
    icon: FileIcon,
    title: 'VAT Registration',
    text: 'VAT (Value Added Tax) registration services assist businesses in complying with VAT regulations by registering them with the appropriate tax authorities',
  },
  {
    icon: IdCardIcon,
    title: 'VAT Return Filling',
    text: 'VAT return filing services help businesses accurately report and submit their VAT (Value Added Tax) returns to the tax authorities within the required deadlines',
  },
  {
    icon: EditIcon,
    title: 'VAT–De–Registration',
    text: 'VAT de-registration services assist businesses in officially removing themselves from the VAT system when they no longer meet the requirements to remain VAT-registered.',
  },
]

const SUPPORT = [
  {
    icon: UsersIcon,
    title: 'Business Formation',
    text: 'Business formation services guide entrepreneurs and companies through the process of legally establishing a new business entity.',
  },
  {
    icon: CheckCircle,
    title: 'Local Sponsor',
    text: 'Local sponsor services are essential for foreign entrepreneurs and companies looking to establish a business in countries where foreign ownership restrictions apply, such as the UAE',
  },
  {
    icon: GearIcon,
    title: 'PRO Services',
    text: 'PRO services assist businesses with government-related documentation and administrative processes, ensuring compliance with legal and regulatory requirements',
  },
]

function ServiceCard({ icon: Icon, title, text }) {
  return (
    <article className="card">
      <span className="card__icon">
        <Icon />
      </span>
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{text}</p>
    </article>
  )
}

export default function Services() {
  return (
    <>
      <section className="section section--services" id="accounting">
        <div className="container">
          <p className="eyebrow">What Service We Offer</p>
          <h2 className="section__title">Accounting Services</h2>

          <div className="grid grid--4">
            {ACCOUNTING.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" id="vat">
        <div className="container">
          <h2 className="section__title">VAT / TAX Services</h2>

          <div className="grid grid--3">
            {VAT.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" id="support">
        <div className="container">
          <h2 className="section__title">Support Services</h2>

          <div className="grid grid--3">
            {SUPPORT.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
