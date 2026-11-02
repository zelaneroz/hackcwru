export type SponsorSize = 'small' | 'medium' | 'large'

export interface Sponsor {
  id: string
  name: string
  image: string
  /** Controls the logo dimensions; this is not a sponsorship tier. */
  size: SponsorSize
  /** Optional official website, opened when the logo is selected. */
  url?: string
}

// Add or remove entries here; each sponsor appears in the logo grid.
// Put logos in public/sponsors and use their /sponsors/... URL.
// Placeholder artwork remains until the official logo is supplied.
export const sponsors: Sponsor[] = [
  { id: 'teksafari', name: 'TekSafari', image: '/sponsors/teksafari.png', size: 'large' },
  { id: 'veale', name: 'CWRU Veale Institute for Entrepreneurship', image: '/sponsors/placeholder.svg', size: 'medium' },
  { id: 'accenture', name: 'Placeholder 1', image: '/sponsors/placeholder.svg', size: 'small' },
]
