import { Link } from 'react-router-dom'
import { waLink } from '../api'
import { useSite } from '../site'
import { ContactForm } from './Forms'
import { Arrow, Eyebrow, Icon, Photo, SplitText } from './ui'
import { instagramPosts, steps, whyItems } from '../data/content'
import { Scene } from './Scene'

export function ContactSection({ id = 'contact' }: { id?: string }) {
  const { settings: s } = useSite()
  const ig = (s.instagram || 'aureevia__').replace('@', '')
  return (
    <section className="section contact" id={id}>
      <div className="wrap contact-grid">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <SplitText as="h2" text="Let's Curate Your Next Journey." />
          <p className="body" data-reveal>Tell us a little, or a lot. We reply personally, usually within one working day.</p>
          <ul className="contact-list" data-reveal>
            <li><Icon name="mail" /><div><small>Email</small><a href={`mailto:${s.email}`}>{s.email}</a></div></li>
            <li><Icon name="insta" /><div><small>Instagram</small><a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer">@{ig}</a></div></li>
            {s.whatsapp && <li><Icon name="phone" /><div><small>WhatsApp</small><a href={waLink(s.whatsapp)} target="_blank" rel="noopener noreferrer">Message us</a></div></li>}
            {s.phone && <li><Icon name="phone" /><div><small>Phone</small><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></div></li>}
          </ul>
        </div>
        <div className="paper" data-reveal><ContactForm /></div>
      </div>
    </section>
  )
}

export function WhySection() {
  return (
    <section className="section dark why">
      <div className="why-rings" aria-hidden="true">
        <svg viewBox="0 0 600 600"><g fill="none" stroke="var(--gold)" strokeWidth=".8"><circle cx="300" cy="300" r="120" /><circle cx="300" cy="300" r="190" strokeDasharray="2 8" /><circle cx="300" cy="300" r="260" /><path d="M300 20v560M20 300h560" opacity=".4" /></g></svg>
      </div>
      <div className="wrap">
        <Eyebrow>Why Aurevia</Eyebrow>
        <SplitText as="h2" text="Why Travel With Aurevia?" />
        <ol className="why-list">
          {whyItems.map(([t, d], i) => (
            <li key={t} data-reveal style={{ transitionDelay: `${(i % 2) * 90}ms` }}>
              <span className="why-num">0{i + 1}</span>
              <div><h3>{t}</h3><p>{d}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function HowSection() {
  const nodes = [125, 375, 625, 875]
  const route = 'M125 60 C 250 -14, 250 134, 375 60 S 500 -14, 625 60 S 750 134, 875 60'
  return (
    <section className="section how">
      <div className="wrap">
        <Eyebrow>How it works</Eyebrow>
        <SplitText as="h2" text="Four steps. One conversation." />
        <div className="how-track" data-reveal>
          <svg viewBox="0 0 1000 120" aria-hidden="true" className="how-svg">
            <path pathLength="1" className="how-path" d={route} />
            {nodes.map((x) => <circle key={x} className="how-node" cx={x} cy="60" r="9" />)}
            <g className="how-dot"><circle r="5" fill="var(--gold)"><animateMotion dur="7s" repeatCount="indefinite" path={route} /></circle></g>
          </svg>
          <ol className="how-steps">
            {steps.map(([t, d], i) => (
              <li key={t} style={{ ['--i' as string]: i }}>
                <span className="how-n">0{i + 1}</span><h3>{t}</h3><p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function InstagramSection() {
  const { settings: s } = useSite()
  const ig = (s.instagram || 'aureevia__').replace('@', '')
  const url = `https://instagram.com/${ig}`
  return (
    <section className="section insta">
      <div className="wrap">
        <div className="insta-head">
          <div><Eyebrow>@{ig}</Eyebrow><SplitText as="h2" text="Follow the Journey" /></div>
          <a className="btn btn-line" href={url} target="_blank" rel="noopener noreferrer"><span>Follow Aurevia</span><Arrow /></a>
        </div>
        <ul className="insta-grid">
          {instagramPosts.map((p, i) => (
            <li key={i} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
              <a href={p.href || url} target="_blank" rel="noopener noreferrer" aria-label={`${p.caption}, on Instagram`}>
                {p.image ? <Photo src={p.image} alt={p.caption} /> : <Scene kind={p.scene} />}
                <span className="insta-over"><Icon name="insta" /><span>{p.caption}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function CtaBand({ title = 'Where would you like to wake up next?', image = '/images/santorini.jpg' }: { title?: string; image?: string }) {
  return (
    <section className="cta-band">
      <Photo src={image} />
      <div className="wrap">
        <SplitText as="h2" text={title} />
        <Link to="/plan-your-journey" className="btn btn-gold" data-reveal><span>Plan Your Journey</span><Arrow /></Link>
      </div>
    </section>
  )
}
