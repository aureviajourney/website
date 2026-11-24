import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { submitEnquiry } from '../api'
import { useSite } from '../site'
import { Arrow } from './ui'

type Errors = Record<string, string>
const TRIPS = ['Honeymoon', 'Family', 'Couple', 'Friends', 'Solo', 'Corporate', 'Luxury', 'Adventure', 'Religious', 'Leisure']
const today = () => new Date().toISOString().slice(0, 10)
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const phoneOk = (v: string) => /^[+\d][\d\s\-()]{6,}$/.test(v.trim())

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; children: ReactNode; hint?: string }) {
  return (
    <div className={'field' + (error ? ' has-error' : '')}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      <span className="err" id={id + '-err'} role={error ? 'alert' : undefined}>{error}</span>
    </div>
  )
}

function Success({ title = 'Thank you for choosing Aurevia.', onAgain }: { title?: string; onAgain: () => void }) {
  return (
    <div className="success" role="status">
      <svg viewBox="0 0 80 80" width="84" height="84" aria-hidden="true"><circle cx="40" cy="40" r="36" className="s-ring" /><path d="M24 41l11 11 22-24" className="s-tick" /></svg>
      <h3>{title}</h3>
      <p>Our travel specialist will connect with you shortly.</p>
      <button type="button" className="link-btn" onClick={onAgain}>Send another enquiry</button>
    </div>
  )
}

// Used by both forms: posts, maps server-side field errors, tracks state.
function useSubmit(kind: 'plan' | 'contact') {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [formError, setFormError] = useState('')
  const started = useRef(Date.now())
  const { settings } = useSite()
  const send = async (payload: Record<string, unknown>) => {
    if (payload.website || Date.now() - started.current < 1500) return false // bot traps
    setStatus('sending'); setFormError('')
    try {
      await submitEnquiry(kind, payload, settings.email)
      setStatus('done')
      return true
    } catch {
      setStatus('idle')
      setFormError('We could not send that. Please email us directly or message us on WhatsApp.')
      return false
    }
  }
  const reset = () => { setStatus('idle'); setErrors({}); started.current = Date.now() }
  return { errors, setErrors, status, formError, send, reset }
}

const Honeypot = () => (
  <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
)

/* ---------- Plan your journey (3 steps) ---------- */
export function PlanForm({ defaultDestination = '' }: { defaultDestination?: string }) {
  const [step, setStep] = useState(0)
  const [v, setV] = useState({ name: '', email: '', phone: '', from: '', destination: defaultDestination, departure: '', returnDate: '', adults: '2', children: '0', tripType: '', preferences: '', requests: '' })
  const { errors, setErrors, status, formError, send, reset } = useSubmit('plan')
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => { setV({ ...v, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: '' }) }

  const validate = (s: number): Errors => {
    const e: Errors = {}
    if (s === 0) {
      if (v.name.trim().length < 2) e.name = 'Please enter your name'
      if (!emailOk(v.email)) e.email = 'Enter a valid email address'
      if (!phoneOk(v.phone)) e.phone = 'Enter a valid phone or WhatsApp number'
    }
    if (s === 1) {
      if (v.from.trim().length < 2) e.from = 'Where are you travelling from?'
      if (v.destination.trim().length < 2) e.destination = 'Tell us where you would like to go'
      if (!v.departure) e.departure = 'Choose a departure date'
      else if (v.departure < today()) e.departure = 'Departure cannot be in the past'
      if (v.returnDate && v.returnDate < v.departure) e.returnDate = 'Return must be after departure'
      if (Number(v.adults) < 1) e.adults = 'At least one adult'
    }
    if (s === 2 && !v.tripType) e.tripType = 'Choose the kind of trip'
    return e
  }
  const next = () => { const e = validate(step); setErrors(e); if (!Object.keys(e).length) setStep(step + 1) }
  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const all = { ...validate(0), ...validate(1), ...validate(2) }
    if (Object.keys(all).length) {
      setErrors(all)
      setStep(Object.keys(validate(0)).length ? 0 : Object.keys(validate(1)).length ? 1 : 2)
      return
    }
    const hp = (ev.currentTarget.elements.namedItem('website') as HTMLInputElement)?.value
    await send({ ...v, adults: Number(v.adults), children: Number(v.children), website: hp })
  }

  if (status === 'done') return <Success onAgain={() => { setV({ ...v, departure: '', returnDate: '', preferences: '', requests: '', tripType: '' }); setStep(0); reset() }} />
  const labels = ['About you', 'The journey', 'Your style']
  return (
    <form className="form plan" onSubmit={submit} noValidate aria-label="Plan your journey">
      <ol className="steps" aria-label="Progress">
        {labels.map((l, i) => <li key={l} className={i === step ? 'on' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}><span>{i + 1}</span>{l}</li>)}
        <i className="steps-bar" style={{ transform: `scaleX(${step / 2})` }} />
      </ol>

      <div className="panel" hidden={step !== 0}>
        <Field id="p-name" label="Full name" error={errors.name}><input id="p-name" value={v.name} onChange={set('name')} autoComplete="name" aria-describedby="p-name-err" aria-invalid={!!errors.name} /></Field>
        <div className="row">
          <Field id="p-email" label="Email" error={errors.email}><input id="p-email" type="email" value={v.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} /></Field>
          <Field id="p-phone" label="Phone / WhatsApp" error={errors.phone}><input id="p-phone" type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={!!errors.phone} /></Field>
        </div>
      </div>

      <div className="panel" hidden={step !== 1}>
        <div className="row">
          <Field id="p-from" label="Travel from" error={errors.from}><input id="p-from" value={v.from} onChange={set('from')} placeholder="City" aria-invalid={!!errors.from} /></Field>
          <Field id="p-dest" label="Destination" error={errors.destination}><input id="p-dest" value={v.destination} onChange={set('destination')} placeholder="Where to?" aria-invalid={!!errors.destination} /></Field>
        </div>
        <div className="row">
          <Field id="p-dep" label="Departure date" error={errors.departure}><input id="p-dep" type="date" min={today()} value={v.departure} onChange={set('departure')} aria-invalid={!!errors.departure} /></Field>
          <Field id="p-ret" label="Return date" error={errors.returnDate}><input id="p-ret" type="date" min={v.departure || today()} value={v.returnDate} onChange={set('returnDate')} aria-invalid={!!errors.returnDate} /></Field>
        </div>
        <div className="row">
          <Field id="p-ad" label="Adults" error={errors.adults}><input id="p-ad" type="number" min={1} max={50} value={v.adults} onChange={set('adults')} inputMode="numeric" /></Field>
          <Field id="p-ch" label="Children" error={errors.children}><input id="p-ch" type="number" min={0} max={50} value={v.children} onChange={set('children')} inputMode="numeric" /></Field>
        </div>
      </div>

      <div className="panel" hidden={step !== 2}>
        <fieldset className="chips">
          <legend>Trip type</legend>
          <div>{TRIPS.map((t) => (
            <label key={t} className={v.tripType === t ? 'chip on' : 'chip'}>
              <input type="radio" name="tripType" value={t} checked={v.tripType === t} onChange={set('tripType')} />{t}
            </label>
          ))}</div>
          <span className="err" role={errors.tripType ? 'alert' : undefined}>{errors.tripType}</span>
        </fieldset>
        <Field id="p-pref" label="Travel preferences" hint="Pace, hotel style, food, must-sees"><textarea id="p-pref" rows={3} maxLength={1500} value={v.preferences} onChange={set('preferences')} /></Field>
        <Field id="p-req" label="Special requests"><textarea id="p-req" rows={3} maxLength={1500} value={v.requests} onChange={set('requests')} /></Field>
        <Honeypot />
      </div>

      {formError && <p className="form-error" role="alert">{formError}</p>}
      <div className="form-actions">
        {step > 0 && <button type="button" className="link-btn" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 2
          ? <button type="button" className="btn btn-gold" onClick={next}><span>Continue</span><Arrow /></button>
          : <button type="submit" className="btn btn-gold" disabled={status === 'sending'}><span>{status === 'sending' ? 'Sending…' : 'Curate My Journey'}</span><Arrow /></button>}
      </div>
    </form>
  )
}

/* ---------- Contact ---------- */
export function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', phone: '', destination: '', travelDate: '', message: '' })
  const { errors, setErrors, status, formError, send, reset } = useSubmit('contact')
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => { setV({ ...v, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: '' }) }
  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e: Errors = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your name'
    if (!emailOk(v.email)) e.email = 'Enter a valid email address'
    if (!phoneOk(v.phone)) e.phone = 'Enter a valid phone number'
    if (v.message.trim().length < 5) e.message = 'Please add a short message'
    setErrors(e)
    if (Object.keys(e).length) return
    const hp = (ev.currentTarget.elements.namedItem('website') as HTMLInputElement)?.value
    await send({ ...v, website: hp })
  }
  if (status === 'done') return <Success onAgain={() => { setV({ name: '', email: '', phone: '', destination: '', travelDate: '', message: '' }); reset() }} />
  return (
    <form className="form" onSubmit={submit} noValidate aria-label="Contact Aurevia">
      <div className="row">
        <Field id="c-name" label="Name" error={errors.name}><input id="c-name" value={v.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} /></Field>
        <Field id="c-email" label="Email" error={errors.email}><input id="c-email" type="email" value={v.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} /></Field>
      </div>
      <div className="row">
        <Field id="c-phone" label="Phone" error={errors.phone}><input id="c-phone" type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={!!errors.phone} /></Field>
        <Field id="c-dest" label="Destination" error={errors.destination}><input id="c-dest" value={v.destination} onChange={set('destination')} /></Field>
      </div>
      <Field id="c-date" label="Travel date" error={errors.travelDate}><input id="c-date" type="date" min={today()} value={v.travelDate} onChange={set('travelDate')} /></Field>
      <Field id="c-msg" label="Message" error={errors.message}><textarea id="c-msg" rows={4} maxLength={2000} value={v.message} onChange={set('message')} aria-invalid={!!errors.message} /></Field>
      <Honeypot />
      {formError && <p className="form-error" role="alert">{formError}</p>}
      <div className="form-actions"><button type="submit" className="btn btn-gold" disabled={status === 'sending'}><span>{status === 'sending' ? 'Sending…' : 'Send Enquiry'}</span><Arrow /></button></div>
    </form>
  )
}
