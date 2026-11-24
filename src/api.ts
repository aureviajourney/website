export type SceneKind = 'tropical' | 'lagoon' | 'dusk' | 'alpine' | 'desert' | 'sakura'
export type Settings = Record<string, string>
export interface Destination {
  id: number; slug: string; name: string; country: string; category: 'International' | 'Domestic'
  tagline: string; description: string; image: string; scene: SceneKind; featured: boolean; best_time: string
}
export interface ItineraryDay { day: string; title: string; text: string }
export interface Pkg {
  id: number; slug: string; title: string; destination_id: number | null; destination_name?: string; destination_slug?: string
  destination_image?: string; scene?: SceneKind; duration: string; price: number; summary: string
  inclusions: string[]; exclusions: string[]; itinerary: ItineraryDay[]; images: string[]
}

export const money = (n: number) => '₹' + n.toLocaleString('en-IN')
export const waLink = (number: string, msg = 'Hello Aurevia, I would like to plan a journey.') =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`

/**
 * Enquiry submission, the single place to change when the backend arrives.
 * For now it opens the visitor's email app with the details pre-filled, addressed to Aurevia.
 * Later: replace the body with  await fetch('/api/enquiries/' + kind, { method: 'POST', ... }).
 */
export async function submitEnquiry(kind: 'plan' | 'contact', data: Record<string, unknown>, to: string): Promise<void> {
  const lines = Object.entries(data).filter(([k, v]) => v !== '' && v != null && k !== 'website' && k !== 'startedAt').map(([k, v]) => `${k}: ${v}`)
  const subject = encodeURIComponent('New Travel Enquiry — Aurevia')
  const body = encodeURIComponent(`Enquiry type: ${kind === 'plan' ? 'Journey plan' : 'Contact'}\n\n${lines.join('\n')}`)
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
}
