# Portfolio

An interactive, chat-style portfolio. Visitors tap a question or type their own, and the avatar
"answers" with a typed-out reply and a rich card (projects, skills, resume, contact…).

It is **fully static**: there is no AI, no API key and no server. Every answer is scripted in one
content file, so hosting is free and nobody can run up a bill.

Theme and interaction design are based on [toukoum/portfolio](https://github.com/toukoum/portfolio).

## Make it yours

Everything a visitor sees lives in **[`src/data/portfolio.js`](src/data/portfolio.js)**. Search it
for `TODO`:

| Section | What it controls |
|---|---|
| `site` | Page title, description, SEO |
| `hero` | Landing greeting, headline, watermark word, avatar image + video |
| `profile`, `skills`, `projects`, `resume`, `contact`, `fun`, `availability` | The cards |
| `answers` | The scripted replies, which card each one shows, and the keywords that route a typed question to it |
| `fallbackAnswer` | What is shown when a typed question matches nothing |
| `quickQuestions`, `questionDrawer` | The question buttons and the "more questions" drawer |

Put your images and resume PDF in `public/` and point the paths at them. Until then,
`public/placeholder.svg` is used. The avatar files (`landing-memojis.png`, `final_memojis.webm`,
`final_memojis_ios.mp4`) are still the original author's and need replacing.

## Run

Requires Node.js 18+.

```bash
pnpm install   # or npm install
pnpm dev       # http://localhost:3000
```

## Build and deploy

```bash
pnpm build     # writes the static site to /out
```

Deploy `/out` to any static host: Vercel, Netlify, Cloudflare Pages, GitHub Pages.
