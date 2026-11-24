import type { SceneKind } from '../api'

// Editable site content. Replace copy, swap scenes for real image paths (e.g. /images/flights.jpg) any time.
export interface Service { image: string; slug: string; icon: string; title: string; short: string; long: string; points: string[]; scene: SceneKind }
export const services: Service[] = [
  { image: '/images/switzerland.jpg', slug: 'flights', icon: 'flights', title: 'Flights', short: 'Domestic and international flight bookings.', scene: 'alpine',
    long: 'We build routes around your time, not around the cheapest fare that wastes a day. Fare comparison, seat and baggage planning, and rebooking help if plans move.',
    points: ['Domestic and international bookings', 'Multi-city and open-jaw routes', 'Seat, meal and baggage requests', 'Changes and rescheduling support'] },
  { image: '/images/maldives.jpg', slug: 'hotels', icon: 'hotels', title: 'Hotels & Stays', short: 'Handpicked hotels, resorts and premium stays.', scene: 'lagoon',
    long: 'Every property is chosen for location, service and how it fits the rest of your trip. Boutique hotels, resorts, villas and palace stays, with the right room category confirmed in advance.',
    points: ['Hotels, resorts, villas and heritage stays', 'Room category and view requests', 'Early check-in and late checkout requests', 'Celebration set-ups on arrival'] },
  { image: '/images/kyoto.jpg', slug: 'visa', icon: 'visa', title: 'Visa Assistance', short: 'Guidance and assistance for visa applications.', scene: 'desert',
    long: 'Requirements change often. We tell you what is needed, check your documents before you submit and guide you through the application. Approval is always decided by the embassy or consulate.',
    points: ['Document checklist for your destination', 'Application form guidance', 'Appointment scheduling support', 'Travel insurance arrangement'] },
  { image: '/images/paris.jpg', slug: 'transfers', icon: 'transfers', title: 'Airport Transfers', short: 'Reliable private and shared airport transfers.', scene: 'dusk',
    long: 'A named driver at arrivals, tracked against your flight. Private cars, shared shuttles, seaplane and rail connections where the destination calls for it.',
    points: ['Private and shared transfers', 'Flight-tracked pickups', 'Rail, ferry and seaplane connections', 'Chauffeur days available'] },
  { image: '/images/bali.jpg', slug: 'packages', icon: 'packages', title: 'Customized Packages', short: 'Personalized itineraries designed around your budget, interests and schedule.', scene: 'tropical',
    long: 'Not a template with your name on it. Tell us the budget, the pace and what matters most, and we build the whole journey, then revise it until you are happy to say yes.',
    points: ['Built around budget, pace and interests', 'One revision round at no charge', 'Single point of contact', 'Support while you are travelling'] },
  { image: '/images/kerala.jpg', slug: 'experiences', icon: 'experiences', title: 'Experiences', short: 'Tours, activities, sightseeing, dining and unique local experiences.', scene: 'sakura',
    long: 'The table with the view, the guide who skips the queue, the cooking class in a family kitchen. We reserve the things that sell out and leave room for the things that should not be scheduled.',
    points: ['Private and small-group tours', 'Restaurant reservations', 'Cultural and adventure activities', 'Local guides'] },
  { image: '/images/santorini.jpg', slug: 'honeymoon', icon: 'honeymoon', title: 'Honeymoon Journeys', short: 'Romantic destinations and customized honeymoon experiences.', scene: 'dusk',
    long: 'Quiet, private and well timed. We choose destinations and rooms for couples, add the small surprises, and make sure the first night is easy.',
    points: ['Destination matching by season and mood', 'Room upgrades and celebration set-ups', 'Private dinners and couples spa', 'Photographer introductions'] },
  { image: '/images/dubai.jpg', slug: 'corporate', icon: 'corporate', title: 'Corporate Travel', short: 'Business trips, corporate stays, flights and transportation.', scene: 'desert',
    long: 'Tight schedules need dependable logistics. Flights, stays near the meeting, ground transport and one invoice, with flexibility when meetings move.',
    points: ['Flights, hotels and ground transport', 'Flexible and refundable options', 'Team and group travel', 'Consolidated billing'] },
]

export const whyItems = [
  ['Personalized Planning', 'Every itinerary starts with a conversation, not a catalogue.'],
  ['Transparent Communication', 'Clear costs, clear timelines, and an honest answer when something will not work.'],
  ['Carefully Curated Options', 'A short list we stand behind, not forty tabs to compare.'],
  ['End-to-End Assistance', 'Flights, stays, transfers, visas and experiences, handled together.'],
  ['Dedicated Travel Support', 'One person who knows your trip, reachable before and during it.'],
  ['Memorable Experiences', 'The details that you will still be talking about next year.'],
] as const

export const steps = [
  ['Tell Us Your Vision', 'Share where, when and how you like to travel. A form or a WhatsApp message is enough.'],
  ['We Curate', 'Your specialist designs the itinerary, stays and transfers, and sends it with clear pricing.'],
  ['You Approve', 'Adjust anything you like. Nothing is booked until you say yes.'],
  ['Travel & Experience', 'We confirm everything, stay reachable on the trip, and you simply enjoy it.'],
] as const

// Instagram gallery. Add `image: '/images/post-1.jpg'` to show a real photo; leave it out to show the artwork.
export interface Post { scene: SceneKind; caption: string; image?: string; href?: string }
export const instagramPosts: Post[] = [
  { scene: 'lagoon', image: '/images/maldives.jpg', caption: 'Morning light, Maldives' },
  { scene: 'dusk', image: '/images/santorini.jpg', caption: 'Above the caldera, Santorini' },
  { scene: 'alpine', image: '/images/switzerland.jpg', caption: 'The Matterhorn, Zermatt' },
  { scene: 'sakura', image: '/images/kyoto.jpg', caption: 'Golden Pavilion, Kyoto' },
  { scene: 'tropical', image: '/images/bali.jpg', caption: 'Rice terraces, Bali' },
  { scene: 'desert', image: '/images/udaipur.jpg', caption: 'Lake Pichola, Udaipur' },
]
