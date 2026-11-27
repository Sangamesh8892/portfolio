/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — the only file you need to edit to make the site yours.
 *
 *  Search for "TODO" to find every value that still needs replacing. Images
 *  live in /public; placeholder.svg is used until you drop your own files in
 *  and update the paths here.
 *
 *  Cards an answer can show: 'about' | 'projects' | 'skills' | 'resume' |
 *  'contact' | 'fun' | 'availability'
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PLACEHOLDER = '/placeholder.svg';

/* ── Site & SEO ─────────────────────────────────────────────────────────── */
export const site = {
  title: 'Sangamesh — GenAI Developer & Architect',
  description:
    'GenAI developer and architect designing multi-agent systems, agentic RAG and human-in-the-loop workflows for enterprise delivery.',
  url: 'https://example.com', // TODO: your domain
  keywords: [
    'GenAI Developer',
    'GenAI Architect',
    'AI Agents',
    'Multi-agent systems',
    'Agentic RAG',
    'LangGraph',
    'Claude',
    'Portfolio',
  ],
  twitterHandle: '@yourhandle', // TODO
};

/* ── Landing hero ───────────────────────────────────────────────────────── */
export const hero = {
  greeting: "Hey, I'm Sangamesh 👋",
  headline: 'GenAI Developer & Architect',
  /** Landing hero (B2 centred) */
  notice: 'GenAI developer & architect',
  titleLine: "Hi, I'm Sangamesh.",
  titleLead: 'I build',
  titleEmphasis: 'AI agents that do real work',
  lead: 'Multi-agent systems grounded in enterprise context, with a human in the loop where quality matters.',
  facts: [
    { strong: '80–90%', text: 'accurate first drafts' },
    { strong: '3', text: 'AI certifications' },
    { strong: 'Multi-cloud', text: '· Azure · GCP · AWS' },
  ],
  /** Giant faded word at the bottom of the landing page. */
  watermark: 'Sangamesh',
  avatarImage: '/landing-memojis.png', // TODO: your avatar / memoji still
  /** Avatar loop played while "talking" in the chat (webm + mp4 fallback). */
  avatarVideoWebm: '/final_memojis.webm', // TODO
  avatarVideoMp4: '/final_memojis_ios.mp4', // TODO
};

/* ── Certifications ─────────────────────────────────────────────────────── */
// Dates are YYYY-MM-DD. verifyUrl opens the public Credly badge; null hides the verify button.
// pdf / image / thumb live in /public/certificates (images rendered from page 1 of the PDF).
export const certifications = [
  {
    name: 'Claude Certified Architect – Professional',
    issuer: 'Anthropic',
    level: 'Professional',
    issued: '2026-11-01',
    expires: '2027-11-01',
    verifyUrl: 'https://www.credly.com/badges/95d9aa76-255b-4a17-a29c-5a35a6ba1977',
    pdf: '/certificates/claude-architect-professional.pdf',
    image: '/certificates/claude-architect-professional.jpg',
    thumb: '/certificates/claude-architect-professional-thumb.jpg',
  },
  {
    name: 'Claude Certified Developer – Foundations',
    issuer: 'Anthropic',
    level: 'Foundations',
    issued: '2026-09-12',
    expires: '2027-09-12',
    verifyUrl: 'https://www.credly.com/badges/a3cdd74c-50b7-4e2f-8fa7-ef2072be1873',
    pdf: '/certificates/claude-developer-foundations.pdf',
    image: '/certificates/claude-developer-foundations.jpg',
    thumb: '/certificates/claude-developer-foundations-thumb.jpg',
  },
  {
    name: 'AWS Certified Generative AI Developer – Professional',
    issuer: 'AWS',
    level: 'Professional',
    issued: null, // TODO: issue date
    expires: null, // TODO: expiry date
    verifyUrl: null, // TODO: Credly link
  },
];

/* ── Scroll story: About ────────────────────────────────────────────────── */
export const about = {
  lead: 'I design multi-agent systems that take the slow, manual work out of enterprise delivery.',
  body: [
    'I build with LangGraph and LangChain, ground every agent in real enterprise context with agentic RAG, and keep a human in the loop where quality matters.',
    'Before agents, I did applied ML: I took a desktop-grade PyTorch model and made it run fully offline on a phone.',
  ],
  facts: [
    { label: 'Now', value: 'Gen AI Developer · TCS' },
    { label: 'Based in', value: 'Bengaluru' },
    { label: 'Studied', value: 'B.E. Computer Science, 2025' },
    { label: 'Certified', value: 'Claude Architect · AWS GenAI' },
  ],
};

/* ── Scroll story: agents I've built ────────────────────────────────────────
 * One pinned chapter per agent, in this order. Add an object to add a chapter.
 *
 *   name     agent name (the chapter title and its tab)
 *   status   e.g. 'In production', 'Pilot', 'In progress'; live: true adds the green dot
 *   lede     what it does. **word** renders bold
 *   client   who it was for (a description is fine while names can't be shown)
 *   domain   area, e.g. 'SAP FI'
 *   result   { big: headline number, text: what the number means }
 *   stack    tech used
 *   demo     the live demo on the right:
 *            'tsd' | 'edit' | 'route' | 'retrieval' | 'generic'
 *            'generic' builds an input → output demo from
 *            input: { label, text } and output: { label, lines: [...] }
 *
 * Anything written as [like this] shows as a dashed placeholder on the site.
 */
export const agents = [
  {
    id: 'fsd-tsd',
    name: 'FSD → TSD Agent',
    status: 'In production',
    live: true,
    lede: 'Give it a **functional spec** and it writes the **technical spec**, grounded in the consultant knowledge base, the client’s naming and coding standards, and live context from SAP ADT.',
    client: '[Client name]', // TODO
    domain: 'SAP delivery · [module]', // TODO
    result: { big: '80–90%', text: 'accurate first drafts' },
    stack: ['SAP ADT', 'SAP AI Core', 'Hybrid RAG', 'LLM agents'],
    demo: 'tsd',
  },
  {
    id: 'quick-edits',
    name: 'Quick Edits',
    status: '[Status]', // TODO
    lede: 'Ask for a change in plain words and it lands **in place** in seconds: targeted edits to a generated document, without regenerating the whole thing.',
    client: '[Client name]', // TODO
    domain: 'SAP delivery · documents',
    result: { big: '[x]', text: '[result, e.g. time saved per edit]' }, // TODO
    stack: ['LLM agents', 'Token optimisation'],
    demo: 'edit',
  },
  {
    id: 'model-layer',
    name: 'Multi-cloud Model Layer',
    status: '[Status]', // TODO
    lede: 'One way for agents to call models hosted on **SAP AI Core, Azure and Google Cloud**, including SAP AI Core authentication, so each task gets the right model.',
    client: '[Client name]', // TODO
    domain: 'Platform',
    result: { big: '3', text: 'model platforms behind one interface' },
    stack: ['SAP AI Core', 'Azure', 'GCP'],
    demo: 'route',
  },
  {
    id: 'retrieval',
    name: 'Retrieval Tuned for SAP',
    status: '[Status]', // TODO
    lede: 'Chunking built around **how SAP specs are written**, hybrid BM25 + semantic retrieval with reranking, and token budgets that keep context tight and costs down.',
    client: '[Client name]', // TODO
    domain: 'RAG · SAP documents',
    result: { big: '[x]', text: '[result, e.g. retrieval accuracy]' }, // TODO
    stack: ['BM25', 'Embeddings', 'Reranking', 'Chunking'],
    demo: 'retrieval',
  },
];

/* ── Scroll story: experience ───────────────────────────────────────────── */
export const experience = [
  {
    role: 'Gen AI Developer',
    org: 'Tata Consultancy Services',
    place: 'Bengaluru',
    dates: 'Apr 2026 – Present',
    bullets: [
      'Architected the HITL SAP Automation Platform with LangGraph and LangChain.',
      'Designed the agent pipeline from user story to ABAP and tests, with a human check after each step.',
      'Built agentic RAG on FAISS and Pinecone, with chunk reranking for accurate context.',
      'Used Azure Blob Storage and Redis Cache to hold outputs for review and speed up retrieval.',
    ],
  },
  {
    role: 'Applied ML',
    org: 'PyTorch model → offline mobile',
    place: '',
    dates: 'TODO', // TODO: when was this?
    bullets: ['Optimised a desktop-grade PyTorch model to run completely offline on a phone.'],
  },
];

export const education = {
  degree: 'B.E. Computer Science',
  school: 'Jain College of Engineering and Technology, Hubballi',
  dates: '2021 – 2025',
};


/* ── About card ─────────────────────────────────────────────────────────── */
export const profile = {
  name: 'Sangamesh',
  subtitle: 'GenAI Developer & Architect',
  location: 'Bengaluru, India',
  description:
    "Hey 👋\nI'm Sangamesh, a GenAI developer and architect. I design multi-agent systems that take the slow, manual parts out of enterprise work, grounded in real context with agentic RAG and checked by a human where it matters. My latest platform turns a user story into specs, code and tests.",
  photo: PLACEHOLDER, // TODO
  tags: ['AI agents', 'Multi-agent systems', 'RAG', 'Claude certified', 'AWS GenAI certified'],
};

/* ── Skills card ────────────────────────────────────────────────────────── */
// icon: 'code' | 'cpu' | 'pen' | 'users' | 'sparkles' | 'search' | 'cloud' | 'award'
export const skills = [
  {
    category: 'Agents & LLMs',
    icon: 'sparkles',
    items: [
      'Agent workflows',
      'Document generation',
      'Quick-edit loops',
      'Prompt engineering',
      'Token optimisation',
      'Claude',
    ],
  },
  {
    category: 'Retrieval',
    icon: 'search',
    items: [
      'Chunking strategies',
      'BM25',
      'Semantic search',
      'Hybrid retrieval',
      'Reranking',
    ],
  },
  {
    category: 'Platforms & Models',
    icon: 'cloud',
    items: [
      'SAP AI Core',
      'SAP AI Core auth',
      'SAP ADT',
      'Azure',
      'Google Cloud (GCP)',
      'AWS',
    ],
  },
  {
    category: 'Certifications',
    icon: 'award',
    items: certifications.map((c) => c.name),
  },
];

/* ── Projects carousel ──────────────────────────────────────────────────── */
// `cover` is the image on the carousel card; `images` show when it is opened.
export const projects = [
  {
    title: 'FSD → TSD Agent',
    category: 'SAP SDLC automation',
    cover: PLACEHOLDER, // TODO
    date: 'TODO',
    description:
      'A user gives the agent a Functional Spec (FSD) and gets back a Technical Spec (TSD). The agent grounds every section in a technical-consultant knowledge base, the client\'s naming standards and coding standards, and live object context pulled from SAP ADT. The first draft comes out 80–90% accurate, so consultants review and refine instead of writing from scratch.',
    techStack: ['SAP ADT', 'SAP AI Core', 'Hybrid RAG', 'LLM agents'],
    links: [],
    images: [],
  },
  {
    title: 'Quick Edits',
    category: 'SAP SDLC automation',
    cover: PLACEHOLDER, // TODO
    date: 'TODO',
    description:
      'Ask for a change in plain words and it lands in the document in seconds: targeted edits to the generated TSD without regenerating the whole thing.',
    techStack: ['LLM agents', 'Token optimisation'],
    links: [],
    images: [],
  },
  {
    title: 'Multi-cloud Model Layer',
    category: 'Platform',
    cover: PLACEHOLDER, // TODO
    date: 'TODO',
    description:
      'One way for the agents to call models hosted on SAP AI Core, Azure and Google Cloud, including SAP AI Core authentication.',
    techStack: ['SAP AI Core', 'Azure', 'GCP'],
    links: [],
    images: [],
  },
  {
    title: 'Retrieval Tuned for SAP',
    category: 'RAG',
    cover: PLACEHOLDER, // TODO
    date: 'TODO',
    description:
      'Chunking built around how SAP specs and standards are written, hybrid BM25 + semantic retrieval with reranking, and token budgets that keep context tight and costs down.',
    techStack: ['BM25', 'Embeddings', 'Reranking', 'Chunking'],
    links: [],
    images: [],
  },
];

/* ── Resume card ────────────────────────────────────────────────────────── */
export const resume = {
  title: "Sangamesh's Resume",
  description: 'GenAI Developer & Architect',
  fileType: 'PDF',
  lastUpdated: 'Month 2026', // TODO
  fileSize: '0.5 MB', // TODO
  /** Drop your PDF in /public and point here. */
  downloadUrl: '/resume.pdf', // TODO
};

/* ── Contact card ───────────────────────────────────────────────────────── */
export const contact = {
  /** Shown only through the copy button, never as text or a mailto: link. */
  email: 'sangamesh8894@gmail.com',
  handle: '', // optional, e.g. '@handle'
  socials: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sangameshwarbjalihal' },
    // TODO: add GitHub once you confirm the profile URL
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
  duration: 'Full-time', // TODO
  location: 'Remote or City', // TODO
  stack: [
    'AI agents, multi-agent systems, RAG, Claude',
    'Azure, GCP, AWS, SAP AI Core',
  ],
  whatIBring:
    'Agents that ship into real enterprise delivery: grounded in client standards, measured on accuracy, and cheap to run.', // TODO: check wording
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
  {
    id: 'about',
    card: 'about',
    keywords: ['who', 'about', 'yourself', 'you are', 'introduce', 'background', 'passion'],
    reply:
      "That's me! I'm a GenAI developer and architect. I design multi-agent systems that automate real enterprise work, like turning a functional spec into a technical spec. Want to see the agents, my stack, or my certifications?",
  },
  {
    id: 'projects',
    card: 'projects',
    keywords: ['project', 'work', 'built', 'build', 'portfolio', 'proud', 'working on', 'agent'],
    reply:
      'These are the agents and systems I have built. Tap a card for details, or ask **how the TSD agent works**.',
  },
  {
    id: 'tsd-agent',
    keywords: ['tsd', 'fsd', 'how does', 'how it works', 'technical spec', 'functional spec', 'adt'],
    reply: `Here's how the **FSD → TSD agent** works:

1. **Read the FSD** the user gives it and split it into the parts a TSD needs.
2. **Gather context**: the technical-consultant knowledge base, the client's naming and coding standards, and live object details from **SAP ADT**.
3. **Retrieve smart**: hybrid **BM25 + semantic** search, then a reranker, so only the most relevant chunks go into the prompt.
4. **Write the TSD** section by section, following the client's standards.
5. **Quick edits**: ask for a change and it's applied in place, with no full rewrite.

The first draft lands at about **80–90% accuracy**, so consultants review instead of starting from a blank page.`,
  },
  {
    id: 'retrieval',
    keywords: ['rag', 'retrieval', 'bm25', 'rerank', 'chunk', 'token', 'embedding', 'search'],
    reply:
      'Retrieval is where most of the accuracy comes from. I chunk documents around how SAP specs are actually written, retrieve with **BM25 + semantic** search together, then **rerank** before anything reaches the model. Token budgets keep context tight, which keeps answers sharp and costs down.',
  },
  {
    id: 'models',
    keywords: ['model', 'ai core', 'azure', 'gcp', 'google', 'llm', 'provider', 'cloud'],
    reply:
      'The agents run on models from **SAP AI Core**, **Azure** and **Google Cloud**, behind one layer that also handles SAP AI Core authentication. Picking the model per task keeps quality up and cost down.',
  },
  {
    id: 'certifications',
    card: 'skills',
    keywords: ['cert', 'certified', 'certification', 'claude', 'anthropic', 'aws'],
    reply: `My certifications:

${certifications.map((c) => `- **${c.name}** (${c.issuer})`).join('\n')}`,
  },
  {
    id: 'skills',
    card: 'skills',
    keywords: ['skill', 'stack', 'tech', 'language', 'framework', 'know', 'tools', 'good at'],
    reply:
      'This is my stack: agents and LLMs, retrieval, and the SAP and cloud platforms they run on. Anything you want to dig into?',
  },
  {
    id: 'resume',
    card: 'resume',
    keywords: ['resume', 'cv', 'experience', 'education', 'school', 'degree', 'hire'],
    reply: 'Here is my resume, click the card to download it.',
  },
  {
    id: 'contact',
    card: 'contact',
    keywords: ['contact', 'reach', 'email', 'mail', 'linkedin', 'talk', 'connect', 'located', 'where'],
    reply:
      "The best way to reach me is by email. I usually reply within a day or two. Let's talk!",
  },
  {
    id: 'fun',
    card: 'fun',
    keywords: ['fun', 'hobby', 'hobbies', 'crazy', 'free time', 'weekend', 'sport'],
    reply: 'When I am not building agents, this is what I am up to.', // TODO
  },
  {
    id: 'availability',
    card: 'availability',
    keywords: ['available', 'availability', 'job', 'internship', 'opportunit', 'looking for', 'open to', 'role'],
    reply: "Here's what I'm looking for right now.",
  },
  {
    id: 'mac-or-pc',
    keywords: ['mac or pc', 'mac', 'windows', 'linux'],
    reply: 'A playful one-liner answer goes here. 😄', // TODO
  },
];

export const fallbackAnswer = {
  id: 'fallback',
  keywords: [],
  reply:
    "Good question! I don't have a scripted answer for that one yet. Try one of the questions below, or just email me.",
};

/* ── Question buttons ───────────────────────────────────────────────────── */
/** The five quick buttons (landing page + chat). `answerId` must exist above. */
export const quickQuestions = [
  {
    label: 'Agents',
    hint: 'FSD → TSD & more',
    answerId: 'projects',
    question: 'What agents have you built?',
    color: '#155BC9',
    icon: 'bot',
  },
  {
    label: 'Me',
    hint: 'Who I am',
    answerId: 'about',
    question: 'Who are you?',
    color: '#2FA8A2',
    icon: 'laugh',
  },
  {
    label: 'Stack',
    hint: 'Agents, RAG, cloud',
    answerId: 'skills',
    question: 'What is your stack?',
    color: '#3D7BF0',
    icon: 'layers',
  },
  {
    label: 'Certs',
    hint: 'Claude · AWS',
    answerId: 'certifications',
    question: 'What are you certified in?',
    color: '#D0578F',
    icon: 'award',
  },
  {
    label: 'Contact',
    hint: "Let's talk",
    answerId: 'contact',
    question: 'How can I reach you?',
    color: '#C9971F',
    icon: 'user-search',
  },
];

/** Sticky footer dock: the same five as the hero tiles. Each opens its answer in a sheet. */
export const dock = quickQuestions.map(({ answerId, label, icon }) => ({ id: answerId, label, icon }));

/** Link that opens the chat on a question (and, optionally, a fixed answer). */
export const chatHref = (question, answerId) =>
  `/chat?query=${encodeURIComponent(question)}` +
  (answerId ? `&answer=${encodeURIComponent(answerId)}` : '');

/** Questions in the "more" drawer, grouped by category. Highlighted ones get the dark style. */
export const questionDrawer = {
  highlighted: ['How does the TSD agent work?', 'Can I see your resume?'],
  categories: [
    {
      id: 'me',
      name: 'Me',
      icon: 'user',
      questions: ['Who are you?', 'What are you certified in?'],
    },
    {
      id: 'agents',
      name: 'Agents',
      icon: 'bot',
      questions: [
        'What agents have you built?',
        'How does the TSD agent work?',
        'How do you tune retrieval?',
        'Which models do you use?',
      ],
    },
    {
      id: 'skills',
      name: 'Stack',
      icon: 'code',
      questions: ['What is your stack?'],
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: 'briefcase',
      questions: ['Can I see your resume?', 'Are you available for work?'],
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
