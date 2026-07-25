import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from './auth.js'

const router = Router()

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const clean = (v, max) => String(v ?? '').trim().slice(0, max)
const digitsOnly = (v) => String(v ?? '').replace(/\D/g, '').slice(0, 20)
const normalizeDay = (v) => {
  const s = String(v ?? '').trim().toLowerCase()
  return DAYS.find((d) => d.toLowerCase() === s) || null
}

/* Server-local weekday — used only as a fallback when the website doesn't send
   its own local day (e.g. a direct API hit). Normally the client passes ?day=
   so the rotation follows the viewer's clock and rolls over at their midnight. */
const todayName = () => new Date().toLocaleDateString('en-US', { weekday: 'long' })

const fallbackMessage = () =>
  process.env.WHATSAPP_DEFAULT_MESSAGE || 'Hello Saeed Accounting, We are Seeking for VAT Services.'

/* Sort in calendar order (Mon → Sun), not alphabetically. */
const ORDER = `ORDER BY CASE day_of_week
  WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
  WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
  WHEN 'Sunday' THEN 7 ELSE 8 END, id DESC`

/* ── PUBLIC ────────────────────────────────────────────────────────────────
   The website's "WhatsApp us" button reads today's number + message here, so
   the office can rotate the number per weekday from the admin panel without
   touching code. Returns the ACTIVE row for today's weekday; if that row is
   inactive or missing, returns the default number instead — the button is
   never left pointing at a dead / deactivated number. This route sits above
   requireAuth on purpose. */
router.get('/today', (req, res) => {
  /* Never cache this — the office can change today's number at any moment, and
     a stale cached response would keep the site pointing at an old number. */
  res.set('Cache-Control', 'no-store')

  /* The website sends the visitor's local weekday (?day=…) so the number rolls
     over at the viewer's own midnight; fall back to the server's day if it's
     missing or invalid. */
  const day = normalizeDay(req.query.day) || todayName()
  const row = db
    .prepare('SELECT * FROM whatsapp_messages WHERE day_of_week = ? AND active = 1 ORDER BY id DESC')
    .get(day)

  if (row) {
    return res.json({
      day,
      active: true,
      number: digitsOnly(row.number),
      message: row.message || fallbackMessage(),
    })
  }

  /* No ACTIVE number for today (deactivated or never set). The website button
     will tell the visitor instead of opening a chat with a wrong/old number. */
  res.json({ day, active: false, number: null, message: fallbackMessage() })
})

/* Everything below is admin-only — requires a valid token. */
router.use(requireAuth)

/* List every scheduled message. */
router.get('/', (_req, res) => {
  const messages = db.prepare(`SELECT * FROM whatsapp_messages ${ORDER}`).all()
  res.json({ messages })
})

/* Create a new scheduled message. */
router.post('/', (req, res) => {
  const { day, name, number, message = '', active = true } = req.body || {}

  const validDay = normalizeDay(day)
  const cleanNumber = digitsOnly(number)
  if (!validDay || !name?.trim() || !cleanNumber) {
    return res.status(400).json({ error: 'Day, name and WhatsApp number are required.' })
  }

  const info = db
    .prepare(
      `INSERT INTO whatsapp_messages (day_of_week, name, number, message, active)
       VALUES (@day_of_week, @name, @number, @message, @active)`
    )
    .run({
      day_of_week: validDay,
      name: clean(name, 120),
      number: cleanNumber,
      message: clean(message, 2000),
      active: active ? 1 : 0,
    })

  const row = db.prepare('SELECT * FROM whatsapp_messages WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json({ message: row })
})

/* Partial update — used for both the edit form and the active/inactive toggle. */
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM whatsapp_messages WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Message not found.' })

  const { day, name, number, message, active } = req.body || {}
  const next = {
    day_of_week: day !== undefined ? normalizeDay(day) : existing.day_of_week,
    name: name !== undefined ? clean(name, 120) : existing.name,
    number: number !== undefined ? digitsOnly(number) : existing.number,
    message: message !== undefined ? clean(message, 2000) : existing.message,
    active: active !== undefined ? (active ? 1 : 0) : existing.active,
  }

  if (!next.day_of_week || !next.name || !next.number) {
    return res.status(400).json({ error: 'Day, name and WhatsApp number are required.' })
  }

  db.prepare(
    `UPDATE whatsapp_messages
        SET day_of_week = @day_of_week, name = @name, number = @number,
            message = @message, active = @active
      WHERE id = @id`
  ).run({ ...next, id: existing.id })

  const row = db.prepare('SELECT * FROM whatsapp_messages WHERE id = ?').get(existing.id)
  res.json({ message: row })
})

/* Delete a scheduled message. */
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM whatsapp_messages WHERE id = ?').run(req.params.id)
  if (!info.changes) return res.status(404).json({ error: 'Message not found.' })
  res.json({ ok: true })
})

export default router
