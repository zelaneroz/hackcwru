export interface TeamMember {
  id: string
  /** Lower numbers appear first, from top left across each row. */
  order: number
  name: string
  position: string
  description: string
  imagePath: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
}

// Replace the placeholder details and add optional profile URLs here.
// The final two members use neutral portraits until their photos are supplied.
export const teamMembers: TeamMember[] = [
  { id: 'member-01', order: 1, name: 'Ishika Mishra', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/placeholder.svg' },
  { id: 'member-02', order: 2, name: 'Ana Izma', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/placeholder.svg' },
  { id: 'member-03', order: 3, name: 'Ninjin Bilgee', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/ninjin.png' },
  { id: 'member-04', order: 4, name: 'Saniha Lastname', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/saniha.png' },
  { id: 'member-05', order: 5, name: 'Zelan Espanto', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/zelan.png' },
  { id: 'member-06', order: 6, name: 'Zijin Lastname', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/zijin.png' },
   { id: 'member-07', order: 7, name: 'Blessing Masanga', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/Blessing.png' },
  { id: 'member-08', order: 8, name: 'Khang lastname', position: 'position', description: 'lorem ipsum dolor sit amet', imagePath: '/team/khang.PNG' },
]

export const teamContact = {
  instagramUrl: 'https://www.instagram.com/hack_cwru/',
  linkedinUrl: 'https://www.linkedin.com/company/hackcwru',
  email: 'hackcwruteam@case.edu',
}
