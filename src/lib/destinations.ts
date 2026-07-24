// Shared destination data — used by Nav's mega menu, the mobile menu, Hero's search
// dropdown, and the homepage Destinations section. Kept in one place per CLAUDE.md's
// duplicated-list-consistency rule (ported from the static build, where this same list
// was copy-pasted across files by hand — a Sanity `destination` reference type replaces
// this once that schema exists, per atlas-website's handoff notes on Tier 4).
export type Destination = {
  id: string
  name: string
  tagline: string
  seasonNights: string
  image: string
  alt: string
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'raja-ampat',
    name: 'Raja Ampat',
    tagline: 'Indonesia’s Holy Grail of Diving',
    seasonNights: 'Year-Round · 7–12 Nights',
    image: '/assets/destination-raja-ampat.webp',
    alt: 'Aerial view of forested limestone islands and turquoise lagoons in Raja Ampat, Indonesia',
  },
  {
    id: 'komodo',
    name: 'Komodo',
    tagline: 'Dragons & World-Class Drift Dives',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-komodo.webp',
    alt: 'Aerial view of small sandy islands separated by narrow channels of turquoise water',
  },
  {
    id: 'banda-sea',
    name: 'Banda Sea',
    tagline: 'Remote Spice Islands & Big Pelagics',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-banda-sea.webp',
    alt: 'Aerial view of a forested volcanic island with a sheltered lagoon and fringing reef',
  },
  {
    id: 'triton-bay',
    name: 'Triton Bay',
    tagline: 'Remote Reefs & Whale Sharks',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-triton-bay.webp',
    alt: 'A whale shark swimming near the surface with a snorkeler in the background',
  },
  {
    id: 'sumbawa',
    name: 'Sumbawa',
    tagline: 'Untouched Reefs & Empty Seas',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-sumbawa.webp',
    alt: 'Aerial view of a secluded sandy beach beneath tall cliffs with palm trees in the foreground',
  },
  {
    id: 'flores',
    name: 'Flores',
    tagline: 'Volcanic Peaks & Colourful Reefs',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-flores.webp',
    alt: 'Aerial view of a rocky coastline meeting turquoise water beside dense forest',
  },
  {
    id: 'bali',
    name: 'Bali',
    tagline: 'Wrecks, Reefs & Legendary Night Dives',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-bali.webp',
    alt: 'Two scuba divers with underwater torches exploring a sunlit cavern',
  },
  {
    id: 'north-sulawesi',
    name: 'North Sulawesi',
    tagline: 'Lembeh Strait & World-Class Macro Diving',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-north-sulawesi.webp',
    alt: 'Macro close-up of a brain coral illuminated in blue light',
  },
  {
    id: 'halmahera',
    name: 'Halmahera',
    tagline: 'Remote Reefs of the Northern Moluccas',
    seasonNights: 'Itinerary details TBC',
    image: '/assets/destination-halmahera.webp',
    alt: 'Aerial view of two small palm-covered islands surrounded by coral reef and turquoise water',
  },
]
