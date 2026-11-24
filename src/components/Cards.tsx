import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { money, type Destination, type Pkg } from '../api'
import { Arrow } from './ui'
import { Visual } from './Scene'

export function PackageCard({ p, i = 0 }: { p: Pkg; i?: number }) {
  return (
    <Link to={`/packages/${p.slug}`} className="pcard" data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
      <div className="pcard-img">
        <Visual image={p.images[0] || p.destination_image} scene={p.scene ?? 'tropical'} alt={`${p.title}, ${p.destination_name ?? ''}`} />
        <span className="pcard-dur">{p.duration}</span>
      </div>
      <div className="pcard-body">
        <small>{p.destination_name}</small>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <div className="pcard-foot"><span>From <b>{money(p.price)}</b><em> per person</em></span><span className="more">Details <Arrow /></span></div>
      </div>
    </Link>
  )
}

// Editorial index: hovering a row shows its scene following the cursor (hover devices); on touch the row simply links.
export function DestinationIndex({ items }: { items: Destination[] }) {
  const [hover, setHover] = useState<Destination | null>(null)
  const prev = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !prev.current) return
    prev.current.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 110}px, 0)`
  }
  return (
    <div className="dindex" onPointerMove={move} onPointerLeave={() => setHover(null)}>
      <ul>
        {items.map((d, i) => (
          <li key={d.id} data-reveal style={{ transitionDelay: `${(i % 4) * 50}ms` }}>
            <Link to={`/destinations/${d.slug}`} onPointerEnter={() => setHover(d)} onFocus={() => setHover(d)} onBlur={() => setHover(null)}>
              <span className="di-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="di-name">{d.name}</span>
              <span className="di-country">{d.country}</span>
              <span className="di-tag">{d.tagline}</span>
              <span className="di-go"><Arrow /></span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={prev} className={'dpreview' + (hover ? ' on' : '')} aria-hidden="true">
        {hover && <Visual key={hover.id} image={hover.image} scene={hover.scene} alt="" />}
      </div>
    </div>
  )
}
