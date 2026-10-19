export interface HackTrack {
  id: string
  filename: string
  title: string
  bullets: [string, string, string]
  prizes: { award: string; details: string }[]
}

// Preview content. Replace with confirmed event tracks and prizes before launch.
export const hackTracks: HackTrack[] = [
  {
    id: 'track1',
    filename: 'track1.txt',
    title: 'AI & Machine Learning',
    bullets: [
      'Develop intelligent agents, neural networks, or LLM-based solutions to solve modern problems.',
      'Use natural language processing, computer vision, or machine learning to bring a new idea to life.',
      'Challenge yourself with data analysis, automation, and smarter decision-making.',
    ],
    prizes: [
      { award: 'Best AI Project', details: 'Trophy & sponsor gift cards' },
      { award: 'Best ML Hack', details: 'Hardware & gadgets' },
    ],
  },
  {
    id: 'track2',
    filename: 'track2.txt',
    title: 'Health & Accessibility',
    bullets: [
      'Build tools that make everyday life more accessible, inclusive, and independent.',
      'Explore assistive interfaces, personal wellbeing, or better ways to connect people with care.',
      'Put people first: design with empathy and make your project useful to someone new.',
    ],
    prizes: [
      { award: 'Best Accessible Design', details: 'Trophy & sponsor gift cards' },
      { award: 'Best Health Hack', details: 'Hardware & gadgets' },
    ],
  },
  {
    id: 'track3',
    filename: 'track3.txt',
    title: 'Sustainability & Social Good',
    bullets: [
      'Turn a local challenge into a project that helps your community or the planet.',
      'Rethink energy, waste, education, or how we share the resources around us.',
      'Make a small change with a big possibility: show how your idea can create lasting impact.',
    ],
    prizes: [
      { award: 'Best Community Impact', details: 'Trophy & sponsor gift cards' },
      { award: 'Best Green Hack', details: 'Hardware & gadgets' },
    ],
  },
]
