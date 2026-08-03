# Deploying to a CloudPanel VPS

One Node process serves both the API and the built frontend, so CloudPanel needs
a single reverse-proxy target. Run every command as the **site user** (not root)
unless it says otherwise.

Placeholders used below — substitute your own:

| Placeholder | Meaning | Example |
| --- | --- | --- |
| `SITE_USER` | CloudPanel site user | `saeedacc` |
| `APP_DIR` | Site root on disk | `/home/saeedacc/htdocs/www.saeedaccounting.com` |
| `DOMAIN` | Live domain | `www.saeedaccounting.com` |

---

## 1. Point DNS at the server

In your domain registrar, create these records and wait for them to propagate
(check with `dig +short DOMAIN` — it must return the server IP):

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | server IP |
| A | `www` | server IP |

SSL in step 7 will fail until this resolves, so do it first.

## 2. Create the site in CloudPanel

CloudPanel → **Sites → Add Site → Create a Node.js Site**.

- Domain: `DOMAIN`
- Node.js version: **20** (or 22 — the app needs ≥ 18)
- App Port: **4000**

CloudPanel creates `APP_DIR` and wires an nginx reverse proxy to `127.0.0.1:4000`.

## 3. Create the database

CloudPanel → **Databases → Add Database**.

- Name: `saeed_accounting`
- User: `saeed_accounting`, with a strong generated password

Note the password — it goes in `.env` next. The app creates its own tables on
boot (`init()` in `backend/db.js`), so there is no schema to import.

## 4. Get the code onto the server

SSH in as the site user, then from `APP_DIR`:

```bash
cd APP_DIR
git clone <your-repo-url> .          # or: rsync the project up, minus node_modules/ and dist/
npm ci --omit=dev                    # devDeps are only needed to build (see step 5)
```

If `APP_DIR` already contains CloudPanel's placeholder `index.html`, delete it
first so the clone lands in an empty directory.

## 5. Build the frontend

The build needs `vite`, which is a devDependency, so install everything, build,
then prune:

```bash
npm ci                # full install, including devDependencies
npm run build         # writes dist/
npm prune --omit=dev  # drop devDependencies again
```

Alternatively build on your own machine and upload `dist/` — the server never
needs the devDependencies that way.

`backend/server.js` only serves the frontend if `dist/index.html` exists, so
**this step is required** or the domain will return JSON 404s.

## 6. Configure the environment

```bash
cp backend/.env.example backend/.env
chmod 600 backend/.env    # secrets: keep it owner-readable only
nano backend/.env
```

Set at minimum:

```ini
PORT=4000
CORS_ORIGIN=https://DOMAIN

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=saeed_accounting
DB_USER=saeed_accounting
DB_PASSWORD=<from step 3>

ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong password>
JWT_SECRET=<paste: openssl rand -base64 48>

SMTP_HOST=mail.saeedaccounting.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@saeedaccounting.com
SMTP_PASS=<mailbox password>
MAIL_FROM_NAME=Saeed Accounting
MAIL_FROM=info@saeedaccounting.com
LEADS_INBOX=info@saeedaccounting.com

WHATSAPP_DEFAULT_NUMBER=971501035519
WHATSAPP_DEFAULT_MESSAGE="Hello Saeed Accounting, We are Seeking for VAT Services."
```

Two things worth getting right the first time:

- **`ADMIN_PASSWORD` is only read on first boot.** `seedAdmin()` skips an
  existing user, so changing it later has no effect — you would have to update
  the `users` row directly.
- **`JWT_SECRET` must be a real random string.** The fallback in the code is a
  known dev value; leaving it unset would let anyone mint a valid admin token.

## 7. Enable SSL

CloudPanel → your site → **SSL/TLS → Actions → New Let's Encrypt Certificate**,
covering both `DOMAIN` and the bare domain. Then turn on **Force HTTPS** for the
site so `http://` visitors are redirected.

## 8. Start the app under PM2

```bash
npm install -g pm2          # once per server; may need sudo
cd APP_DIR
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup                 # prints a sudo command — run it, to survive reboots
```

Verify before touching the browser:

```bash
curl -s localhost:4000/api/health     # → {"ok":true}
pm2 logs saeed-accounting --lines 40  # → [api] listening on http://localhost:4000
```

If the process is restarting in a loop, it is almost always the database: the
startup path exits deliberately when `init()` fails, so read the
`[startup] database init failed:` line in the logs.

## 9. Check the live site

- `https://DOMAIN` — homepage renders
- `https://DOMAIN/api/health` — `{"ok":true}`
- A deep link like `https://DOMAIN/contact` **on a hard refresh** — must render
  the page, not a 404 (this is the SPA fallback in `server.js`)
- Submit the contact form → lead lands in the admin panel and the email arrives
- `https://DOMAIN/admin` → log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`

---

## Redeploying after a code change

```bash
cd APP_DIR
git pull
npm ci                 # only if package.json changed
npm run build
npm prune --omit=dev
pm2 restart saeed-accounting
```

Hashed assets are cached for a year and HTML revalidates every request
(`Cache-Control: no-cache` in `server.js`), so a rebuild is picked up
immediately with no cache purge.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `502 Bad Gateway` | Node process is down, or listening on a different port | `pm2 logs`; confirm `PORT` in `.env` matches the site's App Port |
| Domain returns `{"error":"Not found"}` | `dist/` was never built | Run step 5, then `pm2 restart saeed-accounting` |
| Restart loop on boot | Wrong DB credentials, or MySQL unreachable | Check the `[startup]` line in `pm2 logs`; re-check `DB_*` in `.env` |
| Contact form saves but no email | SMTP rejected the login | Check `pm2 logs` at submit time; verify `SMTP_*` and that port 465 is open outbound |
| Login fails with the password you set | User was seeded on an earlier boot with a different one | Update the `users` row directly, or delete it and restart to reseed |
| Deep link 404s only on refresh | Reverse proxy is serving files itself instead of proxying | Confirm the site is a **Node.js** site in CloudPanel, proxying all paths to `127.0.0.1:4000` |

## Notes

- `backend/.env` is gitignored — it must never be committed. Keep the real
  values in a password manager, not in the repo.
- Never run `npm run dev` on the server; that is the Vite dev server. Production
  is `dist/` served by the Node process under PM2.
- Backups: CloudPanel can schedule MySQL dumps. The `leads` table is the only
  data that cannot be regenerated from the repo — make sure it is included.
