import { Router } from 'express'
import { all, get, run } from '../db.js'
import { requireAuth } from './auth.js'
import { sendLeadEmails } from '../mailer.js'

const router = Router()

const STATUSES = ['new', 'contacted', 'closed']

/* Public — the site's contact form posts here. Deliberately unauthenticated;
   everything below this route requires a token. */
router.post('/', async (req, res) => {
  const { name, phone, email = '', message = '', source = 'contact', page = '' } = req.body || {}

  /* Name + phone are required; email is optional (some forms — e.g. the CT
     filing card — only collect a WhatsApp number). Validate email only when
     one is given. */
  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Name and phone are required.' })
  }
  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const lead = {
    name: name.trim().slice(0, 120),
    phone: phone.trim().slice(0, 40),
    email: email.trim().slice(0, 160),
    message: String(message).trim().slice(0, 5000),
    source: String(source).slice(0, 40),
  }

  const info = await run(
    `INSERT INTO leads (name, phone, email, message, source)
     VALUES (:name, :phone, :email, :message, :source)`,
    lead
  )

  /* Respond immediately so the visitor isn't kept waiting on SMTP. */
  res.status(201).json({ id: info.insertId, ok: true })

  /* Then send the office notification + customer thank-you in the background.
     The page URL is passed through (not stored). Failures are only logged —
     the lead is already saved and shows in the dashboard regardless. */
  sendLeadEmails({ ...lead, page: String(page).trim().slice(0, 300) })
    .then((mail) => {
      if (mail.skipped) console.warn('[mail] not sent:', mail.reason)
      else console.log('[mail] lead', info.insertId, mail)
    })
    .catch((err) => console.error('[mail] unexpected error:', err))
})

router.use(requireAuth)

/* Dashboard list, with optional status filter and search. */
router.get('/', async (req, res) => {
  const { status, q } = req.query
  const where = []
  const params = {}

  if (status && STATUSES.includes(status)) {
    where.push('status = :status')
    params.status = status
  }
  if (q?.trim()) {
    where.push('(name LIKE :q OR email LIKE :q OR phone LIKE :q)')
    params.q = `%${q.trim()}%`
  }

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const leads = await all(
    `SELECT * FROM leads ${clause} ORDER BY created_at DESC, id DESC LIMIT 500`,
    params
  )

  res.json({ leads })
})

/* Counters for the dashboard's stat tiles. */
router.get('/stats', async (_req, res) => {
  const total = (await get('SELECT COUNT(*) AS n FROM leads')).n
  const byStatus = Object.fromEntries(
    (await all('SELECT status, COUNT(*) AS n FROM leads GROUP BY status')).map((r) => [r.status, r.n])
  )
  const today = (
    await get('SELECT COUNT(*) AS n FROM leads WHERE DATE(created_at) = CURDATE()')
  ).n

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
router.get('/trend', async (_req, res) => {
  const rows = await all(
    `SELECT DATE(created_at) AS day, status, COUNT(*) AS n
       FROM leads
      WHERE created_at >= (NOW() - INTERVAL 13 DAY)
      GROUP BY day, status`
  )

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

router.patch('/:id', async (req, res) => {
  const { status } = req.body || {}
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` })
  }

  const info = await run('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id])
  if (!info.changes) return res.status(404).json({ error: 'Lead not found.' })

  res.json({ ok: true })
})

router.delete('/:id', async (req, res) => {
  const info = await run('DELETE FROM leads WHERE id = ?', [req.params.id])
  if (!info.changes) return res.status(404).json({ error: 'Lead not found.' })

  res.json({ ok: true })
})

export default router
