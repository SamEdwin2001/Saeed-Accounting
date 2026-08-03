import { Phone, Mail, EditIcon } from './Icons.jsx'

export default function FloatingActions() {
  return (
    /* Left-edge quick-contact rail */
    <aside className="rail" aria-label="Quick contact">
      <a className="rail__btn" href="tel:+971501035519" aria-label="Call us">
        <Phone />
      </a>
      <a className="rail__btn" href="mailto:info@saeedaccounting.com" aria-label="Email us">
        <Mail />
      </a>
      <a className="rail__btn" href="#contact" aria-label="Enquire now">
        <EditIcon width="14" height="14" />
      </a>
    </aside>
  )
}
