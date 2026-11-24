import { useId, type ReactNode } from 'react'
import type { SceneKind } from '../api'

// Illustrated destination scenes. Used wherever a photograph has not been uploaded yet; once an
// image URL is set on a destination in the admin panel, <Visual> shows the photo instead.
const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 11.3) * 43758.5453; return x - Math.floor(x) }

const Clouds = ({ y = 160, tone = '#fff', op = 0.16 }: { y?: number; tone?: string; op?: number }) => (
  <g fill={tone} opacity={op}>
    {[0, 1, 2].map((i) => (
      <g key={i} className="sc-drift" style={{ animationDuration: `${90 + i * 40}s`, animationDelay: `${-i * 35}s` }}>
        <ellipse cx={300 + i * 520} cy={y + i * 55} rx={190} ry={22} />
        <ellipse cx={380 + i * 520} cy={y + i * 55 - 16} rx={120} ry={20} />
      </g>
    ))}
  </g>
)
const Stars = ({ n = 40, h = 360 }: { n?: number; h?: number }) => (
  <g fill="#fff">
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={rnd(i) * 1600} cy={rnd(i + 90) * h} r={0.8 + rnd(i + 5) * 1.4} className="sc-twinkle" style={{ animationDelay: `${rnd(i + 3) * 5}s` }} />
    ))}
  </g>
)
const Birds = () => (
  <g stroke="#0b1b2b" strokeWidth="2.4" fill="none" opacity=".55" strokeLinecap="round">
    {[[420, 250], [470, 220], [380, 215]].map(([x, y], i) => (
      <path key={i} className="sc-bird" style={{ animationDelay: `${i * 0.6}s` }} d={`M${x} ${y} q12 -14 24 0 q12 -14 24 0`} />
    ))}
  </g>
)
const Waves = ({ y, fill, op = 0.5, n = 3 }: { y: number; fill: string; op?: number; n?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} className="sc-wave" style={{ animationDuration: `${14 + i * 5}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }} fill={fill} opacity={op - i * 0.1}
        d={`M-800 ${y + i * 46} q100 -22 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 V900 H-800Z`} />
    ))}
  </g>
)

function Lagoon({ id }: { id: string }) {
  const huts = Array.from({ length: 7 }, (_, i) => ({ x: 560 + i * 125, y: 690 - i * 14, s: 1.15 - i * 0.1 }))
  return (
    <>
      <defs>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b3550" /><stop offset=".55" stopColor="#3b9aa7" /><stop offset="1" stopColor="#f3dcab" /></linearGradient>
        <linearGradient id={id + 'w'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#35b0b6" /><stop offset="1" stopColor="#08445c" /></linearGradient>
        <radialGradient id={id + 'g'}><stop offset="0" stopColor="#fff3cf" stopOpacity=".9" /><stop offset="1" stopColor="#fff3cf" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}s)`} />
      <circle cx="1150" cy="500" r="260" fill={`url(#${id}g)`} /><circle cx="1150" cy="500" r="62" fill="#fff3d2" />
      <Clouds y={170} /><Birds />
      <path d="M0 560 q60 -50 130 -22 q40 -34 90 -4 q60 -10 120 26 V580 H0Z" fill="#1d5a62" opacity=".7" />
      <rect y="560" width="1600" height="340" fill={`url(#${id}w)`} />
      <g fill="#fff3d2">{Array.from({ length: 16 }, (_, i) => <rect key={i} className="sc-shimmer" style={{ animationDelay: `${i * 0.25}s` }} x={1150 - 110 + rnd(i) * 220 - i * 3} y={572 + i * 17} width={150 - i * 7} height="3" rx="2" />)}</g>
      <path d="M540 700 L1480 600" stroke="#c8ab7a" strokeWidth="5" />
      {huts.map((h, i) => (
        <g key={i} transform={`translate(${h.x} ${h.y}) scale(${h.s})`}>
          <ellipse cx="0" cy="16" rx="54" ry="6" fill="#06364b" opacity=".45" />
          <g stroke="#3b2e22" strokeWidth="3"><line x1="-28" y1="-6" x2="-28" y2="16" /><line x1="0" y1="-6" x2="0" y2="16" /><line x1="28" y1="-6" x2="28" y2="16" /></g>
          <rect x="-34" y="-34" width="68" height="26" fill="#e3cfa6" /><rect x="-34" y="-10" width="68" height="5" fill="#6a5238" />
          <rect x="-8" y="-28" width="16" height="18" fill="#2a2018" opacity=".55" />
          <path d="M-52 -32 L0 -66 L52 -32 Z" fill="#8a6a42" />
        </g>
      ))}
      <Waves y={760} fill="#06384e" op={0.55} />
    </>
  )
}

function Dusk({ id }: { id: string }) {
  const cubes: [number, number, number, number, string][] = [[1010, 560, 70, 46, '#f7f2e8'], [1085, 585, 80, 52, '#efe6d6'], [1170, 540, 66, 60, '#fbf8f1'], [1240, 600, 90, 50, '#ece1cc'], [1340, 566, 70, 58, '#f7f2e8'], [1415, 610, 100, 44, '#efe6d6'], [955, 612, 76, 50, '#e9dec8'], [1125, 640, 86, 46, '#f7f2e8'], [1290, 650, 80, 42, '#fbf8f1']]
  return (
    <>
      <defs>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141f4d" /><stop offset=".45" stopColor="#7d4a82" /><stop offset=".75" stopColor="#ef9a78" /><stop offset="1" stopColor="#f9d89b" /></linearGradient>
        <linearGradient id={id + 'w'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e08a7c" /><stop offset=".25" stopColor="#35457c" /><stop offset="1" stopColor="#0a1536" /></linearGradient>
        <radialGradient id={id + 'g'}><stop offset="0" stopColor="#ffd9a0" stopOpacity=".85" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}s)`} />
      <Stars n={50} h={330} />
      <circle cx="560" cy="600" r="300" fill={`url(#${id}g)`} /><circle cx="560" cy="610" r="70" fill="#ffe3ae" />
      <rect y="620" width="1600" height="280" fill={`url(#${id}w)`} />
      <g fill="#ffd9a0">{Array.from({ length: 12 }, (_, i) => <rect key={i} className="sc-shimmer" style={{ animationDelay: `${i * 0.3}s` }} x={560 - 70 + rnd(i + 4) * 140 - i * 2} y={632 + i * 19} width={120 - i * 6} height="3" rx="2" />)}</g>
      <path d="M820 900 V650 q70 -100 190 -120 L1300 470 L1600 400 V900Z" fill="#1c1735" />
      {cubes.map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={c} opacity=".96" />)}
      <rect x="1160" y="545" width="66" height="8" fill="#d9ccb3" />
      <path d="M1176 540 a22 22 0 0 1 44 0Z" fill="#2c63b4" /><rect x="1197" y="500" width="2" height="16" fill="#2c63b4" />
      <path d="M1130 700 H1600 V900 H1100Z" fill="#120f27" />
      <g fill="#ffd9a0">{[[1020, 590], [1110, 612], [1260, 628], [1370, 596], [1450, 630]].map(([x, y], i) => <rect key={i} className="sc-twinkle" style={{ animationDelay: `${i * 0.7}s` }} x={x} y={y} width="8" height="10" />)}</g>
      <Waves y={800} fill="#070f2a" op={0.5} n={2} />
    </>
  )
}

function Alpine({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a2a4d" /><stop offset=".6" stopColor="#6aa5c9" /><stop offset="1" stopColor="#e6eef0" /></linearGradient>
        <linearGradient id={id + 'm'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f6f8" /><stop offset=".35" stopColor="#7f9db4" /><stop offset="1" stopColor="#274560" /></linearGradient>
        <linearGradient id={id + 'f'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe9ec" stopOpacity="0" /><stop offset="1" stopColor="#dfe9ec" stopOpacity=".85" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}s)`} />
      <circle cx="260" cy="190" r="46" fill="#fff6dc" opacity=".9" />
      <Clouds y={230} op={0.3} />
      <path d="M0 640 L240 420 L360 500 L560 300 L760 480 L900 380 L1120 560 L1300 380 L1600 600 V900H0Z" fill="#8ea9bd" opacity=".75" />
      <path d="M-20 700 L220 480 L330 560 L620 220 L860 520 L1000 430 L1260 250 L1640 640 V900H-20Z" fill={`url(#${id}m)`} />
      <path d="M620 220 L545 310 L590 300 L620 340 L660 295 L710 330 L690 290Z M1260 250 L1195 330 L1240 322 L1262 360 L1300 318 L1335 345 L1315 305Z" fill="#fff" opacity=".92" />
      <rect y="620" width="1600" height="120" fill={`url(#${id}f)`} />
      <g fill="#0f2b2b">
        {Array.from({ length: 38 }, (_, i) => {
          const x = i * 44 - 20 + rnd(i) * 20, h = 90 + rnd(i + 7) * 90, y = 900
          return <path key={i} d={`M${x} ${y} L${x + 26} ${y - h} L${x + 52} ${y}Z`} opacity={0.85 + rnd(i) * 0.15} />
        })}
      </g>
      <g fill="#0a1f20">{Array.from({ length: 22 }, (_, i) => { const x = i * 76 + rnd(i + 2) * 30, h = 150 + rnd(i + 3) * 130; return <path key={i} d={`M${x} 900 L${x + 40} ${900 - h} L${x + 80} 900Z`} /> })}</g>
    </>
  )
}

function Desert({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#181033" /><stop offset=".4" stopColor="#a2466c" /><stop offset=".72" stopColor="#f09a5c" /><stop offset="1" stopColor="#fbd89b" /></linearGradient>
        <radialGradient id={id + 'g'}><stop offset="0" stopColor="#ffe2a8" stopOpacity=".9" /><stop offset="1" stopColor="#ffe2a8" stopOpacity="0" /></radialGradient>
        <linearGradient id={id + 'd'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c98a4b" /><stop offset="1" stopColor="#6a3a2a" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}s)`} />
      <Stars n={30} h={280} />
      <circle cx="1060" cy="560" r="300" fill={`url(#${id}g)`} /><circle cx="1060" cy="560" r="84" fill="#ffe6b0" />
      <g fill="#1f1431" opacity=".92">
        <rect x="300" y="470" width="40" height="120" /><rect x="350" y="430" width="34" height="160" /><rect x="394" y="500" width="50" height="90" />
        <path d="M520 590 L536 300 L544 230 L552 300 L568 590Z" /><rect x="580" y="450" width="42" height="140" /><rect x="630" y="500" width="60" height="90" />
        <path d="M700 590 q20 -150 60 -150 q40 0 60 150Z" /><rect x="830" y="470" width="36" height="120" /><rect x="236" y="520" width="50" height="70" />
      </g>
      <path d="M0 640 q220 -70 460 -10 t520 -10 t640 -30 V900H0Z" fill={`url(#${id}d)`} />
      <path d="M0 740 q260 -90 560 -30 t560 20 t480 -40 V900H0Z" fill="#7d4a30" />
      <path d="M0 820 q300 -70 640 -20 t600 10 t360 -30 V900H0Z" fill="#4a2a24" />
    </>
  )
}

function Tropical({ id }: { id: string }) {
  const bands = ['#7fb26f', '#5f9a58', '#4a8548', '#386f3d', '#295b34']
  return (
    <>
      <defs>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12413f" /><stop offset=".5" stopColor="#82bd92" /><stop offset="1" stopColor="#f6e6ac" /></linearGradient>
        <radialGradient id={id + 'g'}><stop offset="0" stopColor="#fff5c4" stopOpacity=".9" /><stop offset="1" stopColor="#fff5c4" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}s)`} />
      <circle cx="400" cy="300" r="300" fill={`url(#${id}g)`} /><circle cx="400" cy="300" r="56" fill="#fff6cf" />
      <Clouds y={150} op={0.22} /><Birds />
      <path d="M0 520 q300 -120 620 -40 t520 -60 t460 40 V900H0Z" fill="#3f7a67" opacity=".7" />
      {bands.map((c, i) => <path key={i} d={`M0 ${560 + i * 70} q${260 - i * 20} ${-60 - i * 10} ${560} ${-12 + i * 4} t${600 + i * 40} ${-10} t${480} ${24 - i * 6} V900H0Z`} fill={c} />)}
      {bands.map((_, i) => <path key={'l' + i} d={`M0 ${566 + i * 70} q${260 - i * 20} ${-60 - i * 10} ${560} ${-12 + i * 4} t${600 + i * 40} ${-10} t480 ${24 - i * 6}`} fill="none" stroke="#c9e4a0" strokeOpacity=".35" strokeWidth="2.5" />)}
      {[[1280, 880, 520, -30], [160, 900, 430, 24], [1480, 900, 360, -12]].map(([x, y, h, lean], i) => (
        <g key={i} stroke="#10261e" fill="none" strokeLinecap="round">
          <path d={`M${x} ${y} q${lean} ${-h / 2} ${lean * 2} ${-h}`} strokeWidth="14" />
          {[-150, -100, -40, 30, 90, 150].map((a, j) => <path key={j} className="sc-sway" style={{ animationDelay: `${j * 0.4}s`, transformOrigin: `${x + lean * 2}px ${y - h}px` }} d={`M${x + lean * 2} ${y - h} q${a * 0.5} ${-60 + Math.abs(a) * 0.2} ${a} ${20 + Math.abs(a) * 0.2}`} strokeWidth="9" />)}
        </g>
      ))}
    </>
  )
}

function Sakura({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#261b3b" /><stop offset=".5" stopColor="#c4799b" /><stop offset="1" stopColor="#f8d8cd" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}s)`} />
      <Stars n={22} h={220} />
      <circle cx="1130" cy="330" r="96" fill="#fff0e4" opacity=".92" />
      <path d="M0 700 q300 -140 620 -80 t480 -60 t500 40 V900H0Z" fill="#4a2c52" opacity=".75" />
      <path d="M0 780 q400 -110 800 -50 t800 -40 V900H0Z" fill="#2a1938" />
      <g fill="#1d1129">
        <rect x="905" y="470" width="14" height="190" /><rect x="935" y="470" width="14" height="190" /><rect x="965" y="470" width="14" height="190" />
        <path d="M850 480 q80 -20 160 -60 q80 40 160 60 q-60 -6 -80 14 H930 q-20 -20 -80 -14Z" transform="translate(-20 0)" />
        <path d="M880 420 q60 -16 118 -50 q60 34 118 50 q-46 -4 -62 12 H942 q-16 -16 -62 -12Z" transform="translate(-6 -6)" />
        <path d="M930 370 q50 -14 98 -44 q48 30 98 44 q-38 -4 -50 10 H980 q-12 -14 -50 -10Z" transform="translate(-34 -14)" />
        <rect x="990" y="290" width="4" height="40" />
      </g>
      <g stroke="#2a1633" strokeWidth="12" fill="none" strokeLinecap="round"><path d="M1600 120 q-260 40 -420 170 M1470 160 q-60 -50 -150 -70 M1340 230 q-30 50 -100 70" /></g>
      <g fill="#f6bccd">{Array.from({ length: 34 }, (_, i) => <circle key={i} cx={1180 + rnd(i) * 420} cy={70 + rnd(i + 9) * 240} r={7 + rnd(i + 3) * 9} opacity={0.75 + rnd(i) * 0.25} />)}</g>
      <g fill="#fbd5df">{Array.from({ length: 26 }, (_, i) => <ellipse key={i} className="sc-fall" style={{ animationDelay: `${-rnd(i + 20) * 14}s`, animationDuration: `${12 + rnd(i) * 10}s` }} cx={rnd(i + 40) * 1600} cy="-20" rx="7" ry="4" />)}</g>
    </>
  )
}

const scenes: Record<SceneKind, (p: { id: string }) => ReactNode> = { lagoon: Lagoon, dusk: Dusk, alpine: Alpine, desert: Desert, tropical: Tropical, sakura: Sakura }

export function Scene({ kind, className = '', label }: { kind: SceneKind; className?: string; label?: string }) {
  const id = useId().replace(/:/g, '')
  const S = scenes[kind] ?? Tropical
  return (
    <svg className={'scene ' + className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <S id={id} />
    </svg>
  )
}

// Photo when available, illustrated scene otherwise.
export function Visual({ image, scene, alt, className = '' }: { image?: string; scene: SceneKind; alt: string; className?: string }) {
  return image ? <img className={'visual ' + className} src={image} alt={alt} loading="lazy" decoding="async" /> : <Scene kind={scene} className={'visual ' + className} label={alt} />
}
