# braisgf.dev — Development Log

## 2026-10-31 — Version 2.1.0: editable content and discoverable pages

- Added bilingual field notes (`/notes`) for reviews and editorial entries, with links between notes and experiments.
- Added a dated visual journal (`/journal`) for original photos and social video embeds.
- Expanded the loopback-only editor to manage projects, six homepage videos, shared site copy, career entries, poll, personality quiz, field notes and journal items.
- Added prerender validation for localized metadata, structured data, public routes, sitemap and `llms.txt`.
- Improved responsive interaction, keyboard access, reduced-motion handling, route-specific visit counting and the career timeline.
- See `README.md`, `GUIDE.md`, `.agents/SOURCE_OF_TRUTH.md` and `IMAGE_PLAN.md` for current workflows and architecture.

## 2026-10-22 — The lab becomes an application

The redesign moved from a collection of static HTML pages to a reusable React + Vite application.

### Architecture

- React + Vite
- React Router
- i18next / react-i18next
- Reusable components for navigation, dossiers, resources, accessibility, community and interactive sections
- Content separated from presentation
- English and Spanish share the same routes/components

### Experience

- Editorial laboratory aesthetic
- Interactive `IMAGINE → CREATE → SHARE → REPEAT`
- "You don't need another feed" remains a core principle
- About page + professional timeline
- Social/video bridge for visitors who know Brais from another platform
- Next-project voting + suggestion box
- Small visitor personality test
- Human 404
- Mobile navigation
- Keyboard-accessible accessibility menu
- Reduced-motion support

### Publishing

Experiments now have a reusable resource model. A publication can carry text, URLs, images, video, audio, PDFs, code, archives and other downloadable files.

See `GUIDE.md` for the publishing workflow.

### Discovery

- canonical URLs
- EN/ES hreflang
- JSON-LD Person/WebSite/WebPage data
- robots.txt
- bilingual sitemap
- Open Graph/Twitter metadata
- stable human-readable URLs
- internal links between person, career, experiments and archive

### Repository cleanup

The old static `about`, `blog`, `career`, `lab`, `privacy`, `social`, `stack`, `wip` and duplicated Spanish frontends were removed from `DEV` after their useful content was migrated into the new application.

`main` remains untouched.

---

> The site should feel like entering Brais' workshop, not opening another portfolio.
