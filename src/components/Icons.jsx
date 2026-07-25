/**
 * Inline SVG icons. All of them inherit `currentColor`, so colour is set in CSS.
 */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const ChevronDown = (p) => (
  <svg {...base} width="12" height="12" strokeWidth={2.4} {...p}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const ChevronLeft = (p) => (
  <svg {...base} width="14" height="14" strokeWidth={2.4} {...p}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

export const ChevronRight = (p) => (
  <svg {...base} width="14" height="14" strokeWidth={2.4} {...p}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export const ArrowRight = (p) => (
  <svg {...base} width="16" height="16" {...p}>
    <line x1="4" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
)

export const WhatsApp = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="18" height="18" {...p}>
    <path d="M16.04 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.73 6.41L3.2 28.8l6.55-1.71a12.74 12.74 0 0 0 6.29 1.64h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.06-3.68Zm0 23.02h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.58 10.58 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.5 1.11 7.51 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.62-10.63 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.18-.32-.02-.5.14-.66.15-.15.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.73-.98-2.36-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
  </svg>
)

export const Phone = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)

export const MapPin = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const Mail = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2 6 12 13 22 6" />
  </svg>
)

/* ---- Accounting service icons ---- */
export const UserIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const InvoiceIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
    <line x1="9" y1="15" x2="13" y2="15" />
  </svg>
)

export const LedgerIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
)

export const BookIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
)

/* ---- VAT service icons ---- */
export const FileIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export const IdCardIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="8.5" cy="11" r="2" />
    <line x1="14" y1="10" x2="18" y2="10" />
    <line x1="14" y1="14" x2="18" y2="14" />
  </svg>
)

export const EditIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

/* ---- Support service icons ---- */
export const UsersIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const CheckCircle = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
)

export const GearIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
)

/* ---- Dark CTA feature icons ---- */
export const BriefcaseIcon = (p) => (
  <svg {...base} width="22" height="22" {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

export const ScaleIcon = (p) => (
  <svg {...base} width="22" height="22" {...p}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="5" y1="7" x2="19" y2="7" />
    <path d="M5 7 2 14h6L5 7Z" />
    <path d="M19 7l-3 7h6l-3-7Z" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
)

export const HandshakeIcon = (p) => (
  <svg {...base} width="22" height="22" {...p}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2 2 0 0 1 2.8 0L21 8.4" />
    <path d="m21 3-3.6 3.6a2 2 0 0 0 0 2.8" />
    <path d="M3 8.4 5.2 6.2a2 2 0 0 1 2.8 0l3.4 3.4a1 1 0 0 1 0 1.4l-1.6 1.6a1 1 0 0 1-1.4 0L5 9.2" />
  </svg>
)

/* Diamond-badge icons on the Corporate Tax cards */
export const ClipboardIcon = (p) => (
  <svg {...base} width="20" height="20" strokeWidth={1.6} {...p}>
    <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" />
    <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="13" y2="15" />
  </svg>
)

export const PeopleDocIcon = (p) => (
  <svg {...base} width="20" height="20" strokeWidth={1.6} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 3 14 8 19 8" />
    <circle cx="12" cy="13" r="2" />
    <path d="M8.5 18a3.5 3.5 0 0 1 7 0" />
  </svg>
)

/* Review-platform marks for the badge strip */
export const GoogleG = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" {...p}>
    <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" />
    <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21 7.6 23.5 12 23.5Z" />
    <path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z" />
    <path fill="#EA4335" d="M12 5.1c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.6 15.1.5 12 .5 7.6.5 3.7 3 1.8 6.8l3.8 3c.9-2.7 3.4-4.7 6.4-4.7Z" />
  </svg>
)

export const TrustpilotStar = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00B67A" width="20" height="20" {...p}>
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
)

export const XMark = (p) => (
  <svg {...base} width="16" height="16" strokeWidth={2.6} {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

export const BuildingIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15" />
    <path d="M12 10h7a1 1 0 0 1 1 1v10" />
    <line x1="7" y1="9" x2="9" y2="9" />
    <line x1="7" y1="13" x2="9" y2="13" />
    <line x1="15" y1="14" x2="17" y2="14" />
    <line x1="2" y1="21" x2="22" y2="21" />
  </svg>
)

export const GlobeIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </svg>
)

export const PersonIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
  </svg>
)

export const Check = (p) => (
  <svg {...base} width="16" height="16" strokeWidth={3} {...p}>
    <polyline points="4 12 9 17 20 6" />
  </svg>
)

export const Star = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...p}>
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
)

export const Quote = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...p}>
    <path d="M6.5 4C4 4 2 6 2 8.5S4 13 6.5 13c.3 0 .6 0 .9-.1-.5 2.2-2.2 3.9-4.4 4.4l.5 2.7C7.6 19.1 11 15 11 9.5 11 6.5 9 4 6.5 4Zm11 0C15 4 13 6 13 8.5s2 4.5 4.5 4.5c.3 0 .6 0 .9-.1-.5 2.2-2.2 3.9-4.4 4.4l.5 2.7c4.1-.9 7.5-5 7.5-10.5C22 6.5 20 4 17.5 4Z" />
  </svg>
)

/* ---- Social icons ---- */
export const Facebook = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
  </svg>
)

export const XLogo = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13" {...p}>
    <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1-5.7 6.1H1.6l7.5-8.5L1.2 3h6.6l4.5 5.6L17.5 3Zm-1.1 16h1.8L7.7 4.8H5.8L16.4 19Z" />
  </svg>
)

export const Instagram = (p) => (
  <svg {...base} width="14" height="14" strokeWidth={2} {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const LinkedIn = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.6c0-1.34-.02-3.06-1.9-3.06-1.9 0-2.2 1.46-2.2 2.96V21H9V9Z" />
  </svg>
)

export const YouTube = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
    <path d="M22.5 7.2a2.7 2.7 0 0 0-1.9-1.9C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.6.5A2.7 2.7 0 0 0 1.5 7.2 28 28 0 0 0 1 12a28 28 0 0 0 .5 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 23 12a28 28 0 0 0-.5-4.8ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" />
  </svg>
)

export const Plus = (p) => (
  <svg {...base} width="18" height="18" strokeWidth={2.2} {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const Trash = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

export const Menu = (p) => (
  <svg {...base} width="24" height="24" strokeWidth={2} {...p}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

export const Close = (p) => (
  <svg {...base} width="24" height="24" strokeWidth={2} {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)
