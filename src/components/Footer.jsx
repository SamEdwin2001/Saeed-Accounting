import { Link, useLocation } from 'react-router-dom'
import { MapPin, Phone, Mail, XLogo, Pinterest, LinkedIn, Instagram } from './Icons.jsx'
import { FOOTER_QUICK_LINKS, FOOTER_SERVICES } from '../data/nav.js'

/* The X link is the profile itself, not the login-redirect URL it was given
   as — that would bounce signed-in visitors through a login screen. */
const SOCIALS = [
  { Icon: XLogo, label: 'X', href: 'https://x.com/saeedaccntng' },
  { Icon: Pinterest, label: 'Pinterest', href: 'https://in.pinterest.com/saeedaccntng/' },
  {
    Icon: LinkedIn,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/saeed-accounting/',
  },
  { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/saeedaccounting/' },
]

export default function Footer() {
  const { pathname } = useLocation()

  /* Matches the bare header on the same route — a conversion landing page
     drops the whole four-column block and ends on the copyright bar. */
  const bareFooter = pathname === '/register-for-vat-online-uae'

  return (
    <footer className={`footer ${bareFooter ? 'footer--bare' : ''}`} id="contact">
      {!bareFooter && (
        <div className="container">
          <div className="footer__grid">
            <div className="footer__col footer__col--about">
              <h3 className="footer__heading">Saeed Accounting</h3>
              <p className="footer__text">
                At Saeed Accounting, we are certified tax consultants committed to delivering
                precise, reliable, and innovative solutions for VAT and tax compliance in Dubai. Our
                experienced team empowers businesses to navigate challenges and seize opportunities
                with confidence.
              </p>
            </div>

            <div className="footer__col">
              <h3 className="footer__heading">Quick Links</h3>
              <ul className="footer__list">
                {FOOTER_QUICK_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__heading">Services</h3>
              <ul className="footer__list">
                {FOOTER_SERVICES.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__col">
              <h3 className="footer__heading">Get In Touch</h3>
              <ul className="footer__contact">
                <li>
                  <MapPin className="footer__contact-icon" />
                  <span>No – 413, Hamsah A Building, Karama, Dubai, UAE</span>
                </li>
                <li>
                  <Phone className="footer__contact-icon" />
                  <a href="tel:+971508365223">+971 50 83 65 223</a>
                </li>
                <li>
                  <Mail className="footer__contact-icon" />
                  <a href="mailto:info@saeedaccounting.com">info@saeedaccounting.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <p className="footer__copy">Copyright @ 2026 . All Rights Reserved</p>
          <ul className="footer__socials">
            {SOCIALS.map(({ Icon, label, href }) => (
              <li key={label}>
                <a href={href} aria-label={label} target="_blank" rel="noreferrer">
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
