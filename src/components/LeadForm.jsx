import { useState } from 'react'

const EMPTY = { name: '', phone: '', company: '' }

/**
 * Peach lead-capture card in the CT-filing hero.
 * No backend is wired up — swap the submit handler for your form endpoint.
 */
export default function LeadForm({ data }) {
  const { title, subtitle, priceLabel, priceAmount, fields, submitLabel, trustLine } = data
  const [values, setValues] = useState(EMPTY)
  const [sent, setSent] = useState(false)

  const update = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  return (
    <div className="lead">
      <div className="lead__head">
        <div>
          <h2 className="lead__title">{title}</h2>
          <p className="lead__sub">{subtitle}</p>
        </div>
        <div className="lead__price">
          <span className="lead__price-label">{priceLabel}</span>
          <span className="lead__price-amount">{priceAmount}</span>
        </div>
      </div>

      {sent ? (
        <p className="form__sent" role="status">
          Thanks — we&apos;ll be in touch shortly.
        </p>
      ) : (
        <form
          className="lead__form"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          {fields.map((f) => (
            <label className="lead__field" key={f.key}>
              <span className="lead__label">
                {f.label} <abbr title="required">*</abbr>
              </span>

              {f.type === 'select' ? (
                <select required value={values[f.key]} onChange={update(f.key)}>
                  <option value="">{f.placeholder}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  value={values[f.key]}
                  onChange={update(f.key)}
                />
              )}
            </label>
          ))}

          <button className="lead__submit" type="submit">
            {submitLabel}
          </button>
          <p className="lead__trust">{trustLine}</p>
        </form>
      )}
    </div>
  )
}
