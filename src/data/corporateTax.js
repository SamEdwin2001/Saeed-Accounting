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
  faqs: null,

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
  faqs: [
    {
      q: 'How to register for Corporate Tax in UAE?',
      a: 'To register for corporate tax in the UAE, businesses must use the EmaraTax platform for the CT registration process.',
    },
    {
      q: 'What is the Corporate Tax registration UAE deadline?',
      a: 'The Federal Tax Authority (FTA) sets the corporate tax registration deadline in the UAE based on the date your business license was issued.',
    },
    {
      q: 'What is the eligibility for Corporate Tax in UAE?',
      a: 'Generally, businesses operating with a valid trade license must complete corporate tax registration. All Free Zone entities are also required to register.',
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
