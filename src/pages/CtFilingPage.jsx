import { useState } from 'react'
import { CT_FILING as D } from '../data/ctFiling.js'
import Reviews from '../components/Reviews.jsx'
import Seo from '../components/Seo.jsx'
import '../ctFiling.css'

/**
 * /corporate-tax-filing-service-uae
 *
 * Markup and class names mirror the live page exactly; the styles live in
 * ../ctFiling.css, ported from the live stylesheet and scoped under
 * .ctf-page. The live page's own <nav> and <footer> are intentionally not
 * rendered — the site's Header/Footer wrap this route already.
 */

import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

const WHATSAPP = WHATSAPP_FALLBACK_HREF

/* ---- inline SVGs, matching the source ---- */
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Cross = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const WaGlyph = () => (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16.04 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.73 6.41L3.2 28.8l6.55-1.71a12.74 12.74 0 0 0 6.29 1.64c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.05-3.68Zm0 23.02a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.58 10.58 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.5 1.11 7.51 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.62-10.63 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.18-.32-.02-.5.14-.66.15-.15.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.73-.98-2.36-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
  </svg>
)

const Star = () => (
  <svg className="star" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
)

// One line icon per jurisdiction chip, in the order of D.jurisdictions
// (DMCC, JAFZA, Mainland, DIFC, DIC, SPC Free Zone, Sole Establishments).
const JURISDICTION_ICONS = [
  // DMCC — tower
  <path key="dmcc" d="M6 21V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17M14 21V9h3a1 1 0 0 1 1 1v11M3 21h18M9 7h2M9 11h2M9 15h2" />,
  // JAFZA — anchor / port
  <path key="jafza" d="M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v16M5 12a7 7 0 0 0 14 0M3 12h4M17 12h4" />,
  // Mainland — columned bank
  <path key="mainland" d="M3 21h18M4 10h16M5 10 12 4l7 6M6 10v11M10 10v11M14 10v11M18 10v11" />,
  // DIFC — finance building
  <path key="difc" d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 21V9h4v12M4 21h17M8 8h3M8 12h3M8 16h3" />,
  // DIC — globe
  <path key="dic" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />,
  // SPC Free Zone — package / certificate
  <path key="spc" d="M3 9h18M5 4h14l2 5H3l2-5ZM4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M9 13h6" />,
  // Sole Establishments — person
  <path key="sole" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
]

const ENTITY_ICONS = [
  // Mainland
  <path key="a" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4" />,
  // Free zone
  <path key="b" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />,
  // Sole establishment
  <path key="c" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
  // Foreign branches
  <path key="d" d="M3 7h18v14H3zM8 7V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />,
]

function WaButton({ label, className = 'btn-wa' }) {
  return (
    <a className={className} href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
      <WaGlyph />
      {label}
    </a>
  )
}

function FormCard() {
  const [values, setValues] = useState({ name: '', phone: '', company: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  return (
    <div className="form-card">
      <div className="fc-header">
        <div>
          <div className="fc-title">{D.form.title}</div>
          <div className="fc-subtitle">{D.form.subtitle}</div>
        </div>
        <div className="fc-price-tag">
          <div className="fc-price-label">{D.form.priceLabel}</div>
          <div className="fc-price-num">
            <span className="fc-price-cur">AED </span>999
          </div>
        </div>
      </div>

      {sent ? (
        <p className="fc-subtitle" role="status">
          Thanks — we&apos;ll be in touch within 2 minutes.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // No backend wired up — point this at your form endpoint / CRM.
            setSent(true)
          }}
        >
          <div className="fc-field">
            <label htmlFor="fc-name">Full Name *</label>
            <input
              id="fc-name"
              type="text"
              required
              placeholder="e.g. Ali Hassan"
              value={values.name}
              onChange={set('name')}
            />
          </div>

          <div className="fc-field">
            <label htmlFor="fc-phone">WhatsApp / Mobile *</label>
            <input
              id="fc-phone"
              type="tel"
              required
              placeholder="+971 55 123 4567"
              value={values.phone}
              onChange={set('phone')}
            />
          </div>

          <div className="fc-field">
            <label htmlFor="fc-company">Company Type *</label>
            <select id="fc-company" required value={values.company} onChange={set('company')}>
              <option value="">Select your company type</option>
              {D.form.fields[2].options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-submit" type="submit">
            {D.form.submitLabel}
          </button>

          <div className="fc-trust">
            <span className="fc-trust-dot" />
            {D.form.trustLine}
          </div>
        </form>
      )}
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {q}
        <span className="faq-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div className="faq-a">
        <div className="faq-a-inner">{a}</div>
      </div>
    </div>
  )
}

export default function CtFilingPage() {
  // The site header is a transparent absolute overlay, so the page must
  // reserve its height or the hero renders underneath it.
  return (
    <div className="ctf-page" style={{ paddingTop: 'var(--header-h)' }}>
      <Seo
        title="Corporate Tax Filing Service UAE — from AED 999"
        description="FTA-compliant corporate tax filing in the UAE from AED 999. We handle financial statement review through to FTA portal submission for mainland, free zone and sole establishments."
      />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid-lines" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="tb-dot" />
              {D.heroPill}
            </div>

            <h1>
              Corporate Tax Filing in UAE – Stress-Free Starts at{' '}
              <span className="accent">AED 999</span>
            </h1>

            <p className="hero-desc">
              {D.heroSub} <strong>{D.heroSubBold}</strong>
            </p>

            <div className="hero-pills">
              {D.heroChips.map((c) => (
                <div className="hero-pill" key={c}>
                  <span className="check">
                    <Check />
                  </span>
                  {c}
                </div>
              ))}
            </div>

            <WaButton label={D.heroCta} />
          </div>

          <FormCard />
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stats-inner">
          {D.statsBar.map((s, i) => (
            <div className="stat-wrap" key={s.label} style={{ display: 'contents' }}>
              <div className="stat-item">
                <div className="stat-num">{s.value}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
              {i < D.statsBar.length - 1 && <div className="stat-divider" />}
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-lbl">{D.jurisdictionLine}</div>
          <div className="trust-logos">
            {D.jurisdictions.map((j, i) => (
              <div className="trust-chip" key={j}>
                <span className="trust-chip-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {JURISDICTION_ICONS[i % JURISDICTION_ICONS.length]}
                  </svg>
                </span>
                {j}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What's included + price */}
      <section className="section glow-section">
        <div className="section-inner">
          <div className="included-layout">
            <div className="reveal-left visible">
              <div className="section-title">
                Complete Corporate Tax <span className="accent">Filing Support</span>
              </div>
              <p className="section-sub">{D.supportLead}</p>

              <div className="checklist reveal visible">
                {D.supportItems.map((item) => (
                  <div className="cl-item" key={item}>
                    <span className="cl-check">
                      <Check />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="inc-price-block theme-card reveal-right visible">
              <div className="theme-card-inner">
                <div className="ipb-label">{D.pricingCard.priceLabel}</div>
                <div className="ipb-price">
                  <span className="ipb-currency">AED</span> {D.pricingCard.amount}
                </div>
                <div className="ipb-sub">{D.pricingCard.note}</div>

                <div className="ipb-features">
                  <div className="ipb-f-title">{D.pricingCard.includedTitle}</div>
                  {D.pricingCard.included.map((f) => (
                    <div className="ipb-f-item" key={f}>
                      <span className="cl-check">
                        <Check />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <a className="btn-cta-card" href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
                  <WaGlyph />
                  {D.pricingCard.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="section">
        <div className="section-inner">
          <div className="reveal visible">
            <div className="section-eyebrow">{D.serveKicker}</div>
            <div className="section-title">
              CT Filing for Every Business in <span className="accent">the UAE</span>
            </div>
          </div>

          <div className="entity-grid">
            {D.serveCards.map((c, i) => (
              <div className="entity-card reveal visible" key={c.title}>
                <div className="ec-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {ENTITY_ICONS[i]}
                  </svg>
                </div>
                <div className="ec-title">{c.title}</div>
                <div className="ec-desc">{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key regulations */}
      <section className="section bg-slate">
        <div className="section-inner">
          <div className="reveal visible">
            <div className="section-eyebrow">{D.regKicker}</div>
            <div className="section-title">
              UAE Corporate Tax <span className="accent">Compliance Guidelines</span>
            </div>
            <p className="section-sub">{D.regLead}</p>
          </div>

          <div className="rules-grid">
            {D.regCards.map((c) => (
              <div className="rule-card reveal visible" key={c.num}>
                <div className="rc-num">{c.num}</div>
                <div className="rc-body">
                  <div className="rc-title">{c.title}</div>
                  <div className="rc-desc">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="section-inner">
          <div className="reveal visible">
            <div className="section-eyebrow">{D.stepsKicker}</div>
            <div className="section-title">
              Your CT Filing Done in <span className="accent">4 Simple Steps</span>
            </div>
          </div>

          <div className="process-wrap">
            {D.steps.map((s) => (
              <div className="proc-step reveal visible" key={s.num}>
                <div className="ps-bubble">{s.num}</div>
                <div className="ps-title">{s.title}</div>
                <p className="ps-desc">{s.text}</p>
                <span className="ps-badge">{s.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section bg-slate">
        <div className="section-inner">
          <div className="reveal visible">
            <div className="section-eyebrow">{D.vsKicker}</div>
            <div className="section-title">
              Saeed Accounting vs <span className="accent">Doing It Yourself</span>
            </div>
          </div>

          <div className="compare-grid">
            <div className="compare-col us reveal-left visible">
              <div className="compare-h4">{D.vsGood.title}</div>
              {D.vsGood.items.map((i) => (
                <div className="compare-row" key={i}>
                  <span className="cl-check">
                    <Check />
                  </span>
                  {i}
                </div>
              ))}
            </div>

            <div className="compare-col them reveal-right visible">
              <div className="compare-h4">{D.vsBad.title}</div>
              {D.vsBad.items.map((i) => (
                <div className="compare-row" key={i}>
                  <span className="cl-cross">
                    <Cross />
                  </span>
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — shared grid component, identical to the landing pages. */}
      <Reviews />

      {/* FAQ */}
      <section className="section bg-slate">
        <div className="section-inner">
          <div className="faq-layout">
            <div className="reveal-left visible">
              <div className="section-eyebrow">{D.faqKicker}</div>
              <div className="section-title">
                Corporate Tax Filing <span className="accent">FAQs</span>
              </div>
              <p className="section-sub">{D.faqLead}</p>
              <WaButton label={D.faqCtaLabel} />
            </div>

            <div className="faq-list reveal-right visible">
              {D.faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="fca-inner">
          <div className="fca-eyebrow">
            <span className="tb-dot" />
            {D.finalPill}
          </div>

          <div className="fca-title">
            Stop Losing <span className="accent">AED 500</span> Every Month to Penalties
          </div>
          <p className="fca-sub">{D.finalLead}</p>

          <div className="fca-btns">
            <a className="btn-primary-lg" href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
              {D.finalCtas[0]}
            </a>
            <a className="btn-secondary-lg" href={WHATSAPP} onClick={handleWhatsappClick} target="_blank" rel="noreferrer">
              {D.finalCtas[1]}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
