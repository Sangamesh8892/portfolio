# Scroll story + 3D glass + glass dock — design

**Date:** 2026-11-21 · **Project:** portfolio (Next.js 15 static export, plain JS, Tailwind v4) · **Status:** approved 2026-11-21

## 1. Intent

The landing page stops being a menu of question tiles and becomes **one scroll story** about Sangameshwar and his main work:

1. who he is,
2. his MVP, the **HITL SAP Automation Platform** (the multi-agent pipeline with the FSD → TSD agent at its core),
3. his experience.

A **real-looking 3D glass lens** (reference: visionpictures.net "Agentic Liquid Glass", 3D section) travels through the story as "the agent". Quick facts (Stack, Certifications, Contact, Résumé, All questions) live in a **glass dock pinned to the bottom**, always clickable. Each one opens a **glass sheet** over the page.

**Why:** visitors (recruiters and engineers) should understand his work in one scroll, and the page itself should prove he builds polished, technical things.

## 2. Goals, non-goals, anti-goals

**Goals**
- The story reads in under a minute of scrolling. The MVP section explains the pipeline without any prior SAP knowledge.
- The glass looks like thick, refracting glass with rainbow edges, not a flat frosted card.
- Dock facts are reachable at any moment in 1 click.
- Works in light and dark (mercury toggle), on desktop and phone, and under reduced motion.

**Non-goals**
- No AI chat, no free-text input (standing rule).
- No CMS. Content stays in `src/data/portfolio.js`.
- No refraction of the HTML text itself: the 3D lens refracts the 3D scene only.

**Anti-goals (failure even if it "works")**
- Scroll-jacking that fights the user, or a story that can't be skimmed.
- Text sitting on busy 3D so it becomes hard to read.
- Invented facts: metrics, dates, employers or clients not given by him.
- Jank: the page must hold ~60 fps on a mid laptop and degrade gracefully on phones.

## 3. Constraints

- Static export (`output: 'export'`), plain JS, existing stack: Next 15, React 19, Tailwind v4, framer-motion 12, next-themes, three 0.170, vaul.
- Keep **FluidCursor unchanged** and global. Keep **buttons-only**. Keep the **mercury toggle**.
- Glass rule from the flow doc: no lingering `filter`/`opacity<1`/`mask`/`clip-path` on ancestors of DOM glass.
- Tokens are named `--brand`, `--brand-ink`, `--ink-soft`, `--em` (never shadcn names).

## 4. Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| Scroll engine | **A. Lenis + GSAP ScrollTrigger** | +2 deps (~45 kB). Reliable pinning and scrubbing; one timeline drives DOM and 3D. Named in the flow doc for this job. | **Chosen** (proposed, not objected to) |
| | B. Motion `useScroll` + CSS sticky | No new deps; hand-built pinning gets fiddly over a 4-screen sequence | Rejected |
| 3D glass | **Own glass in three.js** (screen-space refraction shader) | Free, fits the existing neural scene; refracts the 3D background only | **Chosen by user** |
| | Buy the $33 pack (a Claude Code skill) | Closest match, but paid and third-party code | Rejected by user |
| Dock action | **Glass sheet over the page** | Story stays in place; `/chat` no longer needed from the landing | **Chosen by user** |
| | Navigate to `/chat` | Today's behaviour | Rejected |
| Dock timing | **Always clickable, quieter while scrolling** | Never blocks access | **Chosen by user** |

## 5. The story (landing page `/`)

Screens are at 1440×900. "Lens" = the 3D glass object in the WebGL canvas, which sits behind all DOM.

| # | Section (id) | Height | DOM content | Lens |
|---|---|---|---|---|
| 0 | Hero (`#top`) | 1 screen | Memoji (glass ring), notice "GenAI engineer · AI agents for SAP", h1 "Hi, I'm {name}. I build *AI agents for SAP*", lead line, small "Scroll" cue | Big lens (disc), lower right, slow spin, tilts with the cursor |
| 1 | About (`#about`) | 1 screen | 2–3 sentences (from his summary), facts: TCS · Gen AI Developer · Bengaluru · B.E. CS 2025 · Claude-certified | Lens drifts to the left and rounds toward a sphere; text sits right |
| 2 | The MVP (`#work`) | **pinned, ~4 screens of scroll** | Title "HITL SAP Automation Platform". A pipeline of 5 stations: **User story → Functional spec → Technical spec (TSD agent) → ABAP code → Test cases**. Each station lights up as the lens reaches it, then shows a "Human checkpoint ✓" chip. A side column reveals in step: Grounding (consultant KB, naming + coding standards, SAP ADT) · Retrieval (FAISS + Pinecone, BM25 + semantic, rerank) · Infra (Azure Blob, Redis) · Models (SAP AI Core, Azure, GCP) · Outcome (80–90% accurate TSD drafts, quick edits) | Small lens travels station to station along the pipeline line, scrubbed by scroll |
| 3 | Experience (`#experience`) | 1–2 screens | Timeline: **TCS — Gen AI Developer, Apr 2026–present** (4 bullets condensed) · **Applied ML** — PyTorch model optimised for offline mobile (no date) · **B.E. Computer Science**, Jain College of Engineering and Technology, Hubballi, 2021–2025 | Lens stretches into a pill and slides down the timeline |
| 4 | Close (`#contact`) | ~0.6 screen | One line ("Let's build agents that ship.") + two buttons: Email me (opens Contact sheet), Download résumé | Lens settles centred, gently breathing; the dock grows to full size |

**Copy rules:** every fact comes from the LinkedIn PDF or his messages. Unknowns are `TODO` in `portfolio.js`, never invented.

**Reduced motion:** Lenis off (native scroll). No pinning: the MVP becomes a normal vertical list with all stations lit. The lens holds one pose per section (no scrubbing) and stays still.

**Phone (≤ 768px):** pipeline stations stack vertically and the lens travels down instead of across. Pin length drops to about 3 screens. The lens is smaller and kept off the text column.

## 6. The 3D glass (lens)

- Lives in the existing `neural-scene.js` scene as a new layer.
- **Rendering:** the neural scene (cores, graph, pulses) renders to a render target. A full-screen pass draws it. Then the lens renders with a **custom screen-space refraction shader**:
  - It samples that render target, offset by the refracted normal.
  - **Dispersion:** a separate IOR per colour channel gives the rainbow edges.
  - **Fresnel reflection** from a soft generated environment (three's `RoomEnvironment` via PMREM).
  - A **thick-rim term**: a brighter, more distorted edge to fake total internal reflection.
  - A slight **frost** option (blur by mip level).
- **Why custom:** three's built-in `transmission` ignores transparent objects, and the whole neural scene is transparent points and lines.
- **Geometry:** one high-resolution sphere, scaled per pose. Disc = (1.6, 1.6, 0.45), sphere = (1, 1, 1), small lens = (0.6, 0.6, 0.25), pill ≈ (2.2, 0.7, 0.5). Pose changes ease between section states and are scrubbed by scroll in the MVP.
- **Theme:** in dark, a cobalt/lime tint in the reflections. In light, neutral glass with a cobalt rim.
- **Budget:** one extra render target. DPR is capped at 1.75 (1.25 on phones). The lens only renders while visible (it always is) — revisit if perf fails.

**DOM glass upgrade** (nav, dock, sheets, chips) so it matches the lens:
- a thicker rim highlight,
- a subtle **chromatic edge**: a conic rainbow border, masked to a 1px rim, at low opacity,
- slightly stronger edge refraction.

## 7. Glass dock

- Fixed, bottom-centre, a glass pill. Items: **Stack · Certs · Contact · Résumé · All questions**, each with an icon and a label (icon-only under 400px).
- **While scrolling:** it scales to 0.94 and dims to about 85% (opacity on the dock's tint layer only, not on a glass ancestor). 200 ms after scroll stops, or at the page end, it returns to full size. It is always clickable, with a 44px minimum tap size.
- **Click** opens a **glass sheet** (vaul drawer, styled as glass), reusing the existing cards:
  - Stack → `skills` card
  - Certs → a certifications list (new small card)
  - Contact → `contact` card
  - Résumé → `resume` card
  - All questions → the 13 questions, grouped. Tapping one shows its scripted answer and card **inside the sheet**, using `SimplifiedChatView`.
- Esc and the drag handle close the sheet. Focus is trapped inside and returns to the dock button.

## 8. Navigation and other pages

- **Nav:**
  - mark (scrolls to top)
  - **About · Work · Experience** (smooth-scroll anchors via Lenis)
  - mercury toggle
  - **Email me** (opens the Contact sheet)
- `/chat` **stays working** for old deep links. Nothing on the landing links to it any more. *(Builder's call; revisit later.)*

## 9. Data changes (`src/data/portfolio.js`)

- `about`: summary sentences, facts list.
- `mvp`: name, stations (label, agent, what it does), side-column groups, outcome.
- `experience`: items (title, org, dates, bullets).
- `education`.
- `dock`: item order and labels.
- Update `certifications` (pending §11) and `profile.name` (pending §11).

## 10. Libraries

- Add `lenis` and `gsap` (+ `@gsap/react` for `useGSAP`).
- Lenis runs at the root (client layout component) and is wired to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and the gsap ticker).
- Scroll state reaches the 3D scene through a tiny shared store (`setStory({ section, progress })`) that the scene reads every frame.

## 11. Decisions from the user (2026-11-21)

1. **Name on the site:** keep **"Sangamesh"**.
2. **Certifications:** show all three: Claude Certified Architect – Professional, Claude Certified Developer – Foundations, AWS Certified Generative AI Developer – Professional.
3. **Email:** shown only through a **click-to-copy button** (Contact sheet and Close section). The address lives in `portfolio.js` and isn't printed as plain text or as a `mailto:` link. The button shows a "Copied" confirmation (sonner toast).
4. **Confidentiality:** naming **TCS** and the **HITL SAP Automation Platform** at this level of detail is fine.

**Status:** approved by the user on 2026-11-21.

## 12. Left to the builder

- Exact copy wording within the facts.
- Easing curves and pin lengths within the motion rules (strong ease-out, reduced-motion fallbacks).
- Icon choices.
- Whether the old hero tiles code is deleted or kept unused (delete).

## 13. Acceptance checks

- Playwright screenshots at 1440 / 768 / 390, light and dark, at each section and mid-MVP. Read every screenshot.
- Dock reachable and clickable at every scroll position. Sheets open and close with mouse, touch and keyboard.
- Reduced-motion pass: everything readable, nothing pinned or hidden.
- No horizontal scroll at 320. No console errors. `next build` passes. Frame rate is checked by eye in DevTools during the MVP scrub.

## Addendum (2026-11-21, after delivery)

The reference was meant for **glass UI elements**, not a 3D object. The 3D lens (§6, first half) is removed. Every `.glass` element now gets its own SVG filter built from a bevel displacement map (`src/lib/glass-map.js`): the backdrop bends only along the thick rounded edge, and R/G/B bend by different amounts to leave dispersion fringes at the rim. About uses a glass profile card. Experience is a timeline of glass cards. In the MVP, a glass droplet rides the progress track.
