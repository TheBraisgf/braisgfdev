# braisgf.dev

> **A personal lab for ideas I refuse to leave as ideas.**

`braisgf.dev` is Brais' personal website — deliberately not a traditional portfolio.

The public loop is:

**IMAGINE → CREATE → SHARE → REPEAT**

Every interesting question can become an experiment. An experiment gets a number, a hypothesis, constraints, a process, failures, a result and, ideally, something tangible to show for it.

## What lives here

- **Experiments** — software, maker projects, learning challenges, creative work and strange ideas.
- **Dossiers** — durable pages for what I thought, tried, broke and learned.
- **About + professional path** — the person and career behind the projects, without making the CV the homepage.
- **Video gallery** — a quick bridge for people who already know Brais from social platforms.
- **Community lab** — next-project voting and a suggestion box.
- **Lab test** — a tiny interactive experience for visitors.
- **Lab notes** — older writing kept because the trail matters.

## Architecture

The current site is a small React application built with Vite.

```text
/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── GUIDE.md
├── public/
│   ├── favicon.svg
│   ├── og.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── files/             # Publication attachments of any format
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/        # Reusable UX pieces
    ├── data/              # Content models + asset imports
    ├── i18n/              # English + Spanish translations
    ├── pages/             # Route-level pages
    └── styles/             # Shared visual system
```

The old static HTML sections have been removed from `DEV`. Existing useful media is imported through `src/data/assets.js` so Vite includes it in the production bundle instead of relying on the old folder layout.

### Why React + Vite?

Repeated concepts — navigation, experiment dossiers, resources, accessibility controls, interactive values and community components — are genuinely reusable. React handles that without turning a personal site into a giant framework project.

Vite keeps the output static and simple: no server runtime, database or CMS is required for the core site.

### Why i18next?

Interface and editorial copy lives in `src/i18n/en.json` and `src/i18n/es.json`. Language changes do not duplicate HTML pages, so the two versions can evolve together.

## Content model

The experiment model supports:

- text and metadata
- images
- external URLs
- downloadable files
- code
- ZIPs and other binaries
- audio
- video
- PDFs

Common media is previewed automatically; unknown formats remain downloadable resources.

See **[GUIDE.md](./GUIDE.md)** for the complete publishing workflow.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Before merging, test English and Spanish, deep routes, mobile, keyboard navigation, accessibility preferences and the browser console.

## Deployment

`DEV` is deployed through Vercel during the redesign phase. `vercel.json` explicitly declares the Vite build and `dist` output and provides the SPA rewrite required by React Router.

The visitor counter is optional and configured with `VITE_GOATCOUNTER_CODE`.

## SEO

SEO is part of the application architecture:

- semantic HTML and accessible navigation
- stable human-readable URLs
- dynamic titles/descriptions
- canonical URLs
- EN/ES `hreflang`
- Open Graph + Twitter metadata
- Person / WebSite / WebPage JSON-LD
- `robots.txt`
- bilingual XML sitemap
- internal linking between projects, person and archive

The goal is not to generate keyword pages. It is to make the real work easy for search engines and AI systems to understand, cite and discover.

## Design principles

- **Human before trend.** No generic AI-portfolio aesthetic.
- **Editorial before decorative.** Typography, spacing and hierarchy do the heavy lifting.
- **Personality over polish.** Intentional roughness is allowed; accidental broken UI is not.
- **Artifacts over feeds.** The site should leave things behind, not ask visitors to scroll forever.
- **Experience over friction.** Every section should invite the next useful click.
- **Accessibility from the beginning.** Keyboard navigation, focus states, reduced motion and adjustable presentation are first-class features.
- **Simple to maintain.** Adding experiment #004 should feel like adding content, not building another website.

## Status

Active experiment. The website itself is **Experiment #001**.

---

© Braisgf — Imagine. Create. Share. Repeat.
