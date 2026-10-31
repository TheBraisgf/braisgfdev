# Guía de mantenimiento y publicación

El sitio es un laboratorio personal. La interfaz vive en React; proyectos, vídeos, trayectoria, encuesta, test, notas y textos recurrentes se editan como contenido. El editor incluido permite hacer esos cambios sin tocar componentes.

## Estructura

```text
src/
├── components/          # Interfaz e interacciones reutilizables
├── content/
│   ├── projects.json    # Metadatos EN/ES, visibilidad y recursos de proyectos
│   ├── site-content.json # Copia global, trayectoria, encuesta y test
│   ├── field-notes.json  # Reseñas, ideas y notas editoriales
│   ├── journal.json      # Fotos y vídeos fechados
│   └── experiments/     # Markdown EN/ES por ID
├── data/
│   ├── assets.js        # Recursos visuales importados
│   ├── experiments.js   # Valida y prepara el contenido público
│   ├── seo.js           # Metadatos y datos estructurados
│   └── videos.json      # URLs y formato de los vídeos
├── i18n/                # Textos de interfaz EN/ES
├── pages/               # Páginas asociadas a rutas
└── styles/              # Sistema visual
scripts/
├── editor/               # Interfaz del editor local
├── editor-server.js      # API local autenticada del editor
└── prerender.js          # HTML estático, sitemap y llms.txt
public/files/<id>/       # Adjuntos descargables por proyecto
public/images/            # Imágenes activas; rutas de reemplazo en IMAGE_PLAN.md
```

## Editar desde el editor local

1. Abre una terminal en el repositorio y ejecuta `npm install` si es la primera vez.
2. Ejecuta `npm run editor`.
3. Abre en este ordenador el enlace de un solo uso que imprime la terminal. El enlace incluye un token temporal; no lo compartas.
4. Elige una pestaña: Proyectos; Galería de vídeo; Trayectoria, encuesta y test; o Notas y cuaderno visual. Los dos últimos apartados tienen campos bilingües y plantillas para crear entradas.
5. Guarda con el botón o `Ctrl+S`. Los cambios se escriben en los archivos del repositorio. Si `npm run dev` está ejecutándose en otra terminal, Vite recarga el sitio al detectar los cambios.
6. Puedes borrar un proyecto, nota o pieza del cuaderno visual desde su botón **Eliminar**; el editor pide confirmación. En notas y cuaderno el borrado se aplica al pulsar Guardar; al borrar un proyecto también se quitan sus dossiers Markdown y se conservan los adjuntos.
7. Usa **Subir imagen desde el ordenador** para guardar archivos JPEG, PNG, WebP, GIF o AVIF (máximo 15 MB) en `public/images/projects/<id>/`, `public/images/notes/<slug>/` o `public/images/journal/`. El editor actualiza la portada, el campo de imagen o inserta Markdown con la ruta creada.
8. El botón verde &#128640; muestra el estado y las rutas de todos los cambios rastreados y no rastreados, deja elegir una rama local y pide confirmación antes de ejecutar `git add`, `git commit` y `git push`. Usa las credenciales que ya tenga Git configuradas en el equipo; bloquea archivos `.env`, claves y credenciales. El commit se crea en la rama actual y se envía a la rama elegida; un rechazo remoto deja el commit local para resolverlo.
9. Crea primero como borrador. Para publicar, completa título, resumen y cuerpo en ambos idiomas y cambia la visibilidad a “Público”. Para retirar sin borrar, usa “Archivado”.

La barra sobre el texto Markdown aplica títulos, negrita, cursiva, código, listas, citas, enlaces e imágenes al texto seleccionado o a la línea actual. También puedes usar Ctrl+B, Ctrl+I y Ctrl+K para negrita, cursiva y enlace. La vista previa se actualiza mientras escribes; Ctrl+Z conserva el deshacer del navegador.

Antes de publicar, pulsa **Revisión final**. Comprueba los campos requeridos, límites editoriales, URLs, títulos y resúmenes por idioma, encabezados en ambos dossiers, contenido muy breve (menos de 45 palabras como orientación), texto provisional y texto alternativo de imágenes. Muestra una vista previa del título, descripción y canonical que tendrá cada idioma. Los errores bloquean la publicación, pero permiten guardar el borrador; las recomendaciones no bloquean. Es una comprobación local determinista, sin API ni coste: no puede juzgar la experiencia de primera mano, la veracidad, la calidad de la traducción o los permisos de imágenes.

El editor solo escucha en `127.0.0.1`, requiere un token nuevo en cada ejecución y no tiene ruta en la web desplegada. Mantén la terminal abierta mientras editas y pulsa `Ctrl+C` al terminar. No configures un proxy público para el puerto 4179. Consulta [.agents/CONTENT_EDITOR.md](.agents/CONTENT_EDITOR.md) para los campos, rutas y reglas de publicación.

## Editar archivos directamente

Cada proyecto tiene un ID estable de tres cifras. Sus metadatos están en `src/content/projects.json` y sus cuerpos en `src/content/experiments/<id>/es.md` y `en.md`. Las propiedades de recursos usan `label` y `href`; las URLs deben ser HTTPS o rutas desde la raíz (`/files/006/prototype.pdf`). Las imágenes pueden usar un alias importado, como `@labHero`, una ruta local o una URL HTTPS.

Los seis vídeos de portada están en `src/data/videos.json`. Cada entrada lleva `social` (`TikTok`, `YouTube`, `Instagram` o `Twitch`), `orientation` (`vertical` o `horizontal`) y una URL HTTPS válida. La galería conserva las seis entradas, pero monta solo el reproductor activo para reducir bloqueos y límites del proveedor; al elegir otra tarjeta, carga ese vídeo. El enlace original siempre está disponible si la red social deniega el embed.

Si no configuras `VITE_SUGGESTION_ENDPOINT`, el buzón abre un borrador de correo con asunto prefijado y una estructura de mensaje. La dirección está definida en `SECURITY.md`; edítala allí y en `src/components/CommunityLab.jsx` solo si cambia el correo de contacto.

El archivo de proyectos y los dossiers usan la misma lista pública. Los borradores y archivados no aparecen en la web, el sitemap ni `llms.txt`. Las páginas públicas, los datos estructurados, sitemap y `llms.txt` se generan desde el mismo registro.

## SEO y publicación

La build prerenderiza EN y ES como HTML, con título, descripción, canonical, alternates, Open Graph, Twitter y JSON-LD. Durante esa generación valida que las páginas públicas conserven esas señales, un único H1, que el 404 lleve `noindex`, que el sitemap tenga todas las rutas públicas y que `robots.txt` permita OAI-SearchBot y anuncie el sitemap. `llms.txt` es un índice complementario: no garantiza indexación ni posiciones. GEO no requiere repetir palabras clave ni añadir un marcado especial; prioriza contenido original, útil, preciso y basado en experiencia real.

Antes de publicar, revisa la vista previa de títulos, descripciones y canonicals. Ejecuta `npm run build`; comprueba las rutas en `dist/`, `dist/404.html`, el sitemap y `llms.txt`. El build falla si faltan las señales SEO comprobadas. No edites a mano los archivos generados. Vercel sirve estas rutas estáticas y la página 404.

Después de desplegar el sitemap y verificar la propiedad del dominio en cada servicio:

1. En [Google Search Console](https://search.google.com/search-console), abre **Sitemaps** y envía `https://braisgf.dev/sitemap.xml`.
2. En [Bing Webmaster Tools](https://www.bing.com/webmasters), abre **Sitemaps** y envía la misma URL.
3. Revisa el estado de lectura y los errores que muestre cada servicio. Vuelve a compilar y desplegar si cambian las rutas o los proyectos; comprueba después el sitemap publicado.

Enviar el sitemap facilita que esos buscadores descubran las URLs; no garantiza rastreo, indexación ni posición. La verificación del dominio y el envío se hacen en las cuentas del propietario después del despliegue.

La revisión sigue las [pautas de Google para contenido en experiencias de IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide?version=published), sus recomendaciones para [títulos](https://developers.google.com/search/docs/appearance/title-link) y [descripciones/snippets](https://developers.google.com/search/docs/appearance/snippet), y las [directrices de rastreo de OpenAI](https://developers.openai.com/api/docs/bots). Los buscadores pueden truncar títulos y generar sus propios snippets; los límites del editor son de almacenamiento editorial, no una longitud que garantice posicionamiento.

## Accesibilidad y experiencia

Conserva HTML semántico, nombres accesibles, navegación por teclado, foco visible, preferencias de movimiento reducido y objetivos táctiles cómodos. Comprueba el sitio en escritorio y en móvil estrecho tras cambios de layout. Mantén el contenido y los controles utilizables sin depender solo del color, el hover o el movimiento. Conserva la jerarquía, tipografía y composición visual existentes salvo que se solicite un rediseño.

## Comandos

```bash
npm install
npm run dev       # Servidor Vite para previsualizar el sitio
npm run editor    # Editor de contenido local
npm run build     # Sitio estático, sitemap y llms.txt
npm run preview   # Previsualizar dist/
```

Consulta [IMAGE_PLAN.md](IMAGE_PLAN.md) para el inventario exacto de imágenes activas, sus tamaños recomendados y las rutas donde sustituirlas.
