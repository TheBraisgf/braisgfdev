# Arquitectura y fuentes de contenido

## Capas

- `src/App.jsx`: rutas localizadas y carga por página.
- `src/pages/`: composición de cada ruta. `Layout.jsx` resuelve navegación, metadatos de cliente, pie y contador.
- `src/components/`: interacciones y bloques reutilizables.
- `src/styles/`: sistema visual y reglas por área; conserva la estética editorial actual y añade excepciones al final de `ux-polish.css` solo cuando haya una razón responsive o accesible concreta.
- `src/data/`: validación, resolución de imágenes, metadatos y modelos derivados.
- `src/content/`: fuentes editables de proyectos, carrera, encuesta, test, notas y cuaderno visual.
- `scripts/editor/` y `scripts/editor-server.js`: editor servido solo en loopback con sesión temporal. El navegador nunca escribe archivos directamente.
- `scripts/prerender.js`: HTML localizado, sitemap y `llms.txt` para producción.

## Fuentes canónicas

- Proyectos: `src/content/projects.json` y `src/content/experiments/<id>/{es,en}.md`. No dupliques títulos o resúmenes públicos en otros registros.
- Trayectoria, encuesta, test y textos recurrentes de cabecera/pie/banner: `src/content/site-content.json`.
- Entradas editoriales fuera de proyectos: `src/content/field-notes.json` (nombre público: **Notas de campo**).
- Fotos y vídeos ordenados por fecha: `src/content/journal.json` (nombre público: **Cuaderno visual**).
- Galería de seis vídeos de portada: `src/data/videos.json`.
- Imágenes de interfaz/proyectos y sus alias: `src/data/assets.js`; inventario y rutas: `IMAGE_PLAN.md`.
- Textos de interfaz que no son contenido recurrente: `src/i18n/{es,en}.json`.

## Límites

- No inventes datos de empleo, métricas, fechas, logros, reseñas, opiniones o afirmaciones SEO/GEO. Usa borradores y pide a Brais el contenido factual que falte.
- Mantén la equivalencia `en`/`es` en las rutas y contenido publicado. El editor valida datos bilingües y guarda primero como borrador.
- No publiques entradas en borrador ni las incluyas en sitemap, JSON-LD editorial o `llms.txt`.
