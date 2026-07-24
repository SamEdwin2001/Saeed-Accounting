import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'

const router = Router()

const secret = () => process.env.JWT_SECRET || 'dev-only-insecure-secret'

/* Verifies the Bearer token. Exported so routes/leads.js can guard itself. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    req.user = jwt.verify(token, secret())
    next()
  } catch {
    res.status(401).json({ error: 'Session expired. Please sign in again.' })
  }
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)

  /* Same message whether the user is missing or the password is wrong, so
     the response can't be used to enumerate valid usernames. */
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Incorrect username or password.' })
  }

  const token = jwt.sign({ id: user.id, username: user.username }, secret(), { expiresIn: '12h' })
  res.json({ token, username: user.username })
})

/* Lets the dashboard confirm a stored token is still valid on page load. */
router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username })
})

export default router
