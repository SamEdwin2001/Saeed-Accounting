import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'
import { WhatsApp as WhatsAppIcon, EditIcon, Trash, Plus, Close } from '../components/Icons.jsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/* The weekday name for today — the viewer's local day, matching how the
   website picks today's number (rolls over at local midnight). */
const todayName = () => new Date().toLocaleDateString('en-US', { weekday: 'long' })

const emptyForm = () => ({ day: todayName(), name: '', number: '', message: '' })

export default function WhatsApp() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* modal is null when closed, else { mode: 'create'|'edit', id, values }. */
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  /* Confirmation dialog for toggle + delete: null | { kind, row }. */
  const [pending, setPending] = useState(null)
  const [confirmBusy, setConfirmBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { messages } = await api.whatsapp.list()
      setRows(messages)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setFormError('')
    setModal({ mode: 'create', id: null, values: emptyForm() })
  }

  const openEdit = (r) => {
    setFormError('')
    setModal({
      mode: 'edit',
      id: r.id,
      values: { day: r.day_of_week, name: r.name, number: r.number, message: r.message },
    })
  }

  const closeModal = () => setModal(null)

  const setField = (key) => (e) =>
    setModal((m) => ({ ...m, values: { ...m.values, [key]: e.target.value } }))

  /* Number field accepts digits only — strip anything else as it's typed. */
  const setNumber = (e) =>
    setModal((m) => ({
      ...m,
      values: { ...m.values, number: e.target.value.replace(/\D/g, '') },
    }))

  const save = async (e) => {
    e.preventDefault()
    const { day, name, number } = modal.values
    if (!day || !name.trim() || !number.trim()) {
      setFormError('Day, name and WhatsApp number are required.')
      return
    }
    setSaving(true)
    try {
      if (modal.mode === 'create') await api.whatsapp.create(modal.values)
      else await api.whatsapp.update(modal.id, modal.values)
      closeModal()
      load()
    } catch (err) {
      setFormError(err.message || 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  /* Toggle and delete both route through the confirmation dialog. */
  const askToggle = (r) => setPending({ kind: 'toggle', row: r })
  const askDelete = (r) => setPending({ kind: 'delete', row: r })
  const closeConfirm = () => {
    if (!confirmBusy) setPending(null)
  }

  const runConfirm = async () => {
    if (!pending) return
    const { kind, row } = pending
    setConfirmBusy(true)
    try {
      if (kind === 'toggle') await api.whatsapp.update(row.id, { active: !row.active })
      else await api.whatsapp.remove(row.id)
      setPending(null)
      load()
    } catch (err) {
      setError(err.message)
      setPending(null)
    } finally {
      setConfirmBusy(false)
    }
  }

  const today = todayName()

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">WhatsApp</h1>
        <button className="wa-add" onClick={openCreate}>
          <Plus />
          Add message
        </button>
      </div>

      {error && (
        <p className="adm-alert" role="alert">
          {error}
        </p>
      )}

      <section className="adm-panel">
        <div className="adm-panel__head">
          <h2 className="adm-panel__title">Scheduled messages</h2>
          <span className="adm-panel__count">{rows.length} total</span>
        </div>

        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Name</th>
                <th>WhatsApp Number</th>
                <th>Message Text</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td className="adm-empty" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="adm-empty" colSpan={6}>
                    No messages yet. Click “Add message” to create your first one.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="adm-nowrap adm-strong">
                      {r.day_of_week}
                      {r.day_of_week === today && <span className="wa-badge wa-badge--today">Today</span>}
                    </td>
                    <td>{r.name}</td>
                    <td className="adm-nowrap">
                      <a
                        className="adm-link"
                        href={`https://wa.me/${r.number.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <WhatsAppIcon />
                        {r.number}
                      </a>
                    </td>
                    <td className="adm-msg">{r.message || '—'}</td>
                    <td>
                      <span
                        className={`wa-badge ${r.active ? 'wa-badge--active' : 'wa-badge--inactive'}`}
                      >
                        {r.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="wa-actions">
                        <button
                          className={`wa-switch ${r.active ? 'is-on' : ''}`}
                          onClick={() => askToggle(r)}
                          role="switch"
                          aria-checked={!!r.active}
                          aria-label={r.active ? 'Deactivate message' : 'Activate message'}
                          title={r.active ? 'Turn off' : 'Turn on'}
                        >
                          <span className="wa-switch__knob" />
                        </button>
                        <button
                          className="wa-icon-btn wa-icon-btn--edit"
                          onClick={() => openEdit(r)}
                          aria-label={`Edit message for ${r.name}`}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="wa-icon-btn wa-icon-btn--danger"
                          onClick={() => askDelete(r)}
                          aria-label={`Delete message for ${r.name}`}
                          title="Delete"
                        >
                          <Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit form modal */}
      {modal && (
        <div className="wa-overlay" onMouseDown={closeModal}>
          <div
            className="wa-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={modal.mode === 'create' ? 'New WhatsApp message' : 'Edit WhatsApp message'}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="wa-dialog__head">
              <h3 className="wa-dialog__title">
                {modal.mode === 'create' ? 'New WhatsApp message' : 'Edit WhatsApp message'}
              </h3>
              <button className="wa-dialog__close" onClick={closeModal} aria-label="Close">
                <Close />
              </button>
            </div>

            <form className="wa-dialog__body" onSubmit={save}>
              <label className="adm-field">
                <span>Day</span>
                <select value={modal.values.day} onChange={setField('day')} required>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="adm-field">
                <span>Name</span>
                <input
                  type="text"
                  value={modal.values.name}
                  onChange={setField('name')}
                  placeholder="e.g. VAT Masters"
                  required
                />
              </label>

              <label className="adm-field">
                <span>WhatsApp Number</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={20}
                  value={modal.values.number}
                  onChange={setNumber}
                  onKeyDown={(e) => {
                    if (e.key.length === 1 && !/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="e.g. 971588617514"
                  required
                />
              </label>

              <label className="adm-field">
                <span>Message Text</span>
                <textarea
                  rows={3}
                  value={modal.values.message}
                  onChange={setField('message')}
                  placeholder="Hello, we are seeking tax services…"
                />
              </label>

              {formError && (
                <p className="adm-alert" role="alert">
                  {formError}
                </p>
              )}

              <div className="wa-dialog__foot">
                <button type="button" className="adm-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="wa-save" disabled={saving}>
                  {saving ? 'Saving…' : modal.mode === 'create' ? 'Create message' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal — toggle + delete */}
      {pending && (
        <div className="wa-overlay" onMouseDown={closeConfirm}>
          <div
            className="wa-dialog wa-dialog--confirm"
            role="alertdialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="wa-dialog__head">
              <h3 className="wa-dialog__title">
                {pending.kind === 'delete'
                  ? 'Delete message'
                  : pending.row.active
                    ? 'Deactivate message'
                    : 'Activate message'}
              </h3>
              <button className="wa-dialog__close" onClick={closeConfirm} aria-label="Close">
                <Close />
              </button>
            </div>

            <div className="wa-confirm">
              <p className="wa-confirm__text">
                {pending.kind === 'delete' ? (
                  <>
                    Delete the <strong>{pending.row.day_of_week}</strong> message for{' '}
                    <strong>{pending.row.name}</strong>? This cannot be undone.
                  </>
                ) : pending.row.active ? (
                  <>
                    Turn <strong>off</strong> the <strong>{pending.row.day_of_week}</strong> message?
                    It will be marked inactive and won’t be sent.
                  </>
                ) : (
                  <>
                    Turn <strong>on</strong> the <strong>{pending.row.day_of_week}</strong> message?
                    It will be marked active.
                  </>
                )}
              </p>

              <div className="wa-dialog__foot">
                <button
                  type="button"
                  className="adm-btn"
                  onClick={closeConfirm}
                  disabled={confirmBusy}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={pending.kind === 'delete' ? 'wa-save wa-save--danger' : 'wa-save'}
                  onClick={runConfirm}
                  disabled={confirmBusy}
                >
                  {confirmBusy
                    ? 'Working…'
                    : pending.kind === 'delete'
                      ? 'Delete'
                      : pending.row.active
                        ? 'Deactivate'
                        : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
