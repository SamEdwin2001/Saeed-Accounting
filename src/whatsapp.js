/* The website's "WhatsApp us" button.
 *
 * The number now rotates by weekday: it's pulled from the admin panel's
 * WhatsApp schedule via GET /api/whatsapp/today, so the office can set a
 * different number for each day (and edit / deactivate them) without touching
 * code. The day's message is pre-filled into the chat.
 *
 * Until that request resolves — and if it fails, or today's row is inactive /
 * missing — we fall back to the main number + default message, so the button
 * is never dead. */

const DEFAULT_NUMBER = '971508365223'
const DEFAULT_MESSAGE = 'Hello Saeed Accounting, We are Seeking for VAT Services.'

/* The CT-filing landing page (/corporate-tax-filing-uae) has its own dedicated
   WhatsApp line. Every WhatsApp button on that route uses it, independent of
   the weekday schedule that drives the rest of the site. Checked at click time,
   so it also holds after client-side navigation onto the page. */
const LANDING_PATH = '/corporate-tax-filing-uae'
const LANDING_NUMBER = '971569205600'
const LANDING_MESSAGE = 'Hello Saeed Accounting, We are Seeking for Corporate Tax Filing Service'

const onLandingPage = () =>
  typeof window !== 'undefined' && window.location.pathname === LANDING_PATH

/* Single source of truth for the WhatsApp contact number (fallback). */
export const WHATSAPP_NUMBER = DEFAULT_NUMBER

/* Updated in place once /today resolves; read at click time.
   active: null = not loaded yet, true = today has an active number,
   false = today has no active number (button alerts instead of opening). */
let today = { active: null, number: DEFAULT_NUMBER, message: DEFAULT_MESSAGE, day: '' }

async function loadToday() {
  try {
    /* Send the visitor's local weekday so the number rolls over at their own
       midnight, not the server's timezone. */
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    const res = await fetch(`/api/whatsapp/today?day=${encodeURIComponent(day)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return
    const data = await res.json()
    today = {
      active: !!data.active,
      number: data.number ? String(data.number).replace(/\D/g, '') : null,
      message: data.message || DEFAULT_MESSAGE,
      day: data.day || '',
    }
  } catch {
    /* Network error — leave active as null so clicks still open the main line
       rather than blocking when we simply couldn't reach the server. */
  }
}

/* Fetch on load, and again whenever the tab regains focus — so a page left
   open across midnight picks up the new day's number without a manual reload. */
if (typeof window !== 'undefined') {
  loadToday()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadToday()
  })
}

/* Coarse pointer + no hover is the reliable touch signal; the UA string is
   the fallback for browsers that don't report pointer media (and for the
   iPadOS UA, which claims to be a Mac). */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false

  if (window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) return true

  return /android|iphone|ipad|ipod|opera mini|iemobile|blackberry|webos/i.test(
    navigator.userAgent || ''
  )
}

/* wa.me redirects per device, but on desktop it lands on an interstitial
   before web.whatsapp.com; picking the endpoint up front skips that. */
function buildHref(number, message) {
  const text = message ? encodeURIComponent(message) : ''
  if (isMobileDevice()) {
    return `https://wa.me/${number}${text ? `?text=${text}` : ''}`
  }
  return `https://web.whatsapp.com/send?phone=${number}${text ? `&text=${text}` : ''}`
}

/* Resolved at click time, not module load, so the latest fetched number and
   the current device (resized window / desktop-mode toggle) are respected. */
export function whatsappHref() {
  if (onLandingPage()) return buildHref(LANDING_NUMBER, LANDING_MESSAGE)
  return buildHref(today.number || DEFAULT_NUMBER, today.message)
}

/* onClick handler for anchors. When today has an active number (or we're still
   loading / offline), it rewrites the href and lets the chat open. When today's
   number is deactivated / not set, it blocks the click and tells the visitor —
   so a wrong or old number is never dialled. */
export function handleWhatsappClick(event) {
  /* The landing page always uses its own number — never the weekday schedule,
     and never the "no active number today" alert. */
  if (onLandingPage() || today.active === null || (today.active && today.number)) {
    event.currentTarget.href = whatsappHref()
    return
  }

  event.preventDefault()
  const day =
    today.day || new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Dubai' })
  window.alert(`No ACTIVE WhatsApp number set for today (${day}).`)
}

/* Static fallback href for the anchor's initial render / no-JS / middle-click.
   Click rewrites it to today's number + message. */
export const WHATSAPP_FALLBACK_HREF = `https://wa.me/${DEFAULT_NUMBER}?text=${encodeURIComponent(
  DEFAULT_MESSAGE
)}`
