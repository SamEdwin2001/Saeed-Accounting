/**
 * ─────────────────────────────────────────────────────────────
 *  REPLACE IMAGE PATHS HERE — this is the only file you edit.
 * ─────────────────────────────────────────────────────────────
 *
 * Drop your real photos into `public/images/` and the paths below
 * resolve automatically (Vite serves `public/` from the site root).
 * Until a file exists, <Img> renders a grey "Replace image"
 * placeholder at exactly the same size / radius / position.
 *
 * Recommended source aspect ratios so nothing gets cropped oddly:
 *   hero    → 3:2  (e.g. 1200x800)
 *   about   → 1.9:1 letterbox (it is object-fit: cover, so 3:2 crops ~21%)
 *   collage → a single pre-composed PNG with transparency, ~1:1.03
 */
export const IMAGES = {
  hero: '/images/hero-meeting.jpg',
  about: '/images/about-team.jpg',
  collage: '/images/collage.png',
  logo: '/images/logo.png',
  // Diagram shown mid-article on service pages that have one.
  serviceDiagram: '/images/service-diagram.jpg',
}
