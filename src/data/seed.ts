import type { Destination, Pkg, SceneKind, Settings } from '../api'

// Site-wide settings. When the admin panel is built these will come from the database instead.
export const settings: Settings = {
  company_name: 'Aurevia',
  tagline: 'Curated Journeys. Exceptional Experiences.',
  email: 'aureviajourney@gmail.com',
  phone: '',          // add when available, e.g. '+91 98xxx xxxxx'
  whatsapp: '',       // digits with country code, e.g. '919800000000'. The floating button shows once set.
  instagram: 'aureevia__',
  facebook: '', x: '', linkedin: '', youtube: '',
  logo: '',
  address: 'India',
  about: 'Aurevia is a travel concierge for people who would rather enjoy the journey than manage it. We plan domestic and international trips end to end, with a real person on the other side of every message.',
}

type D = [string, string, string, 'International' | 'Domestic', string, string, SceneKind, boolean, string]
const D: D[] = [
  ['maldives', 'Maldives', 'Maldives', 'International', 'Water villas, and nothing on the calendar', 'Private islands, house reefs and overwater villas. We pair the right atoll with the right resort, then arrange seaplane and speedboat transfers so the first hour feels like day three.', 'lagoon', true, 'Nov – Apr'],
  ['santorini', 'Santorini', 'Greece', 'International', 'Caldera light, slow evenings', 'Whitewashed cliffside suites, sunset sailings and tables above the caldera. Ideal for honeymoons and anniversaries.', 'dusk', true, 'Apr – Oct'],
  ['switzerland', 'Swiss Alps', 'Switzerland', 'International', 'Scenic rail, alpine stillness', 'Glacier Express windows, lakeside towns and mountain lodges, linked by a rail itinerary that actually makes sense.', 'alpine', true, 'Jun – Sep, Dec – Mar'],
  ['dubai', 'Dubai', 'United Arab Emirates', 'International', 'Skyline stays, desert evenings', 'Design-led hotels, private desert dinners and effortless city transfers. Equally good for a long weekend or a business stopover.', 'desert', true, 'Nov – Mar'],
  ['bali', 'Bali', 'Indonesia', 'International', 'Rice terraces and quiet villas', 'Private pool villas in Ubud and Uluwatu, temple mornings, cliffside dinners and a driver who knows the shortcuts.', 'tropical', true, 'Apr – Oct'],
  ['kyoto', 'Kyoto & Tokyo', 'Japan', 'International', 'Tradition, precision, seasons', 'Ryokan nights, reserved tables and rail passes sorted in advance. Timed around cherry blossom or autumn colour.', 'sakura', false, 'Mar – Apr, Oct – Nov'],
  ['paris', 'Paris', 'France', 'International', 'Left Bank mornings, late dinners', 'Boutique hotels, private museum hours and tables worth the reservation.', 'dusk', false, 'Apr – Jun, Sep – Oct'],
  ['udaipur', 'Udaipur', 'India', 'Domestic', 'Lake palaces and heritage evenings', 'Palace stays on Lake Pichola, royal dining and a gentle pace. Our most requested domestic escape.', 'desert', true, 'Oct – Mar'],
  ['kerala', 'Kerala Backwaters', 'India', 'Domestic', 'Houseboats, spice hills, ayurveda', 'Private houseboat nights, Munnar tea country and a retreat-style close in Kovalam.', 'tropical', false, 'Sep – Mar'],
]
export const destinations: Destination[] = D.map((d, i) => ({ id: i + 1, slug: d[0], name: d[1], country: d[2], category: d[3], tagline: d[4], description: d[5], image: `/images/${d[0]}.jpg`, scene: d[6], featured: d[7], best_time: d[8] }))
const dest = (slug: string) => destinations.find((d) => d.slug === slug)!

type P = [string, string, string, string, number, string, string[], string[], [string, string, string][]]
const P: P[] = [
  ['maldives-overwater-escape', 'Overwater Escape', 'maldives', '5 nights / 6 days', 145000, 'Seaplane arrival, overwater villa, sunset cruise and a private reef dinner.',
    ['Return flights from select Indian cities', '5 nights in an overwater villa', 'Daily breakfast and dinner', 'Seaplane or speedboat transfers', 'Sunset dolphin cruise'], ['Visa and travel insurance', 'Lunches and premium beverages', 'Personal expenses'],
    [['1', 'Arrive in Malé', 'Met at arrivals and flown by seaplane to your resort.'], ['2', 'Reef and recover', 'A slow day: snorkelling, spa, nothing urgent.'], ['3', 'Sunset cruise', 'A private cruise with dolphin spotting.'], ['4', 'Private dinner', 'A table on the sandbank, arranged for two.'], ['5', 'Free day', 'Optional diving, island hop or simply stay put.'], ['6', 'Departure', 'Late checkout where available, then transfer to the airport.']]],
  ['santorini-caldera-romance', 'Caldera Romance', 'santorini', '4 nights / 5 days', 168000, 'Cliffside suite with a plunge pool, a private sailing and tables chosen for the view.',
    ['Return flights via Athens', '4 nights in a caldera-view suite', 'Daily breakfast', 'Private sunset catamaran', 'Airport and port transfers'], ['Visa', 'Lunches and most dinners', 'Personal expenses'],
    [['1', 'Arrive in Fira', 'Private transfer to your suite in Imerovigli.'], ['2', 'Oia at golden hour', 'Walk the village early, reserve sunset on a quiet terrace.'], ['3', 'Sail the caldera', 'Swim stops at the hot springs and Red Beach.'], ['4', 'Winery afternoon', 'A tasting among the vines, then dinner in Pyrgos.'], ['5', 'Departure', 'Transfer and flight home.']]],
  ['swiss-rail-journey', 'Swiss Rail Journey', 'switzerland', '7 nights / 8 days', 215000, 'Zurich, Lucerne, Interlaken and Zermatt linked by scenic rail.',
    ['Return flights to Zurich', '7 nights in handpicked hotels', 'Swiss Travel Pass', 'Daily breakfast', 'Jungfraujoch excursion'], ['Visa', 'Most lunches and dinners', 'Travel insurance'],
    [['1', 'Zurich', 'Arrive and settle in by the lake.'], ['2', 'Lucerne', 'Chapel Bridge and a lake cruise.'], ['3', 'Interlaken', 'Panoramic train to the Bernese Oberland.'], ['4', 'Jungfraujoch', 'Top of Europe, weather permitting.'], ['5', 'Glacier Express', 'The long, slow window-seat day to Zermatt.'], ['6', 'Matterhorn', 'Gornergrat railway and a long lunch.'], ['7', 'Free day', 'Walk, shop or spa.'], ['8', 'Departure', 'Rail to Zurich and fly home.']]],
  ['dubai-skyline-weekend', 'Skyline Weekend', 'dubai', '3 nights / 4 days', 78000, 'A design hotel, a private desert dinner and every transfer taken care of.',
    ['Return flights', '3 nights in a 5-star hotel', 'Daily breakfast', 'Desert dinner with transfers', 'Burj Khalifa observation deck'], ['Visa', 'Other meals', 'Shopping'],
    [['1', 'Arrive', 'Chauffeured transfer and early check-in where possible.'], ['2', 'Old and new Dubai', 'Creek, souks and the skyline at dusk.'], ['3', 'Desert evening', 'Dune drive and a private dinner under the stars.'], ['4', 'Departure', 'Breakfast, then airport transfer.']]],
  ['bali-villa-retreat', 'Villa Retreat', 'bali', '6 nights / 7 days', 98000, 'Private pool villas in Ubud and Uluwatu with a driver throughout.',
    ['Return flights', '3 nights in Ubud, 3 in Uluwatu', 'Daily breakfast', 'Private driver', 'Temple and rice terrace tour'], ['Visa on arrival fee', 'Most lunches and dinners'],
    [['1', 'Arrive', 'Straight to your Ubud villa.'], ['2', 'Terraces and temples', 'Tegalalang at sunrise, then Tirta Empul.'], ['3', 'Slow Ubud', 'Cooking class, spa and a long dinner.'], ['4', 'Move to Uluwatu', 'Cliffside villa and a sunset at the temple.'], ['5', 'Beach day', 'Quiet coves and a seafood dinner on the sand.'], ['6', 'Free day', 'Surf lesson or stay in.'], ['7', 'Departure', 'Transfer to the airport.']]],
  ['udaipur-palace-stay', 'Palace Stay', 'udaipur', '3 nights / 4 days', 62000, 'Lake-view palace suite, boat ride and a royal dinner.',
    ['Flights from select cities', '3 nights in a lake palace hotel', 'Daily breakfast', 'Private sightseeing', 'Lake Pichola boat ride'], ['Other meals', 'Monument entry fees'],
    [['1', 'Arrive', 'Welcome by the lake.'], ['2', 'City Palace', 'A guided morning, then bazaars.'], ['3', 'Royal dinner', 'A set table above the water.'], ['4', 'Departure', 'Unhurried check-out.']]],
]
export const packages: Pkg[] = P.map((p, i) => {
  const d = dest(p[2])
  return { id: i + 1, slug: p[0], title: p[1], destination_id: d.id, destination_name: d.name, destination_slug: d.slug, destination_image: d.image, scene: d.scene, duration: p[3], price: p[4], summary: p[5], inclusions: p[6], exclusions: p[7], itinerary: p[8].map(([day, title, text]) => ({ day, title, text })), images: [] }
})
