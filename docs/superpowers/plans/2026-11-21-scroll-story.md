# Scroll Story + 3D Glass + Glass Dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tile landing page with a scroll story: Hero → About → pinned MVP pipeline → Experience → Close. A refracting 3D glass lens travels the story, and a pinned glass dock opens glass sheets.

**Architecture:**
- **Scroll:** Lenis drives smooth scroll. GSAP ScrollTrigger pins the MVP section and writes `{section, progress}` into a tiny store.
- **Lens:** the three.js neural scene reads that store every frame to pose a lens. The lens is drawn with a screen-space refraction shader over a render target of the neural scene.
- **Dock and sheets:** the dock and nav open sheets through a second tiny store. Sheets are vaul drawers that reuse the existing cards.

**Tech Stack:** Next.js 15 (static export), React 19, plain JS, Tailwind v4, framer-motion 12, next-themes, three 0.170, vaul, sonner, **+ lenis, gsap, @gsap/react**. Tests use Node's built-in runner (`node --test`), with no new test dependency.

**Spec:** `docs/superpowers/specs/2026-11-21-scroll-story-design.md`

## Global Constraints

- Plain JavaScript only (`.js`/`.jsx`), no TypeScript.
- **FluidCursor unchanged** (`src/components/FluidCursor.jsx`, `src/hooks/use-FluidCursor.jsx`); it stays mounted in `layout.jsx`.
- Buttons only: no text inputs, no chat input, no AI features.
- Name on site: **"Sangamesh"**. Certifications shown: Claude Certified Architect – Professional; Claude Certified Developer – Foundations; AWS Certified Generative AI Developer – Professional.
- Email `sangamesh8894@gmail.com` appears only via a click-to-copy button: never as visible text, never as `mailto:`.
- Every fact comes from the spec. Unknowns are `TODO` in `portfolio.js`.
- CSS tokens: `--brand`, `--brand-ink`, `--ink-soft`, `--em`, `--bg`, `--ink`. Never define `--accent`, `--muted`, `--primary`, `--secondary`, `--card`, `--border`.
- Glass rule: no ancestor of `.glass` may keep `filter`, `opacity<1`, `mask`, `clip-path`, or `will-change: filter/opacity` after animating. Entrances animate `opacity`+`transform` with fill `backwards`.
- Motion: strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`. UI transitions ≤ 300 ms (sheets ≤ 500 ms). Hover gated by `(hover: hover) and (pointer: fine)`. Every animation has a `prefers-reduced-motion` variant.
- Tap targets ≥ 44px. No horizontal scroll at 320px.
- Don't save screenshots inside the project while `next dev` runs (it triggers reloads). Use `.playwright-mcp/` (git-ignored) only.

## Review Focus

1. **Reduced motion:** a visitor with reduced motion must see every MVP station and every section fully readable, with nothing pinned or hidden. Tested in Task 6 (pinning disabled, all stations `data-lit`).
2. **Dock during scroll:** the dock must stay clickable while the page scrolls fast. A click mid-scroll opens the sheet. Tested in Task 7.
3. **Copy email when the Clipboard API is missing or denied:** copy must fall back to `execCommand('copy')`, and the toast must say "Copied" only on success. Tested in Task 7 (`copyText`).
4. **Deep links and the back button:** reloading at `/#work` or `/#experience` must land on that section, and old `/chat?...` links must still work. Tested in Task 6.
5. **Theme switch mid-scroll:** toggling the theme while the MVP is pinned must not unpin it or reset progress. The lens retints only. Tested in Task 4 (scene keeps its pose across `setPalette`).

---

### Task 1: Story content in `portfolio.js`

**Files:**
- Modify: `src/data/portfolio.js`
- Test: `tests/data.test.mjs`

**Interfaces:**
- Produces, all exported from `src/data/portfolio.js`:
  - `about = { lead: string, body: string[], facts: { label, value }[] }`
  - `mvp = { name: string, intro: string, stations: { id, label, agent, does }[] /* exactly 5, in order */, groups: { title, items: string[] }[], outcome: string[] }`
  - `experience = { role, org, place, dates, bullets: string[] }[]`
  - `education = { degree, school, dates }`
  - `dock = { id: 'stack'|'certs'|'contact'|'resume'|'questions', label, icon }[]` (exactly 5, in that order)
  - `contact.email = 'sangamesh8894@gmail.com'`
  - `certifications`: the 3 certs (the AWS one is already present; add the Developer – Foundations name exactly).

- [ ] **Step 1: Write the failing test** `tests/data.test.mjs` using `node:test` + `node:assert/strict`. Import `../src/data/portfolio.js`. Assert:
  - `mvp.stations.map(s => s.label)` deep-equals `['User story', 'Functional spec', 'Technical spec', 'ABAP code', 'Test cases']`
  - `mvp.stations[2].agent` matches `/TSD/`
  - `dock.map(d => d.id)` deep-equals `['stack','certs','contact','resume','questions']`
  - `certifications.map(c => c.name)` includes all three exact names from Global Constraints
  - `experience[0]` has `org: 'Tata Consultancy Services'` and `dates: 'Apr 2026 – Present'`
  - `education.school === 'Jain College of Engineering and Technology, Hubballi'`
  - `JSON.stringify({ about, mvp, experience })` does not contain `'@'` (the email never leaks into story copy)
- [ ] **Step 2: Run** `node --test tests/` → expect FAIL (exports missing).
- [ ] **Step 3: Add the exports.** Copy comes from spec §5 and the LinkedIn facts:
  - **MVP groups:** Grounding (consultant KB, naming + coding standards, SAP ADT) · Retrieval (FAISS + Pinecone, BM25 + semantic, reranking) · Infra (Azure Blob Storage, Redis Cache) · Models (SAP AI Core, Azure, GCP)
  - **MVP outcome:** "80–90% accurate TSD drafts", "Quick edits applied in place", "Human checkpoint after every agent"
  - **Experience:** TCS role first; then `{ role: 'Applied ML', org: 'PyTorch model → offline mobile', dates: 'TODO', ... }`
  - Add `"test": "node --test tests/"` to `package.json` scripts.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Checkpoint.** Commit only if the user has OK'd commits: `feat(data): story, MVP, experience and dock content`.

### Task 2: Story store, sheet store and lens poses (pure logic)

**Files:**
- Create: `src/lib/story-store.js`, `src/lib/sheet-store.js`, `src/lib/lens-poses.js`
- Test: `tests/stores.test.mjs`, `tests/lens-poses.test.mjs`

**Interfaces:**
- `story-store.js`:
  - `getStory(): { section: 'hero'|'about'|'work'|'experience'|'close', progress: number /*0..1 within section*/, scrolling: boolean }`
  - `setStory(partial): void`
  - `subscribeStory(fn): () => void`
- `sheet-store.js`:
  - `openSheet(id: dock id): void`
  - `closeSheet(): void`
  - `getSheet(): string|null`
  - `subscribeSheet(fn): () => void`
  - `useSheet(): [id|null, openSheet, closeSheet]` (React hook via `useSyncExternalStore`, in the same file)
- `lens-poses.js`:
  - `POSES: Record<section, { pos: [x,y,z], scale: [x,y,z], rot: [x,y,z] }>`
  - `poseFor(section, progress, { narrow: boolean }): { pos, scale, rot }`
  - In `'work'` the lens lerps across the 5 station x-positions as `progress` goes 0→1. When `narrow` is true it moves along y instead. Other sections return their pose, blended toward the next section's pose over `progress` 0.8→1.
  - **Pose values (world units, camera z=10):**
    - hero: pos (3.2, −1.2, 1), scale (1.6, 1.6, 0.45)
    - about: pos (−3.4, 0, 1), scale (1.1, 1.1, 1)
    - work: scale (0.6, 0.6, 0.25), y −0.2, x from −4.4 to 4.4
    - experience: pos (−4.2, 0, 1), scale (2.2, 0.7, 0.5)
    - close: pos (0, 0.4, 1), scale (1.2, 1.2, 0.5)

- [ ] **Step 1: Write failing tests**
  - Stores: `setStory({progress:.5})` keeps `section` and notifies subscribers once. The unsubscribe stops calls. `openSheet('certs')` then `getSheet() === 'certs'`, and `closeSheet()` → `null`.
  - Poses: `poseFor('work',0,{narrow:false}).pos[0] === -4.4`; `poseFor('work',1,…).pos[0] === 4.4`; `poseFor('work',.5,{narrow:true}).pos[0] === 0` and its y lies between the stations' top and bottom; `poseFor('hero',0.9,…)` lies strictly between the hero and about positions; every returned value is finite for `progress` in [−1, 2] (clamped).
- [ ] **Step 2: Run** `npm test` → FAIL.
- [ ] **Step 3: Implement** the three modules. They are plain objects plus a Set of listeners, and `useSyncExternalStore` for `useSheet`.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Checkpoint.**

### Task 3: Smooth scroll (Lenis + GSAP) and story tracking

**Files:**
- Create: `src/components/story/SmoothScroll.jsx` (client)
- Modify: `src/app/layout.jsx` (wrap `<main>` content), `package.json` (deps)

**Interfaces:**
- Consumes: `setStory`.
- Produces:
  - `scrollToId(id: string): void`, exported from `SmoothScroll.jsx`. It uses `lenis.scrollTo('#'+id, { offset: -80 })`, or `element.scrollIntoView` when Lenis is off.
  - Sections opt in to tracking with `data-story="hero|about|work|experience|close"`. SmoothScroll creates one ScrollTrigger per `[data-story]` (`start: 'top center', end: 'bottom center'`) and writes `section` + `progress`. Lenis `scroll` events toggle `scrolling` (true on scroll, false 180 ms after the last event).

- [ ] **Step 1:** `npm install lenis gsap @gsap/react` → verify `package.json` lists all three.
- [ ] **Step 2:** Implement `SmoothScroll`:
  - Lenis `{ lerp: 0.1 }` + `gsap.registerPlugin(ScrollTrigger)` + `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` + `gsap.ticker.lagSmoothing(0)`.
  - **Skip Lenis entirely** under `prefers-reduced-motion` (native scroll; ScrollTriggers still update the store).
  - Destroy everything on unmount.
  - On mount, if `location.hash` is set, call `scrollToId(hash.slice(1))` after one frame.
- [ ] **Step 3: Verify** with `npm run dev` and Playwright:
  - scroll the page → `getStory().section` changes (`window.__story` debug getter, dev only)
  - load `/#experience` → the viewport starts at that section
- [ ] **Step 4: Checkpoint.**

### Task 4: 3D glass lens in the neural scene

**Files:**
- Modify: `src/lib/neural-scene.js`
- Create: `src/lib/glass-lens.js`
- Modify: `src/lib/theme-palettes.js` (add `lensTint`, `lensRim` per theme)

**Interfaces:**
- Consumes: `getStory()`, `poseFor()`.
- Produces: `createGlassLens(renderer, { palette }) → { mesh, setPalette(p), update(dt, pose, pointer), render(sceneTexture) , dispose() }` in `glass-lens.js`.

The shader is the one algorithm the tests don't pin down:

```glsl
// fragment, per pixel of the lens (view-space normal N, view dir V, screen uv)
float fres = pow(1. - max(dot(N, V), 0.), 3.);
vec2 base = N.xy * uThickness;               // refraction offset
vec3 col;                                    // dispersion: one IOR per channel
col.r = texture(uScene, uv + base * (1. - 1./uIorR)).r;
col.g = texture(uScene, uv + base * (1. - 1./uIorG)).g;
col.b = texture(uScene, uv + base * (1. - 1./uIorB)).b;
float rim = smoothstep(.55, 1., 1. - abs(dot(N, V)));   // thick-rim "TIR" band
col = mix(col, texture(uScene, uv - base * 2.2).rgb, rim * .6) + uRimColor * rim * .35;
col += envReflect(reflect(-V, N)) * fres * .6 + spec(N, V) ;
```

Uniform values: `uIorR 1.44, uIorG 1.47, uIorB 1.52, uThickness 0.09`.

- [ ] **Step 1:**
  - **Rendering:** the neural scene renders into a `WebGLRenderTarget` sized to the drawing buffer (resized with the canvas). A full-screen quad draws that target to the screen, then the lens mesh renders on top with the shader above.
  - **Environment:** `RoomEnvironment` + `PMREMGenerator` (`three/examples/jsm/environments/RoomEnvironment.js`).
  - **Geometry:** `SphereGeometry(1, 96, 64)`.
- [ ] **Step 2:** Each frame, compute `poseFor(story.section, story.progress, {narrow: innerWidth < 768})` and ease the mesh toward it (`lerp 0.08`; snap under reduced motion). Add the pointer tilt from the existing `ptr` (±0.25 rad). Add a slow spin in the hero pose only.
- [ ] **Step 3:** `setPalette` retints the lens rim and tint without touching the pose. Lower the DPR cap to 1.25 when `innerWidth < 768`.
- [ ] **Step 4: Verify** with Playwright at 1440 dark, then light:
  - the hero lens shows rainbow edges and a refracted core behind it
  - toggle the theme while scrolled into `#work` → the pose is unchanged (compare the lens bounding position via the `window.__lensPos` dev getter before and after)
- [ ] **Step 5:** `npx next build` → passes. Checkpoint.

### Task 5: DOM glass upgrade (thick rim + chromatic edge)

**Files:**
- Modify: `src/app/site.css`

- [ ] **Step 1:** Add the rim to `.glass`: a `::after`-layered `conic-gradient(from 210deg, #ff5f6d33, #ffc37133, #47ffb033, #3a78ff33, #c86bff22, #ff5f6d33)`, masked to a 1.25px ring with `mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)` and `padding: 1.25px`, plus a stronger inner top highlight. Raise `#liquid` displacement `scale` from 46 to 60 in `GlassRuntime.jsx`. Note: the mask sits on the glass element's own pseudo-element, not on an ancestor, so the glass rule holds.
- [ ] **Step 2: Verify** with screenshots of the nav and the dock in both themes: the rim is visible but subtle (≤ 20% opacity), and the text contrast is unchanged.
- [ ] **Step 3: Checkpoint.**

### Task 6: Story sections on the landing page

**Files:**
- Create: `src/components/story/Hero.jsx`, `About.jsx`, `MvpPipeline.jsx`, `Experience.jsx`, `Close.jsx`, `src/components/story/story.css` (imported by `site.css`)
- Modify: `src/app/page.jsx` (compose the sections; remove the tiles, facts strip and question count), `src/components/site/SiteNav.jsx`

**Interfaces:**
- Consumes: Task 1 data, `scrollToId`, `openSheet`, `setStory` (via `[data-story]`).
- Produces: section ids `top`, `about`, `work`, `experience`, `contact`.
- `MvpPipeline` renders 5 `.station` elements with `data-station={index}` and toggles `data-lit` as progress passes `i/5`.

- [ ] **Step 1: Hero.** The current hero minus the tiles and facts, plus a "Scroll" cue (a chevron with a gentle 2s loop, static under reduced motion).
  - **Nav:** About · Work · Experience call `scrollToId`. **Email me** → `openSheet('contact')`. Mark → `scrollToId('top')`.
- [ ] **Step 2: About.** Two columns from 1024px up (an empty left column where the lens sits, text on the right); stacked below that. The facts render as glass chips.
- [ ] **Step 3: MvpPipeline.**
  - **Pinning:** `useGSAP` creates a ScrollTrigger: `pin: true`, `end: '+=300%'` (`'+=200%'` below 768px), `scrub: 0.6`, `onUpdate: self => setStory({ section:'work', progress: self.progress })`.
  - **Stations:** five stations sit on one line (a column below 768px). A station gets `data-lit` once `progress ≥ i/5`, and its "Human checkpoint ✓" chip appears at `progress ≥ (i+0.6)/5`.
  - **Side column:** the four groups and the outcome reveal one per 20% of progress.
  - **Reduced motion:** no pin, and every station is `data-lit` from the start.
- [ ] **Step 4: Experience.** A vertical timeline: the TCS role with its 4 bullets condensed to one line each, then Applied ML, then Education.
- [ ] **Step 5: Close.** The line "Let's build agents that ship." with two buttons: **Copy email** (`CopyEmailButton` from Task 7) and **Résumé** (`openSheet('resume')`).
- [ ] **Step 6: Verify** with Playwright at 1440 / 768 / 390 in both themes:
  - a screenshot at each section and at MVP progress 0.1 / 0.5 / 0.95 (`window.scrollTo` + wait 800 ms)
  - with `emulateMedia({ reducedMotion: 'reduce' })`: the MVP isn't pinned (`getComputedStyle(pinSpacer)` absent) and all 5 stations have `data-lit`
  - `/#work` loads at the MVP
  - `/chat?query=Who%20are%20you%3F&answer=about` still renders the about card
  - `scrollWidth === innerWidth` at 320px
- [ ] **Step 7:** `npx next build` passes. Checkpoint.

### Task 7: Glass dock, sheets and copy-email

**Files:**
- Create: `src/components/dock/GlassDock.jsx`, `DockSheet.jsx`, `CertsCard.jsx`, `QuestionsPanel.jsx`, `CopyEmailButton.jsx`, `src/lib/copy-text.js`, `src/components/dock/dock.css`
- Modify: `src/app/page.jsx` (mount the dock and the sheet)
- Test: `tests/copy-text.test.mjs`

**Interfaces:**
- Consumes: `dock`, `contact.email`, `certifications`, `questionDrawer`, `findAnswer`/`getAnswerById`, `SimplifiedChatView`, `useSheet`, `getStory().scrolling`.
- Produces: `copyText(text: string, env = globalThis): Promise<boolean>`. It tries `env.navigator.clipboard.writeText`, then falls back to a hidden textarea + `env.document.execCommand('copy')`, and returns `false` if both fail.

- [ ] **Step 1: Write failing tests** for `copyText`:
  - with a clipboard stub that resolves → `true` and the stub got the text
  - with a clipboard that rejects plus an `execCommand` stub returning `true` → `true`
  - with neither → `false`
- [ ] **Step 2: Run** `npm test` → FAIL. **Step 3:** Implement `copy-text.js`. **Step 4:** `npm test` → PASS.
- [ ] **Step 5: GlassDock.**
  - **Layout:** fixed bottom-centre glass pill, `bottom: max(16px, env(safe-area-inset-bottom))`, five 44px-tall buttons with lucide icons (Layers, Award, Mail, FileText, MessagesSquare) and labels; icon-only under 400px.
  - **While `scrolling`:** `transform: scale(.94)` and its tint layer at `opacity .85` (on the inner tint span, not the glass root), 200 ms ease-out. It is always clickable.
- [ ] **Step 6: DockSheet.**
  - **Drawer:** a vaul `Drawer.Root` controlled by `useSheet`, with a glass content panel (`max-height: 85dvh`, radius 28px top).
  - **Contents by id:** `stack` → `<Skills/>`, `certs` → `<CertsCard/>`, `contact` → `<Contact/>` + `<CopyEmailButton/>`, `resume` → `<Resume/>`, `questions` → `<QuestionsPanel/>`. QuestionsPanel lists the grouped questions; tapping one shows `<SimplifiedChatView reply={{ card, text }}/>` with a "← All questions" back button.
  - **Accessibility:** Esc closes; focus returns to the triggering dock button.
- [ ] **Step 7: CopyEmailButton.** Its label is "Copy email". On click it awaits `copyText(contact.email)`, then shows a sonner toast: **"Email copied"** on success, or **"Couldn't copy, it's {email}"** on failure (the only place the address is shown). It never renders `mailto:`.
- [ ] **Step 8: Verify** with Playwright:
  - each dock item opens the right sheet at 1440 and 390, and Esc closes it
  - start a fast `window.scrollBy` loop, click Certs mid-scroll → the sheet opens
  - grep the built HTML in `out/` for `mailto:` and the plain address → none
- [ ] **Step 9:** `npm test` and `npx next build` pass. Checkpoint.

### Task 8: Final pass

**Files:**
- Modify: `design/website_Flow.md` (add the lens and scroll-story recipe to Flow A)
- Modify: memory notes (project state)

- [ ] **Step 1: Run the full quality gate from the flow doc (A6)** at 1440 / 768 / 390, light and dark, reduced motion, 320px overflow, console clean, `npx next build`, `npm test`. Fix what fails.
- [ ] **Step 2:** Check by eye in DevTools that the MVP scrub holds ~60 fps on desktop. If not, lower the lens sphere segments to 64×48 and the render target to 0.75× DPR.
- [ ] **Step 3:** Report to the user: what's verified, what's left for them to feel-check (scroll speed, lens drift, dock shrink), and the open TODOs (dates for Applied ML, résumé PDF, project images).
