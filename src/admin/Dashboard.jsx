import { useCallback, useEffect, useState } from 'react'
import { api, clearToken } from './api.js'
import Sparkline from './Sparkline.jsx'
import WhatsAppPage from './WhatsApp.jsx'
import {
  UserIcon,
  UsersIcon,
  CheckCircle,
  ClipboardIcon,
  Phone,
  Mail,
  Menu,
  Close,
  WhatsApp,
} from '../components/Icons.jsx'

const STATUSES = ['new', 'contacted', 'closed']

const formatDate = (s) =>
  new Date(`${s.replace(' ', 'T')}Z`).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

/* Card accents. Each drives the icon chip, the sparkline stroke and the
   card's wash tint, so a card reads as one colour block. */
const CARDS = [
  { key: 'total', label: 'Total Enquiries', Icon: UsersIcon, tone: 'red', series: 'total' },
  { key: 'today', label: 'Today', Icon: ClipboardIcon, tone: 'dark', series: 'total' },
  { key: 'new', label: 'New', Icon: UserIcon, tone: 'amber', series: 'new' },
  { key: 'contacted', label: 'Contacted', Icon: Phone, tone: 'blue', series: 'contacted' },
  { key: 'closed', label: 'Closed', Icon: CheckCircle, tone: 'green', series: 'closed' },
]

const TONE_STROKE = {
  red: '#e0342a',
  dark: '#2b2b2b',
  amber: '#e08a00',
  blue: '#2f6fed',
  green: '#17a34a',
}

export default function Dashboard({ username, onSignOut }) {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState(null)
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [page, setPage] = useState('enquiries') // 'enquiries' | 'whatsapp'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [{ leads }, s, t] = await Promise.all([
        api.listLeads({ status, q }),
        api.stats(),
        api.trend(),
      ])
      setLeads(leads)
      setStats(s)
      setTrend(t)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [status, q])

  /* Debounced so typing in the search box doesn't fire a request per keystroke. */
  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const changeStatus = async (id, next) => {
    /* Optimistic: the row updates immediately, then a reload resyncs the
       stat cards. On failure the reload restores the old value. */
    setLeads((rows) => rows.map((r) => (r.id === id ? { ...r, status: next } : r)))
    try {
      await api.setStatus(id, next)
      load()
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return
    try {
      await api.remove(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const signOut = () => {
    clearToken()
    onSignOut()
  }

  return (
    <div className="adm">
      <aside className={`adm-side ${navOpen ? 'is-open' : ''}`}>
        <div className="adm-side__brand">
          <span className="adm-side__mark">SA</span>
          <span className="adm-side__name">Saeed</span>
          <button
            className="adm-side__close"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          >
            <Close />
          </button>
        </div>

        <nav className="adm-nav">
          <p className="adm-nav__label">Dashboard</p>
          <button
            className={`adm-nav__item ${page === 'enquiries' ? 'is-active' : ''}`}
            onClick={() => {
              setPage('enquiries')
              setNavOpen(false)
            }}
          >
            <span className="adm-dot adm-dot--red" />
            Enquiries
          </button>
          <button
            className={`adm-nav__item ${page === 'whatsapp' ? 'is-active' : ''}`}
            onClick={() => {
              setPage('whatsapp')
              setNavOpen(false)
            }}
          >
            <span className="adm-nav__ico">
              <WhatsApp />
            </span>
            WhatsApp
          </button>

          {page === 'enquiries' && (
            <>
              <p className="adm-nav__label">Filter</p>
              <button
                className={`adm-nav__item ${status === '' ? 'is-active' : ''}`}
                onClick={() => setStatus('')}
              >
                <span className="adm-dot adm-dot--dark" />
                All leads
              </button>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`adm-nav__item ${status === s ? 'is-active' : ''}`}
                  onClick={() => setStatus(s)}
                >
                  <span className={`adm-dot adm-dot--${s}`} />
                  <span className="adm-cap">{s}</span>
                  {stats && <span className="adm-nav__count">{stats[s] ?? 0}</span>}
                </button>
              ))}
            </>
          )}

          <p className="adm-nav__label">Site</p>
          <a className="adm-nav__item" href="/" target="_blank" rel="noreferrer">
            <span className="adm-dot adm-dot--muted" />
            View website
          </a>
        </nav>
      </aside>

      {navOpen && <div className="adm-scrim" onClick={() => setNavOpen(false)} />}

      <div className="adm-body">
        <header className="adm-top">
          <button className="adm-burger" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Menu />
          </button>

          {page === 'enquiries' ? (
            <input
              className="adm-search"
              placeholder="Search name, email or phone…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          ) : (
            <span className="adm-search-gap" />
          )}

          <div className="adm-top__right">
            <span className="adm-avatar">{username.slice(0, 1).toUpperCase()}</span>
            <span className="adm-who">{username}</span>
            <button className="adm-btn" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>

        <main className="adm-main">
          {page === 'whatsapp' ? (
            <WhatsAppPage />
          ) : (
            <>
          <div className="adm-head">
            <h1 className="adm-h1">Dashboard</h1>
            <p className="adm-crumb">Dashboard &mdash; Enquiries</p>
          </div>

          {error && (
            <p className="adm-alert" role="alert">
              {error}
            </p>
          )}

          <div className="adm-cards">
            {CARDS.map(({ key, label, Icon, tone, series }) => (
              <article className={`adm-card adm-card--${tone}`} key={key}>
                <div className="adm-card__top">
                  <span className="adm-card__icon">
                    <Icon />
                  </span>
                  <div className="adm-card__meta">
                    <p className="adm-card__label">{label}</p>
                    <p className="adm-card__value">{stats?.[key] ?? '—'}</p>
                  </div>
                  <Sparkline
                    id={key}
                    points={trend?.[series] ?? []}
                    color={TONE_STROKE[tone]}
                  />
                </div>
                <p className="adm-card__foot">
                  {trend ? `${trend[series].reduce((a, b) => a + b, 0)} in the last 14 days` : ' '}
                </p>
              </article>
            ))}
          </div>

          <section className="adm-panel">
            <div className="adm-panel__head">
              <h2 className="adm-panel__title">
                {status ? <span className="adm-cap">{status} enquiries</span> : 'All enquiries'}
              </h2>
              <span className="adm-panel__count">{leads.length} shown</span>
            </div>

            <div className="adm-tablewrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {loading && leads.length === 0 ? (
                    <tr>
                      <td className="adm-empty" colSpan={7}>
                        Loading…
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td className="adm-empty" colSpan={7}>
                        No enquiries yet. Submissions from the contact form appear here.
                      </td>
                    </tr>
                  ) : (
                    leads.map((l) => (
                      <tr key={l.id}>
                        <td className="adm-nowrap adm-dim">{formatDate(l.created_at)}</td>
                        <td className="adm-strong">{l.name}</td>
                        <td className="adm-nowrap">
                          <a className="adm-link" href={`tel:${l.phone}`}>
                            <Phone />
                            {l.phone}
                          </a>
                        </td>
                        <td>
                          <a className="adm-link" href={`mailto:${l.email}`}>
                            <Mail />
                            {l.email}
                          </a>
                        </td>
                        <td className="adm-msg">{l.message || '—'}</td>
                        <td>
                          <select
                            className={`adm-status adm-status--${l.status}`}
                            value={l.status}
                            onChange={(e) => changeStatus(l.id, e.target.value)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button
                            className="adm-del"
                            onClick={() => remove(l.id)}
                            aria-label={`Delete enquiry from ${l.name}`}
                          >
                            <Close />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
