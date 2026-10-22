# braisgf.dev — Development Log

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
