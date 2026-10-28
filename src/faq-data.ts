export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FAQContent {
  directory: string
  title: string
  introduction: string
  items: FAQItem[]
}

// Edit the FAQ copy here. Add, remove, or reorder items as needed.
// Keep each id unique. Answers are plain text; blank lines start new paragraphs.
// The introduction and attendance answer follow the supplied reference.
export const faqContent: FAQContent = {
  directory: String.raw`C:\HACKCWRU\FAQ`,
  title: 'FAQ',
  introduction:
    'HackCWRU will take place in person from February 13 through February 15, 2026. It will include 36 hours of hacking, events, speakers, and more.',
  items: [
    {
      id: 'attendance',
      question: 'Who can attend HackCWRU?',
      answer:
        'Anyone is welcome! If you are a student, hobbyist, or developer looking to build something amazing, we’d love to have you. No prior experience is required!',
    },
    {
      id: 'teams',
      question: 'Do I need a team? If so, how do teams work?',
      // Replace with confirmed team rules before publishing.
      answer: 'No. You do not need a team to apply or participate. Teams may have up to four members, and you will have a chance to meet other hackers at team formation events.',
    },
        {
      id: 'format',
      question: 'Is HackCWRU in person or virtual?',
      answer: 'HackCWRU 2026 will take place in person.',
    },
    {
      id: 'age',
      question: 'What is the age policy?',
      answer: 'There is no separate age minimum. HackCWRU is open to students who are currently matriculated at a college or university, whether they are in an undergraduate or graduate program.',
    },
    {
      id: 'why',
      question: 'Why should I attend HackCWRU?',
      answer: 'Beyond the learning opportunities and mentorship workshops, HackCWRU is a great place to meet other hackers who are as passionate and enthusiastic about building as you are. We will also have swag, prizes, and a few surprises for attendees.',
    },
    {
      id: 'cost',
      question: 'What is the cost?',
      answer: 'There is no cost to apply or participate in HackCWRU. We want to make the event accessible to everyone who is interested.',
    }
  ],
}
