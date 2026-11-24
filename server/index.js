import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { z } from 'zod'
import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import { all, get, run } from './db.js'
import { notifyEnquiry } from './mail.js'

const PORT = Number(process.env.PORT || 4000)
const PROD = process.env.NODE_ENV === 'production'
const SITE_URL = (process.env.SITE_URL || `http://localhost:${PROD ? PORT : 5173}`).replace(/\/$/, '')
const SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
if (!process.env.JWT_SECRET) console.warn('[auth] JWT_SECRET not set. Admin sessions will reset on every restart.')
if (!process.env.ADMIN_PASSWORD) console.warn('[auth] ADMIN_PASSWORD not set. No admin account will be created.')

const root = path.resolve('.')
const uploadDir = path.join(root, 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const app = express()
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'data:', 'https:'],
      'script-src': ["'self'", ...(PROD ? [] : ["'unsafe-inline'"])],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(express.json({ limit: '200kb' }))
app.use(cookieParser())

// ---------- helpers ----------
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-')
const parse = (schema, body) => {
  const r = schema.safeParse(body)
  if (!r.success) {
    const err = new Error('Please check the highlighted fields.')
    err.status = 400
    err.fields = Object.fromEntries(r.error.issues.map((i) => [i.path.join('.') || 'form', i.message]))
    throw err
  }
  return r.data
}
const J = (s, fallback = []) => { try { return JSON.parse(s) } catch { return fallback } }
const dest = (d) => d && ({ ...d, featured: !!d.featured })
const pkg = (p) => p && ({ ...p, inclusions: J(p.inclusions), exclusions: J(p.exclusions), itinerary: J(p.itinerary), images: J(p.images) })
const settingsObj = () => Object.fromEntries(all('SELECT key,value FROM settings').map((r) => [r.key, r.value]))

const limiter = (windowMin, max, message) => rateLimit({ windowMs: windowMin * 60_000, limit: max, standardHeaders: true, legacyHeaders: false, message: { error: message } })

// ---------- public API ----------
const api = express.Router()
api.get('/settings', (_q, res) => res.json(settingsObj()))
api.get('/destinations', (_q, res) => res.json(all('SELECT * FROM destinations ORDER BY featured DESC, name').map(dest)))
api.get('/destinations/:slug', (req, res) => {
  const d = get('SELECT * FROM destinations WHERE slug=?', req.params.slug)
  if (!d) return res.status(404).json({ error: 'Destination not found' })
  res.json({ ...dest(d), packages: all('SELECT * FROM packages WHERE destination_id=?', d.id).map(pkg) })
})
api.get('/packages', (_q, res) => res.json(all(`SELECT p.*, d.name AS destination_name, d.slug AS destination_slug, d.scene AS scene, d.image AS destination_image
  FROM packages p LEFT JOIN destinations d ON d.id=p.destination_id ORDER BY p.id`).map(pkg)))
api.get('/packages/:slug', (req, res) => {
  const p = get(`SELECT p.*, d.name AS destination_name, d.slug AS destination_slug, d.scene AS scene, d.image AS destination_image
    FROM packages p LEFT JOIN destinations d ON d.id=p.destination_id WHERE p.slug=?`, req.params.slug)
  if (!p) return res.status(404).json({ error: 'Package not found' })
  res.json(pkg(p))
})

const text = (max) => z.string().trim().max(max)
const base = {
  name: text(100).min(2, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email').max(150),
  phone: text(30).regex(/^[+\d][\d\s\-()]{6,}$/, 'Enter a valid phone number'),
  website: z.string().max(0).optional(), // honeypot
  startedAt: z.number().optional(),
}
const TRIP = ['Honeymoon', 'Family', 'Couple', 'Friends', 'Solo', 'Corporate', 'Luxury', 'Adventure', 'Religious', 'Leisure']
const planSchema = z.object({
  ...base,
  from: text(100).min(2, 'Where are you travelling from?'),
  destination: text(100).min(2, 'Tell us where you would like to go'),
  departure: z.string().min(1, 'Choose a departure date'),
  returnDate: z.string().optional().default(''),
  adults: z.coerce.number().int().min(1, 'At least one adult').max(50),
  children: z.coerce.number().int().min(0).max(50).default(0),
  tripType: z.enum(TRIP, { message: 'Choose a trip type' }),
  preferences: text(1500).optional().default(''),
  requests: text(1500).optional().default(''),
}).refine((d) => !d.returnDate || d.returnDate >= d.departure, { path: ['returnDate'], message: 'Return must be after departure' })
const contactSchema = z.object({
  ...base,
  destination: text(100).optional().default(''),
  travelDate: text(40).optional().default(''),
  message: text(2000).min(5, 'Please add a short message'),
})

api.post('/enquiries/:kind', limiter(15, 8, 'Too many enquiries from this connection. Please try again shortly, or message us on WhatsApp.'), wrap(async (req, res) => {
  const kind = req.params.kind
  if (!['plan', 'contact'].includes(kind)) return res.status(404).json({ error: 'Unknown form' })
  const body = req.body || {}
  // Silent success for bots: filled honeypot or submitted faster than a human could.
  if (body.website || (typeof body.startedAt === 'number' && Date.now() - body.startedAt < 2500)) return res.json({ ok: true })
  const { website: _w, startedAt: _s, ...data } = parse(kind === 'plan' ? planSchema : contactSchema, body)
  run('INSERT INTO enquiries(kind,data) VALUES (?,?)', kind, JSON.stringify(data))
  const to = process.env.NOTIFY_EMAIL || settingsObj().email
  notifyEnquiry(to, kind === 'plan' ? 'Journey plan' : 'Contact', data).catch((e) => console.error('[mail] failed', e.message))
  res.json({ ok: true })
}))

// ---------- admin auth ----------
const COOKIE = 'aurevia_admin'
const cookieOpts = { httpOnly: true, sameSite: 'strict', secure: PROD, maxAge: 8 * 3600_000, path: '/' }
const adminAuth = (req, res, next) => {
  try {
    req.admin = jwt.verify(req.cookies[COOKIE] || '', SECRET)
    next()
  } catch { res.status(401).json({ error: 'Please sign in' }) }
}
const DUMMY = bcrypt.hashSync('not-a-real-password', 12)
api.post('/admin/login', limiter(15, 8, 'Too many attempts. Try again in a few minutes.'), wrap(async (req, res) => {
  const { email, password } = parse(z.object({ email: z.string().email(), password: z.string().min(1).max(200) }), req.body)
  const a = get('SELECT * FROM admins WHERE email=?', email.toLowerCase())
  const ok = await bcrypt.compare(password, a?.password_hash || DUMMY) // constant-ish time either way
  if (!a || !ok) return res.status(401).json({ error: 'Incorrect email or password' })
  res.cookie(COOKIE, jwt.sign({ id: a.id, email: a.email }, SECRET, { expiresIn: '8h' }), cookieOpts).json({ email: a.email })
}))
api.post('/admin/logout', (_q, res) => res.clearCookie(COOKIE, { path: '/' }).json({ ok: true }))
api.get('/admin/me', adminAuth, (req, res) => res.json({ email: req.admin.email }))

// ---------- admin CRUD ----------
const admin = express.Router()
admin.use(adminAuth)
// Mutating admin calls must be JSON or multipart; with SameSite=strict cookies this blocks CSRF.
admin.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && !/^(application\/json|multipart\/form-data)/.test(req.headers['content-type'] || '') && req.method !== 'DELETE')
    return res.status(415).json({ error: 'Unsupported content type' })
  next()
})

const destSchema = z.object({
  name: text(100).min(2), country: text(100).min(2), category: z.enum(['International', 'Domestic']),
  tagline: text(200).default(''), description: text(3000).default(''), image: text(500).default(''),
  scene: z.enum(['tropical', 'lagoon', 'dusk', 'alpine', 'desert', 'sakura']).default('tropical'),
  featured: z.coerce.boolean().default(false), best_time: text(100).default(''),
})
const uniqueSlug = (table, name, selfId) => {
  const b = slugify(name) || 'item'
  let s = b, i = 2
  while (get(`SELECT id FROM ${table} WHERE slug=? AND id<>?`, s, selfId ?? -1)) s = `${b}-${i++}`
  return s
}
admin.get('/destinations', (_q, res) => res.json(all('SELECT * FROM destinations ORDER BY name').map(dest)))
admin.post('/destinations', wrap((req, res) => {
  const d = parse(destSchema, req.body)
  const r = run('INSERT INTO destinations(slug,name,country,category,tagline,description,image,scene,featured,best_time) VALUES (?,?,?,?,?,?,?,?,?,?)',
    uniqueSlug('destinations', d.name), d.name, d.country, d.category, d.tagline, d.description, d.image, d.scene, d.featured ? 1 : 0, d.best_time)
  res.status(201).json(dest(get('SELECT * FROM destinations WHERE id=?', r.lastInsertRowid)))
}))
admin.put('/destinations/:id', wrap((req, res) => {
  const id = Number(req.params.id)
  if (!get('SELECT id FROM destinations WHERE id=?', id)) return res.status(404).json({ error: 'Not found' })
  const d = parse(destSchema, req.body)
  run('UPDATE destinations SET slug=?,name=?,country=?,category=?,tagline=?,description=?,image=?,scene=?,featured=?,best_time=? WHERE id=?',
    uniqueSlug('destinations', d.name, id), d.name, d.country, d.category, d.tagline, d.description, d.image, d.scene, d.featured ? 1 : 0, d.best_time, id)
  res.json(dest(get('SELECT * FROM destinations WHERE id=?', id)))
}))
admin.delete('/destinations/:id', (req, res) => { run('DELETE FROM destinations WHERE id=?', Number(req.params.id)); res.json({ ok: true }) })

const pkgSchema = z.object({
  title: text(120).min(2), destination_id: z.coerce.number().int().nullable().optional(), duration: text(60).default(''),
  price: z.coerce.number().int().min(0).default(0), summary: text(500).default(''),
  inclusions: z.array(text(200)).max(30).default([]), exclusions: z.array(text(200)).max(30).default([]),
  itinerary: z.array(z.object({ day: text(20), title: text(120), text: text(600) })).max(40).default([]),
  images: z.array(text(500)).max(12).default([]),
})
admin.get('/packages', (_q, res) => res.json(all('SELECT * FROM packages ORDER BY id').map(pkg)))
admin.post('/packages', wrap((req, res) => {
  const p = parse(pkgSchema, req.body)
  const r = run('INSERT INTO packages(slug,title,destination_id,duration,price,summary,inclusions,exclusions,itinerary,images) VALUES (?,?,?,?,?,?,?,?,?,?)',
    uniqueSlug('packages', p.title), p.title, p.destination_id ?? null, p.duration, p.price, p.summary, JSON.stringify(p.inclusions), JSON.stringify(p.exclusions), JSON.stringify(p.itinerary), JSON.stringify(p.images))
  res.status(201).json(pkg(get('SELECT * FROM packages WHERE id=?', r.lastInsertRowid)))
}))
admin.put('/packages/:id', wrap((req, res) => {
  const id = Number(req.params.id)
  if (!get('SELECT id FROM packages WHERE id=?', id)) return res.status(404).json({ error: 'Not found' })
  const p = parse(pkgSchema, req.body)
  run('UPDATE packages SET slug=?,title=?,destination_id=?,duration=?,price=?,summary=?,inclusions=?,exclusions=?,itinerary=?,images=? WHERE id=?',
    uniqueSlug('packages', p.title, id), p.title, p.destination_id ?? null, p.duration, p.price, p.summary, JSON.stringify(p.inclusions), JSON.stringify(p.exclusions), JSON.stringify(p.itinerary), JSON.stringify(p.images), id)
  res.json(pkg(get('SELECT * FROM packages WHERE id=?', id)))
}))
admin.delete('/packages/:id', (req, res) => { run('DELETE FROM packages WHERE id=?', Number(req.params.id)); res.json({ ok: true }) })

const SETTING_KEYS = ['company_name', 'tagline', 'email', 'phone', 'whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'youtube', 'logo', 'address', 'about']
admin.put('/settings', wrap((req, res) => {
  const s = parse(z.object(Object.fromEntries(SETTING_KEYS.map((k) => [k, text(2000).optional()]))), req.body)
  for (const [k, v] of Object.entries(s)) if (v !== undefined) run('INSERT INTO settings(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', k, k === 'whatsapp' ? v.replace(/\D/g, '') : v)
  res.json(settingsObj())
}))

admin.get('/enquiries', (_q, res) => res.json(all('SELECT * FROM enquiries ORDER BY id DESC LIMIT 500').map((e) => ({ ...e, data: J(e.data, {}) }))))
admin.patch('/enquiries/:id', wrap((req, res) => {
  const { status } = parse(z.object({ status: z.enum(['new', 'contacted', 'closed']) }), req.body)
  run('UPDATE enquiries SET status=? WHERE id=?', status, Number(req.params.id))
  res.json({ ok: true })
}))
admin.delete('/enquiries/:id', (req, res) => { run('DELETE FROM enquiries WHERE id=?', Number(req.params.id)); res.json({ ok: true }) })

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' }
const upload = multer({
  storage: multer.diskStorage({ destination: uploadDir, filename: (_q, f, cb) => cb(null, crypto.randomUUID() + EXT[f.mimetype]) }),
  limits: { fileSize: 6 * 1024 * 1024, files: 1 },
  fileFilter: (_q, f, cb) => cb(EXT[f.mimetype] ? null : new Error('Only JPG, PNG, WebP or AVIF images are allowed'), !!EXT[f.mimetype]),
})
admin.post('/upload', (req, res, next) => upload.single('file')(req, res, (err) => {
  if (err) return res.status(400).json({ error: err.message })
  if (!req.file) return res.status(400).json({ error: 'No file received' })
  res.json({ url: `/uploads/${req.file.filename}` })
}))
api.use('/admin', admin)

app.use('/api', express.Router().use(limiter(1, 240, 'Too many requests')), api)
app.use('/api', (_q, res) => res.status(404).json({ error: 'Not found' }))
app.use('/uploads', express.static(uploadDir, { maxAge: '30d', immutable: true, setHeaders: (r) => r.setHeader('X-Content-Type-Options', 'nosniff') }))

// ---------- SEO files ----------
app.get('/robots.txt', (_q, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`))
app.get('/sitemap.xml', (_q, res) => {
  const urls = ['/', '/about', '/packages', '/services', '/contact', '/plan-your-journey', '/privacy-policy', '/terms-and-conditions',
    ...all('SELECT slug FROM destinations').map((d) => `/destinations/${d.slug}`), ...all('SELECT slug FROM packages').map((p) => `/packages/${p.slug}`)]
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>`)
})

// ---------- production: serve the built site ----------
if (PROD) {
  const dist = path.join(root, 'dist')
  app.use(express.static(dist, { maxAge: '1y', index: false, setHeaders: (r, f) => { if (f.endsWith('.html')) r.setHeader('Cache-Control', 'no-cache') } }))
  app.get(/^(?!\/api).*/, (_q, res) => res.sendFile(path.join(dist, 'index.html')))
}

// ---------- errors ----------
app.use((err, _req, res, _next) => {
  if (err.status === 400 || err.fields) return res.status(400).json({ error: err.message, fields: err.fields })
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' })
})

app.listen(PORT, () => console.log(`Aurevia API listening on :${PORT}`))
