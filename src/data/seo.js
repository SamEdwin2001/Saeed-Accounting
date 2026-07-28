/**
 * Per-route <title> and meta description — one source of truth.
 *
 * Previously each page passed its own strings to <Seo>, and the 14 article
 * routes derived a description by truncating body copy. That produced titles
 * with no location keyword ("VAT Audit | Saeed Accounting", 28 chars, half the
 * usable width) and descriptions that cut off mid-word — plus two routes
 * (/vat-refund, /vat-amendment) sharing a byte-identical description, which
 * search engines treat as duplicate content.
 *
 * Keyed by pathname WITHOUT the leading slash; '' is the homepage.
 *
 * Length targets: title ≤ 60 chars including the " | Saeed Accounting" suffix
 * that Seo.jsx appends (19 chars, so keep `title` ≤ 41); description 120–160.
 * Both are enforced by scripts/check-seo.mjs.
 */

/** Appended to every title by Seo.jsx — kept here so the checker can measure. */
export const TITLE_SUFFIX = ' | Saeed Accounting'

export const ROUTE_SEO = {
  '': {
    // Home passes no title, so Seo.jsx uses its own default full-brand string.
    title: null,
    description:
      'Accounting, bookkeeping, VAT and corporate tax services across the UAE — FTA-compliant registration, filing and advisory for mainland and free zone firms.',
  },

  /* ---- Accounting ---- */
  'accounting-bookkeeping': {
    title: 'Accounting & Bookkeeping Services UAE',
    description:
      'Outsourced accounting and bookkeeping for UAE businesses — ledgers, reconciliations and management reports kept audit-ready and FTA-compliant year round.',
  },
  'accounts-receivable-services': {
    title: 'Accounts Receivable Services UAE',
    description:
      'Accounts receivable management for UAE businesses — invoicing, credit control and collections handled so cash flow stays steady and overdue balances get chased.',
  },
  'accounts-payable-services': {
    title: 'Accounts Payable Services UAE',
    description:
      'Outsourced accounts payable for UAE companies — supplier invoices verified, approvals tracked and payments scheduled to avoid late fees and duplicate billing.',
  },
  'cfo-services': {
    title: 'Outsourced CFO Services UAE',
    description:
      'Part-time and outsourced CFO services in the UAE — budgeting, cash flow forecasting, reporting and board-level advice without a full-time finance chief.',
  },

  /* ---- VAT ---- */
  'vat-registration-services': {
    title: 'FTA VAT Registration UAE from AED 149',
    description:
      'FTA VAT registration in the UAE from AED 149. Get your TRN fast with expert help on eligibility, documents and submission for mainland and free zone firms.',
  },
  'vat-return-filling': {
    title: 'VAT Return Filing Services UAE',
    description:
      'Accurate VAT return filing for UAE businesses — input and output tax reviewed and returns filed with the FTA before deadline, avoiding late-filing penalties.',
  },
  'vat-de-registration': {
    title: 'VAT De-Registration Services UAE',
    description:
      'VAT de-registration in the UAE — cancel your registration and suspend your TRN correctly, with FTA applications filed inside the 20-business-day window.',
  },
  'vat-audit': {
    title: 'VAT Audit Services UAE',
    description:
      'VAT audit support in the UAE — records and returns reviewed before the FTA examines them, with gaps found and documents prepared to defend your filings.',
  },
  'vat-refund': {
    title: 'VAT Refund Services UAE',
    description:
      'Claim your UAE VAT refund with confidence — recoverable input tax identified, evidence assembled and the FTA refund application tracked through to payment.',
  },
  'vat-amendment': {
    title: 'VAT Amendment Services UAE',
    description:
      'Correct errors in a filed UAE VAT return — voluntary disclosures and amendment requests prepared for the FTA to limit penalties and keep records accurate.',
  },

  /* ---- Corporate tax ---- */
  'corporate-tax-registration': {
    title: 'Corporate Tax Registration UAE',
    description:
      'UAE corporate tax registration handled end to end — eligibility confirmed, documents prepared and your Tax Registration Number secured via FTA EmaraTax.',
  },
  'corporate-tax-filing': {
    title: 'Corporate Tax Filing Services UAE',
    description:
      'UAE corporate tax filing done right — taxable income, deductions and reliefs calculated and your return filed with the FTA within nine months of year end.',
  },
  'corporate-tax-implementation': {
    title: 'Corporate Tax Implementation UAE',
    description:
      'Get your UAE business corporate-tax ready — impact assessment, chart of accounts alignment and process changes before your first taxable period begins.',
  },
  'corporate-tax-advisory': {
    title: 'Corporate Tax Advisory UAE',
    description:
      'UAE corporate tax advisory from qualified consultants — group structuring, free zone qualifying income, exemptions and reliefs assessed under the 9% regime.',
  },

  /* ---- Business setup ---- */
  'business-formation': {
    title: 'Business Formation Services Dubai',
    description:
      'Company formation in Dubai and across the UAE — mainland, free zone and offshore setup with licensing, trade name reservation and bank account opening.',
  },
  'local-sponsor': {
    title: 'Local Sponsor Services Dubai',
    description:
      'Local sponsor and corporate nominee services in Dubai — structured so you keep operational control while meeting UAE mainland ownership requirements.',
  },
  'pro-services': {
    title: 'PRO Services Dubai & Abu Dhabi',
    description:
      'Outsourced PRO services across Dubai, Abu Dhabi and Sharjah — visas, Emirates ID, labour cards and licence renewals processed without counter queues.',
  },

  /* ---- SEO landing variants ----
     These duplicate a service page's content on the live site but must not
     duplicate its meta, or the pair competes for the same query. */
  'uae-vat-registration': {
    title: 'VAT Registration UAE — Get Your TRN',
    description:
      'Register for UAE VAT without the guesswork. We confirm your threshold, compile documents and file with the FTA so your TRN arrives without resubmissions.',
  },
  'register-for-vat-online-uae': {
    title: 'Register for VAT Online in the UAE',
    description:
      'Complete your UAE VAT registration online from AED 149. Eligibility checked, documents prepared and the application submitted through the FTA portal for you.',
  },
  'uae-corporate-tax-registration': {
    title: 'UAE Corporate Tax Registration',
    description:
      'Speak to a UAE corporate tax consultant about registration — deadlines by licence issue date, EmaraTax filing and the AED 10,000 late penalty explained.',
  },
  'file-corporate-tax-return': {
    title: 'File Your Corporate Tax Return UAE',
    description:
      'File your UAE corporate tax return on time — financial statements reviewed, adjustments and reliefs applied, and the return filed via FTA EmaraTax.',
  },
  'corporate-tax-filing-uae': {
    title: 'Corporate Tax Filing UAE from AED 999',
    description:
      'FTA-compliant corporate tax filing in the UAE from AED 999, covering financial statement review through to submission for mainland and free zone firms.',
  },

  /* ---- Site pages ---- */
  'about-us': {
    title: 'About Us — UAE Tax Consultants',
    description:
      'Saeed Accounting is a UAE team of accountants and tax consultants supporting mainland and free zone businesses with bookkeeping, VAT, corporate tax and PRO.',
  },
  'contact-us': {
    title: 'Contact Us — Free Consultation',
    description:
      'Talk to Saeed Accounting about accounting, VAT and corporate tax in the UAE. Call, email or WhatsApp us for a free consultation with a qualified consultant.',
  },
}

/** Shown on unmatched routes. noindex, so length rules do not apply. */
export const NOT_FOUND_SEO = {
  title: 'Page Not Found',
  description: null,
}

/**
 * Look up meta for a pathname. Returns null when the route has no entry, so
 * the caller can fall back to NOT_FOUND_SEO.
 */
export function seoFor(pathname) {
  const key = String(pathname || '').replace(/^\/+|\/+$/g, '')
  return Object.prototype.hasOwnProperty.call(ROUTE_SEO, key) ? ROUTE_SEO[key] : null
}
