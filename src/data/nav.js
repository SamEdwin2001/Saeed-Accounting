/**
 * Single source of truth for the navigation tree.
 * Both the header dropdowns and the footer link lists read from this,
 * and the router builds one route per service slug from SERVICES.
 *
 * Paths mirror the live saeedaccounting.com URLs exactly.
 */
export const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'Accounting',
    children: [
      { label: 'Accounts receivable services', to: '/accounts-receivable-services' },
      { label: 'Accounts payable Services', to: '/accounts-payable-services' },
      { label: 'Accounting & Bookkeeping', to: '/accounting-bookkeeping' },
      { label: 'CFO Services', to: '/cfo-services' },
    ],
  },
  {
    label: 'VAT / TAX',
    children: [
      { label: 'VAT Registration', to: '/vat-registration-uae' },
      { label: 'VAT Return Filling', to: '/vat-return-filling' },
      { label: 'VAT–De–Registration', to: '/vat-de-registration' },
      { label: 'VAT Audit', to: '/vat-audit' },
      { label: 'VAT Refund', to: '/vat-refund' },
      { label: 'VAT Amendment', to: '/vat-amendment' },
    ],
  },
  {
    label: 'Corporate Tax',
    children: [
      { label: 'Corporate Tax Registration', to: '/corporate-tax-registration' },
      { label: 'Corporate Tax Filing', to: '/corporate-tax-filing' },
      { label: 'Corporate Tax Implementation', to: '/corporate-tax-implementation' },
      { label: 'Corporate Tax Advisory', to: '/corporate-tax-advisory' },
    ],
  },
  {
    label: 'Support Services',
    children: [
      { label: 'Business Formation', to: '/business-formation' },
      { label: 'Local Sponsor', to: '/local-sponsor' },
      { label: 'PRO Services', to: '/pro-services' },
    ],
  },
  { label: 'About Us', to: '/about-us' },
  { label: 'Contact Us', to: '/contact-us' },
]

export const FOOTER_QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about-us' },
  { label: 'Contact', to: '/contact-us' },
]

export const FOOTER_SERVICES = [
  { label: 'VAT Registration', to: '/vat-registration-uae' },
  { label: 'Corporate Tax Registration', to: '/corporate-tax-registration' },
  { label: 'Accounting and Bookkeeping', to: '/accounting-bookkeeping' },
  { label: 'Corporate Tax Filing', to: '/corporate-tax-filing' },
  { label: 'VAT Filing', to: '/vat-return-filling' },
]
