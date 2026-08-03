import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

/* MySQL connection pool. Config comes from backend/.env (loaded by server.js
   before this module is imported).
   - dateStrings keeps DATETIME/DATE columns as plain strings, the way the old
     SQLite layer returned them, so the dashboard + trend logic are unchanged.
   - namedPlaceholders lets queries bind with :name (object) while plain ?
     positional binding (array) still works. */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  namedPlaceholders: true,
})

/* Thin helpers so the routes read almost like the old better-sqlite3 calls,
   only async: all() → rows, get() → first row, run() → { insertId, changes }. */
export async function all(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows
}
export async function get(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows[0]
}
export async function run(sql, params) {
  const [result] = await pool.query(sql, params)
  return { insertId: result.insertId, changes: result.affectedRows }
}

/* Create the tables on boot if they don't exist (MySQL dialect). */
export async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(120) NOT NULL,
      phone      VARCHAR(40)  NOT NULL,
      email      VARCHAR(160) NOT NULL,
      message    TEXT         NOT NULL,
      source     VARCHAR(40)  NOT NULL DEFAULT 'contact',
      status     VARCHAR(20)  NOT NULL DEFAULT 'new',
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_leads_created (created_at)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      username      VARCHAR(120) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      day_of_week VARCHAR(12)  NOT NULL,
      name        VARCHAR(120) NOT NULL,
      number      VARCHAR(20)  NOT NULL,
      message     TEXT         NOT NULL,
      active      TINYINT      NOT NULL DEFAULT 1,
      created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  /* Blog posts written in the admin panel and rendered at /blog and
     /blog/<slug>.
     - slug is UNIQUE because it *is* the public URL: two posts sharing one
       would make the second unreachable.
     - categories is a comma-separated list rather than its own table. The
       filter chips on /blog are the only consumer, the set is small and
       author-typed, and a join table would buy nothing here.
     - published_at is a DATE, not DATETIME: the card and the article show a
       day, and the admin form's date input has no time part to store. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      title        VARCHAR(200) NOT NULL,
      slug         VARCHAR(200) NOT NULL UNIQUE,
      categories   VARCHAR(255) NOT NULL DEFAULT '',
      image        VARCHAR(255) NOT NULL DEFAULT '',
      content      MEDIUMTEXT   NOT NULL,
      published    TINYINT      NOT NULL DEFAULT 1,
      published_at DATE         NULL,
      created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_blog_listing (published, published_at)
    )
  `)
}

/* Seed the single admin account on first run. Credentials come from .env so the
   default password never has to survive into production. */
export async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const exists = await get('SELECT 1 FROM users WHERE username = ?', [username])
  if (exists) return

  await run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [
    username,
    bcrypt.hashSync(password, 10),
  ])
  console.log(`[db] seeded admin user "${username}"`)
}
