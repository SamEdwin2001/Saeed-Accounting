/* Single source of truth for the WhatsApp contact number. */
export const WHATSAPP_NUMBER = '971508365223'

/* wa.me already redirects per device, but it costs a round trip and on
   desktop it lands on an interstitial before web.whatsapp.com. Picking the
   endpoint up front skips both. */
const MOBILE_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
const DESKTOP_LINK = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`

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

/* Resolved at click time, not module load, so a resized window or a
   desktop-mode toggle is respected rather than baked in on first render. */
export function whatsappHref() {
  return isMobileDevice() ? MOBILE_LINK : DESKTOP_LINK
}

/* onClick handler for anchors: rewrites href at click time. The anchor keeps
   a real wa.me href so middle-click, "copy link", and no-JS all still work. */
export function handleWhatsappClick(event) {
  event.currentTarget.href = whatsappHref()
}

export const WHATSAPP_FALLBACK_HREF = MOBILE_LINK
