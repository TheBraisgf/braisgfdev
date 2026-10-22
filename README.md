# braisgf.dev

> **A personal lab for ideas I refuse to leave as ideas.**

`braisgf.dev` is Brais' personal website — but it is deliberately not a traditional portfolio.

The site is the public home of a simple loop:

**IMAGINE → CREATE → SHARE → REPEAT**

Every interesting question can become an **experiment**. An experiment gets a number, a hypothesis, constraints, a process, failures, a result and, ideally, something tangible to show for it.

The point is not to look like I already know everything. The point is to make the process worth following.

## What lives here

- **Experiments** — software, maker projects, learning challenges, creative work and strange ideas.
- **Dossiers** — the durable version of each experiment: what I thought, what I tried, what broke and what came out.
- **Lab notes** — older writing and projects kept as part of the archive.
- **Bilingual experience** — English and Spanish, with one translation catalogue rather than duplicated pages.

## Architecture

The current site is a small React application built with Vite.

```text
/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── assets/                 # Existing media; Vite copies this as public assets
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Routes + application shell
│   ├── components/
│   │   └── Layout.jsx      # Shared navigation + footer
│   ├── data/
│   │   └── experiments.js  # Small, reusable content model
│   ├── i18n/
│   │   ├── config.js
│   │   ├── en.json         # English copy
│   │   └── es.json         # Spanish copy
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Archive.jsx
│   │   └── Experiment.jsx
│   └── styles/
│       └── global.css      # Visual system + responsive layout
└── ...legacy files         # Kept in Git history while the new app takes over deployment
```

### Why React + Vite?

The site has repeated concepts — navigation, experiment cards, dossier layouts, status labels and language handling. React makes those pieces genuinely reusable without turning a personal website into an unnecessarily large system.

Vite keeps the build small and boring: no server runtime, no database, no CMS required.

### Why i18next?

All interface copy lives in `src/i18n/*.json`. Adding a sentence should mean changing a translation file, not copying an entire HTML page and hoping both versions stay in sync.

## Adding an experiment

1. Add its metadata to `src/data/experiments.js`.
2. Add the same experiment key to `src/i18n/en.json` and `src/i18n/es.json`.
3. If it needs special media or behaviour, add it to the reusable dossier component rather than creating another bespoke page.
4. Build and check the result on both desktop and a narrow mobile viewport.

The goal is that adding experiment `#004` should feel like adding content, not building another website.

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

## Deployment

The `DEV` branch is intended to be deployed by Vercel. The application builds to a static Vite bundle and uses a small SPA rewrite for client-side routes.

There is no runtime database or backend dependency.

## Design principles

- **Human before trend.** No generic "AI portfolio" look, no excessive glass, no dashboard cosplay.
- **Editorial before decorative.** Typography, spacing and hierarchy do most of the work.
- **Personality over polish.** A little roughness is allowed when it feels intentional.
- **Artifacts over feeds.** A finished page, prototype, file or lesson is more valuable than another endless scroll.
- **Mobile is a first-class experience.** The narrow layout is designed, not merely squeezed.
- **Simple to maintain.** Content and structure should be understandable six months from now.

## Status

Active experiment. The website itself is **Experiment #001**.

---

© Braisgf — Imagine. Create. Share. Repeat.
