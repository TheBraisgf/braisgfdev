# Contenido y editor local

Arranca con `npm run editor` y abre el enlace temporal que imprime la terminal. La herramienta escucha solo en `127.0.0.1`; no la expongas ni pongas el puerto detrás de un proxy. Las escrituras se validan en servidor, son atómicas y comprueban una huella para evitar pisar cambios externos.

## Secciones del editor

- **Proyectos**: metadatos bilingües, visibilidad, imágenes, Markdown, enlaces y archivos. La barra de formato ofrece títulos, listas, enlaces e imágenes con vista previa.
- **Galería de vídeo**: las seis fuentes del carrusel principal. Todos los embeds se montan en la primera visita; el primero se inicia en silencio.
- **Trayectoria, encuesta y test**: `src/content/site-content.json`. `global` edita navegación, banner y pie; `career` contiene fechas, texto bilingüe y tarjetas breves por puesto; `poll` configura la votación; `personality` necesita 5–8 preguntas, cuatro respuestas por pregunta y perfiles identificados por tipo.
- **Notas y cuaderno visual**: `src/content/field-notes.json` y `src/content/journal.json`. Los botones crean plantillas de borrador; edita los campos visuales y completa ambos idiomas antes de publicar. Abre las opciones avanzadas para etiquetas, enlaces relacionados o ajustes JSON puntuales.

La trayectoria, encuesta, test y textos globales se editan con campos visuales. Las opciones JSON avanzadas son un recurso secundario. Tras guardar, Vite recarga los datos durante desarrollo; ejecuta `npm run build` para generar el HTML estático y el sitemap que se publican.

## Tipos de contenido y enlaces

- Los proyectos viven en `/experiments/<id>` y su Markdown es el dossier narrativo.
- Las reseñas, lecturas, películas, series, juegos y apuntes viven como **Notas de campo** en `/notes/<slug>`; cada entrada conserva fecha, resumen, etiquetas, Markdown localizado y enlaces relacionados.
- Para enlazar desde Markdown, usa rutas como `[Mi proyecto](/experiments/002)` y `[Reseña relacionada](/notes/mi-resena)`. Usa `/es/...` cuando el texto español deba quedarse en español.
- El **Cuaderno visual** en `/journal` recibe fotos locales con ruta `/images/journal/archivo.jpg` y videos incrustados de YouTube, Twitch, TikTok e Instagram. Para imágenes propias, guarda los archivos en `public/images/journal/`.

## Al publicar

1. Guarda como borrador mientras falte información.
2. Completa texto alternativo útil en imágenes y resumen bilingüe para páginas públicas.
3. Comprueba enlaces locales, enlaces externos y fechas reales.
4. Ejecuta `npm run build`; abre la ruta prerenderizada correspondiente y comprueba metadatos y sitemap.
