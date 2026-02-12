# CLAUDE.md

## Project Overview

A static portfolio and lead-collection website for a creative professional. The site features animated interactions, a comprehensive design token system with 8 switchable themes, and a serverless contact form API. Built with vanilla HTML/CSS/JS (no framework or build step).

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **Animations:** GSAP 3.12.5 + ScrollTrigger (loaded via CDN)
- **Fonts:** Google Fonts (Inter, JetBrains Mono, Space Grotesk, Fira Code) + Adobe Typekit (Roca)
- **Backend:** Vercel serverless functions (Node.js, ES modules)
- **Deployment:** Vercel (static site, no build step)
- **Storage:** In-memory only for leads (no database)

## Repository Structure

```
lead-collection-site/
├── api/
│   └── submit.js              # Vercel serverless function (POST /api/submit)
├── public/                    # Vercel output directory (served as site root)
│   ├── index.html             # Homepage: hero, work history, posts, contact
│   ├── animated-titles.html   # Blog post: AI animated titles tutorial
│   ├── design-system.html     # Design system showcase page
│   ├── design-trends.html     # Design trends page
│   ├── app.js                 # Main JS: cursor, magnetic hovers, GSAP animations, form
│   ├── theme.js               # ThemeManager + DesignTokens (localStorage persistence)
│   ├── process.js             # Blog page: copy-to-clipboard, scroll animations
│   ├── design-system.js       # Design system page: token controls, theme selectors
│   ├── base.css               # Shared styles, reset, typography, layout, components
│   ├── tokens.css             # Design tokens: 8 themes via CSS custom properties
│   ├── home.css               # Homepage styles: cursor, shapes, hero, work list
│   ├── blog.css               # Blog/tutorial styles: steps, prompt cards, grid
│   ├── design-system.css      # Design system page styles
│   ├── favicon.png
│   ├── images/                # Blog tutorial screenshots (step-1/2/3.png)
│   └── gifs/                  # Animated title examples (9 GIFs)
├── package.json               # Minimal: name, version, description only
├── vercel.json                # Vercel config: rewrites for clean URLs
└── .gitignore
```

## Development Workflow

### Running Locally

There is no build step. To develop locally:

1. Use the [Vercel CLI](https://vercel.com/docs/cli): `vercel dev`
2. Or serve the `public/` directory with any static file server

The `api/` directory is only functional when using Vercel's dev server or deployed to Vercel.

### No Build, Lint, or Test Commands

- **No `npm run build`** — static site, no compilation
- **No linter or formatter configured** — no ESLint, Prettier, etc.
- **No test suite** — no test runner or test files exist
- **No TypeScript** — all JavaScript is vanilla ES6+

### Deployment

Deployed via Vercel. The `vercel.json` configures:
- `outputDirectory: "public"` — static files served from here
- No build or install commands
- URL rewrites for clean routes (e.g., `/animated-titles` -> `/animated-titles.html`)

## Architecture & Key Patterns

### Pages

Each page is a standalone HTML file in `public/` that loads its own CSS and JS. There is no shared templating or component system. Common structure:
- `base.css` + `tokens.css` loaded by all pages
- Page-specific CSS (e.g., `home.css`, `blog.css`)
- `theme.js` loaded for theme switching
- Page-specific JS for interactions

### Design Token System (`tokens.css` + `theme.js`)

- **8 themes** defined as CSS custom properties on `[data-theme="name"]`:
  - Dark: `seoul`, `tokyo`, `shanghai`, `hanoi`
  - Light: `kyoto`, `busan`, `osaka`, `singapore`
- **ThemeManager class** in `theme.js`: switches themes, persists to localStorage, dispatches `themechange` events
- **DesignTokens class** in `theme.js`: manages font, spacing, border-radius, animation speed, and blur settings via CSS custom properties and localStorage

### Animation Patterns

- GSAP `ScrollTrigger` for reveal animations (fade in + blur)
- Custom cursor with follower circle (hidden on touch devices)
- Magnetic hover effect that pulls elements toward the cursor
- Staggered list item animations
- Theme transition uses a full-screen overlay flash

### Serverless API (`api/submit.js`)

- **Endpoint:** `POST /api/submit`
- **Accepts:** `{ name, email, message }` (email required)
- **Returns:** `{ success: true, message: "..." }`
- **Storage:** In-memory array (not persistent across deploys/restarts)
- Uses ES module syntax (`export default function handler`)

### Responsive Design

- Mobile breakpoint: `640px`
- Container max-width: `720px`
- Fluid font sizes using `clamp()`
- Custom cursor hidden on touch devices
- Lazy-loaded images

## Code Conventions

- **No framework** — all DOM manipulation is vanilla JS
- **CSS custom properties** for all design values (colors, spacing, fonts, etc.)
- **ES module syntax** in serverless functions (`export default`)
- **Standard script tags** (not modules) for frontend JS
- **External dependencies loaded via CDN** — no `node_modules` for frontend
- **localStorage** for persisting user preferences (theme, design tokens)
- **No semicolons** are NOT enforced — the codebase uses semicolons consistently
- **Single-file pages** — each HTML file is self-contained with its own styles/scripts

## Important Notes for AI Assistants

1. **No build system** — changes to HTML/CSS/JS in `public/` are immediately reflected. Do not introduce build tools unless explicitly requested.
2. **No package dependencies** — frontend libraries are loaded via CDN `<script>` tags. Do not add npm dependencies for frontend code.
3. **Static files only** — all frontend assets live in `public/`. Vercel serves this directory directly.
4. **Theme system is central** — any new UI must respect the CSS custom property system in `tokens.css`. Use `var(--property-name)` for colors, spacing, typography, etc.
5. **GSAP is the animation standard** — use GSAP and ScrollTrigger for any new animations, not CSS-only or other libraries.
6. **API is minimal** — the serverless function uses in-memory storage. Any database integration would be a significant change.
7. **No tests exist** — there is no test infrastructure. If adding tests, this would need to be set up from scratch.
8. **Clean URL routing** — new pages need a corresponding rewrite rule in `vercel.json`.
