import { useEffect } from 'react'
import './corporateTaxFilingUae.css'

/*
 * Corporate Tax Filing (UAE / AED 999) landing page.
 *
 * Converted from a standalone HTML file. The original markup + SVGs are kept
 * verbatim and rendered through the component so the design is pixel-identical
 * to the source; the accompanying CSS is scoped under .ctf-page so its global
 * rules (body, *, :root …) can't affect the rest of the site.
 *
 * The three inline behaviours from the original <script> are ported below and
 * the two click helpers are exposed on window so the markup's inline
 * onclick="openWhatsApp(...)" / onclick="toggleFaq(this)" keep working.
 */
export default function CorporateTaxFilingUae() {
  /* The marquee sits above the site header, which is absolute at top:0.
     Publishing its measured height as --marquee-h drops the header (and the
     hero's top padding) below the bar. Measured rather than hardcoded so a
     wrapped line on a narrow screen still clears. */
  useEffect(() => {
    const bar = document.querySelector('.ctf-marquee')
    if (!bar) return undefined

    const apply = () =>
      document.body.style.setProperty('--marquee-h', `${bar.offsetHeight}px`)
    apply()

    const ro = new ResizeObserver(apply)
    ro.observe(bar)

    return () => {
      ro.disconnect()
      document.body.style.removeProperty('--marquee-h')
    }
  }, [])

  useEffect(() => {
    window.openWhatsApp = (text) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      const url = isMobile
        ? 'https://wa.me/+971569205600?text=' + encodeURIComponent(text)
        : 'https://web.whatsapp.com/send?phone=+971569205600&text=' + encodeURIComponent(text)
      window.open(url, '_blank')
    }

    window.toggleFaq = (el) => {
      const item = el.closest('.faq-item')
      const isOpen = item.classList.contains('open')
      document.querySelectorAll('.ctf-page .faq-item').forEach((f) => f.classList.remove('open'))
      if (!isOpen) item.classList.add('open')
    }

    // "Book a Free CT Filing Assessment" card → saves the lead, emails the
    // office (with the source page URL) and sends the visitor a thank-you.
    // All four fields are required, so we bail if any is empty.
    const form = document.querySelector('.ctf-page #lead-form')
    // Pristine markup captured up-front so the card can be restored after the
    // thank-you shows — otherwise the success state sticks until a page reload.
    const originalFormHTML = form ? form.innerHTML : ''
    let restoreTimer
    const onLeadSubmit = async (e) => {
      e.preventDefault()
      const val = (n) => form.querySelector(`[name="${n}"]`)?.value.trim() || ''
      const name = val('name')
      const phone = val('phone')
      const email = val('email')
      const company = val('company')
      if (!name || !phone || !email || !company) return

      const btn = form.querySelector('.btn-submit')
      const label = btn.textContent
      btn.disabled = true
      btn.textContent = 'Sending…'
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            email,
            message: `Corporate Tax Filing enquiry — Company type: ${company}`,
            source: 'ct-filing-landing',
            page: window.location.href,
          }),
        })
        if (!res.ok) throw new Error('request failed')
        form.innerHTML =
          '<div class="fc-success">' +
          '<div class="fc-success-tick">✓</div>' +
          '<h3>Thank you!</h3>' +
          '<p>Our team will contact you within 2 minutes. For anything urgent, WhatsApp us anytime.</p>' +
          '</div>'
        // Bring the fresh, empty form back after a few seconds so the page is
        // usable again without a manual reload. The submit listener lives on the
        // <form> itself, so it keeps working once the inputs are restored.
        restoreTimer = window.setTimeout(() => {
          if (form) form.innerHTML = originalFormHTML
        }, 6000)
      } catch {
        btn.disabled = false
        btn.textContent = label
        window.alert('Sorry, something went wrong. Please try again, or WhatsApp us.')
      }
    }
    if (form) form.addEventListener('submit', onLeadSubmit)

    // Scroll-reveal animations (same thresholds/timings as the original).
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 60)
        })
      },
      { threshold: 0.1 }
    )
    document
      .querySelectorAll('.ctf-page .reveal, .ctf-page .reveal-left, .ctf-page .reveal-right')
      .forEach((el) => revealObserver.observe(el))

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting)
            setTimeout(() => {
              e.target.style.opacity = '1'
              e.target.style.transform = 'translateY(0)'
            }, i * 80)
        })
      },
      { threshold: 0.1 }
    )
    document
      .querySelectorAll(
        '.ctf-page .entity-card, .ctf-page .review-card, .ctf-page .proc-step, .ctf-page .cl-item, .ctf-page .rule-card'
      )
      .forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
        el.style.transition = 'opacity .55s ease, transform .55s ease'
        cardObserver.observe(el)
      })

    return () => {
      revealObserver.disconnect()
      cardObserver.disconnect()
      if (form) form.removeEventListener('submit', onLeadSubmit)
      window.clearTimeout(restoreTimer)
      delete window.openWhatsApp
      delete window.toggleFaq
    }
  }, [])

  return <div className="ctf-page" dangerouslySetInnerHTML={{ __html: HTML }} />
}

/* Original page markup, preserved verbatim, with the deadline marquee added
   above it. The text is duplicated because the track scrolls a full 50% —
   the second copy is what's on screen as the first one leaves, so the loop
   reads as continuous rather than snapping back to an empty bar. */
const HTML = `<!-- DEADLINE MARQUEE -->
    <div class="ctf-marquee">
        <div class="ctf-marquee-track">
            <span class="ctf-marquee-item">⚠️ Avoid Penalties ⏰ Corporate Tax Filing Deadline: September 30, 2026 – File Before It's Too Late!</span>
            <span class="ctf-marquee-item" aria-hidden="true">⚠️ Avoid Penalties ⏰ Corporate Tax Filing Deadline: September 30, 2026 – File Before It's Too Late!</span>
        </div>
    </div>

    <!-- TOPBAR -->
    <!-- <div class="topbar">
        <div class="topbar-inner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber2)" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                </path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span class="tb-text"><strong>CT Filing Deadline Approaching</strong> — Every month delayed costs an extra
                AED 500. File today.</span>
            <a href="#lead-form" class="tb-badge"
                onclick="event.preventDefault(); document.getElementById('lead-form').scrollIntoView({behavior:'smooth'})">Act
                Now</a>
        </div>
    </div> -->

    <!-- NAV -->
    <!-- <nav class="nav">
        <div class="nav-inner">
            <a href="https://saeedaccounting.com" class="nav-logo">
                <img src="https://saeedaccounting.com/wp-content/uploads/2022/08/saeed.png" alt="Saeed Accounting"
                    style="max-height: 44px; width: auto;" />
            </a>
            <div class="nav-right">
                <span class="nav-badge">✦ FTA Compliant Experts</span>
                <button class="nav-cta"
                    onclick="document.getElementById('lead-form').scrollIntoView({behavior:'smooth'})">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path
                            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.22 1.05 2 2 0 012.2 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 10.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    Free Assessment
                </button>
            </div>
        </div>
    </nav> -->

    <!-- HERO -->
    <section class="hero">
        <div class="hero-bg">
            <div class="hero-grid-lines"></div>
        </div>
        <div class="hero-inner">
            <div class="hero-left">
                <div class="hero-eyebrow">
                    <div class="tb-dot" style="width:6px;height:6px;background:var(--sky);"></div>
                    Certified Tax Consultants · Dubai, UAE
                </div>
                <h1 style="line-height: 1.2;">
                    Corporate Tax Filing<br>
                    in UAE – <span class="italic">Stress-Free</span><br>
                    Starts at <span class="accent">AED 999</span>
                </h1>
                <p class="hero-desc">Saeed Accounting's FTA-compliant CT filing service handles everything from
                    financial statement review to FTA portal submission. <strong>Fast, accurate, fully transparent
                        pricing.</strong></p>



                <div class="hero-pills">
                    <span class="hero-pill"><span class="check">✓</span> 100% FTA Aligned</span>
                    <span class="hero-pill"><span class="check">✓</span> On-time Filing Guarantee</span>
                    <span class="hero-pill"><span class="check">✓</span> End-to-End Tax Solution</span>
                </div>

                <button class="btn-wa" style="margin-top: 24px; max-width: 400px; width: 100%;"
                    onclick="openWhatsApp('Hello Saeed Accounting, We are Seeking for Corporate Tax Filing Service')">
                    <svg viewBox="0 0 24 24">
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp – Get Instant Reply
                </button>
            </div>

            <form class="form-card" id="lead-form">
                <div class="fc-header">
                    <div>
                        <div class="fc-title">Book a Free CT Filing<br>Assessment Today</div>
                        <div class="fc-subtitle">We'll contact you within 2Mins.</div>
                    </div>
                    <div class="fc-price-tag">
                        <div class="fc-price-label"><strong>Starting at</strong></div>
                        <div class="fc-price-num"><span class="fc-price-cur">AED </span>999</div>
                    </div>
                </div>
                
                <div class="fc-field">
                    <label>Full Name *</label>
                    <input type="text" name="name" placeholder="e.g. Ali Hassan" required />
                </div>
                <div class="fc-field">
                    <label>WhatsApp / Mobile *</label>
                    <input type="tel" name="phone" placeholder="+971 55 123 4567" required />
                </div>
                <div class="fc-field">
                    <label>Email *</label>
                    <input type="email" name="email" placeholder="e.g. you@company.com" required />
                </div>
                <div class="fc-field">
                    <label>Company Type *</label>
                    <select name="company" required>
                        <option value="">Select your company type</option>
                        <option>LLC (Limited Liability Company)</option>
                        <option>Free Zone Company</option>
                        <option>Mainland Company</option>
                        <option>Sole Establishment</option>
                        <option>Foreign Branch / Subsidiary</option>
                        <option>Others</option>
                    </select>
                </div>

                <button class="btn-submit" type="submit">
                    Get Free Assessment
                </button>

                <div class="fc-trust">
                    <div class="fc-trust-dot"></div>
                    <span>Trusted by 16,000+ UAE businesses. Your information is secure.</span>
                </div>
            </form>
        </div>
    </section>

    <!-- STATS BAR -->
    <div class="stats-bar">
        <div class="stats-inner">
            <div class="stat-item">
                <div class="stat-num">16,000+</div>
                <div class="stat-lbl">Businesses served</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-num">7,000+</div>
                <div class="stat-lbl">Tax returns filed</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-num">10+</div>
                <div class="stat-lbl">Years experience</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-num">4.9 <span style="color: var(--amber2);">★</span></div>
                <div class="stat-lbl">Google rating</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <div class="stat-num">FTA</div>
                <div class="stat-lbl">Compliant experts</div>
            </div>
        </div>
    </div>

    <!-- TRUST LOGOS STRIP -->
    <div class="trust-strip">
        <div class="trust-strip-inner">
            <div class="trust-lbl">We file for companies across every UAE free zone &amp; jurisdiction</div>
            <div class="trust-logos">
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M8 12h8M8 8h5" />
                        </svg></div><span class="trust-chip-name">DMCC</span>
                </div>
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 3v18M3 12h18" />
                        </svg></div><span class="trust-chip-name">JAFZA</span>
                </div>
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <path d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg></div><span class="trust-chip-name">Mainland</span>
                </div>
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <path
                                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        </svg></div><span class="trust-chip-name">DIFC</span>
                </div>
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg></div><span class="trust-chip-name">DIC</span>
                </div>
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg></div><span class="trust-chip-name">SPC Free Zone</span>
                </div>
                <div class="trust-chip">
                    <div class="trust-chip-icon"><svg viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg></div><span class="trust-chip-name">Sole Establishments</span>
                </div>
            </div>
        </div>
    </div>

    <!-- SECTION: WHAT'S INCLUDED -->
    <!-- SECTION: WHAT'S INCLUDED -->
    <section class="section glow-section">
        <div class="section-inner">
            <div class="included-layout">
                <div>
                    <div class="reveal-left" style="margin-bottom: 1rem;"> 
                        <div class="section-title" style="line-height: 1.15;">Complete Corporate Tax<br><span
                                class="accent">Filing Support</span>
                        </div>
                        <p class="section-sub" style="margin-top: 6px;">Get expert-managed CT filing with accurate calculations, compliance checks, and seamless submission to the FTA.
                    
                        <div class="checklist reveal">
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Company KYC document review &amp; verification</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Full financial statements analysis (P&amp;L, Balance Sheet)</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Taxable income calculation per local tax law</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Depreciation schedule preparation &amp; review</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">VAT return reconciliation &amp; cross-checks</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Official portal submission &amp; tracking</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Filing confirmation &amp; acknowledgement</span>
                            </div>
                            <div class="cl-item">
                                <div class="cl-check"><svg viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span class="cl-text">Tax return copy for your digital records</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="inc-price-block theme-card reveal-right"
                        style="box-shadow: 0 20px 40px rgba(0,0,0,0.15);">
                        <div class="theme-card-inner">
                            <div class="ipb-label">Starting at</div>
                            <div class="ipb-price"><span class="ipb-currency">AED</span>999</div>
                            <div class="ipb-sub" style="margin-bottom: 1.25rem;"> Easy process. Fast service.</div>
                            <hr style="border: 0; border-top: 1px solid #000; opacity: 0.05; margin-bottom: 1.25rem;">
                            <div
                                style="font-size: 11px; font-weight: 700; color: #6B7280; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                                What's Included:</div>
                            <div class="ipb-features"
                                style="background: transparent; border: none; padding: 0; margin: 0; box-shadow: none;">
                                <div class="ipb-f-item"
                                    style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #1F2937;">
                                    <div
                                        style="width: 22px; height: 22px; background: #fff1ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg viewBox="0 0 24 24"
                                            style="width: 12px; height: 12px; stroke: var(--cobalt2); stroke-width: 4.5; fill: none;">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                     Free Zone
                                </div>
                                <div class="ipb-f-item"
                                    style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #1F2937;">
                                    <div
                                        style="width: 22px; height: 22px; background: #fff1ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg viewBox="0 0 24 24"
                                            style="width: 12px; height: 12px; stroke: var(--cobalt2); stroke-width: 4.5; fill: none;">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    Mainland
                                </div>
                                <div class="ipb-f-item"
                                    style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #1F2937;">
                                    <div
                                        style="width: 22px; height: 22px; background: #fff1ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg viewBox="0 0 24 24"
                                            style="width: 12px; height: 12px; stroke: var(--cobalt2); stroke-width: 4.5; fill: none;">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    Sole Establishments
                                </div>
                                <div class="ipb-f-item"
                                    style="display: flex; align-items: center; gap: 10px; margin-bottom: 0; font-size: 14px; font-weight: 600; color: #1F2937;">
                                    <div
                                        style="width: 22px; height: 22px; background: #fff1ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg viewBox="0 0 24 24"
                                            style="width: 12px; height: 12px; stroke: var(--cobalt2); stroke-width: 4.5; fill: none;">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    Foreign Branches
                                </div>
                            </div>
                        </div>

                        <a href="javascript:void(0)" onclick="openWhatsApp('Hi, I want to Start CT Filing')"
                            class="btn-cta-card" style="margin-top: 1.25rem;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style="margin-right: 8px;">
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            WhatsApp — Get Instant Reply
                        </a>

                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- SECTION: WHO IT'S FOR -->
    <section class="section">
        <div class="section-inner">
            <div class="reveal" style="text-align:center;">
                <div class="section-eyebrow">Who we serve</div>
                <div class="section-title">CT Filing for Every<br>Business in the <span class="accent">UAE</span></div>
            </div>
            <div class="entity-grid">
                <div class="entity-card reveal">
                    <div class="ec-icon-wrap"><svg viewBox="0 0 24 24">
                            <path d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg></div>
                    <div class="ec-title">Mainland</div>
                    <div class="ec-desc">UAE Mainland companies allow business anywhere with full flexibility.</div>
                </div>
                <div class="entity-card reveal">
                    <div class="ec-icon-wrap"><svg viewBox="0 0 24 24">
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                        </svg></div>
                    <div class="ec-title">Free Zone Companies</div>
                    <div class="ec-desc">DMCC, JAFZA, DIFC, SPC, and all other UAE free zones.</div>
                </div>
                <div class="entity-card reveal">
                    <div class="ec-icon-wrap"><svg viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="5" />
                            <path d="M20 21a8 8 0 10-16 0" />
                        </svg></div>
                    <div class="ec-title">Sole Establishments</div>
                    <div class="ec-desc">Individual traders and sole proprietors operating across the UAE.</div>
                </div>
                <div class="entity-card reveal">
                    <div class="ec-icon-wrap"><svg viewBox="0 0 24 24">
                            <path
                                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        </svg></div>
                    <div class="ec-title">Foreign Branches</div>
                    <div class="ec-desc">International company branches and subsidiaries registered in UAE.</div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: COMPLIANCE RULES -->
    <section class="section bg-slate">
        <div class="section-inner">
            <div class="reveal">
                <div class="section-eyebrow">Key regulations</div>
                <div class="section-title">UAE Corporate Tax<br><span class="accent">Compliance Guidelines</span></div>
                <p class="section-sub">Understand the key rules that every UAE business must follow under the Federal
                    Tax Authority's CT regime.</p>
            </div>
            <div class="rules-grid">
                <div class="rule-card reveal">
                    <div class="rc-num">01</div>
                    <div class="rc-body">
                        <div class="rc-title">Mandatory Returns for All Companies</div>
                        <div class="rc-desc">Filing is required for every company operating in the UAE — including free
                            zone entities and businesses with zero or nil tax liability.</div>
                    </div>
                </div>
                <div class="rule-card reveal">
                    <div class="rc-num">02</div>
                    <div class="rc-body">
                        <div class="rc-title">Federal Tax Authority Oversight</div>
                        <div class="rc-desc">The FTA (Federal Tax Authority) governs all corporate tax compliance,
                            registration, filing, and enforcement across the UAE.</div>
                    </div>
                </div>
                <div class="rule-card reveal">
                    <div class="rc-num">03</div>
                    <div class="rc-body">
                        <div class="rc-title">Standard Tax Rate: 9%</div>
                        <div class="rc-desc">Companies are subject to a 9% tax on profits above AED 375,000, and are required to file tax returns regardless of profit levels - filing is still mandatory.</div>
                    </div>
                </div>
                <div class="rule-card reveal">
                    <div class="rc-num">04</div>
                    <div class="rc-body">
                        <div class="rc-title">AED 500/Month Penalty for Late Filing</div>
                        <div class="rc-desc">Every month your CT return is overdue incurs an AED 500 FTA penalty. Prompt
                            filing is the most cost-effective decision.</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: PROCESS -->
    <section class="section">
        <div class="section-inner">
            <div class="reveal" style="text-align:center;">
                <div class="section-eyebrow" style="margin-bottom: 0.25rem;">How it works</div>
                <div class="section-title" style="margin-bottom: 20px;">Your CT Filing Done in<br><span class="accent">4
                        Simple Steps</span></div>
            </div>
            <div class="process-wrap">
                <div class="proc-step reveal">
                    <div class="ps-bubble"><span class="ps-num">1</span></div>
                    <div class="ps-title">Free Consultation</div>
                    <p class="ps-desc">WhatsApp or call us. Our CT experts review your specific business type and tax
                        requirements.</p>
                    <span class="ps-badge">Within 15 mins</span>
                </div>
                <div class="proc-step reveal">
                    <div class="ps-bubble"><span class="ps-num">2</span></div>
                    <div class="ps-title">Document Collection</div>
                    <p class="ps-desc">We send you a simple checklist. You share all required documents via WhatsApp or
                        email.</p>
                    <span class="ps-badge">30–60 mins</span>
                </div>
                <div class="proc-step reveal">
                    <div class="ps-bubble"><span class="ps-num">3</span></div>
                    <div class="ps-title">CT Return Preparation</div>
                    <p class="ps-desc">Our certified tax experts prepare, calculate, and review your complete corporate
                        tax return.</p>
                    <span class="ps-badge">Within 24 hours</span>
                </div>
                <div class="proc-step reveal">
                    <div class="ps-bubble"><span class="ps-num">4</span></div>
                    <div class="ps-title">FTA Submission</div>
                    <p class="ps-desc">We file on EmaraTax portal and share your official FTA confirmation and receipt
                        instantly.</p>
                    <span class="ps-badge">Confirmed same day</span>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: COMPARE -->
    <section class="section bg-slate">
        <div class="section-inner">
            <div class="reveal" style="text-align:center;">
                <div class="section-eyebrow">Why choose us</div>
                <div class="section-title">Saeed Accounting vs<br><span class="accent">Doing It Yourself</span></div>
            </div>
            <div class="compare-grid">
                <div class="compare-col us reveal-left">
                    <div class="compare-h4">With Saeed Accounting</div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#059669" stroke-width="2.5" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg><span>Starts at AED 999 — Easy setup, fast process</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#059669" stroke-width="2.5" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg><span>CT return ready in as little as 48 hours</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#059669" stroke-width="2.5" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg><span>Certified UAE tax professionals handle everything</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#059669" stroke-width="2.5" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg><span>FTA compliant — zero risk of errors or penalties</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#059669" stroke-width="2.5" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg><span>WhatsApp support throughout the process</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#059669" stroke-width="2.5" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                        </svg><span>Official FTA acknowledgement sent to you</span></div>
                </div>
                <div class="compare-col them reveal-right">
                    <div class="compare-h4">Without a Tax Expert</div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg><span>Risk of costly errors &amp; FTA audit exposure</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg><span>Hours spent navigating EmaraTax portal</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg><span>Uncertain on exemptions &amp; deductions</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg><span>AED 500/month penalty if you miss the deadline</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg><span>No professional backup if FTA queries arise</span></div>
                    <div class="compare-row"><svg viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg><span>No expert guidance on future tax planning</span></div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: REVIEWS -->
    <section class="section">
        <div class="section-inner">
            <div class="reveal">
                <div class="section-eyebrow" style="margin-bottom: 0.25rem;">Client reviews</div>
                <div class="section-title" style="margin-bottom: 0.5rem;">What Our Clients Say<br>About <span
                        class="accent">Saeed Accounting</span></div>
            </div>
            <div class="reviews-grid">
                <div class="review-card reveal">
                    <div class="rc-stars">
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <div class="rc-text">Saeed Accounting handled our entire corporate tax filing smoothly. Very
                        professional team, clear communication, and done within 48 hours just as promised. Highly
                        recommended!</div>
                    <div class="rc-author">
                        <div class="rc-avatar">A</div>
                        <div>
                            <div class="rc-name">Ahmed Al Rashidi</div>
                            <div class="rc-role">LLC Owner, Dubai Mainland</div>
                        </div>
                    </div>
                </div>
                <div class="review-card reveal">
                    <div class="rc-stars">
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <div class="rc-text">I approached Saeed Accounting for our DMCC free zone CT filing. Their service
                        was exemplary — professional, knowledgeable, and they guided us through every step with
                        confidence.</div>
                    <div class="rc-author">
                        <div class="rc-avatar">S</div>
                        <div>
                            <div class="rc-name">Sara Al Mansoori</div>
                            <div class="rc-role">Director, DMCC Free Zone Company</div>
                        </div>
                    </div>
                </div>
                <div class="review-card reveal">
                    <div class="rc-stars">
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <svg class="star" viewBox="0 0 24 24">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <div class="rc-text">Fast, efficient, and no fuss. Got my TRN and corporate tax filing done without
                        any hassle. The team was very responsive on WhatsApp throughout. Will definitely use again!
                    </div>
                    <div class="rc-author">
                        <div class="rc-avatar">K</div>
                        <div>
                            <div class="rc-name">Khalid Hassan</div>
                            <div class="rc-role">Sole Establishment, Karama</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: FAQ -->
    <section class="section bg-slate">
        <div class="section-inner">
            <div class="faq-layout">
                <div class="reveal-left" style="position:sticky;top:80px;">
                    <div class="section-eyebrow">Common questions</div>
                    <div class="section-title">Corporate Tax Filing<br><span class="accent">FAQs</span></div>
                    <p class="section-sub" style="font-size:14px;margin-top:.75rem;">Still have questions? Our tax team
                        is available on WhatsApp 7 days a week.</p>
                    <button class="btn-wa" style="margin-top:1.5rem;width:auto;padding:12px 22px;border-radius:40px;"
                        onclick="openWhatsApp('Hi, I have a question about CT Filing')">
                        <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:#fff">
                            <path
                                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </button>
                </div>
                <div class="faq-list reveal-right">
                    <div class="faq-item">
                        <div class="faq-q" onclick="toggleFaq(this)">
                            When is the UAE corporate tax filing deadline?
                            <div class="faq-icon"><svg viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg></div>
                        </div>
                        <div class="faq-a">
                            <div class="faq-a-inner">The FTA requires corporate tax returns to be filed within 9 months
                                of the end of the relevant tax period. For companies with a financial year ending
                                December 31, 2025, the CT filing deadline falls in September 2026. File early to avoid
                                penalties.</div>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-q" onclick="toggleFaq(this)">
                            What is the FTA penalty for late CT filing?
                            <div class="faq-icon"><svg viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg></div>
                        </div>
                        <div class="faq-a">
                            <div class="faq-a-inner">The FTA imposes a penalty of AED 500 for each month your corporate
                                tax return is delayed. That means a 3-month delay results in AED 1500 in fines, while a
                                6-month delay leads to AED 3000 in penalties. Filing on time with Saeed Accounting costs
                                just AED 999—significantly less than the cost of late fees.</div>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-q" onclick="toggleFaq(this)">
                            Do free zone companies need to file CT returns?
                            <div class="faq-icon"><svg viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg></div>
                        </div>
                        <div class="faq-a">
                            <div class="faq-a-inner">Yes. All UAE-registered entities—including free zone companies such
                                as DMCC, JAFZA, DIFC, SPC, and others—are required to register and file a corporate tax
                                return, regardless of whether they qualify for the 0% Qualifying Free Zone Person (QFZP)
                                rate. Failure to file is considered a violation</div>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-q" onclick="toggleFaq(this)">
                            What documents are needed for CT filing in Dubai?
                            <div class="faq-icon"><svg viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg></div>
                        </div>
                        <div class="faq-a">
                            <div class="faq-a-inner">You’ll need your company trade licence and KYC documents, financial
                                statements (audited or management accounts—including the income statement, balance
                                sheet, and cash flow statement), VAT return copies if you’re registered, bank statements
                                for the relevant tax period, and depreciation schedules. Our team will provide a simple
                                checklist, and most clients are able to gather everything within 30–60 minutes</div>
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-q" onclick="toggleFaq(this)">
                            My income is below AED 375,000 — must I still file?
                            <div class="faq-icon"><svg viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg></div>
                        </div>
                        <div class="faq-a">
                            <div class="faq-a-inner">Yes — the 0% tax rate on income below AED 375,000 does not exempt
                                you from corporate tax filing. You are still required to submit a return even if your
                                tax liability is AED 0. Our package AED 999 fully covers nil-liability returns, helping
                                you stay compliant and avoid penalties.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FINAL CTA -->
    <section class="final-cta">
        <div class="fca-inner">
            <div class="fca-eyebrow">
                <div class="tb-dot" style="width:6px;height:6px;background:var(--sky);"></div>
                Your Trusted Tax Partner
            </div>
            <div class="fca-title">Stop Losing <span class="accent">AED 500</span><br>Every Month to Penalties</div>
            <p>Complete your UAE corporate tax filing with Saeed Accounting today. Starts at AED 999. FTA-compliant
                certified experts. 48-hour turnaround. Serving 16,000+ businesses across Dubai and the UAE.</p>
            <div class="fca-btns">
                <button class="btn-primary-lg"
                    onclick="document.getElementById('lead-form').scrollIntoView({behavior:'smooth'})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path
                            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.22 1.05 2 2 0 012.2 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 10.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    Get Free Assessment – AED 999
                </button>
                <button class="btn-secondary-lg"
                    onclick="openWhatsApp('Hello Saeed Accounting, We are Seeking for Corporate Tax Filing Service')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp for CT Filing →
                </button>
            </div>
        </div>
    </section>

    <!-- MOBILE STICKY CTA -->
    <div class="mobile-cta">
        <button class="mcta-btn mcta-primary"
            onclick="document.getElementById('lead-form').scrollIntoView({behavior:'smooth'})">CT Filing – AED
            999</button>
        <button class="mcta-btn mcta-wa"
            onclick="openWhatsApp('Hello Saeed Accounting, We are Seeking for Corporate Tax Filing Service')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
        </button>
    </div>


    <!-- FOOTER -->

    <!-- FOOTER -->
    <!-- <div class="footer">
        <p><span class="footer-accent">Saeed Accounting</span> &nbsp;·&nbsp; Corporate Tax Filing UAE &nbsp;·&nbsp; CT
            Filing Dubai &nbsp;·&nbsp; No. 413, Hamsah A Building, Karama, Dubai &nbsp;·&nbsp; +971 50 10 35 519
            &nbsp;·&nbsp; © 2026 All Rights Reserved</p>
    </div> -->`
