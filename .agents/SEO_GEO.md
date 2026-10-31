# Descubrimiento en buscadores y asistentes

La meta es que cada página pública sea rastreable, clara y citable. SEO/GEO no puede garantizar aparecer en cada búsqueda, respuesta de IA o agente; depende de sistemas externos y de la autoridad, utilidad y originalidad del contenido.

## Qué hacer

- Mantén el contenido principal y un único `h1` en el HTML generado inicialmente por `scripts/prerender.js`.
- Cada ruta indexable necesita título, descripción específica, canonical, alternates `en`/`es`/`x-default`, Open Graph, Twitter y JSON-LD coherentes con el texto visible.
- Las páginas editoriales necesitan autor, tema, fecha cuando existe y enlaces internos contextuales. No fabriques datos estructurados ni afirmaciones.
- Mantén sitemap derivado únicamente de rutas públicas localizadas; `robots.txt` permite los crawlers configurados y `llms.txt` funciona como índice complementario, no como sustituto.
- Revisa links y contenido renderizado además de las etiquetas. Evita keyword stuffing, páginas puerta, contenido repetido y afirmaciones de posicionamiento.

## Verificación

`npm run build` debe prerenderizar todas las rutas públicas y validar canonical, idioma, alternates, tarjetas sociales, JSON-LD, sitemap y política de rastreo. Abre al menos una página ES y una EN de cada plantilla y verifica el HTML de `dist/<ruta>/index.html`.
