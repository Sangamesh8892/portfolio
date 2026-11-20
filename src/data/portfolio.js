/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — the only file you need to edit to make the site yours.
 *
 *  Everything below is placeholder content. Search for "TODO" to find every
 *  value that still needs replacing. Images live in /public; placeholder.svg is
 *  used until you drop your own files in and update the paths here.
 *
 *  Cards an answer can show: 'about' | 'projects' | 'skills' | 'resume' |
 *  'contact' | 'fun' | 'availability'
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PLACEHOLDER = '/placeholder.svg';

/* ── Site & SEO ─────────────────────────────────────────────────────────── */
export const site = {
  title: 'Your Name — Portfolio', // TODO
  description: 'Interactive portfolio: ask me anything about my work.', // TODO
  url: 'https://example.com', // TODO: your domain
  keywords: ['Portfolio', 'Developer', 'Next.js', 'React'], // TODO
  twitterHandle: '@yourhandle', // TODO
};

/* ── Landing hero ───────────────────────────────────────────────────────── */
export const hero = {
  greeting: "Hey, I'm Your Name 👋", // TODO
  headline: 'Software Engineer', // TODO
  /** Giant faded word at the bottom of the landing page. */
  watermark: 'YourName', // TODO
  avatarImage: '/landing-memojis.png', // TODO: your avatar / memoji still
  /** Avatar loop played while "talking" in the chat (webm + mp4 fallback). */
  avatarVideoWebm: '/final_memojis.webm', // TODO
  avatarVideoMp4: '/final_memojis_ios.mp4', // TODO
};

/* ── About card ─────────────────────────────────────────────────────────── */
export const profile = {
  name: 'Your Name', // TODO
  subtitle: '00 years old', // TODO: age, role, or anything short
  location: 'City, Country', // TODO
  description:
    "Hey 👋\nI'm Your Name. Write two or three sentences about who you are, what you build, and what you care about.", // TODO
  photo: PLACEHOLDER, // TODO
  tags: ['Tag one', 'Tag two', 'Tag three'], // TODO
};

/* ── Skills card ────────────────────────────────────────────────────────── */
// icon: 'code' | 'cpu' | 'pen' | 'users' | 'sparkles'
export const skills = [
  // TODO: replace every group
  {
    category: 'Frontend',
    icon: 'code',
    items: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
  },
  {
    category: 'Backend & Systems',
    icon: 'cpu',
    items: ['Node.js', 'PostgreSQL', 'Docker', 'Git'],
  },
  {
    category: 'Design',
    icon: 'pen',
    items: ['Figma', 'Prototyping'],
  },
  {
    category: 'Soft Skills',
    icon: 'users',
    items: ['Communication', 'Problem-solving', 'Teamwork'],
  },
];

/* ── Projects carousel ──────────────────────────────────────────────────── */
// `cover` is the image on the carousel card; `images` show when it is opened.
export const projects = [
  // TODO: replace with your projects (add as many as you like)
  {
    title: 'Project One',
    category: 'Side Project',
    cover: PLACEHOLDER,
    date: '2025',
    description:
      'One paragraph on what this project is, the problem it solves, and your part in it.',
    techStack: ['Next.js', 'JavaScript'],
    links: [{ name: 'website', url: 'https://example.com' }],
    images: [{ src: PLACEHOLDER, alt: 'Project One screenshot' }],
  },
  {
    title: 'Project Two',
    category: 'Hackathon',
    cover: PLACEHOLDER,
    date: '2024',
    description: 'Describe the project here.',
    techStack: ['React', 'Node.js'],
    links: [],
    images: [{ src: PLACEHOLDER, alt: 'Project Two screenshot' }],
  },
  {
    title: 'Project Three',
    category: 'Open Source',
    cover: PLACEHOLDER,
    date: '2024',
    description: 'Describe the project here.',
    techStack: ['Python'],
    links: [],
    images: [],
  },
];

/* ── Resume card ────────────────────────────────────────────────────────── */
export const resume = {
  title: "Your Name's Resume", // TODO
  description: 'Role • Specialty', // TODO
  fileType: 'PDF',
  lastUpdated: 'Month 2025', // TODO
  fileSize: '0.5 MB', // TODO
  /** Drop your PDF in /public and point here. */
  downloadUrl: '/resume.pdf', // TODO
};

/* ── Contact card ───────────────────────────────────────────────────────── */
export const contact = {
  email: 'you@example.com', // TODO
  handle: '@yourhandle', // TODO
  socials: [
    // TODO: keep the ones you use
    { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { name: 'GitHub', url: 'https://github.com/' },
    { name: 'X', url: 'https://x.com/' },
  ],
};

/* ── Fun card (photo gallery) ───────────────────────────────────────────── */
export const fun = {
  title: 'Outside of code', // TODO
  intro: 'A sentence about your hobbies and what you do for fun.', // TODO
  photos: [
    // TODO
    { src: PLACEHOLDER, alt: 'Hobby photo', caption: 'Caption for this photo' },
    { src: PLACEHOLDER, alt: 'Hobby photo', caption: 'Caption for this photo' },
  ],
};

/* ── Availability card (what you're looking for) ────────────────────────── */
export const availability = {
  heading: 'Open to opportunities', // TODO
  status: 'Available', // TODO: e.g. "Available", "Open", "Booked until June"
  duration: 'Full-time · starting Month 2025', // TODO
  location: 'Remote or City', // TODO
  stack: ['JavaScript, React, Next.js', 'Node.js, PostgreSQL'], // TODO
  whatIBring: 'Two or three lines on what you bring to a team.', // TODO
  goal: 'One line on the kind of team or role you want next.', // TODO
};

/* ─────────────────────────────────────────────────────────────────────────
 *  SCRIPTED CHAT
 *  Every question a visitor can ask maps to one of these answers. A typed
 *  question picks the answer whose keywords it matches best; if none match,
 *  `fallbackAnswer` is shown. Replies support Markdown.
 *
 *  Each answer:
 *    id       unique name, used by quickQuestions below
 *    card     (optional) card shown above the reply, see the list at the top
 *    keywords lower-case words or phrases that route a typed question here
 *    reply    the text that gets "typed" out
 * ───────────────────────────────────────────────────────────────────────── */
export const answers = [
  // TODO: rewrite every reply in your own voice
  {
    id: 'about',
    card: 'about',
    keywords: [
      'who',
      'about',
      'yourself',
      'you are',
      'introduce',
      'background',
      'passion',
    ],
    reply:
      "That's me! A short, friendly intro goes here. What would you like to know next: projects, skills, or how to reach me?",
  },
  {
    id: 'projects',
    card: 'projects',
    keywords: [
      'project',
      'work',
      'built',
      'build',
      'portfolio',
      'proud',
      'working on',
    ],
    reply:
      'Here are a few things I have built. Tap a card to see the details. Which one should I tell you more about?',
  },
  {
    id: 'skills',
    card: 'skills',
    keywords: [
      'skill',
      'stack',
      'tech',
      'language',
      'framework',
      'know',
      'tools',
      'good at',
    ],
    reply:
      'These are the tools and skills I use most. Anything specific you want to dig into?',
  },
  {
    id: 'resume',
    card: 'resume',
    keywords: [
      'resume',
      'cv',
      'experience',
      'education',
      'school',
      'degree',
      'hire',
    ],
    reply: 'Here is my resume, click the card to download it.',
  },
  {
    id: 'contact',
    card: 'contact',
    keywords: [
      'contact',
      'reach',
      'email',
      'mail',
      'linkedin',
      'talk',
      'connect',
      'located',
      'where',
    ],
    reply:
      "The best way to reach me is by email. I usually reply within a day or two. Let's talk!",
  },
  {
    id: 'fun',
    card: 'fun',
    keywords: [
      'fun',
      'hobby',
      'hobbies',
      'crazy',
      'free time',
      'weekend',
      'sport',
    ],
    reply: 'When I am not coding, this is what I am up to.',
  },
  {
    id: 'availability',
    card: 'availability',
    keywords: [
      'available',
      'availability',
      'job',
      'internship',
      'opportunit',
      'looking for',
      'open to',
      'role',
    ],
    reply: "Here's what I'm looking for right now.",
  },
  {
    id: 'mac-or-pc',
    keywords: ['mac or pc', 'mac', 'windows', 'linux'],
    reply: 'A playful one-liner answer goes here. 😄',
  },
];

export const fallbackAnswer = {
  id: 'fallback',
  keywords: [],
  reply:
    "Good question! I don't have a scripted answer for that one yet. Try one of the quick questions below, or just email me.",
};

/* ── Question buttons ───────────────────────────────────────────────────── */
/** The five quick buttons (landing page + chat). `answerId` must exist above. */
export const quickQuestions = [
  {
    label: 'Me',
    answerId: 'about',
    question: 'Who are you?',
    color: '#329696',
    icon: 'laugh',
  },
  {
    label: 'Projects',
    answerId: 'projects',
    question: 'What are your projects?',
    color: '#3E9858',
    icon: 'briefcase',
  },
  {
    label: 'Skills',
    answerId: 'skills',
    question: 'What are your skills?',
    color: '#856ED9',
    icon: 'layers',
  },
  {
    label: 'Fun',
    answerId: 'fun',
    question: 'What do you do for fun?',
    color: '#B95F9D',
    icon: 'party',
  },
  {
    label: 'Contact',
    answerId: 'contact',
    question: 'How can I reach you?',
    color: '#C19433',
    icon: 'user-search',
  },
];

/** Questions in the "more" drawer, grouped by category. Highlighted ones get the dark style. */
export const questionDrawer = {
  highlighted: ['Who are you?', 'Can I see your resume?'],
  categories: [
    {
      id: 'me',
      name: 'Me',
      icon: 'user',
      questions: ['Who are you?', 'What are your passions?'],
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: 'briefcase',
      questions: ['Can I see your resume?', 'Are you available for work?'],
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: 'code',
      questions: ['What projects are you most proud of?'],
    },
    {
      id: 'skills',
      name: 'Skills',
      icon: 'graduation',
      questions: ['What are your skills?'],
    },
    {
      id: 'fun',
      name: 'Fun',
      icon: 'party',
      questions: ['What do you do for fun?', 'Mac or PC?'],
    },
    {
      id: 'contact',
      name: 'Contact & Future',
      icon: 'mail',
      questions: ['How can I reach you?', 'Where are you located?'],
    },
  ],
};
