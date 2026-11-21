# Graph Report - portfolio  (2026-11-21)

## Corpus Check
- 62 files · ~24,606 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 4, (none) 2)

## Summary
- 412 nodes · 831 edges · 32 communities (18 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9289ea93`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- HelperBoost.jsx
- react
- useFluidCursor
- tooltip.jsx
- useFluidCursor
- chat.jsx
- dependencies
- devDependencies
- Website Flow
- components.json
- portfolio.js
- @radix-ui/react-collapsible
- bg3d.js
- next-themes
- eslint.config.mjs
- scripts
- next.config.ts
- vercel.json
- clsx
- compilerOptions
- class-variance-authority
- motion@^12.23.0
- @tsparticles/engine
- vaul
- @radix-ui/react-dialog
- @radix-ui/react-scroll-area
- @radix-ui/react-separator
- postcss.config.mjs
- react-markdown

## God Nodes (most connected - your core abstractions)
1. `cn()` - 60 edges
2. `useFluidCursor()` - 41 edges
3. `useFluidCursor()` - 39 edges
4. `react` - 33 edges
5. `framer-motion` - 17 edges
6. `lucide-react` - 14 edges
7. `Chat()` - 14 edges
8. `Button()` - 11 edges
9. `WelcomeModal()` - 11 edges
10. `next` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ChatBubbleTimestamp()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/chat/chat-bubble.jsx → src/lib/utils.js
- `ChatBubbleActionWrapper` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/chat/chat-bubble.jsx → src/lib/utils.js
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dialog.jsx → src/lib/utils.js
- `Page()` --calls--> `Chat()`  [EXTRACTED]
  src/app/chat/page.jsx → src/components/chat/chat.jsx
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  src/app/layout.jsx → src/lib/utils.js

## Import Cycles
- None detected.

## Communities (32 total, 14 thin omitted)

### Community 0 - "cn"
Cohesion: 0.09
Nodes (29): @tsparticles/slim@^3.8.1, @tsparticles/slim, AnimatedShinyText(), ICONS, Skills(), Badge(), badgeVariants, Card() (+21 more)

### Community 1 - "HelperBoost.jsx"
Cohesion: 0.12
Nodes (23): Home(), ICONS, AnimatedChevron(), CategorySection(), HelperBoost(), ICONS, QuestionItem(), FluidCursor() (+15 more)

### Community 2 - "react"
Cohesion: 0.12
Nodes (15): next@15.1.9, @tabler/icons-react@^3.31.0, next, react, @tabler/icons-react, AllProjects(), BlurImage(), Card() (+7 more)

### Community 3 - "useFluidCursor"
Cohesion: 0.09
Nodes (32): useFluidCursor(), addKeywords(), applyInputs(), calcDeltaTime(), clickSplat(), compileShader(), correctDeltaX(), correctDeltaY() (+24 more)

### Community 4 - "tooltip.jsx"
Cohesion: 0.71
Nodes (5): ButtonWithTooltip, Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 5 - "useFluidCursor"
Cohesion: 0.09
Nodes (32): useFluidCursor(), addKeywords(), applyInputs(), calcDeltaTime(), clickSplat(), compileShader(), correctDeltaX(), correctDeltaY() (+24 more)

### Community 6 - "chat.jsx"
Cohesion: 0.13
Nodes (25): Page(), Avatar, ChatBottombar(), Chat(), ChatMessageContent(), CodeBlock(), MOTION_CONFIG, prefersReducedMotion() (+17 more)

### Community 7 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, framer-motion@^12.5.0, @lordicon/react@^1.10.1, lucide-react@^0.483.0, @radix-ui/react-avatar@^1.1.3, @radix-ui/react-icons@^1.3.2, @radix-ui/react-slot@^1.1.2, @radix-ui/react-tooltip@^1.1.8 (+14 more)

### Community 8 - "devDependencies"
Cohesion: 0.12
Nodes (22): devDependencies, eslint@^9.22.0, eslint-config-next@15.2.3, eslint-config-prettier@^10.1.1, eslint-plugin-prettier@^5.2.3, eslint-plugin-tailwindcss@^3.18.0, prettier@^3.5.3, prettier-plugin-tailwindcss@^0.6.11 (+14 more)

### Community 9 - "Website Flow"
Cohesion: 0.10
Nodes (19): 0.1 Check what's installed before installing anything, 0.2 Skills, 0.3 MCP, 0.4 Libraries (install per project, only when the design calls for them), A1. Direction: pick a theme and a feel, A2. Gather references per section, A3. Design system, A4. Build (+11 more)

### Community 10 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "portfolio.js"
Cohesion: 0.08
Nodes (28): Build and deploy, Make it yours, Portfolio, Run, framer-motion, lucide-react, inter, metadata (+20 more)

### Community 13 - "bg3d.js"
Cohesion: 0.33
Nodes (3): col(), SCENES, start()

### Community 14 - "next-themes"
Cohesion: 0.40
Nodes (4): next-themes@^0.4.6, sonner@^2.0.1, next-themes, sonner

### Community 15 - "eslint.config.mjs"
Cohesion: 0.22
Nodes (6): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc@^3, @eslint/eslintrc

### Community 16 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 20 - "compilerOptions"
Cohesion: 0.50
Nodes (3): compilerOptions, baseUrl, paths

### Community 21 - "class-variance-authority"
Cohesion: 0.33
Nodes (4): class-variance-authority@^0.7.1, tw-animate-css@^1.2.4, class-variance-authority, tw-animate-css

## Knowledge Gaps
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `cn`, `HelperBoost.jsx`, `tooltip.jsx`, `chat.jsx`, `dependencies`, `devDependencies`, `portfolio.js`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.09292929292929293 - nodes in this community are weakly interconnected._
- **Why does `useFluidCursor()` connect `useFluidCursor` to `HelperBoost.jsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `HelperBoost.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `HelperBoost.jsx`, `react`, `tooltip.jsx`, `chat.jsx`, `portfolio.js`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Should `useFluidCursor` be split into smaller, more focused modules?**
  _Cohesion score 0.0931174089068826 - nodes in this community are weakly interconnected._