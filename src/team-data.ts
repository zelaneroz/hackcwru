export interface TeamMember {
  id: string
  /** Lower numbers appear first, from top left across each row. */
  order: number
  name: string
  position: string
  /** Plain-text bio; backtick strings support multiple sentences and line breaks. */
  description: string
  imagePath: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
}

// Replace the placeholder details and add optional profile URLs here.
// Use neutral portraits until member photos are supplied.
// Add as many sentences and paragraphs as needed inside each description's backticks.
// Blank lines separate paragraphs in the popup; .trim() removes outer blank lines.
export const teamMembers: TeamMember[] = [
  {
    id: 'member-01',
    order: 1,
    name: 'Ishika Mishra',
    position: 'Co-President',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/placeholder.svg',
  },
  {
    id: 'member-02',
    order: 2,
    name: 'Ana Izma',
    position: 'Co-President',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/placeholder.svg',
  },
  {
    id: 'member-03',
    order: 3,
    name: 'Ninjin Bilgee',
    position: 'Treasurer',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/ninjin.png',
  },
  {
    id: 'member-04',
    order: 4,
    name: 'Saniha Dsouza',
    position: 'Logistics',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/saniha.png',
  },
  {
    id: 'member-05',
    order: 5,
    name: 'Zelan Eroz Espanto',
    websiteUrl: 'https://zeespanto.com/',
    linkedinUrl: 'https://www.linkedin.com/in/zelanespanto/',
    githubUrl: 'https://github.com/zelaneroz',
    position: 'Web Developer',
    description: `
       Mabuhay! I'm Zee. I've been involved in various AI and design projects in industry and research settings, and I'm currently building Klariti and the CWRU AI Collective while volunteering as a designer for Head, Heart, and Hands.
       
       Born and raised in Dinagat Islands, Philippines, I love painting, writing, traveling, and diving into new tech rabbit holes (currently exploring embedded AI!). I'm happiest in unfamiliar places, meeting new people, and discovering different ways of seeing the world.
       
       My motto: “To find yourself, lose yourself.”
    `.trim(),
    imagePath: '/team/zelan.png',
  },
  {
    id: 'member-06',
    order: 6,
    name: 'Zijin Chen',
    position: 'Design',
    linkedinUrl: 'https://www.linkedin.com/in/zijin-chen-exe/',
    githubUrl: ' https://github.com/xiao-niao-himo',
    description: `
      Howdy! My name is Zijin (pronounced zee-jin), and I’m a junior at CWRU studying computer science and electrical engineering interested in manufacturing, controls, and embedded systems. I’m the designer for HackCWRU where I focus on designing tracks and prompts to excite our hackathon participants! In my free time, I enjoy listening to 2000s punk rock music and doodling in my notes.
    `.trim(),
    imagePath: '/team/zijin.png',
  },
  {
    id: 'member-07',
    order: 7,
    name: 'Blessing Masanga',
    position: 'PR/Marketing',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/Blessing.png',
  },
  {
    id: 'member-08',
    order: 8,
    name: 'Khang Luu',
    position: 'Outreach',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/khang.PNG',
  },
  {
    id: 'member-09',
    order: 9,
    name: 'Niti Baniya',
    position: 'Outreach',
    description: `
      lorem ipsum dolor sit amet
    `.trim(),
    imagePath: '/team/placeholder.svg',
  },
]

export const teamContact = {
  instagramUrl: 'https://www.instagram.com/hack_cwru/',
  linkedinUrl: 'https://www.linkedin.com/company/hackcwru',
  email: 'hackcwruteam@case.edu',
}
