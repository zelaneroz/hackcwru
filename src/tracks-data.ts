export interface HackTrack {
  id: string
  filename: string
  title: string
  image: { src: string; alt: string }
  bullets: [string]
  prizes: { award: string; details: string }[]
}

// Preview content. Replace with confirmed event tracks and prizes before launch.
export const hackTracks: HackTrack[] = [
  {
    id: 'software',
    filename: 'software.txt',
    title: 'Software',
    image: { src: '/schoolhouse.png', alt: 'Purble Place schoolhouse with a golden bell' },
    bullets: [
      'Develop intelligent agents, neural networks, or LLM-based solutions to solve modern problems.',
    ],
    prizes: [
      { award: 'Best AI Project', details: 'Trophy & sponsor gift cards' }
    ],
  },
  {
    id: 'hardware',
    filename: 'hardware.txt',
    title: 'Hardware',
    image: { src: '/cake-factory.png', alt: 'Purble Place cake factory with a yellow delivery truck' },
    bullets: [
      'Build tools that make everyday life more accessible, inclusive, and independent.',
    ],
    prizes: [
      { award: 'Best Accessible Design', details: 'Trophy & sponsor gift cards' }
    ],
  },
  {
    id: 'special',
    filename: 'special.txt',
    title: 'Special Track',
    image: { src: '/purple-eye-shop.png', alt: 'Purble Place purple shop with blue eyes on its roof' },
    bullets: [
      'Turn a local challenge into a project that helps your community or the planet.',
    ],
    prizes: [
      { award: 'Best Community Impact', details: 'Trophy & sponsor gift cards' }
    ],
  },
]
