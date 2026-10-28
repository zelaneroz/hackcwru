export interface Sponsor {
  id: string
  name: string
  image: string
  /** Optional official website, shown for the selected sponsor when supplied. */
  url?: string
}

// Add or remove entries here; the player derives its layout and counts from
// this array. Put artwork in public/sponsors and use its /sponsors/... URL.
// These covers are temporary artwork, not official organization logos.
export const sponsors: Sponsor[] = [
  { id: 'teksafari', name: 'TekSafari', image: '/sponsors/teksafari.png' },
  { id: 'veale', name: 'CWRU Veale Institute for Entrepreneurship', image: '/sponsors/placeholder.svg' },
  { id: 'accenture', name: 'Placeholder 1', image: '/sponsors/placeholder.svg' },
]
