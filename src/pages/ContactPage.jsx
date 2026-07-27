import { useState } from 'react'
import { MapPin, Mail, Phone, WhatsApp, ArrowRight, Check } from '../components/Icons.jsx'
import { api } from '../admin/api.js'
import { WHATSAPP_FALLBACK_HREF, handleWhatsappClick } from '../whatsapp.js'

const CHANNELS = [
  {
    Icon: MapPin,
    label: 'Visit us',
    value: 'No – 413, Hamsha A Building, Karama, Dubai, UAE',
    note: 'Sun – Thu, 9am – 6pm',
  },
  {
    Icon: Mail,
    label: 'Email us',
    value: 'info@saeedaccounting.com',
    href: 'mailto:info@saeedaccounting.com',
    note: 'We reply within one working day',
  },
  {
    Icon: Phone,
    label: 'Call us',
    value: '+971 50 83 65 223',
    href: 'tel:+971508365223',
    note: 'Speak to a consultant directly',
  },
]

const ASSURANCES = ['Free first consultation', 'FTA-registered tax agents', '30 years in the UAE']

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'
const makeCode = () =>
  Array.from({ length: 5 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')

const EMPTY = { name: '', phone: '', email: '', message: '', captcha: '' }

export default function ContactPage() {
  const [values, setValues] = useState(EMPTY)
  const [code, setCode] = useState(makeCode)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))

  const refresh = () => {
    setCode(makeCode())
    setValues((v) => ({ ...v, captcha: '' }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    /* The verification code is optional — it's a light anti-spam hint, not a
       gate. Name, phone and email stay required (enforced natively below and
       again on the server). */
    setError('')
    setBusy(true)
    try {
      await api.submitLead({
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message,
        source: 'contact',
        page: window.location.href,
      })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="ctc">
        <div className="ctc__inner">
          {/* Dark rail — contact channels and trust cues */}
          <aside className="ctc__aside">
            <p className="ctc__eyebrow">Contact us</p>
            <h1 className="ctc__title">
              Let&apos;s talk about
              <br />
              your numbers.
            </h1>
            <p className="ctc__lede">
              Tell us what you need — VAT, corporate tax, bookkeeping or a full CFO service. A
              consultant will come back to you personally.
            </p>

            <ul className="ctc__channels">
              {CHANNELS.map(({ Icon, label, value, href, note }) => (
                <li className="ctc-ch" key={label}>
                  <span className="ctc-ch__icon">
                    <Icon />
                  </span>
                  <div className="ctc-ch__body">
                    <p className="ctc-ch__label">{label}</p>
                    {href ? (
                      <a className="ctc-ch__value" href={href}>
                        {value}
                      </a>
                    ) : (
                      <p className="ctc-ch__value">{value}</p>
                    )}
                    <p className="ctc-ch__note">{note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a
              className="ctc__wa"
              href={WHATSAPP_FALLBACK_HREF}
              onClick={handleWhatsappClick}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsApp />
              Message us on WhatsApp
            </a>
          </aside>

          {/* Form panel */}
          <div className="ctc__panel">
            {sent ? (
              <div className="ctc-done" role="status">
                <span className="ctc-done__tick">
                  <Check />
                </span>
                <h2 className="ctc-done__title">Thank you — we&apos;ve got it.</h2>
                <p className="ctc-done__text">
                  Your enquiry is with our team. Expect a reply within one working day. For anything
                  urgent, call us on{' '}
                  <a href="tel:+971508365223">+971 50 83 65 223</a>.
                </p>
                <button
                  className="ctc-done__again"
                  onClick={() => {
                    setValues(EMPTY)
                    refresh()
                    setSent(false)
                  }}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form className="ctc-form" onSubmit={onSubmit}>
                <h2 className="ctc-form__title">Request a call back</h2>
                <p className="ctc-form__sub">
                  Fill in the form and we&apos;ll be in touch. No obligation.
                </p>

                {/* Floating labels: the label sits inside the field until the
                    input has content or focus, so the form reads clean without
                    losing the label the way a placeholder-only field does. */}
                <div className="ctc-row">
                  <div className="ctc-fld">
                    <input
                      id="c-name"
                      type="text"
                      placeholder=" "
                      autoComplete="name"
                      required
                      value={values.name}
                      onChange={update('name')}
                    />
                    <label htmlFor="c-name">Your name</label>
                  </div>

                  <div className="ctc-fld">
                    <input
                      id="c-phone"
                      type="tel"
                      placeholder=" "
                      autoComplete="tel"
                      required
                      value={values.phone}
                      onChange={update('phone')}
                    />
                    <label htmlFor="c-phone">Phone number</label>
                  </div>
                </div>

                <div className="ctc-fld">
                  <input
                    id="c-email"
                    type="email"
                    placeholder=" "
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={update('email')}
                  />
                  <label htmlFor="c-email">Email address</label>
                </div>

                <div className="ctc-fld">
                  <textarea
                    id="c-msg"
                    rows={4}
                    placeholder=" "
                    value={values.message}
                    onChange={update('message')}
                  />
                  <label htmlFor="c-msg">How can we help? (optional)</label>
                </div>

                <div className="ctc-cap">
                  <span className="ctc-cap__code" aria-hidden="true">
                    {code}
                  </span>
                  <button
                    type="button"
                    className="ctc-cap__refresh"
                    onClick={refresh}
                    aria-label="Get a new verification code"
                  >
                    ↻
                  </button>
                  <div className="ctc-fld ctc-fld--cap">
                    <input
                      id="c-cap"
                      type="text"
                      placeholder=" "
                      value={values.captcha}
                      onChange={update('captcha')}
                    />
                    <label htmlFor="c-cap">Enter the code (optional)</label>
                  </div>
                </div>

                {error && (
                  <p className="ctc-form__error" role="alert">
                    {error}
                  </p>
                )}

                <button className="ctc-submit" type="submit" disabled={busy}>
                  {busy ? 'Sending…' : 'Send enquiry'}
                  <ArrowRight />
                </button>

                <ul className="ctc-assure">
                  {ASSURANCES.map((a) => (
                    <li key={a}>
                      <Check />
                      {a}
                    </li>
                  ))}
                </ul>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="ctc-map">
        <iframe
          title="Saeed Accounting office location"
          src="https://www.google.com/maps?q=Karama,Dubai,UAE&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
