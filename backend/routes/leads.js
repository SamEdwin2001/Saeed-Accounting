import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()

const STATUSES = ['new', 'contacted', 'closed']

/* Public — the site's contact form posts here. Deliberately unauthenticated;
   everything below this route requires a token. */
router.post('/', (req, res) => {
  const { name, phone, email, message = '', source = 'contact' } = req.body || {}

  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name, phone and email are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const info = db
    .prepare(
      `INSERT INTO leads (name, phone, email, message, source)
       VALUES (@name, @phone, @email, @message, @source)`
    )
    .run({
      name: name.trim().slice(0, 120),
      phone: phone.trim().slice(0, 40),
      email: email.trim().slice(0, 160),
      message: String(message).trim().slice(0, 5000),
      source: String(source).slice(0, 40),
    })

  res.status(201).json({ id: info.lastInsertRowid, ok: true })
})

router.use(requireAuth)

/* Dashboard list, with optional status filter and search. */
router.get('/', (req, res) => {
  const { status, q } = req.query
  const where = []
  const params = {}

  if (status && STATUSES.includes(status)) {
    where.push('status = @status')
    params.status = status
  }
  if (q?.trim()) {
    where.push('(name LIKE @q OR email LIKE @q OR phone LIKE @q)')
    params.q = `%${q.trim()}%`
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const leads = db
    .prepare(`SELECT * FROM leads ${clause} ORDER BY created_at DESC, id DESC LIMIT 500`)
    .all(params)

  res.json({ leads })
})

/* Counters for the dashboard's stat tiles. */
router.get('/stats', (_req, res) => {
  const total = db.prepare('SELECT COUNT(*) AS n FROM leads').get().n
  const byStatus = Object.fromEntries(
    db.prepare('SELECT status, COUNT(*) AS n FROM leads GROUP BY status').all().map((r) => [r.status, r.n])
  )
  const today = db
    .prepare("SELECT COUNT(*) AS n FROM leads WHERE date(created_at) = date('now')").get().n

  res.json({
    total,
    today,
    new: byStatus.new || 0,
    contacted: byStatus.contacted || 0,
    closed: byStatus.closed || 0,
  })
})

/* Daily counts for the last 14 days, zero-filled so the sparklines have a
   continuous series even on days with no enquiries. */
router.get('/trend', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT date(created_at) AS day, status, COUNT(*) AS n
         FROM leads
        WHERE created_at >= datetime('now', '-13 days')
        GROUP BY day, status`
    )
    .all()

  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }

  const seriesFor = (predicate) =>
    days.map((day) =>
      rows.filter((r) => r.day === day && predicate(r)).reduce((sum, r) => sum + r.n, 0)
    )

  res.json({
    days,
    total: seriesFor(() => true),
    new: seriesFor((r) => r.status === 'new'),
    contacted: seriesFor((r) => r.status === 'contacted'),
    closed: seriesFor((r) => r.status === 'closed'),
  })
})

router.patch('/:id', (req, res) => {
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` })
  }

  const info = db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, req.params.id)
  if (!info.changes) return res.status(404).json({ error: 'Lead not found.' })

  res.json({ ok: true })
})

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id)
  if (!info.changes) return res.status(404).json({ error: 'Lead not found.' })

  res.json({ ok: true })
})

export default router
