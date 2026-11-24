import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { waLink } from '../api'
import { useSite } from '../site'
import { Arrow, Logo, WhatsAppGlyph } from './ui'

const links = [['/', 'Home'], ['/packages', 'Packages'], ['/services', 'Services'], ['/about', 'About'], ['/contact', 'Contact']] as const

function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [open])
  return (
    <>
      <div id="mobile-menu" className={'drawer' + (open ? ' open' : '')} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {links.map(([to, l], i) => <Link key={to} to={to} tabIndex={open ? 0 : -1} style={{ transitionDelay: `${open ? 120 + i * 60 : 0}ms` }}><small>0{i + 1}</small>{l}</Link>)}
          <Link to="/plan-your-journey" className="drawer-cta" tabIndex={open ? 0 : -1} style={{ transitionDelay: `${open ? 460 : 0}ms` }}>Plan Your Journey <Arrow /></Link>
        </nav>
      </div>
    <header className={'nav' + (solid && !open ? ' solid' : '')}>
      <div className="nav-in">
        <Logo />
        <nav aria-label="Primary" className="nav-links">
          {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}
        </nav>
        <Link to="/plan-your-journey" className="btn btn-gold btn-sm nav-cta"><span>Plan Your Journey</span></Link>
        <button className={'burger' + (open ? ' on' : '')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><i /><i /></button>
      </div>
    </header>
    </>
  )
}

function Footer() {
  const { settings: s } = useSite()
  const ig = (s.instagram || 'aureevia__').replace('@', '')
  const social = [['Instagram', `https://instagram.com/${ig}`], ['Facebook', s.facebook], ['X', s.x], ['LinkedIn', s.linkedin], ['YouTube', s.youtube]].filter(([, u]) => u)
  return (
    <footer className="footer">
      <div className="footer-big" aria-hidden="true">AUREVIA</div>
      <div className="wrap footer-grid">
        <div className="f-brand">
          <Logo />
          <p className="f-tag">{s.tagline || 'Curated Journeys. Exceptional Experiences.'}</p>
          <ul className="f-social">{social.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}</ul>
        </div>
        <nav aria-label="Footer navigation"><h2>Navigate</h2><ul>
          <li><Link to="/">Home</Link></li><li><Link to="/packages#destinations">Destinations</Link></li><li><Link to="/packages">Packages</Link></li>
          <li><Link to="/services">Services</Link></li><li><Link to="/services#experiences">Experiences</Link></li><li><Link to="/about">About</Link></li><li><Link to="/contact">Contact</Link></li>
        </ul></nav>
        <nav aria-label="Footer services"><h2>Services</h2><ul>
          <li><Link to="/services#flights">Flights</Link></li><li><Link to="/services#hotels">Hotels</Link></li><li><Link to="/services#visa">Visa Assistance</Link></li>
          <li><Link to="/services#transfers">Transfers</Link></li><li><Link to="/services#packages">Customized Packages</Link></li><li><Link to="/services#experiences">Experiences</Link></li>
        </ul></nav>
        <div><h2>Contact</h2><ul>
          <li><a href={`mailto:${s.email}`}>{s.email}</a></li>
          <li><a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer">@{ig}</a></li>
          {s.phone && <li><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></li>}
        </ul>
          <h2 className="f-legal-h">Legal</h2><ul><li><Link to="/privacy-policy">Privacy Policy</Link></li><li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li><li><Link to="/photo-credits">Photo credits</Link></li></ul></div>
      </div>
      <div className="wrap footer-base"><span>© 2026 Aurevia. All rights reserved.</span><span>Curated in India, for the world.</span></div>
    </footer>
  )
}

function WhatsApp() {
  const { settings } = useSite()
  if (!settings.whatsapp) return null
  return (
    <a className="wa" href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Chat with Aurevia on WhatsApp">
      <span className="wa-ping" /><WhatsAppGlyph /><span className="wa-tip">Chat with us</span>
    </a>
  )
}

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Scroll to top or to #hash on navigation
  useEffect(() => {
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80); return () => clearTimeout(t) }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  // One observer reveals every [data-reveal], including nodes that appear after data loads.
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' })
    const seen = new WeakSet<Element>()
    const scan = () => document.querySelectorAll('[data-reveal]').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el) } })
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('main')!, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [pathname])

  // Scroll progress + parallax variable
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight
        document.documentElement.style.setProperty('--sy', String(Math.round(y)))
        document.documentElement.style.setProperty('--progress', String(max > 0 ? y / max : 0))
      })
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <Nav />
      <main id="main"><Outlet /></main>
      <Footer />
      <WhatsApp />
    </>
  )
}

export function PageHero({ eyebrow, title, children, image }: { eyebrow: string; title: string; children?: React.ReactNode; image?: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" aria-hidden="true">{image && <img src={image} alt="" decoding="async" />}</div>
      <div className="wrap">
        <p className="eyebrow gold"><span className="eyebrow-line" />{eyebrow}</p>
        <h1>{title}</h1>
        {children && <p className="lede">{children}</p>}
      </div>
    </section>
  )
}
