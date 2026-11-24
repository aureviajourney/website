import nodemailer from 'nodemailer'

// Email is configured entirely through environment variables (see .env.example).
let transport
function getTransport() {
  if (transport !== undefined) return transport
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  transport = SMTP_HOST
    ? nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: Number(SMTP_PORT) === 465, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined })
    : null
  return transport
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export async function notifyEnquiry(to, kind, data) {
  const rows = Object.entries(data).filter(([, v]) => v !== '' && v != null)
  const t = getTransport()
  if (!t) {
    console.log('[mail] SMTP not configured, enquiry saved to database only:\n' + rows.map(([k, v]) => `  ${k}: ${v}`).join('\n'))
    return false
  }
  await t.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    replyTo: data.email,
    subject: 'New Travel Enquiry — Aurevia',
    text: `Type: ${kind}\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html: `<h2 style="font-family:Georgia,serif">New Travel Enquiry — Aurevia</h2><p>Type: ${esc(kind)}</p><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>`,
  })
  return true
}
