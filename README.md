# braisgf.dev

> A personal lab for ideas I refuse to leave as ideas.

braisgf.dev is Brais's personal lab: software, maker projects, learning experiments, creative work and the process behind them. It is deliberately not a conventional portfolio or an endless social feed.

**IMAGINE -> CREATE -> SHARE -> REPEAT**

## Stack and structure

The site uses React, React Router and Vite. The production build prerenders every public English and Spanish route into static HTML, then hydrates those pages in the browser. Deployment stays static while each page is useful to crawlers before JavaScript runs.

- `src/pages/`: route-level pages
- `src/components/`: reusable interface and interactions
- `src/content/projects.json`: bilingual project metadata, visibility and resources
- `src/content/experiments/<id>/<locale>.md`: project writing in Markdown
- `src/content/site-content.json`: shared copy, career timeline, poll and personality test
- `src/content/field-notes.json` and `src/content/journal.json`: reviews/notes and dated visual media
- `src/data/experiments.js`: validates and prepares the public project registry
- `src/data/seo.js`: localized page metadata and JSON-LD data
- `src/i18n/`: English and Spanish interface text
- `src/styles/`: visual system
- `public/files/<id>/`: project attachments
- `scripts/prerender.js`: static routes, sitemap and model discovery index
- `scripts/editor/`: local only content editor, served at `127.0.0.1`

See [GUIDE.md](./GUIDE.md) for the step-by-step project publishing workflow.

Run `npm run editor` to open the local content editor. It prints a temporary, token protected link and saves projects, videos, shared copy, career, poll, personality quiz, field notes and visual journal directly to the repository. Draft and archived content stays out of public routes. The editor is not deployed; never expose its local port through a proxy. It can upload images directly into the appropriate `public/images/` folder, remove projects/notes/journal entries, and offers an explicit review + commit/push dialog that uses local Git authentication and blocks common credential files.

See [.agents/CONTENT_EDITOR.md](.agents/CONTENT_EDITOR.md) for content workflows and [IMAGE_PLAN.md](IMAGE_PLAN.md) for the current image inventory and replacement paths.

## Search and discovery

Each prerendered page includes a localized title and description, canonical URL, EN/ES alternate links, Open Graph and Twitter metadata, and JSON-LD. The build generates a bilingual XML sitemap and `llms.txt` from the project registry. `robots.txt` permits general and AI search crawlers.

These measures improve crawlability and machine-readable context; no site can guarantee placement in search results. Useful, original and accurate project writing remains essential.

## Local development

```bash
npm install
npm run dev
npm run editor
npm run build
npm run preview
```

After deployment, submit `https://braisgf.dev/sitemap.xml` in Google Search Console and Bing Webmaster Tools, then check each service's sitemap status. See [GUIDE.md](./GUIDE.md) for the steps and links.

## Deployment

Vercel serves the prerendered routes in the static `dist/` output and a custom 404 page. A visitor counter may be enabled with `VITE_GOATCOUNTER_CODE`. Public `VITE_*` values are bundled into the client and must never contain secrets.

## Design principles

- People and real work before trends.
- Editorial hierarchy before decoration.
- Intentional roughness is welcome; broken interaction is not.
- Projects leave durable artifacts instead of becoming a feed.
- Accessibility, responsive layouts and reduced motion are part of the design.
- Adding an experiment should be a content task, not a new page implementation.

Copyright Braisgf. Imagine. Create. Share. Repeat.
