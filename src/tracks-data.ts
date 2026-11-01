export interface HackTrack {
  id: string
  filename: string
  title: string
  image: { src: string; alt: string }
  audio: { src: string; duration: number }
  bullets: [string]
  prizes: { award: string; details: string }[]
}

// Preview content. Replace with confirmed event tracks and prizes before launch.
export const hackTracks: HackTrack[] = [
  {
    id: 'software',
    filename: 'software.txt',
    title: 'Software',
    image: { src: '/track-art/coffee.svg', alt: 'Pixel art of a steaming coffee mug' },
    audio: { src: '/tracks/track1.m4a', duration: 31.704 },
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
    image: { src: '/track-art/flower.svg', alt: 'Pixel art of a flower' },
    audio: { src: '/tracks/track2.m4a', duration: 31.227 },
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
    image: { src: '/track-art/planet.svg', alt: 'Pixel art of a ringed planet' },
    audio: { src: '/tracks/track3.m4a', duration: 39.142 },
    bullets: [
      'Turn a local challenge into a project that helps your community or the planet.',
    ],
    prizes: [
      { award: 'Best Community Impact', details: 'Trophy & sponsor gift cards' }
    ],
  },
]
