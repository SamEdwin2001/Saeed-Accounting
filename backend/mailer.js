import nodemailer from 'nodemailer'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = join(here, '..', 'public', 'images', 'logo.png')
const LOGO_CID = 'saeed-logo'

/* Brand + contact constants reused across both emails. Kept here so the
   templates read cleanly and there's one place to change them. */
const BRAND = {
  name: 'Saeed Accounting',
  orange: '#F0501E',
  ink: '#14110F',
  muted: '#6B6B6B',
  line: '#ECE7E3',
  phone: '+971 50 10 35 519',
  phoneHref: 'tel:+971501035519',
  email: 'info@saeedaccounting.com',
  address: 'No – 413, Hamsha A Building, Karama, Dubai, UAE',
  site: 'https://www.saeedaccounting.com',
}

/* People CC'd on the internal enquiry notification only. The customer
   thank-you email is never CC'd, so visitors never see these addresses.
   Override via LEADS_CC in .env (comma-separated) if this list changes. */
const DEFAULT_LEADS_CC = [
  'vatfiling@thevatconsultant.com',
  'marketing@thevatconsultant.com',
  'vf@thevatconsultant.com',
  'tech3@thevatconsultant.com',
  'tech2@thevatconsultant.com',
]

/* dotenv is loaded by server.js before this module reads process.env, so the
   transporter picks up whatever's in backend/.env. */
function mailConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.MAIL_FROM_NAME || BRAND.name,
    fromAddr: process.env.MAIL_FROM || process.env.SMTP_USER || BRAND.email,
    leadsInbox: process.env.LEADS_INBOX || process.env.SMTP_USER || BRAND.email,
    leadsCc: (process.env.LEADS_CC
      ? process.env.LEADS_CC.split(',').map((a) => a.trim()).filter(Boolean)
      : DEFAULT_LEADS_CC),
  }
}

/* Without a host+user+pass the transporter can't authenticate, so we skip
   sending rather than throw — a submitted lead is still saved to the DB and
   visible in the dashboard even when mail isn't configured yet. */
export function isMailConfigured() {
  const { host, user, pass } = mailConfig()
  return Boolean(host && user && pass)
}

let transporter
function getTransport() {
  if (transporter) return transporter
  const c = mailConfig()
  transporter = nodemailer.createTransport({
    host: c.host,
    port: c.port,
    secure: c.secure, // true for 465 (implicit TLS), false for 587 (STARTTLS)
    auth: { user: c.user, pass: c.pass },
  })
  return transporter
}

/* Escape anything that came from the visitor before it goes into HTML, so a
   name or message can't inject markup into the email. */
function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const logoAttachment = () =>
  existsSync(LOGO_PATH) ? [{ filename: 'logo.png', path: LOGO_PATH, cid: LOGO_CID }] : []

/* A logo <img> that falls back to the brand name if the CID image is missing
   or blocked by the client. */
function logoHeader() {
  if (existsSync(LOGO_PATH)) {
    return `<img src="cid:${LOGO_CID}" alt="${BRAND.name}" width="180"
              style="display:block;border:0;outline:none;height:auto;max-width:180px" />`
  }
  return `<span style="font-size:22px;font-weight:700;color:${BRAND.ink}">${BRAND.name}</span>`
}

function shell(innerHtml) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F6F3F0;font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F3F0">
      <tr>
        <td align="center" style="padding:28px 16px">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                 style="width:600px;max-width:100%;background:#FFFFFF;border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden">
            <tr>
              <td style="height:6px;background:${BRAND.orange};line-height:6px;font-size:0">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px">${logoHeader()}</td>
            </tr>
            ${innerHtml}
            <tr>
              <td style="padding:22px 32px 30px;border-top:1px solid ${BRAND.line}">
                <p style="margin:0 0 4px;font-size:13px;line-height:1.6;color:${BRAND.muted}">
                  <strong style="color:${BRAND.ink}">${BRAND.name}</strong><br />
                  ${BRAND.address}
                </p>
                <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:${BRAND.muted}">
                  <a href="${BRAND.phoneHref}" style="color:${BRAND.orange};text-decoration:none">${BRAND.phone}</a>
                  &nbsp;•&nbsp;
                  <a href="mailto:${BRAND.email}" style="color:${BRAND.orange};text-decoration:none">${BRAND.email}</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#9A9A9A">
            © ${BRAND.name} — Accounting, VAT &amp; Corporate Tax, UAE
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

/* ── Internal notification: goes to the office inbox ─────────────────────── */
function leadNotificationHtml(lead) {
  const row = (label, value) => `
    <tr>
      <td style="padding:10px 0;width:130px;vertical-align:top;font-size:14px;color:${BRAND.muted}">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:${BRAND.ink};font-weight:600">${value}</td>
    </tr>`

  const message = lead.message?.trim()
    ? esc(lead.message).replace(/\n/g, '<br />')
    : '<span style="color:#9A9A9A;font-weight:400">— no message —</span>'

  /* Show the exact page the enquiry was submitted from, as a clickable link.
     Falls back to the plain source label if no page URL came through. */
  const pageCell = lead.page
    ? `<a href="${esc(lead.page)}" style="color:${BRAND.orange};text-decoration:none;word-break:break-all">${esc(lead.page)}</a>`
    : esc(lead.source || 'contact')

  const inner = `
    <tr>
      <td style="padding:8px 32px 0">
        <h1 style="margin:0 0 4px;font-size:20px;color:${BRAND.ink}">New website enquiry</h1>
        <p style="margin:0 0 18px;font-size:14px;color:${BRAND.muted}">
          A visitor submitted the contact form. Reply directly to this email to reach them.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="border-top:1px solid ${BRAND.line}">
          ${row('Name', esc(lead.name))}
          ${row('Phone', `<a href="tel:${esc(lead.phone)}" style="color:${BRAND.ink}">${esc(lead.phone)}</a>`)}
          ${row('Email', lead.email ? `<a href="mailto:${esc(lead.email)}" style="color:${BRAND.ink}">${esc(lead.email)}</a>` : '<span style="color:#9A9A9A;font-weight:400">— not provided —</span>')}
          ${row('Page', pageCell)}
          ${row('Message', message)}
        </table>
      </td>
    </tr>`
  return shell(inner)
}

/* ── Customer confirmation: the thank-you the visitor receives ──────────── */
function thankYouHtml(lead) {
  const firstName = esc((lead.name || '').trim().split(/\s+/)[0] || 'there')
  const inner = `
    <tr>
      <td style="padding:8px 32px 0">
        <h1 style="margin:0 0 12px;font-size:22px;color:${BRAND.ink}">Thank you, ${firstName} 👋</h1>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#3A3A3A">
          We've received your enquiry and a member of our team will get back to you
          within <strong>one working day</strong>. We appreciate you reaching out to
          ${BRAND.name}.
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#3A3A3A">
          Here's a copy of what you sent us:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="margin:6px 0 20px;background:#FBF6F3;border:1px solid ${BRAND.line};border-radius:10px">
          <tr>
            <td style="padding:16px 18px;font-size:14px;line-height:1.7;color:${BRAND.ink}">
              <strong>Phone:</strong> ${esc(lead.phone)}<br />
              <strong>Email:</strong> ${esc(lead.email)}
              ${lead.message?.trim() ? `<br /><strong>Message:</strong> ${esc(lead.message).replace(/\n/g, '<br />')}` : ''}
            </td>
          </tr>
        </table>
        <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#3A3A3A">
          Need something urgent? Call us on
          <a href="${BRAND.phoneHref}" style="color:${BRAND.orange};text-decoration:none;font-weight:600">${BRAND.phone}</a>
          and speak to a consultant directly.
        </p>
        <a href="${BRAND.site}"
           style="display:inline-block;background:${BRAND.orange};color:#FFFFFF;text-decoration:none;
                  font-size:14px;font-weight:700;padding:12px 22px;border-radius:8px">
          Visit our website
        </a>
      </td>
    </tr>`
  return shell(inner)
}

const plain = (lines) => lines.filter(Boolean).join('\n')

/* Sends both emails. Each is awaited independently so one failing (e.g. a
   bounced customer address) doesn't stop the other. Returns a small result
   object; callers log it but should not fail the HTTP request on a mail error
   — the lead is already saved. */
export async function sendLeadEmails(lead) {
  if (!isMailConfigured()) {
    return { skipped: true, reason: 'SMTP not configured (missing SMTP_PASS)' }
  }

  const c = mailConfig()
  const from = `"${c.fromName}" <${c.fromAddr}>`
  const t = getTransport()
  const result = { notify: null, thankYou: null }

  // 1) Office notification
  try {
    const notify = {
      from,
      to: c.leadsInbox,
      // CC the team on the internal enquiry only — the customer thank-you
      // below is never CC'd, so visitors never see these addresses.
      ...(c.leadsCc.length ? { cc: c.leadsCc } : {}),
      subject: `New enquiry from ${lead.name} — website`,
      text: plain([
        'New website enquiry',
        '',
        `Name:    ${lead.name}`,
        `Phone:   ${lead.phone}`,
        `Email:   ${lead.email || '(not provided)'}`,
        `Page:    ${lead.page || lead.source || 'contact'}`,
        `Message: ${lead.message?.trim() || '(none)'}`,
      ]),
      html: leadNotificationHtml(lead),
      attachments: logoAttachment(),
    }
    // Reply-To only when the visitor left an email; otherwise reply by phone.
    if (lead.email) notify.replyTo = `"${lead.name}" <${lead.email}>`
    await t.sendMail(notify)
    result.notify = 'sent'
  } catch (err) {
    result.notify = `failed: ${err.message}`
  }

  // 2) Customer thank-you — only when the visitor gave an email address.
  if (!lead.email) {
    result.thankYou = 'skipped (no email)'
    return result
  }
  try {
    await t.sendMail({
      from,
      to: `"${lead.name}" <${lead.email}>`,
      replyTo: `"${c.fromName}" <${c.leadsInbox}>`,
      subject: `Thank you for contacting ${c.fromName}`,
      text: plain([
        `Thank you, ${(lead.name || '').split(/\s+/)[0] || 'there'}.`,
        '',
        "We've received your enquiry and will get back to you within one working day.",
        '',
        `Phone: ${lead.phone}`,
        `Email: ${lead.email}`,
        lead.message?.trim() ? `Message: ${lead.message}` : '',
        '',
        `Need something urgent? Call us on ${BRAND.phone}.`,
        '',
        BRAND.name,
        BRAND.address,
      ]),
      html: thankYouHtml(lead),
      attachments: logoAttachment(),
    })
    result.thankYou = 'sent'
  } catch (err) {
    result.thankYou = `failed: ${err.message}`
  }

  return result
}
