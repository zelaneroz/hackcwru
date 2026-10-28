export interface HackTrack {
  id: string
  filename: string
  title: string
  image: { src: string; alt: string }
  bullets: [string, string]
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
      'Use natural language processing, computer vision, or machine learning to bring a new idea to life.',
    ],
    prizes: [
      { award: 'Best AI Project', details: 'Trophy & sponsor gift cards' },
      { award: 'Best ML Hack', details: 'Hardware & gadgets' },
    ],
  },
  {
    id: 'hardware',
    filename: 'hardware.txt',
    title: 'Hardware',
    image: { src: '/cake-factory.png', alt: 'Purble Place cake factory with a yellow delivery truck' },
    bullets: [
      'Build tools that make everyday life more accessible, inclusive, and independent.',
      'Explore assistive interfaces, personal wellbeing, or better ways to connect people with care.',
    ],
    prizes: [
      { award: 'Best Accessible Design', details: 'Trophy & sponsor gift cards' },
      { award: 'Best Health Hack', details: 'Hardware & gadgets' },
    ],
  },
  {
    id: 'special',
    filename: 'special.txt',
    title: 'Special Track',
    image: { src: '/purple-eye-shop.png', alt: 'Purble Place purple shop with blue eyes on its roof' },
    bullets: [
      'Turn a local challenge into a project that helps your community or the planet.',
      'Rethink energy, waste, education, or how we share the resources around us.',
    ],
    prizes: [
      { award: 'Best Community Impact', details: 'Trophy & sponsor gift cards' },
      { award: 'Best Green Hack', details: 'Hardware & gadgets' },
    ],
  },
]
