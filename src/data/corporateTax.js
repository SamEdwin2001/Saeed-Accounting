/**
 * Content for the two Corporate Tax landing pages, which share a layout
 * (hero → badges → heading+lead → cards → features → CTA → [FAQ] →
 * date-of-entry + price → reviews) but differ in card shape and whether
 * they carry a penalty line, a third card, or an FAQ accordion.
 *
 * `Ð` stands in for the dirham mark, which has no glyph in the site's font.
 * <Price> swaps it for the real symbol at render time — see components/Price.jsx.
 */

const FEATURES = ['Assured Quality', 'Result Driven', 'Dedicated Support']
const HERO_CHECKS = ['Accurate Compliance', 'Time & Cost Efficiency', 'Expert Guidance']
const PILL = 'ONE STOP TAX SOLUTION PROVIDER IN UAE'
const ENTRY_HEADING = 'Date Of Entry Into Force'
const ENTRY_ACCENT = 'Entry'
const ENTRY_LEAD =
  'The CIT regime is expected to apply to financial years beginning on or after 1 June 2023.'

export const CORPORATE_TAX_FILING = {
  slug: 'corporate-tax-filing',
  pill: PILL,
  heroTitle: 'Corporate Tax Filing',
  heroSub:
    'Our corporate tax filing services ensure complete compliance with the latest regulations while maximizing efficiency',
  heroChecks: HERO_CHECKS,
  heroOffer: 'Limited-time offer – starting from Ð 999',
  heroImage:
    'https://res.cloudinary.com/dekhukonj/image/upload/v1785212341/young-aspiring-businesswoman-looking-confident-glasses-suit-standing-like-professional-white-ba-3_compressed-1-scaled_cyxrpr.webp',
  heroImageAlt: 'Confident businesswoman managing corporate tax filing compliance in the UAE',
  penaltyLine: null,

  heading: 'Corporate TAX Filing',
  headingAccent: 'TAX',
  lead: 'Corporate tax filing is the process through which businesses report their taxable income, deductions, and liabilities to the tax authorities',

  cardLeft: {
    title: 'Key Guidelines for Corporate Tax Compliance in UAE',
    items: [
      { label: 'Mandatory Corporate Tax Returns', text: 'Filing is required for all companies operating in the UAE.' },
      { label: 'Governing Body', text: 'The Federal Tax Authority (FTA) oversees tax compliance' },
      { label: 'Tax on Taxable Income', text: 'Companies must pay taxes based on their taxable income as per UAE tax laws' },
      { label: 'Tax Rate for Small Businesses', text: 'Businesses with income less than AED 375,000 are subject to a 0% tax rate.' },
    ],
  },
  cardRight: {
    title: 'Corporate TAX Filing Requirements',
    items: [
      'Company KYC details',
      'Financial Statement',
      'Income Statement (Profit and Loss Statement)',
      'Balance Sheet',
      'Cash Flow Statement',
      'Tax Returns',
      'Taxable Income Calculation',
      'Depreciation Schedules',
      'Bank Statements',
      'Receipts and Invoices',
      'Payroll Records.',
    ],
  },
  cardBottom: null,

  features: FEATURES,

  /* This page had no FAQ section — `faqs: null` kept it hidden. The client's
     sheet supplies the filing questions, so it renders now. */
  faqHeading: 'Frequently Asked Questions',
  faqHeadingAccent: 'Asked',
  faqs: [
    {
      q: 'What is the UAE corporate tax filing deadline for 2026?',
      a: 'The corporate tax return and payment are due 9 months after your financial year end. For a financial year ending 31 December 2025, the deadline is 30 September 2026.',
    },
    {
      q: 'Do I still need to file a corporate tax return if I owe no tax?',
      a: 'Yes. Every registered taxable person, including businesses below the AED 375,000 profit threshold, must file a return each period — even a nil return.',
    },
    {
      q: 'How do I file a corporate tax return in the UAE?',
      a: "Corporate tax returns are filed online through the FTA's EmaraTax portal, where you declare income, allowable deductions, and any reliefs, then pay the tax due by the same deadline.",
    },
    {
      q: 'What happens if I miss the corporate tax filing deadline?',
      a: 'Late filing triggers a penalty of AED 500 per month for the first 12 months (rising after that), plus 14% per annum interest on any unpaid tax.',
    },
    {
      q: 'Can the FTA extend the corporate tax filing deadline?',
      a: 'The FTA does not generally grant extensions. Exceptional cases with valid justification may be reviewed individually through a registered tax agent.',
    },
    {
      q: 'Do I need audited financial statements to file corporate tax?',
      a: 'Audited financial statements are required if revenue is AED 50 million or more, and for any business claiming Qualifying Free Zone Person (QFZP) status.',
    },
    {
      q: 'What is the UAE corporate tax rate?',
      a: '0% applies to taxable income up to AED 375,000, and 9% applies to taxable income above that threshold.',
    },
  ],

  entryHeading: ENTRY_HEADING,
  entryAccent: ENTRY_ACCENT,
  entryLead: ENTRY_LEAD,
  priceTitle: 'Corporate TAX Filing',
  priceAmount: 'Starts @ Ð 999',
}

export const CORPORATE_TAX_REGISTRATION = {
  slug: 'corporate-tax-registration',
  pill: PILL,
  heroTitle: 'Corporate Tax Registration',
  heroSub:
    'Our corporate tax registration services ensure full compliance with the latest regulations while streamlining the process for maximum efficiency.',
  heroChecks: HERO_CHECKS,
  heroOffer: 'Limited Offer Running Starts @ Ð 149',
  heroImage: '/images/hero-meeting.jpg',
  heroImageAlt: 'Consultant guiding a business owner through corporate tax registration in the UAE',
  penaltyLine: 'Avoid Ð 10,000 penalty by registering for Corporate Tax today!',

  heading: 'Corporate TAX Registration',
  headingAccent: 'TAX',
  lead: 'We take care of all your tax filings whether it is a simple W-2 or complex multi-state filings. You can simply drop off or email us your tax documents and we will notify you when they are ready.',

  cardLeft: {
    title: 'Document Requirements for UAE Corporate Tax Registration?',
    items: [
      { label: 'Trade license' },
      { label: 'MOA or AOA (If Sole establishment not required)' },
      { label: 'Passport copy of the signatory' },
      { label: 'Emirates ID of the signatory' },
      { label: 'Visa Copy of the Signatory (not necessary)' },
      { label: 'Bank Details (Account no/IBAN/Name/Address) (not necessary)' },
      { label: 'Mobile No' },
      { label: 'Email Id' },
      { label: 'Office Address with PO Box.' },
    ],
  },
  cardRight: {
    title: 'Who Needs to Register for Corporate Tax in the UAE?',
    items: [
      'Juridical persons incorporated outside the UAE but managed and controlled effectively within the UAE.',
      'Individuals (i.e. natural persons) engaging in a Business or Business Activity in the UAE, as defined by a Cabinet Decision issued under Article 11(6).',
      'Persons who are non-residents but have a Permanent Establishment in the UAE, or earn UAE-sourced income subject to Corporate Tax.',
      'Entities like limited liability corporations, joint-stock companies (private or public), incorporated or otherwise acknowledged under UAE laws, represent legal persons in the UAE, including Free Zone entities.',
    ],
  },
  cardBottom: {
    title: 'Corporate tax in the UAE will be applied to business income at the following rates:',
    items: [
      'A 0% rate for taxable income up to AED 375,000.',
      'A 9% rate for taxable income exceeding AED 375,000.',
      'A 15% rate for multinational corporations subject to OECD Base Erosion and Profit-Sharing rules under Pillar 2 of the BEPS 2.0 framework, with global revenues above AED 3.15 billion.',
    ],
  },

  features: FEATURES,
  faqHeading: 'Frequently Asked Questions',
  faqHeadingAccent: 'Asked',
  /* The client's FAQ sheet leads — those answers carry the rate bands, the
     statutory deadlines and the penalty figures people search for. Two of the
     original five (the generic "deadline" and "eligibility" answers) were
     dropped, since the sheet answers the same questions with the actual
     numbers and the vaguer version would only contradict it. */
  faqs: [
    {
      q: 'Do all UAE businesses have to register for corporate tax?',
      a: 'Yes — every taxable person in the UAE, including mainland companies, free zone companies, and individuals with turnover above AED 1,000,000/year, must register with the FTA, even if the tax due is 0%. Registration is separate from the tax rate.',
    },
    {
      q: 'What is the UAE corporate tax rate?',
      a: 'The UAE applies 0% on the first AED 375,000 of annual taxable income and 9% on taxable income above that threshold, under Federal Decree-Law No. 47 of 2022, effective for financial years starting on or after 1 June 2023.',
    },
    {
      q: 'What is the deadline to register for corporate tax?',
      a: 'New companies (incorporated on or after 1 March 2024) must register within 3 months of incorporation. Companies incorporated earlier had staggered 2024 deadlines by license month — all of which have now passed, so any still-unregistered pre-2024 company is already overdue.',
    },
    {
      q: 'What is the penalty for late corporate tax registration?',
      a: 'A flat AED 10,000 fine applies for missing the registration deadline. It can be waived or refunded if you file your first tax return within 7 months of your first tax period end, instead of the standard 9.',
    },
    {
      q: 'Do free zone companies need to register for corporate tax?',
      a: 'Yes — free zone companies must register and file annual returns regardless of QFZP status. QFZPs pay 0% only on qualifying income (9% on non-qualifying income), and that rate is claimed on the return after registering, not automatic.',
    },
    {
      q: 'When is the corporate tax filing deadline?',
      a: 'Corporate tax returns are due 9 months after the end of the financial year. For the common case of a business with a 31 December financial year-end, the 2025 tax period return is due by 30 September 2026. Other year-end dates follow the same 9-month rule from their own year-end.',
    },
    {
      q: 'What is the penalty for late corporate tax filing or payment?',
      a: 'Late filing costs AED 500/month for the first 12 months, then AED 1,000/month. Unpaid tax also accrues a separate late-payment penalty.',
    },
    {
      q: 'Does a freelancer or self-employed individual need to register for corporate tax?',
      a: 'Yes, if their total business turnover exceeds AED 1,000,000 in a Gregorian calendar year. The threshold is based on turnover, not profit — so a freelancer who invoices above AED 1 million must register even if their actual net income after expenses is much lower.',
    },
    {
      q: 'Is there relief for small businesses under UAE corporate tax?',
      a: 'Yes — Small Business Relief lets resident taxable persons with revenue below AED 3,000,000 in the current and all prior tax periods elect to be treated as having no taxable income for that period, removing the corporate tax liability while the relief applies. It still requires registration and an annual election/return.',
    },
    {
      q: 'Is filing mandatory even if a company owes zero corporate tax?',
      a: 'Yes. Every registered taxable person must file a corporate tax return — including a nil return — even if no tax is due, because filing is a separate legal obligation from paying tax. Qualifying Free Zone Persons taxed at 0% and small businesses claiming relief still have to file.',
    },
    {
      q: 'How to register for Corporate Tax in UAE?',
      a: 'To register for corporate tax in the UAE, businesses must use the EmaraTax platform for the CT registration process.',
    },
    {
      q: 'Can I register under Corporate Tax group registration in UAE?',
      a: 'If your business comprises multiple entities under common control, you may be eligible for corporate tax group registration.',
    },
    {
      q: 'Amendment can be done in the existing profile?',
      a: 'If you need to make changes or update details in your FTA profile, we will guide you through the amendment process.',
    },
  ],

  entryHeading: ENTRY_HEADING,
  entryAccent: ENTRY_ACCENT,
  entryLead: ENTRY_LEAD,
  priceTitle: 'Corporate Tax Registration',
  priceAmount: 'Starts @ Ð 149',
  carouselReviews: true,
}

/**
 * SEO landing variant at /uae-corporate-tax-registration.
 * Same layout as the registration page above, but the offer/price read
 * "Starts at" rather than "Starts @", and it closes with the stats band.
 */
export const CORPORATE_TAX_CONSULTANT = {
  ...CORPORATE_TAX_REGISTRATION,
  slug: 'uae-corporate-tax-registration',
  heroOffer: 'Limited Offer Running Starts at Ð 149',
  priceAmount: 'Starts at Ð 149',
  showStats: true,
  carouselReviews: true,

  /* Its own list rather than the spread one: the questions here are phrased
     without "register"/"registration", so the wording stays off this page
     while /corporate-tax-registration keeps the original set. */
  faqs: [
    {
      q: 'How to apply for Corporate Tax in UAE?',
      a: 'To register for corporate tax in the UAE, businesses must use the EmaraTax platform for the CT registration process.',
    },
    {
      q: 'What is the Corporate Tax UAE deadline?',
      a: 'The Federal Tax Authority (FTA) sets the corporate tax registration deadline in the UAE based on the date your business license was issued.',
    },
    {
      q: 'What is the eligibility for Corporate Tax in UAE?',
      a: 'Generally, businesses operating with a valid trade license must complete corporate tax registration. All Free Zone entities are also required to register.',
    },
    {
      q: 'Can I apply under a Corporate Tax group in UAE?',
      a: 'If your business comprises multiple entities under common control, you may be eligible for corporate tax group registration.',
    },
    {
      q: 'Amendment can be done in the existing profile?',
      a: 'If you need to make changes or update details in your FTA profile, we will guide you through the amendment process.',
    },
  ],
}
