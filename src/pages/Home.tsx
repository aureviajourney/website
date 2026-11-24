import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { packages } from '../data/seed'
import { useSite } from '../site'
import { Arrow, Eyebrow, Icon, Magnetic, Photo, Seo, SplitText } from '../components/ui'
import { PlanForm } from '../components/Forms'
import { DestinationIndex, PackageCard } from '../components/Cards'
import { ContactSection, HowSection, InstagramSection, WhySection } from '../components/Sections'
import { services } from '../data/content'

const heroScenes = [{ img: '/images/maldives.jpg', place: 'Maldives' }, { img: '/images/santorini.jpg', place: 'Santorini' }, { img: '/images/switzerland.jpg', place: 'Swiss Alps' }]

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % heroScenes.length), 7000)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-bg" aria-hidden="true">
        {heroScenes.map((s, n) => <div key={s.img} className={'hero-slide' + (n === i ? ' on' : '')}><Photo src={s.img} eager={n === 0} /></div>)}
        <div className="hero-shade" />
      </div>
      <div className="wrap hero-in" style={{ ['--x' as string]: 0 }}>
        <p className="eyebrow gold hero-eyebrow"><span className="eyebrow-line" />Aurevia · Curated Journeys</p>
        <h1 id="hero-h"><SplitText text="Travel Beyond" delay={150} /><br /><SplitText text="Ordinary." className="ital" delay={420} /></h1>
        <p className="hero-sub" data-reveal>Curated journeys, crafted around you.</p>
        <p className="hero-text" data-reveal>From unforgettable escapes to seamless business travel, Aurevia creates personalized journeys designed around your preferences, pace and purpose.</p>
        <div className="hero-cta" data-reveal>
          <Magnetic><Link to="/plan-your-journey" className="btn btn-gold"><span>Plan Your Journey</span><Arrow /></Link></Magnetic>
          <Link to="/packages#destinations" className="btn btn-ghost"><span>Explore Destinations</span></Link>
        </div>
      </div>
      <div className="hero-meta">
        <div className="hero-place" aria-hidden="true"><span>0{i + 1} / 0{heroScenes.length}</span><b key={i}>{heroScenes[i].place}</b></div>
        <a href="#intro" className="scroll-cue" aria-label="Scroll to content"><span>Scroll</span><i /></a>
      </div>
    </section>
  )
}

function Marquee() {
  const { destinations } = useSite()
  const names = destinations.length ? destinations.map((d) => d.name) : ['Maldives', 'Santorini', 'Swiss Alps', 'Dubai', 'Bali', 'Kyoto']
  const row = [...names, ...names]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{[0, 1].map((k) => <div key={k}>{row.map((n, i) => <span key={k + n + i}>{n}<svg viewBox="0 0 12 12" width="10" height="10"><path d="M6 0l1.600 4.400L12 6 7.600 7.600 6 12 4.400 7.600 0 6l4.400-1.600z" fill="currentColor" /></svg></span>)}</div>)}</div>
    </div>
  )
}

function Intro() {
  const f = [['personal', 'Personalized', 'Journeys designed around your needs.'], ['seamless', 'Seamless', 'From planning to return, we handle the details.'], ['exceptional', 'Exceptional', 'Thoughtfully selected stays and experiences.']]
  return (
    <section className="section intro" id="intro">
      <div className="wrap intro-grid">
        <div>
          <Eyebrow>Our approach</Eyebrow>
          <SplitText as="h2" text="Your Journey. Our Craft." />
          <p className="body big" data-reveal>At Aurevia, we believe travel should feel effortless. From selecting the perfect destination to arranging flights, stays, transfers and experiences, every detail is thoughtfully curated around you.</p>
        </div>
        <ul className="feat">
          {f.map(([ic, t, d], i) => (
            <li key={t} data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="feat-icon"><Icon name={ic} /></span>
              <div><h3>{t}</h3><p>{d}</p></div>
              <span className="feat-no">0{i + 1}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section services">
      <div className="wrap">
        <div className="sec-head">
          <div><Eyebrow>Services</Eyebrow><SplitText as="h2" text="Everything You Need for Your Journey" /></div>
          <Link to="/services" className="link-arrow" data-reveal>All services <Arrow /></Link>
        </div>
        <ul className="svc-grid">
          {services.map((s, i) => (
            <li key={s.slug} className={'svc svc-' + i} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              <Link to={`/services#${s.slug}`}>
                <div className="svc-img"><Photo src={s.image} alt="" /></div>
                <span className="svc-icon"><Icon name={s.icon} /></span>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span className="more">Learn more <Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Destinations() {
  const { destinations, loading } = useSite()
  return (
    <section className="section dark destinations" id="destinations">
      <div className="wrap">
        <div className="sec-head">
          <div><Eyebrow>Destinations</Eyebrow><SplitText as="h2" text="Where to, next?" /></div>
          <Link to="/packages#destinations" className="link-arrow" data-reveal>See all <Arrow /></Link>
        </div>
        {loading ? <div className="skeleton-list" aria-busy="true">{[0, 1, 2, 3].map((n) => <i key={n} />)}</div> : <DestinationIndex items={destinations.filter((d) => d.featured).slice(0, 6)} />}
      </div>
    </section>
  )
}

function FeaturedPackages() {
  const pk = packages
  return (
    <section className="section packages-home">
      <div className="wrap">
        <div className="sec-head">
          <div><Eyebrow>Signature journeys</Eyebrow><SplitText as="h2" text="A few places we love sending people" /></div>
          <Link to="/packages" className="link-arrow" data-reveal>All packages <Arrow /></Link>
        </div>
      </div>
      <div className="hscroll" tabIndex={0} aria-label="Featured packages, scroll horizontally">
        <div className="hscroll-in">
          {pk.slice(0, 6).map((p, i) => <PackageCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}

function YourWay() {
  const hints = ['Honeymoon', 'Family', 'Corporate', 'Adventure', 'Religious', 'Luxury']
  return (
    <section className="section yourway" id="your-journey">
      <div className="wrap yourway-grid">
        <div className="yourway-copy">
          <Eyebrow>Customized packages</Eyebrow>
          <SplitText as="h2" text="Your Journey, Your Way." />
          <p className="body big" data-reveal>No two travelers are the same. Tell us what you want, and we'll help curate the journey around you.</p>
          <ul className="hints" data-reveal aria-label="Trip types we plan">{hints.map((h) => <li key={h}>{h}</li>)}<li>and more</li></ul>
          <svg className="yourway-art" viewBox="0 0 400 220" aria-hidden="true"><path pathLength="1" d="M10 190 C 90 190, 80 60, 160 90 S 260 190, 320 100 S 370 40, 392 30" /><circle cx="392" cy="30" r="5" /><circle cx="10" cy="190" r="5" /></svg>
        </div>
        <div className="paper" data-reveal><PlanForm /></div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo title="Aurevia | Curated Journeys & Premium Travel Experiences" path="/" description="Aurevia creates personalized domestic and international journeys with curated flights, hotels, visa assistance, transfers and unforgettable travel experiences."
        jsonLd={{ '@context': 'https://schema.org', '@type': 'TravelAgency', name: 'Aurevia', slogan: 'Curated Journeys. Exceptional Experiences.', email: 'aureviajourney@gmail.com', sameAs: ['https://www.instagram.com/aureevia__'], areaServed: 'Worldwide', url: window.location.origin }} />
      <Hero />
      <Marquee />
      <Intro />
      <Services />
      <Destinations />
      <FeaturedPackages />
      <YourWay />
      <WhySection />
      <HowSection />
      <InstagramSection />
      <ContactSection />
    </>
  )
}
