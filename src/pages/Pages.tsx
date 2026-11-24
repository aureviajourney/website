import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { money, waLink } from '../api'
import { packages } from '../data/seed'
import { useSite } from '../site'
import { PageHero } from '../components/Layout'
import { Visual } from '../components/Scene'
import { Arrow, Eyebrow, Icon, Photo, Seo, SplitText } from '../components/ui'
import { PlanForm } from '../components/Forms'
import { PackageCard } from '../components/Cards'
import { ContactSection, CtaBand, HowSection, InstagramSection } from '../components/Sections'
import { services } from '../data/content'

/* ---------- About ---------- */
export function About() {
  const { settings: s } = useSite()
  const principles = [['Listen first', 'We start with how you like to travel, not with what we have to sell.'], ['Say what we think', 'If a plan is rushed, overpriced or out of season, we will tell you and offer a better one.'], ['Stay with you', 'Our job does not end at the booking. We are a message away until you are home.']]
  return (
    <>
      <Seo title="About Aurevia | Personal Travel Concierge" path="/about" description="Aurevia is a travel concierge planning personalized domestic and international journeys, with a real person behind every itinerary." />
      <PageHero eyebrow="About Aurevia" title="Travel, planned like it matters." image="/images/switzerland.jpg">A small team that plans journeys the way a good host plans a dinner: carefully, personally and without making you do the work.</PageHero>
      <section className="section">
        <div className="wrap about-grid">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <SplitText as="h2" text="Why Aurevia exists" />
          </div>
          <div className="prose" data-reveal>
            <p className="big">{s.about}</p>
            <p>Most trips are lost to details: the connection that is too tight, the hotel that is lovely but an hour from everything, the visa that needed one more document. We exist to catch those before you meet them.</p>
            <p>Whether it is a honeymoon in the Maldives, a family week in the Alps or a business trip that cannot afford a delay, the approach is the same: understand the person, design the journey, handle the rest.</p>
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="wrap">
          <Eyebrow>How we work</Eyebrow>
          <SplitText as="h2" text="Three promises" />
          <ol className="promises">{principles.map(([t, d], i) => <li key={t} data-reveal style={{ transitionDelay: `${i * 100}ms` }}><span>0{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
        </div>
      </section>
      <HowSection />
      <CtaBand />
    </>
  )
}

/* ---------- Services ---------- */
export function Services() {
  return (
    <>
      <Seo title="Travel Services | Flights, Hotels, Visas & Transfers | Aurevia" path="/services" description="Flights, handpicked hotels, visa assistance, airport transfers, experiences, honeymoon and corporate travel, all planned together by Aurevia." />
      <PageHero eyebrow="Services" title="One team for the whole journey." image="/images/maldives.jpg">Book one thing or everything. Each service works on its own and works better together.</PageHero>
      <section className="section">
        <div className="wrap">
          {services.map((s, i) => (
            <article id={s.slug} key={s.slug} className={'svc-row' + (i % 2 ? ' flip' : '')}>
              <div className="svc-row-img mask" data-reveal><Photo src={s.image} alt={s.title} /></div>
              <div className="svc-row-copy" data-reveal>
                <span className="svc-icon lg"><Icon name={s.icon} /></span>
                <h2>{s.title}</h2>
                <p className="body">{s.long}</p>
                <ul className="ticks">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <Link to="/plan-your-journey" className="link-arrow">Plan Your Journey <Arrow /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  )
}

/* ---------- Packages ---------- */
export function Packages() {
  const { destinations } = useSite()
  const pk = packages
  const [cat, setCat] = useState<'All' | 'International' | 'Domestic'>('All')
  const dests = destinations.filter((d) => cat === 'All' || d.category === cat)
  return (
    <>
      <Seo title="Customized Travel Packages & Destinations | Aurevia" path="/packages" description="Browse Aurevia's signature journeys and destinations, then tell us what you want and we will curate a package around you." />
      <PageHero eyebrow="Packages" title="Signature journeys, made yours." image="/images/santorini.jpg">Each package is a starting point. Change the hotel, the dates, the pace, or start from nothing.</PageHero>
      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {pk.map((p, i) => <PackageCard key={p.id} p={p} i={i} />)}
          </div>
        </div>
      </section>
      <section className="section tint" id="destinations">
        <div className="wrap">
          <div className="sec-head">
            <div><Eyebrow>Destinations</Eyebrow><SplitText as="h2" text="Explore Destinations" /></div>
            <div className="seg" role="group" aria-label="Filter destinations">{(['All', 'International', 'Domestic'] as const).map((c) => <button key={c} className={cat === c ? 'on' : ''} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
          </div>
          <ul className="dgrid">
            {dests.map((d, i) => (
              <li key={d.id} className="mask" data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <Link to={`/destinations/${d.slug}`} className="dcard">
                  <Visual image={d.image} scene={d.scene} alt={d.name} />
                  <div className="dcard-over"><small>{d.country}</small><h3>{d.name}</h3><span>{d.tagline}</span></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  )
}

export function PackageDetail() {
  const { slug } = useParams()
  const { settings: s } = useSite()
  const p = packages.find((x) => x.slug === slug)
  if (!p) return <NotFound />
  return (
    <>
      <Seo title={`${p.title}, ${p.destination_name ?? ''} | Aurevia`} path={`/packages/${p.slug}`} description={p.summary} image={p.images[0] || p.destination_image || undefined}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'TouristTrip', name: p.title, description: p.summary, offers: { '@type': 'Offer', price: p.price, priceCurrency: 'INR' } }} />
      <section className="detail-hero">
        <Visual image={p.images[0] || p.destination_image} scene={p.scene ?? 'tropical'} alt={p.title} className="detail-bg" />
        <div className="detail-shade" />
        <div className="wrap">
          <p className="eyebrow gold"><span className="eyebrow-line" />{p.destination_name}</p>
          <h1>{p.title}</h1>
          <p className="lede">{p.summary}</p>
          <div className="facts"><span><small>Duration</small>{p.duration}</span><span><small>From</small>{money(p.price)} <em>per person</em></span></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap detail-grid">
          <div>
            <h2 data-reveal>Day by day</h2>
            <ol className="timeline">{p.itinerary.map((d) => <li key={d.day + d.title} data-reveal><span>{d.day}</span><div><h3>{d.title}</h3><p>{d.text}</p></div></li>)}</ol>
            <div className="incl">
              <div data-reveal><h3>Included</h3><ul className="ticks">{p.inclusions.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div data-reveal><h3>Not included</h3><ul className="ticks no">{p.exclusions.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
          </div>
          <aside className="sticky-card" data-reveal>
            <small>Starting from</small><strong>{money(p.price)}</strong><span>per person, subject to dates and availability</span>
            <Link to={`/plan-your-journey?destination=${encodeURIComponent(p.destination_name ?? p.title)}`} className="btn btn-gold"><span>Plan Your Journey</span><Arrow /></Link>
            {s.whatsapp && <a className="link-arrow" href={waLink(s.whatsapp, `Hello Aurevia, I am interested in the ${p.title} package.`)} target="_blank" rel="noopener noreferrer">Ask on WhatsApp <Arrow /></a>}
          </aside>
        </div>
      </section>
    </>
  )
}

/* ---------- Destination ---------- */
export function DestinationPage() {
  const { slug } = useParams()
  const { destinations } = useSite()
  const d = destinations.find((x) => x.slug === slug)
  if (!d) return <NotFound />
  const pk = packages.filter((p) => p.destination_id === d.id)
  return (
    <>
      <Seo title={`${d.name}, ${d.country} Holiday Packages | Aurevia`} path={`/destinations/${d.slug}`} description={`${d.tagline}. ${d.description}`.slice(0, 300)} image={d.image || undefined}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'TouristDestination', name: d.name, description: d.description, touristType: 'Leisure' }} />
      <section className="detail-hero">
        <Visual image={d.image} scene={d.scene} alt={`${d.name}, ${d.country}`} className="detail-bg" />
        <div className="detail-shade" />
        <div className="wrap">
          <p className="eyebrow gold"><span className="eyebrow-line" />{d.country} · {d.category}</p>
          <h1>{d.name}</h1>
          <p className="lede">{d.tagline}</p>
          {d.best_time && <div className="facts"><span><small>Best time</small>{d.best_time}</span></div>}
        </div>
      </section>
      <section className="section">
        <div className="wrap about-grid">
          <div><Eyebrow>The destination</Eyebrow><SplitText as="h2" text={`Planning ${d.name}`} /></div>
          <div className="prose" data-reveal><p className="big">{d.description}</p></div>
        </div>
      </section>
      {pk.length > 0 && <section className="section tint"><div className="wrap"><SplitText as="h2" text={`Journeys in ${d.name}`} /><div className="grid-3">{pk.map((p, i) => <PackageCard key={p.id} p={p} i={i} />)}</div></div></section>}
      <section className="section yourway"><div className="wrap yourway-grid">
        <div><Eyebrow>Plan it</Eyebrow><SplitText as="h2" text={`Tell us about your trip to ${d.name}`} /><p className="body big" data-reveal>Share your dates and who is travelling. We will come back with a plan, not a brochure.</p></div>
        <div className="paper" data-reveal><PlanForm defaultDestination={d.name} /></div>
      </div></section>
    </>
  )
}

/* ---------- Plan, Contact ---------- */
export function Plan() {
  const [q] = useSearchParams()
  return (
    <>
      <Seo title="Plan Your Journey | Aurevia" path="/plan-your-journey" description="Tell Aurevia where you want to go and how you like to travel. A travel specialist will curate a personalized itinerary for you." />
      <PageHero eyebrow="Plan your journey" title="Tell us where. We'll handle how." image="/images/kyoto.jpg">Three short steps. A specialist replies personally, with no obligation.</PageHero>
      <section className="section yourway"><div className="wrap narrow"><div className="paper" data-reveal><PlanForm defaultDestination={q.get('destination') ?? ''} /></div></div></section>
      <InstagramSection />
    </>
  )
}
export function Contact() {
  return (
    <>
      <Seo title="Contact Aurevia | Travel Enquiries" path="/contact" description="Contact Aurevia by email, Instagram, WhatsApp or the enquiry form. We reply to every message personally." />
      <PageHero eyebrow="Contact" title="We'd love to hear from you." image="/images/bali.jpg" />
      <ContactSection id="contact-form" />
    </>
  )
}

/* ---------- Legal ---------- */
const Legal = ({ title, path, updated, children }: { title: string; path: string; updated: string; children: React.ReactNode }) => (
  <>
    <Seo title={`${title} | Aurevia`} path={path} description={`${title} for Aurevia | Curated Journeys.`} />
    <PageHero eyebrow="Legal" title={title}>Last updated {updated}</PageHero>
    <section className="section"><div className="wrap narrow prose legal">{children}</div></section>
  </>
)
export function Privacy() {
  const { settings: s } = useSite()
  return (
    <Legal title="Privacy Policy" path="/privacy-policy" updated="1 January 2026">
      <p>Aurevia ("we", "us") respects your privacy. This policy explains what we collect when you use this website and how we use it.</p>
      <h2>Information we collect</h2>
      <p>When you submit an enquiry we collect your name, email address, phone or WhatsApp number, travel plans and any preferences or requests you choose to share. We do not collect payment card details through this website.</p>
      <h2>How we use it</h2>
      <p>We use your information to respond to your enquiry, prepare itineraries and quotations, arrange the services you ask us to book, and keep records of our communication. We do not sell your personal information.</p>
      <h2>Sharing</h2>
      <p>To arrange your travel we may share the details needed with airlines, hotels, transfer operators, visa and insurance providers. We also use service providers for hosting and email delivery who process data on our behalf.</p>
      <h2>Retention and security</h2>
      <p>We keep enquiry records for as long as needed to serve you and meet legal obligations. We use access controls, encrypted passwords and secure connections to protect the data we hold.</p>
      <h2>Your choices</h2>
      <p>You may ask to access, correct or delete your information at any time by emailing <a href={`mailto:${s.email}`}>{s.email}</a>.</p>
      <h2>Cookies</h2>
      <p>This website uses only the cookies needed to operate, such as the secure session cookie for administrators. We do not use advertising cookies.</p>
    </Legal>
  )
}
export function Terms() {
  const { settings: s } = useSite()
  return (
    <Legal title="Terms & Conditions" path="/terms-and-conditions" updated="1 January 2026">
      <p>These terms apply to your use of the Aurevia website and to enquiries made through it. A booking is governed by the written confirmation we send you.</p>
      <h2>Enquiries and quotations</h2>
      <p>Submitting an enquiry does not create a booking. Quotations are estimates based on availability and prices at the time and may change until confirmed in writing.</p>
      <h2>Bookings and payments</h2>
      <p>A booking is confirmed only when we send a written confirmation and receive the agreed payment. Payment schedules will be stated in your quotation.</p>
      <h2>Changes and cancellations</h2>
      <p>Airlines, hotels and other suppliers set their own change and cancellation rules, which we will share before you confirm. Charges levied by suppliers are passed on, and a service fee may apply.</p>
      <h2>Visas and travel documents</h2>
      <p>We provide guidance and assistance, but visa decisions rest with the issuing authority. You are responsible for valid passports, visas, health requirements and insurance.</p>
      <h2>Liability</h2>
      <p>We act as an intermediary between you and travel suppliers. We take care in selecting suppliers but are not liable for events outside our reasonable control, such as weather, strikes, government action or supplier default, except where the law requires otherwise.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${s.email}`}>{s.email}</a>.</p>
    </Legal>
  )
}

export function NotFound() {
  return (
    <>
      <Seo title="Page not found | Aurevia" path="/404" description="This page could not be found." noindex />
      <section className="nf"><Photo src="/images/santorini.jpg" /><div className="wrap"><p className="eyebrow gold"><span className="eyebrow-line" />Error 404</p><h1>This route is off the map.</h1><p className="lede">The page you are looking for has moved or never existed.</p><Link to="/" className="btn btn-gold"><span>Back to home</span><Arrow /></Link></div></section>
    </>
  )
}

/* ---------- Photo credits ---------- */
import credits from '../data/credits.json'
const creditNames: Record<string, string> = { maldives: 'Maldives', santorini: 'Santorini', switzerland: 'Swiss Alps (Matterhorn)', dubai: 'Dubai', bali: 'Bali', kyoto: 'Kyoto (Kinkaku-ji)', paris: 'Paris', udaipur: 'Udaipur', kerala: 'Kerala backwaters' }
export function Credits() {
  return (
    <Legal title="Photo Credits" path="/photo-credits" updated="24 November 2026">
      <p>Destination photographs are used under open licences from Wikimedia Commons. Thank you to the photographers. Placeholder images will be replaced with Aurevia's own photography.</p>
      <ul className="credits">
        {Object.entries(credits as Record<string, { author: string; license: string; source: string }>).map(([k, c]) => (
          <li key={k}><b>{creditNames[k] ?? k}</b> · {c.author || 'Unknown'} · {c.license} · <a href={c.source} target="_blank" rel="noopener noreferrer">Source</a></li>
        ))}
      </ul>
    </Legal>
  )
}
