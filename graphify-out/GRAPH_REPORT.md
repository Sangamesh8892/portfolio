# Graph Report - portfolio  (2026-11-21)

## Corpus Check
- 74 files · ~21,713 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .example 1)

## Summary
- 447 nodes · 922 edges · 31 communities (17 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d7bbc05`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- chat.tsx
- react
- useFluidCursor
- HelperBoost.tsx
- chat/route.ts
- chat-bubble.tsx
- dependencies
- devDependencies
- compilerOptions
- components.json
- layout.tsx
- chat-message-content.tsx
- package.json
- 🚀 How to run
- eslint.config.mjs
- scripts
- next.config.ts
- vercel.json
- clsx
- @lordicon/react@^1.10.1
- @radix-ui/react-icons@^1.3.2
- react-dom@^19.0.1
- @tsparticles/engine
- vaul
- eslint-config-next@15.2.3
- eslint-config-prettier@^10.1.1
- @types/react@^19
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 62 edges
2. `useFluidCursor()` - 41 edges
3. `react` - 40 edges
4. `framer-motion` - 20 edges
5. `Chat()` - 20 edges
6. `lucide-react` - 19 edges
7. `next` - 17 edges
8. `compilerOptions` - 16 edges
9. `ai` - 15 edges
10. `Button()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ChatBubbleTimestamp()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/chat/chat-bubble.tsx → src/lib/utils.ts
- `ChatBubbleActionWrapper` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/chat/chat-bubble.tsx → src/lib/utils.ts
- `Page()` --calls--> `Chat()`  [EXTRACTED]
  src/app/chat/page.tsx → src/components/chat/chat.tsx
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  src/app/layout.tsx → src/lib/utils.ts
- `Home()` --calls--> `Button()`  [EXTRACTED]
  src/app/page.tsx → src/components/ui/button.tsx

## Import Cycles
- None detected.

## Communities (31 total, 14 thin omitted)

### Community 0 - "cn"
Cohesion: 0.07
Nodes (37): class-variance-authority@^0.7.1, motion@^12.23.0, class-variance-authority, motion, AnimatedShinyText(), AnimatedShinyTextProps, Skills(), Badge() (+29 more)

### Community 1 - "chat.tsx"
Cohesion: 0.09
Nodes (31): lucide-react, next, Page(), Home(), questionConfig, questions, Avatar, AvatarProps (+23 more)

### Community 2 - "react"
Cohesion: 0.10
Nodes (25): @tabler/icons-react@^3.31.0, framer-motion, react, @tabler/icons-react, MOTION_CONFIG, SimplifiedChatViewProps, ToolRenderer(), ToolRendererProps (+17 more)

### Community 3 - "useFluidCursor"
Cohesion: 0.09
Nodes (32): useFluidCursor(), addKeywords(), applyInputs(), calcDeltaTime(), clickSplat(), compileShader(), correctDeltaX(), correctDeltaY() (+24 more)

### Community 4 - "HelperBoost.tsx"
Cohesion: 0.09
Nodes (30): @radix-ui/react-separator@^1.1.2, @radix-ui/react-tooltip@^1.1.8, @radix-ui/react-separator, @radix-ui/react-tooltip, AnimatedChevron(), CategorySection(), CategorySectionProps, HelperBoost() (+22 more)

### Community 5 - "chat/route.ts"
Cohesion: 0.14
Nodes (18): ai@^4.1.65, zod@^3.24.2, ai, zod, SYSTEM_PROMPT, isSameOrigin(), maxDuration, messagesSchema (+10 more)

### Community 6 - "chat-bubble.tsx"
Cohesion: 0.13
Nodes (20): @radix-ui/react-avatar@^1.1.3, @radix-ui/react-avatar, SimplifiedChatView(), Avatar(), AvatarFallback(), AvatarImage(), ChatBubble, ChatBubbleActionProps (+12 more)

### Community 7 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @ai-sdk/openai@^1.2.7, framer-motion@^12.5.0, lucide-react@^0.483.0, next@15.1.9, @radix-ui/react-dialog@^1.1.6, @radix-ui/react-scroll-area@^1.2.3, @radix-ui/react-slot@^1.1.2 (+13 more)

### Community 8 - "devDependencies"
Cohesion: 0.10
Nodes (21): devDependencies, eslint@^9.22.0, @eslint/eslintrc@^3, eslint-plugin-prettier@^5.2.3, eslint-plugin-tailwindcss@^3.18.0, prettier@^3.5.3, prettier-plugin-tailwindcss@^0.6.11, @tailwindcss/postcss@^4 (+13 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "layout.tsx"
Cohesion: 0.15
Nodes (10): next-themes@^0.4.6, sonner@^2.0.1, @vercel/analytics@^1.5.0, next-themes, sonner, @vercel/analytics, inter, metadata (+2 more)

### Community 12 - "chat-message-content.tsx"
Cohesion: 0.22
Nodes (12): @radix-ui/react-collapsible@^1.1.3, react-markdown@^10.1.0, remark-gfm@^4.0.1, @radix-ui/react-collapsible, react-markdown, remark-gfm, ChatMessageContent(), ChatMessageContentProps (+4 more)

### Community 13 - "package.json"
Cohesion: 0.17
Nodes (11): @ai-sdk/react@^1.2.0, @tsparticles/slim@^3.8.1, tailwindcss@^4, @typescript-eslint/parser@^8.27.0, name, private, version, @ai-sdk/react (+3 more)

### Community 14 - "🚀 How to run"
Cohesion: 0.25
Nodes (7): Getting your **tokens**, 🚀 How to run, Prerequisites, Setup, 🔖 Tags, 👇 What can you ask?, World's first AI portfolio 🤖✨

### Community 15 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 16 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Knowledge Gaps
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `cn`, `chat.tsx`, `HelperBoost.tsx`, `chat-bubble.tsx`, `dependencies`, `layout.tsx`, `chat-message-content.tsx`, `package.json`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07337526205450734 - nodes in this community are weakly interconnected._
- **Why does `useFluidCursor()` connect `useFluidCursor` to `chat.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `chat.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08874912648497554 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `chat.tsx`, `react`, `HelperBoost.tsx`, `chat-bubble.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09872241579558652 - nodes in this community are weakly interconnected._
- **Should `useFluidCursor` be split into smaller, more focused modules?**
  _Cohesion score 0.0931174089068826 - nodes in this community are weakly interconnected._