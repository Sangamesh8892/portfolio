# Website Flow

A general playbook for **building a new website** or **improving an existing one**, using a fixed toolkit of skills, MCP servers, libraries, reference galleries and colour themes.

**Who reads this:** Claude (or any coding agent) starting website work, and the owner of this toolkit.
**How to use it:** Read the whole file once at the start of a website task. Do Phase 0 every time. Then follow **Flow A** (new site) or **Flow B** (fix an existing site). Project-specific rules (CLAUDE.md, memory) always override this file.

---

## The toolkit at a glance

| Layer | Tool | Job, and only this job |
|---|---|---|
| Taste / direction | **Taste skill** (`design-taste-frontend`) | Anti-slop direction drawn from a large set of real professional sites. Sets the bar. |
| Design system + critique | **Impeccable** (`impeccable`) | Direction, DESIGN.md, critique, audit, polish. |
| Interaction polish | **Emil Kowalski skills** (`emil-design-eng` + the animation family) | Press/hover states, easing, durations, component feel. |
| De-slop existing UI | **Unslop** (`unslop`, heydamir) | Redesigns vibecoded/AI-looking interfaces. Flow B entry point. |
| Eyes | **Playwright MCP** | Screenshot references and our own pages. Verify in a real browser. |
| Smooth scroll | **Lenis** | Page scroll feel only. |
| Scroll/timeline animation | **GSAP** (+ ScrollTrigger, SplitText) | Scroll-driven scenes, text/image reveals, multi-step timelines. |
| Component motion | **Motion** (`motion` / framer-motion) | Enter/exit, layout, hover/press, AnimatePresence. |
| Ready components | **React Bits** | Professional animated components, copied in (not a dependency). |
| Glass | **liquid-glass-react** | Apple-style liquid glass. Accents only, never body layout. |
| Animation pack | *(name unclear in notes, see Open items)* | 50 animations, 19 free. |

---

## Phase 0: Setup (every task)

### 0.1 Check what's installed before installing anything

```powershell
Get-ChildItem "$env:USERPROFILE\.claude\skills" -Name   # global skills
Get-ChildItem ".claude\skills" -Name -ErrorAction SilentlyContinue  # project skills
```

Install only what's missing. **Read a skill's SKILL.md before installing it.** Skills run as instructions inside the agent. Ask the user before any install.

### 0.2 Skills

| Skill | Install (if missing) |
|---|---|
| Taste | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` |
| Impeccable | `npx skills add https://github.com/pbakaus/impeccable --skill impeccable` |
| Emil Kowalski | `npx skills add emilkowalski/skills` (installs `emil-design-eng`, `animate`, `choreograph`, `review-animations`, `improve-animations`, `remove-animations`, `find-animation-opportunities`, `gestures`, `mobile-native`, `apple-design`, `break-ui`, `animation-performance`, ...) |
| Unslop | `claude plugin install unslop --marketplace heydamir/unslop`, or clone `github.com/heydamir/unslop` and copy `skills/unslop` into `~/.claude/skills` and restart. Needs Playwright (and ffmpeg for videos). |

### 0.3 MCP

- **Playwright MCP** must be connected (`mcp__playwright__*` tools). If missing: `claude mcp add playwright -- npx @playwright/mcp@latest`.

### 0.4 Libraries (install per project, only when the design calls for them)

```bash
npm i lenis                     # smooth scroll; React: import { ReactLenis } from 'lenis/react'
npm i gsap @gsap/react          # all GSAP plugins (ScrollTrigger, SplitText...) ship in the free package
npm i motion                    # skip if framer-motion / motion already present
npm i liquid-glass-react        # only if the design uses glass
```

**React Bits** components are added one at a time from https://reactbits.dev. Choose the variant that matches the project (**JS** or TS, **Tailwind** or CSS). Use the shadcn CLI command shown on each component page, or copy the source. Never add the whole library.

---

## Phase 1: Brief

Before any design, get answers (from the user, or from the existing code) to:

1. **What is the site and who is it for?** (portfolio, SaaS, shop, cafe, agency, event, docs...)
2. **What should a visitor do?** (one primary action)
3. **New build or fix?** New goes to Flow A. Existing goes to Flow B.
4. **Stack** (Next.js / Vite / Astro / static HTML; JS or TS; Tailwind or CSS). Build on what the project already uses.
5. **Hard rules** from CLAUDE.md / memory. Example for this portfolio: keep the fluid cursor, buttons-only (no chat input), plain JS, centred landing.

Write the answers at the top of the project's `DESIGN.md` (Impeccable creates it in Phase 3).

---

## Flow A: New website

### A1. Direction: pick a theme and a feel

- Load **Taste** first. It sets the quality bar for every later step.
- Pick **one** theme from the Theme Library (below) that suits the brand. Pick by mood:
  - warm/editorial: 1 Cream/Orange, 5 Sage/Burgundy
  - bold/playful: 2 Navy/Pink
  - startup/tech: 3 Series A, 4 Electrify
  - premium/moody: 6 Forest/Crimson
- Browse **Refero Styles** (https://styles.refero.design) for 2–3 real sites in the same mood. Note their type scale, spacing and how the accent is used.
- Present the theme + 2–3 references to the user. **Get a yes before building.**

### A2. Gather references per section

Find 2–3 references per section from the galleries, then screenshot them with **Playwright MCP** into `design/refs/<section>/`:

| Section | Gallery |
|---|---|
| Navbar | Navbar Gallery |
| Hero | SuperHero / Supahero (hero sections) |
| Scroll / storytelling | *(Scroll gallery, name unclear, see Open items)* |
| CTA | CTA Gallery |
| Footer | Footer Design (https://footer.design) |
| Icons / 3D visuals | 3D Icons (https://3dicons.co) |
| Whole-site style | Refero Styles |

Rules: take **structure and rhythm** from references, never copy their content, branding or art. Write one line per reference saying what you're taking from it.

### A3. Design system

- Run **Impeccable** to produce `DESIGN.md`: tokens (colour from the chosen theme, type scale, spacing, radius, shadow), components, motion rules.
- Put tokens in CSS variables (see Theme Library). Tailwind v4: `@theme`. Plain CSS: `:root`.
- **In shadcn projects, never name your own tokens `--accent`, `--muted`, `--primary`, `--secondary`, `--card` or `--border`.** shadcn already defines them and one silently overrides the other. Use names like `--brand`, `--brand-ink`, `--ink-soft`, and point shadcn's `--background`/`--foreground` at yours.
- With a dev server running, don't save Playwright screenshots into the project folder: the file watcher recompiles, the page reloads mid-test, and hydration looks broken when it isn't.
- Give every colour a **role** (bg, surface, text, muted, accent, accent-contrast). Check text contrast is at least 4.5:1. Accent colours like hot pink / acid lime are for fills and highlights, **not body text on light backgrounds**.

### A4. Build

Order: layout and content first, then components, then motion last.

Where each component comes from, in order of preference:
1. Something the project already has.
2. **React Bits** (animated text, backgrounds, cards, galleries).
3. shadcn/ui primitives for plain UI (dialog, tooltip, drawer...).
4. **liquid-glass-react** for glass surfaces (nav pill, cards, CTA button). It renders fully only in Chromium; Safari/Firefox show no refraction. Always keep a `backdrop-filter: blur()` fallback that still looks right.
   - **Glass rule (learned the hard way):** no ancestor of a glass element may keep a `filter`, `opacity < 1`, `mask`, `clip-path`, `mix-blend-mode` or `will-change: filter/opacity` after its animation ends. Any of these makes the ancestor a *backdrop root*, and the glass inside stops blurring what's behind it. Entrance animations on glass parents animate only `opacity` + `transform`, with fill `backwards` (CSS), or with the final value removed after completion (Motion).
   - Glass needs something rich behind it (a 3D/gradient ground or photos). On a flat colour it just looks grey.
   - **Thick-glass edges (the visionpictures look), as built in this portfolio:**
     - Give each `.glass` element its own SVG filter built from a bevel displacement map (`src/lib/glass-map.js` + `GlassRuntime.jsx`). The backdrop bends only along the rounded edge and the middle stays clear.
     - Displace R, G and B at slightly different scales (1.0 / 0.9 / 0.8), then recombine with `screen`. That gives the rainbow fringe at the rim.
     - Don't use random-noise (`feTurbulence`) displacement. It wobbles the whole surface and turns blotchy on large panels.
     - To check the effect, put a striped pattern behind a probe element with the blur set to 0.
5. Hand-built, following DESIGN.md.

### A5. Motion

**One job per library. Never two libraries animating the same element.**

| Need | Use |
|---|---|
| Page scroll feel | Lenis (one instance at the root; connect to GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) |
| Scroll-driven scenes, pinned sections, text/image reveals | GSAP + ScrollTrigger / SplitText (`useGSAP` hook in React) |
| Component enter/exit, hover/press, layout, modals | Motion |
| Ready-made effects | React Bits / the animation pack |

Skills to drive it: **animate** (new motion), **choreograph** (groups/heroes/staggers), **emil-design-eng** (feel and polish), **gestures** (drag/swipe), **animation-performance** (jank). Always respect `prefers-reduced-motion`. Lenis and GSAP scenes turn off or simplify under reduced motion.

Restraint: one hero entrance + one or two signature moments per page. Everything else is quiet micro-interaction.

**Recipe: scroll story** (built for this portfolio, reusable):
- Sections carry `data-story="<name>"`. SmoothScroll (Lenis + ScrollTrigger) writes `{section, progress, scrolling}` to a tiny store (`src/lib/story-store.js`).
- One pinned section drives its own progress: stations light up, side groups reveal, and a glass droplet rides the track.
- Never dim a glass element with `opacity`. "Unlit" states change colour and tint instead.
- A pinned glass dock reads `scrolling` and eases down while the page moves, but stays clickable.

### A6. Quality gate (must pass before calling it done)

1. **Playwright** screenshots at 1440, 768 and 390 widths, in light and dark if both exist. Look at them.
2. **Impeccable** critique/audit against DESIGN.md.
3. **Taste** finish gate.
4. **review-animations** on all motion. **animation-performance** if anything stutters.
5. **mobile-native** pass (100vh, tap highlight, notch, hover-on-touch).
6. **break-ui** on data-driven components (long names, empty states).
7. Lighthouse / console clean: no errors, no layout shift from fonts or images.

Fix, re-screenshot, repeat until clean. Report what was checked and what's still open.

---

## Flow B: Improve an existing website

1. **Read first.** Read the codebase (use **graphify** if `graphify-out/` exists), CLAUDE.md and memory rules. List what must not change.
2. **Screenshot current state** with Playwright (same widths as A6) into `design/before/`.
3. **Diagnose:**
   - **Unslop**: find what looks AI-made/generic.
   - **Impeccable** audit: hierarchy, spacing, type, colour, consistency.
   - **improve-animations**: motion audit. **remove-animations** if it feels over-animated.
   - Check for overlapping animation libraries (e.g. framer-motion + GSAP + tsparticles all running). Assign each one job per the A5 table, or remove it.
4. **Present a prioritised fix list** to the user (biggest visible wins first). Get a yes.
5. **Fix** in small batches, re-theming with the Theme Library if the user wants a new palette. Pull section references (A2) only for sections being rebuilt.
6. **Quality gate** (A6). Show before/after screenshots side by side.

---

## Theme Library

Each theme gives three colours by role. Derive the rest (surface, muted, borders) from these with tints/shades; don't add new hues.

| # | Name | Background | Text / ink | Accent | Mood |
|---|---|---|---|---|---|
| 1 | Cream · Black · Burnt Orange | `#F3EFE3` | `#111111` | `#D9541E` | warm, editorial |
| 2 | Navy · White · Hot Pink | `#0F1B3D` | `#FFFFFF` | `#FF3D8B` | bold, playful |
| 3 | **Series A**: Charcoal · Sand · Electric Blue | `#1E1E1C` | `#D8CAB3` ⚠ | `#2F6BFF` | startup, confident |
| 4 | **Electrify**: Midnight · Cobalt · Acid Lime | `#030407` | `#155BC9` ⚠ (secondary) | `#D4FF24` | tech, high-energy |
| 5 | Sage Grey · Warm Cream · Deep Burgundy | `#E8D2B5` ⚠ (cream) | `#590907` | `#A5A79B` (sage) | soft, refined |
| 6 | Charcoal · Forest Green · Crimson | `#171717` | `#06110C` ⚠ (forest) | `#A31C1B` ⚠ | premium, moody |

⚠ = hex read from handwriting; confirm before shipping. Role assignment for themes 4–6 is a suggestion: Theme 4 text should be near-white (cobalt is a secondary surface/accent). Theme 6's forest `#06110C` is nearly black, so use it as a background tint, with light text.

Token template (plain CSS; for Tailwind v4 put the same names in `@theme`):

```css
:root {
  --bg: #F3EFE3;
  --ink: #111111;
  --accent: #D9541E;
  --accent-contrast: #FFFFFF; /* text on accent fills */
  --surface: color-mix(in oklab, var(--bg), var(--ink) 4%);
  --muted: color-mix(in oklab, var(--ink), var(--bg) 45%);
  --border: color-mix(in oklab, var(--ink), var(--bg) 85%);
}
```

---

## Non-negotiables

- Ask before installing anything; read skills before installing them.
- Get user approval of the direction (A1) and of the fix list (B4) before building.
- References give inspiration only. Never copy content, logos or art.
- One job per animation library. Respect reduced motion.
- Nothing is "done" without Playwright screenshots that were actually looked at.
- Project rules beat this playbook.

---

## Open items (from the handwritten notes; confirm with the user)

1. **Scroll reference site**: name unclear ("Scrolltale"? "Scrollable"?). Need the URL.
2. **Animation package**: "Gradient/Gradual reveal…, 50 animations, 19 free". Need the name/URL.
3. **SuperHero**: assumed to be the hero-section gallery *Supahero*. Confirm URL.
4. **Navbar Gallery / CTA Gallery**: confirm exact URLs.
5. **Uncertain hexes** marked ⚠ in the Theme Library.
