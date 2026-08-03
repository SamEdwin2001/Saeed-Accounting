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
 * Titles are stored complete: Seo.jsx renders them verbatim rather than
 * appending a brand suffix, so the ones that carry " | Saeed Accounting" say so
 * here. Length targets — title ≤ 60 chars, description 120–160 — are warnings
 * in scripts/check-seo.mjs, since these strings come from the client's SEO
 * sheet and their wording wins over fitting the pixel width.
 */

/** Brand suffix used by the titles that carry one. */
export const TITLE_SUFFIX = ' | Saeed Accounting'

export const ROUTE_SEO = {
  '': {
    title: 'Accounting Firm in UAE | VAT, Corporate Tax & Bookkeeping',
    description:
      'Trusted accounting firm in UAE offering VAT, corporate tax, bookkeeping & CFO services. FTA-registered tax agents helping Dubai businesses stay compliant. Get a free consultation.',
  },

  /* ---- Accounting ---- */
  'accounting-bookkeeping': {
    title: 'Accounting & Bookkeeping Services in UAE',
    description:
      'Professional accounting and bookkeeping services in UAE for SMEs and large businesses. Accurate records, financial reports & FTA-compliant books. Book a free demo.',
  },
  'accounts-receivable-services': {
    title: 'Accounts Receivable Services in UAE',
    description:
      'Improve cash flow with professional accounts receivable services in UAE. We manage invoicing, collections & credit control for businesses in Dubai. Contact us today.',
  },
  'accounts-payable-services': {
    title: 'Accounts Payable Services in UAE',
    description:
      'Streamline vendor payments with expert accounts payable services in UAE. We handle invoice processing, approvals & payment management for Dubai businesses.',
  },
  'cfo-services': {
    title: 'CFO Services in UAE | Virtual & Outsourced CFO',
    description:
      'Get expert virtual CFO services in UAE without the full-time cost. Financial strategy, forecasting & reporting for growing businesses in Dubai. Talk to our team.',
  },

  /* ---- VAT ---- */
  'vat-registration-services': {
    title: 'VAT Registration Services in UAE | FTA Experts',
    description:
      'Register your business for VAT in the UAE with FTA-approved consultants. Fast, accurate VAT registration and TRN issuance for mainland & free zone companies.',
  },
  'vat-return-filling': {
    title: 'VAT Return Filing Services in UAE',
    description:
      'Timely and accurate VAT return filing services in UAE. Avoid FTA penalties with expert quarterly VAT filing support for Dubai businesses. Get started today.',
  },
  'vat-de-registration': {
    title: 'VAT De-Registration Services in UAE | Saeed Accounting',
    description:
      'Need to cancel your VAT registration? Our tax agents handle VAT deregistration with the FTA quickly and correctly, avoiding delays and penalties in the UAE.',
  },
  'vat-audit': {
    title: 'VAT Audit Services in UAE | FTA Audit Support | Saeed Accounting',
    description:
      'Prepare for an FTA VAT audit with confidence. Our VAT audit services in UAE review your records, identify risks and ensure full compliance. Contact us now.',
  },
  'vat-refund': {
    title: 'VAT Refund Services in UAE | Saeed Accounting',
    description:
      'Recover eligible input VAT with our VAT refund services in UAE. We manage the FTA refund application process end-to-end for businesses in Dubai.',
  },
  'vat-amendment': {
    title: 'VAT Amendment Services in UAE | Saeed Accounting',
    description:
      'Update your VAT registration details correctly with our VAT amendment services in UAE. We manage FTA amendment applications for businesses across Dubai.',
  },

  /* ---- Corporate tax ---- */
  'corporate-tax-registration': {
    title: 'Corporate Tax Registration Services in UAE',
    description:
      'Register your business for UAE corporate tax with FTA-registered experts. Fast, compliant corporate tax registration for mainland & free zone companies.',
  },
  'corporate-tax-filing': {
    title: 'Corporate Tax Filing Services in UAE',
    description:
      'Accurate, on-time corporate tax return filing services in UAE. Stay compliant with FTA deadlines and avoid penalties. Speak with our tax experts today.',
  },
  'corporate-tax-implementation': {
    title: 'Corporate Tax Implementation Services in UAE | Saeed Accounting',
    description:
      'Get your business corporate tax ready in UAE. We help implement systems, processes & documentation to meet FTA corporate tax requirements. Contact us today.',
  },
  'corporate-tax-advisory': {
    title: 'Corporate Tax Advisory Services in UAE | Saeed Accounting',
    description:
      'Strategic corporate tax advisory services in UAE from experienced consultants. Tax planning, structuring & compliance guidance for Dubai businesses.',
  },

  /* ---- Business setup ---- */
  'business-formation': {
    title: 'Business Formation Services in UAE | Company Setup | Saeed Accounting',
    description:
      'Start your business in the UAE with expert business formation services. Mainland, free zone & offshore company setup handled end-to-end. Get a free quote.',
  },
  'local-sponsor': {
    title: 'Local Sponsor Services in UAE | Local Service Agent | Saeed Accounting',
    description:
      'Reliable local sponsor and local service agent services in UAE for mainland company setup. Compliant, transparent partnerships for Dubai businesses.',
  },
  'pro-services': {
    title: 'PRO Services in UAE | Government Liaison Services',
    description:
      'Save time on paperwork with professional PRO services in UAE. Visa processing, license renewals & government approvals handled for you in Dubai.',
  },

  /* ---- SEO landing variants ----
     These duplicate a service page's content on the live site but must not
     duplicate its meta, or the pair competes for the same query. */
  'uae-vat-registration': {
    title: 'VAT Registration UAE — Get Your TRN',
    description:
      'Register for UAE VAT without the guesswork. We confirm your threshold, compile documents and file with the FTA so your TRN arrives without resubmissions.',
  },
  'vat-services-uae': {
    title: 'VAT Services UAE from AED 149',
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
    title: 'About Us - Accounting & Tax Consultants UAE | Saeed Accounting',
    description:
      'Learn about Saeed Accounting, an FTA-approved accounting and tax consultancy serving businesses across the UAE with VAT, corporate tax & bookkeeping expertise.',
  },
  'contact-us': {
    title: 'Contact Us - VAT & Corporate Tax Consultants UAE | Saeed Accounting',
    description:
      'Get in touch with Saeed Accounting for VAT, corporate tax, bookkeeping & business setup services in the UAE. Book your free consultation today.',
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
