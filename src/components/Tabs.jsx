import { useState } from 'react'

/**
 * Tab strip with a bordered panel underneath.
 * A tab is `{ label, text }` for a single paragraph, or `{ label, paragraphs }`
 * / `{ label, items }` when the panel holds several blocks or a bullet list.
 */
export default function Tabs({ tabs, upper }) {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <div className={`tabs ${upper ? 'tabs--upper' : ''}`}>
      <div className="tabs__strip" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            id={`tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={`tabs__tab ${i === active ? 'tabs__tab--active' : ''}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') setActive((a) => (a + 1) % tabs.length)
              if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + tabs.length) % tabs.length)
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tabs__panel" id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
        {tab.text && <p className="tabs__para">{tab.text}</p>}

        {tab.paragraphs?.map((para) => (
          <p className="tabs__para" key={para}>
            {para}
          </p>
        ))}

        {tab.items && (
          <ul className="tabs__list">
            {tab.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
