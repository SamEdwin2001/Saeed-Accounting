/**
 * Content for /file-corporate-tax-return — a conversion landing page
 * with a hero lead-capture form, stats bar, jurisdiction chips, pricing card,
 * comparison table, timeline, testimonials and an FAQ.
 *
 * Scraped from the live site; text is verbatim.
 */
export const CT_FILING = {
  heroPill: 'Certified Tax Consultants · Dubai, UAE',
  heroTitle: 'Corporate Tax Filing in UAE – Stress-Free Starts at AED 999',
  heroTitleAccent: 'AED 999',
  heroSub:
    "Saeed Accounting's FTA-compliant CT filing service handles everything from financial statement review to FTA portal submission.",
  heroSubBold: 'Fast, accurate, fully transparent pricing.',
  heroChips: ['100% FTA Aligned', 'On-time Filing Guarantee', 'End-to-End Tax Solution'],
  heroCta: 'WhatsApp – Get Instant Reply',

  form: {
    title: 'Book a Free CT Filing Assessment Today',
    subtitle: "We'll contact you within 2Mins.",
    priceLabel: 'STARTING AT',
    priceAmount: 'AED 999',
    fields: [
      { key: 'name', label: 'FULL NAME', placeholder: 'e.g. Ali Hassan', type: 'text' },
      { key: 'phone', label: 'WHATSAPP / MOBILE', placeholder: '+971 55 123 4567', type: 'tel' },
      {
        key: 'company',
        label: 'COMPANY TYPE',
        placeholder: 'Select your company type',
        type: 'select',
        options: [
          'LLC',
          'Free Zone Company',
          'Mainland Company',
          'Sole Establishment',
          'Foreign Branch/Subsidiary',
          'Others',
        ],
      },
    ],
    submitLabel: 'GET FREE ASSESSMENT',
    trustLine: 'Trusted by 16,000+ UAE businesses. Your information is secure.',
  },

  statsBar: [
    { value: '16,000+', label: 'Businesses served' },
    { value: '7,000+', label: 'Tax returns filed' },
    { value: '10+', label: 'Years experience' },
    { value: '4.9 ★', label: 'Google rating' },
    { value: 'FTA', label: 'Compliant experts' },
  ],

  jurisdictionLine: 'We file for companies across every UAE free zone & jurisdiction',
  jurisdictions: ['DMCC', 'JAFZA', 'Mainland', 'DIFC', 'DIC', 'SPC Free Zone', 'Sole Establishments'],

  supportHeading: 'Complete Corporate Tax Filing Support',
  supportHeadingAccent: 'Filing Support',
  supportLead:
    'Get expert-managed CT filing with accurate calculations, compliance checks, and seamless submission to the FTA.',
  supportItems: [
    'Company KYC document review & verification',
    'Full financial statements analysis (P&L, Balance Sheet)',
    'Taxable income calculation per local tax law',
    'Depreciation schedule preparation & review',
    'VAT return reconciliation & cross-checks',
    'Official portal submission & tracking',
    'Filing confirmation & acknowledgement',
    'Tax return copy for your digital records',
  ],

  pricingCard: {
    priceLabel: 'STARTING AT',
    currency: 'AED',
    amount: '999',
    note: 'Easy process. Fast service.',
    includedTitle: "What's Included:",
    included: ['Free Zone', 'Mainland', 'Sole Establishments', 'Foreign Branches'],
    ctaLabel: 'WhatsApp — Get Instant Reply',
  },

  serveKicker: 'WHO WE SERVE',
  serveHeading: 'CT Filing for Every Business in the UAE',
  serveHeadingAccent: 'the UAE',
  serveCards: [
    { title: 'Mainland', text: 'UAE Mainland companies allow business anywhere with full flexibility.' },
    { title: 'Free Zone Companies', text: 'DMCC, JAFZA, DIFC, SPC, and all other UAE free zones.' },
    { title: 'Sole Establishments', text: 'Individual traders and sole proprietors operating across the UAE.' },
    { title: 'Foreign Branches', text: 'International company branches and subsidiaries registered in UAE.' },
  ],

  regKicker: 'KEY REGULATIONS',
  regHeading: 'UAE Corporate Tax Compliance Guidelines',
  regHeadingAccent: 'Compliance Guidelines',
  regLead:
    "Understand the key rules that every UAE business must follow under the Federal Tax Authority's CT regime.",
  regCards: [
    {
      num: '01',
      title: 'Mandatory Returns for All Companies',
      text: 'Filing is required for every company operating in the UAE — including free zone entities and businesses with zero or nil tax liability.',
    },
    {
      num: '02',
      title: 'Federal Tax Authority Oversight',
      text: 'The FTA (Federal Tax Authority) governs all corporate tax compliance, registration, filing, and enforcement across the UAE.',
    },
    {
      num: '03',
      title: 'Standard Tax Rate: 9%',
      text: 'Companies are subject to a 9% tax on profits above AED 375,000, and are required to file tax returns regardless of profit levels.',
    },
    {
      num: '04',
      title: 'AED 500/Month Penalty for Late Filing',
      text: 'Every month your CT return is overdue incurs an AED 500 FTA penalty. Prompt filing is the most cost-effective decision.',
    },
  ],

  stepsKicker: 'HOW IT WORKS',
  stepsHeading: 'Your CT Filing Done in 4 Simple Steps',
  stepsHeadingAccent: '4 Simple Steps',
  steps: [
    {
      num: '1',
      title: 'Free Consultation',
      text: 'WhatsApp or call us. Our CT experts review your specific business type and tax requirements.',
      badge: 'Within 15 mins',
    },
    {
      num: '2',
      title: 'Document Collection',
      text: 'We send you a simple checklist. You share all required documents via WhatsApp or email.',
      badge: '30–60 mins',
    },
    {
      num: '3',
      title: 'CT Return Preparation',
      text: 'Our certified tax experts prepare, calculate, and review your complete corporate tax return.',
      badge: 'Within 24 hours',
    },
    {
      num: '4',
      title: 'FTA Submission',
      text: 'We file on EmaraTax portal and share your official FTA confirmation and receipt instantly.',
      badge: 'Confirmed same day',
    },
  ],

  vsKicker: 'WHY CHOOSE US',
  vsHeading: 'Saeed Accounting vs Doing It Yourself',
  vsHeadingAccent: 'Doing It Yourself',
  vsGood: {
    badge: 'SAEED ACCOUNTING',
    title: 'With Saeed Accounting',
    items: [
      'Starts at AED 999 — Easy setup, fast process',
      'CT return ready in as little as 48 hours',
      'Certified UAE tax professionals handle everything',
      'FTA compliant — zero risk of errors or penalties',
      'WhatsApp support throughout the process',
      'Official FTA acknowledgement sent to you',
    ],
  },
  vsBad: {
    title: 'Without a Tax Expert',
    items: [
      'Risk of costly errors & FTA audit exposure',
      'Hours spent navigating EmaraTax portal',
      'Uncertain on exemptions & deductions',
      'AED 500/month penalty if you miss the deadline',
      'No professional backup if FTA queries arise',
      'No expert guidance on future tax planning',
    ],
  },

  reviewsKicker: 'CLIENT REVIEWS',
  reviewsHeading: 'What Our Clients Say About Saeed Accounting',
  reviewsHeadingAccent: 'Saeed Accounting',
  reviews: [
    {
      text: 'Saeed Accounting handled our entire corporate tax filing smoothly. Very professional team, clear communication, and delivered within 48 hours exactly as promised.',
      name: 'Ahmed Al Rashidi',
      role: 'LLC Owner, Dubai Mainland',
      stars: 5,
    },
    {
      text: 'I approached Saeed Accounting for our DMCC free zone CT filing. Their service was exemplary — professional, knowledgeable, and they guided us through every step with confidence.',
      name: 'Sara Al Mansoori',
      role: 'Director, DMCC Free Zone Company',
      stars: 5,
    },
    {
      text: 'Fast, efficient, and no fuss. Got my TRN and corporate tax filing done without any hassle. The team was very responsive on WhatsApp throughout. Will definitely use again!',
      name: 'Khalid Hassan',
      role: 'Sole Establishment, Karama',
      stars: 5,
    },
  ],

  faqKicker: 'COMMON QUESTIONS',
  faqHeading: 'Corporate Tax Filing FAQs',
  faqHeadingAccent: 'FAQs',
  faqLead: 'Still have questions? Our tax team is available on WhatsApp 7 days a week.',
  faqCtaLabel: 'Chat on WhatsApp',
  faqs: [
    {
      q: 'When is the UAE corporate tax filing deadline?',
      a: 'The FTA requires corporate tax returns to be filed within 9 months of the end of the relevant tax period. For companies with a financial year ending December 31, 2025, the CT filing deadline falls in September 2026. File early to avoid penalties.',
    },
    {
      q: 'What is the FTA penalty for late CT filing?',
      a: 'The FTA imposes a penalty of AED 500 for each month your corporate tax return is delayed. That means a 3-month delay results in AED 1500 in fines, while a 6-month delay leads to AED 3000 in penalties. Filing on time with Saeed Accounting costs just AED 999 — significantly less than the cost of late fees.',
    },
    {
      q: 'Do free zone companies need to file CT returns?',
      a: 'Yes. All UAE-registered entities — including free zone companies such as DMCC, JAFZA, DIFC, SPC, and others — are required to register and file a corporate tax return, regardless of whether they qualify for the 0% Qualifying Free Zone Person (QFZP) rate. Failure to file is considered a violation.',
    },
    {
      q: 'What documents are needed for CT filing in Dubai?',
      a: "You'll need your company trade licence and KYC documents, financial statements (audited or management accounts — including the income statement, balance sheet, and cash flow statement), VAT return copies if you're registered, bank statements for the relevant tax period, and depreciation schedules. Our team will provide a simple checklist, and most clients are able to gather everything within 30–60 minutes.",
    },
    {
      q: 'My income is below AED 375,000 — must I still file?',
      a: 'Yes — the 0% tax rate on income below AED 375,000 does not exempt you from corporate tax filing. You are still required to submit a return even if your tax liability is AED 0. Our AED 999 package fully covers nil-liability returns, helping you stay compliant and avoid penalties.',
    },
  ],

  finalPill: 'Your Trusted Tax Partner',
  finalHeading: 'Stop Losing AED 500 Every Month to Penalties',
  finalHeadingAccent: 'AED 500',
  finalLead:
    'Complete your UAE corporate tax filing with Saeed Accounting today. Starts at AED 999. FTA-compliant certified experts. 48-hour turnaround. Serving 16,000+ businesses across Dubai and the UAE.',
  finalCtas: ['Get Free Assessment – AED 999', 'WhatsApp for CT Filing →'],
}
