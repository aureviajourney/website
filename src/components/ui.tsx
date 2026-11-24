import { useEffect, useRef, type ReactNode, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../site'

/* ---------- icons (1.4px line set, drawn for this project) ---------- */
const I = ({ children, ...p }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{children}</svg>
)
export const icons: Record<string, () => ReactNode> = {
  flights: () => <I><path d="M4 21 L28 9 L21 27 L16 18 Z" /><path d="M16 18 L28 9" /></I>,
  hotels: () => <I><path d="M4 26V8M4 20h24v6M28 20v-4a4 4 0 0 0-4-4H12v8" /><circle cx="8.5" cy="14" r="2.5" /></I>,
  visa: () => <I><rect x="6" y="4" width="20" height="24" rx="2" /><circle cx="16" cy="14" r="5" /><path d="M11 14h10M16 9c-2 2-2 8 0 10M16 9c2 2 2 8 0 10M11 24h10" /></I>,
  transfers: () => <I><path d="M5 20l2-7a3 3 0 0 1 3-2h12a3 3 0 0 1 3 2l2 7v5H5z" /><path d="M5 20h22" /><circle cx="10" cy="23" r="1" /><circle cx="22" cy="23" r="1" /><path d="M7 25v2M25 25v2" /></I>,
  packages: () => <I><path d="M4 8l8-3 8 3 8-3v19l-8 3-8-3-8 3z" /><path d="M12 5v19M20 8v19" /></I>,
  experiences: () => <I><path d="M16 4l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L16 21.5 9.2 25.1l1.3-7.6L5 12.1 12.6 11z" /></I>,
  honeymoon: () => <I><path d="M16 27C7 20 5 15 5 11.5A5.5 5.5 0 0 1 16 9a5.5 5.5 0 0 1 11 2.5C27 15 25 20 16 27z" /></I>,
  corporate: () => <I><rect x="4" y="10" width="24" height="16" rx="2" /><path d="M12 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M4 17h24M14 17v3h4v-3" /></I>,
  personal: () => <I><circle cx="16" cy="11" r="5" /><path d="M6 27c1-6 5-9 10-9s9 3 10 9" /></I>,
  seamless: () => <I><path d="M4 22c6-10 10 6 16-4s6-8 8-8" /><circle cx="28" cy="10" r="1.6" /><circle cx="4" cy="22" r="1.6" /></I>,
  exceptional: () => <I><path d="M16 3l3 8h9l-7 5 3 9-8-5.5L8 25l3-9-7-5h9z" /></I>,
  mail: () => <I><rect x="4" y="7" width="24" height="18" rx="2" /><path d="M4 9l12 9 12-9" /></I>,
  phone: () => <I><path d="M9 4h4l2 6-3 2a15 15 0 0 0 8 8l2-3 6 2v4a3 3 0 0 1-3 3C13 26 6 19 6 7a3 3 0 0 1 3-3z" /></I>,
  insta: () => <I><rect x="5" y="5" width="22" height="22" rx="6" /><circle cx="16" cy="16" r="5" /><circle cx="22.5" cy="9.5" r="1" fill="currentColor" /></I>,
}
export const Icon = ({ name }: { name: string }) => <>{(icons[name] ?? icons.packages)()}</>
export const WhatsAppGlyph = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 4a12 12 0 0 0-10.300 18L4 28l6.200-1.600A12 12 0 1 0 16 4z" /><path d="M12 11c-1 1-1 3 1 6s4.500 4.500 6.500 4.500c1.500 0 2.500-1.200 2.500-2l-3-1.500-1.500 1.200c-1.500-.7-3-2.200-3.700-3.700l1.200-1.500L12.500 11z" /></svg>
)
export const Arrow = () => (
  <svg viewBox="0 0 24 12" width="22" height="11" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className="arrow"><path d="M0 6h22M17 1l5 5-5 5" /></svg>
)

/* ---------- brand mark ---------- */
export function Logo({ light = true }: { light?: boolean }) {
  const { settings } = useSite()
  return (
    <Link to="/" className={'logo' + (light ? '' : ' logo-dark')} aria-label="Aurevia, home">
      {settings.logo ? <img src={settings.logo} alt="" className="logo-img" /> : (
        <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="20" cy="20" r="18.5" className="logo-ring" /><path d="M9 28 L20 9 L31 28" /><path d="M14.500 28h11" /><path d="M6 31c5 2 9 2 14 0s9-2 14 0" stroke="var(--gold)" />
        </svg>
      )}
      <span className="logo-word">AUREVIA</span>
    </Link>
  )
}

/* ---------- SEO ---------- */
export function Seo({ title, description, path, image, jsonLd, noindex }: { title: string; description: string; path: string; image?: string; jsonLd?: object; noindex?: boolean }) {
  useEffect(() => {
    const origin = window.location.origin
    const url = origin + path
    document.title = title
    const set = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector<HTMLElement>(sel)
      if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
      el.setAttribute(sel.startsWith('link') ? 'href' : 'content', val)
    }
    set('meta[name="description"]', 'name', 'description', description)
    set('meta[property="og:title"]', 'property', 'og:title', title)
    set('meta[property="og:description"]', 'property', 'og:description', description)
    set('meta[property="og:url"]', 'property', 'og:url', url)
    set('meta[property="og:type"]', 'property', 'og:type', 'website')
    set('meta[property="og:image"]', 'property', 'og:image', image ? (image.startsWith('http') ? image : origin + image) : origin + '/og-image.svg')
    set('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    set('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    set('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    set('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')
    set('link[rel="canonical"]', 'rel', 'canonical', url)
    let ld = document.getElementById('page-jsonld')
    if (jsonLd) {
      if (!ld) { ld = document.createElement('script'); ld.id = 'page-jsonld'; ld.setAttribute('type', 'application/ld+json'); document.head.appendChild(ld) }
      ld.textContent = JSON.stringify(jsonLd)
    } else ld?.remove()
  }, [title, description, path, image, jsonLd, noindex])
  return null
}

/* ---------- motion helpers ---------- */
// Words rise in one by one inside their own mask.
export function SplitText({ text, className = '', as: Tag = 'span', delay = 0 }: { text: string; className?: string; as?: 'span' | 'h1' | 'h2' | 'h3'; delay?: number }) {
  return (
    <Tag className={'split ' + className} data-reveal aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" aria-hidden="true" key={i}><span style={{ transitionDelay: `${delay + i * 70}ms` }}>{w}&nbsp;</span></span>
      ))}
    </Tag>
  )
}
// Button that leans toward the pointer.
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  return (
    <span ref={ref} className="magnetic"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const r = ref.current!.getBoundingClientRect()
        ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`
      }}
      onPointerLeave={() => { if (ref.current) ref.current.style.transform = '' }}>
      {children}
    </span>
  )
}
export const Photo = ({ src, alt = '', className = '', eager = false }: { src: string; alt?: string; className?: string; eager?: boolean }) => (
  <img className={'photo ' + className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
)
export const Eyebrow = ({ children }: { children: ReactNode }) => <p className="eyebrow" data-reveal><span className="eyebrow-line" />{children}</p>
