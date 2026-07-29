import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, WhatsApp, Menu, Close } from './Icons.jsx'
import { IMAGES } from '../images.js'
import { NAV, BARE_CHROME_PATHS } from '../data/nav.js'
import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Which submenu is expanded. Desktop opens on hover via CSS; this state
  // drives the tap-to-expand behaviour inside the mobile drawer.
  const [openIndex, setOpenIndex] = useState(null)
  const { pathname } = useLocation()

  const closeAll = () => {
    setMenuOpen(false)
    setOpenIndex(null)
  }

  /* On a conversion landing page the header keeps just the logo and the
     WhatsApp CTA. */
  const bareHeader = BARE_CHROME_PATHS.includes(pathname)

  return (
    <header className={`header ${bareHeader ? 'header--bare' : ''}`}>
      <div className="container header__inner">
        <Link className="logo" to="/" aria-label="Saeed Accounting home" onClick={closeAll}>
          <img src={IMAGES.logo} alt="Saeed Accounting" className="logo__img" />
        </Link>

        {!bareHeader && (
          <nav
            className={`nav ${menuOpen ? 'nav--open' : ''}`}
            onKeyDown={(e) => e.key === 'Escape' && setOpenIndex(null)}
          >
            <ul className="nav__list">
              {NAV.map((item, i) => {
                // A parent with children owns no page of its own — it only opens
                // a submenu, so it renders as a button rather than a link.
                if (item.children) {
                  const active = item.children.some((c) => c.to === pathname)
                  return (
                    <li
                      key={item.label}
                      className={`nav__item nav__item--has-menu ${
                        openIndex === i ? 'nav__item--open' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className={`nav__link ${active ? 'nav__link--active' : ''}`}
                        aria-haspopup="true"
                        aria-expanded={openIndex === i}
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      >
                        {item.label}
                        <ChevronDown className="nav__caret" />
                      </button>

                      <ul className="dropdown">
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <Link className="dropdown__link" to={child.to} onClick={closeAll}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                }

                return (
                  <li className="nav__item" key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `nav__link ${isActive ? 'nav__link--active' : ''}`
                      }
                      onClick={closeAll}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        <a
          className="btn btn--whatsapp header__cta"
          href={WHATSAPP_FALLBACK_HREF}
          onClick={handleWhatsappClick}
          target="_blank"
          rel="noreferrer"
        >
          <span className="btn__icon-circle">
            <WhatsApp />
          </span>
          WhatsApp us
        </a>

        {/* The drawer toggle goes with the nav it opens. */}
        {!bareHeader && (
          <button
            className="nav__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <Close /> : <Menu />}
          </button>
        )}
      </div>
    </header>
  )
}
