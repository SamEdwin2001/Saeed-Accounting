import { useState } from 'react'
import { ChevronRight } from './Icons.jsx'

/** FAQ accordion. `items` is `[{ q, a }]`. One panel open at a time. */
export default function Accordion({ items }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="faq">
      {items.map((item, i) => (
        <div className={`faq__item ${open === i ? 'faq__item--open' : ''}`} key={item.q}>
          <button
            type="button"
            className="faq__q"
            aria-expanded={open === i}
            aria-controls={`faq-a-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="faq__plus" aria-hidden="true">
              {open === i ? '–' : '+'}
            </span>
            <span className="faq__text">{item.q}</span>
            <ChevronRight className="faq__chevron" />
          </button>

          {open === i && (
            <div className="faq__a" id={`faq-a-${i}`}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
