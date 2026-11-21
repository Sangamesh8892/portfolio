# Graph Report - portfolio  (2026-11-21)

## Corpus Check
- 95 files · ~43,654 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 6, (none) 2)

## Summary
- 565 nodes · 1211 edges · 37 communities (20 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e58e7c9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- app/page.jsx
- react
- useFluidCursor
- tooltip.jsx
- useFluidCursor
- core-poses.js
- dependencies
- devDependencies
- Website Flow
- components.json
- portfolio.js
- three
- bg3d.js
- layout.jsx
- eslint.config.mjs
- scripts
- next.config.ts
- vercel.json
- CertsCard.jsx
- compilerOptions
- Scroll story + 3D glass + glass dock — design
- shadcn
- @tsparticles/engine
- vaul
- @radix-ui/react-dialog
- @radix-ui/react-scroll-area
- @radix-ui/react-separator
- postcss.config.mjs
- gsap
- lenis
- @radix-ui/react-avatar
- @radix-ui/react-icons@^1.3.2
- sonner
- @tsparticles/slim

## God Nodes (most connected - your core abstractions)
1. `cn()` - 62 edges
2. `react` - 41 edges
3. `useFluidCursor()` - 41 edges
4. `useFluidCursor()` - 39 edges
5. `framer-motion` - 17 edges
6. `lucide-react` - 17 edges
7. `Scroll story + 3D glass + glass dock — design` - 15 edges
8. `Chat()` - 14 edges
9. `openSheet()` - 12 edges
10. `SimplifiedChatView()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Review Focus` --references--> `copyText()`  [INFERRED]
  docs/superpowers/plans/2026-11-21-scroll-story.md → src/lib/copy-text.js
- `Task 7: Glass dock, sheets and copy-email` --references--> `copyText()`  [INFERRED]
  docs/superpowers/plans/2026-11-21-scroll-story.md → src/lib/copy-text.js
- `Task 7: Glass dock, sheets and copy-email` --references--> `findAnswer()`  [INFERRED]
  docs/superpowers/plans/2026-11-21-scroll-story.md → src/lib/scripted-chat.js
- `Task 7: Glass dock, sheets and copy-email` --references--> `getAnswerById()`  [INFERRED]
  docs/superpowers/plans/2026-11-21-scroll-story.md → src/lib/scripted-chat.js
- `Task 4: 3D glass lens in the neural scene` --references--> `getStory()`  [INFERRED]
  docs/superpowers/plans/2026-11-21-scroll-story.md → src/lib/story-store.js

## Import Cycles
- None detected.

## Communities (37 total, 17 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (54): class-variance-authority, @radix-ui/react-slot, react, AnimatedShinyText(), ICONS, Skills(), Avatar(), AvatarFallback() (+46 more)

### Community 1 - "app/page.jsx"
Cohesion: 0.08
Nodes (43): Global Constraints, Review Focus, Scroll Story + 3D Glass + Glass Dock Implementation Plan, Task 1: Story content in `portfolio.js`, Task 2: Story store, sheet store and lens poses (pure logic), Task 3: Smooth scroll (Lenis + GSAP) and story tracking, Task 4: 3D glass lens in the neural scene, Task 5: DOM glass upgrade (thick rim + chromatic edge) (+35 more)

### Community 2 - "react"
Cohesion: 0.16
Nodes (15): AnimatedChevron(), CategorySection(), HelperBoost(), ICONS, QuestionItem(), AllProjects(), BlurImage(), Card() (+7 more)

### Community 3 - "useFluidCursor"
Cohesion: 0.09
Nodes (32): useFluidCursor(), addKeywords(), applyInputs(), calcDeltaTime(), clickSplat(), compileShader(), correctDeltaX(), correctDeltaY() (+24 more)

### Community 4 - "tooltip.jsx"
Cohesion: 0.71
Nodes (5): ButtonWithTooltip, Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 5 - "useFluidCursor"
Cohesion: 0.09
Nodes (32): useFluidCursor(), addKeywords(), applyInputs(), calcDeltaTime(), clickSplat(), compileShader(), correctDeltaX(), correctDeltaY() (+24 more)

### Community 6 - "core-poses.js"
Cohesion: 0.15
Nodes (16): clamp01(), CORE_POSES, corePose(), DEFAULT_TRACK, easeCore(), lerp(), ORDER, smooth() (+8 more)

### Community 7 - "dependencies"
Cohesion: 0.07
Nodes (28): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, framer-motion@^12.5.0, @gsap/react@^2.1.2, @lordicon/react@^1.10.1, lucide-react@^0.483.0, @radix-ui/react-slot@^1.1.2 (+20 more)

### Community 8 - "devDependencies"
Cohesion: 0.11
Nodes (24): devDependencies, eslint@^9.22.0, eslint-config-next@15.2.3, eslint-config-prettier@^10.1.1, eslint-plugin-prettier@^5.2.3, eslint-plugin-tailwindcss@^3.18.0, prettier@^3.5.3, prettier-plugin-tailwindcss@^0.6.11 (+16 more)

### Community 9 - "Website Flow"
Cohesion: 0.10
Nodes (19): 0.1 Check what's installed before installing anything, 0.2 Skills, 0.3 MCP, 0.4 Libraries (install per project, only when the design calls for them), A1. Direction: pick a theme and a feel, A2. Gather references per section, A3. Design system, A4. Build (+11 more)

### Community 10 - "components.json"
Cohesion: 0.10
Nodes (20): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+12 more)

### Community 11 - "portfolio.js"
Cohesion: 0.06
Nodes (49): next@15.1.9, Build and deploy, Make it yours, Portfolio, Run, framer-motion, lucide-react, next (+41 more)

### Community 12 - "three"
Cohesion: 0.20
Nodes (6): motion@^12.23.0, @radix-ui/react-collapsible@^1.1.3, three@^0.170.0, motion, @radix-ui/react-collapsible, three

### Community 13 - "bg3d.js"
Cohesion: 0.40
Nodes (3): col(), SCENES, start()

### Community 14 - "layout.jsx"
Cohesion: 0.13
Nodes (17): next-themes@^0.4.6, next-themes, metadata, outfit, RootLayout(), viewport, FluidCursor(), channel() (+9 more)

### Community 15 - "eslint.config.mjs"
Cohesion: 0.22
Nodes (6): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc@^3, @eslint/eslintrc

### Community 16 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 19 - "CertsCard.jsx"
Cohesion: 0.25
Nodes (10): CertDetail(), CertList(), CertsCard(), slug(), SPRING, VerifyLink(), BorderBeam(), credentialStatus() (+2 more)

### Community 20 - "compilerOptions"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

### Community 21 - "Scroll story + 3D glass + glass dock — design"
Cohesion: 0.12
Nodes (15): 10. Libraries, 11. Decisions from the user (2026-11-21), 12. Left to the builder, 13. Acceptance checks, 1. Intent, 2. Goals, non-goals, anti-goals, 3. Constraints, 4. Approaches considered (+7 more)

## Knowledge Gaps
- **1 isolated node(s):** `cmd`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 143 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `app/page.jsx`, `react`, `tooltip.jsx`, `dependencies`, `devDependencies`, `portfolio.js`, `layout.jsx`, `CertsCard.jsx`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **What connects `cmd` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.060759493670886074 - nodes in this community are weakly interconnected._
- **Why does `useFluidCursor()` connect `useFluidCursor` to `layout.jsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `app/page.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07832080200501253 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `react`, `CertsCard.jsx`, `tooltip.jsx`, `layout.jsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `useFluidCursor` be split into smaller, more focused modules?**
  _Cohesion score 0.0931174089068826 - nodes in this community are weakly interconnected._