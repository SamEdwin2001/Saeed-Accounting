import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new Database(join(dataDir, 'app.db'))

/* WAL lets the dashboard read while a form submission writes, instead of
   the two blocking each other. */
db.pragma('journal_mode = WAL')

/* One-time migration: an earlier build of the WhatsApp feature stored a
   `send_date` column; it now uses `day_of_week`. If the old shape is present,
   drop it so the CREATE below rebuilds the table with the new columns. */
const waCols = db.prepare("PRAGMA table_info('whatsapp_messages')").all()
if (waCols.length && !waCols.some((c) => c.name === 'day_of_week')) {
  db.exec('DROP TABLE whatsapp_messages')
}

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    phone      TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    message    TEXT    NOT NULL DEFAULT '',
    source     TEXT    NOT NULL DEFAULT 'contact',
    status     TEXT    NOT NULL DEFAULT 'new',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    number      TEXT    NOT NULL,
    message     TEXT    NOT NULL DEFAULT '',
    active      INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`)

/* Seed the single admin account on first run. Credentials come from .env so
   the default password never has to survive into production. */
export function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const exists = db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)
  if (exists) return

  db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(
    username,
    bcrypt.hashSync(password, 10)
  )
  console.log(`[db] seeded admin user "${username}"`)
}
