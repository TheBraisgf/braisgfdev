# Mapa operativo

Lee primero [../AGENTS.md](../AGENTS.md). Este índice reduce lecturas repetidas: abre la guía del área tocada, no todas a la vez.

| Tema | Fuente canónica | Qué contiene |
| --- | --- | --- |
| Producto, reglas comunes y build | `../AGENTS.md` | Límites técnicos, estructura, seguridad, prerender y flujo de cambio. |
| Colaboración y mantenimiento del arnés | `PERSONALIZATION.md` | Idioma, autonomía y revisión continua. |
| Arquitectura y datos | `ARCHITECTURE.md` | Rutas, módulos y fuentes de contenido. |
| Editor y publicación de contenido | `CONTENT_EDITOR.md` | Esquemas, enlaces, recursos y guardado local. |
| SEO, GEO y HTML prerenderizado | `SEO_GEO.md` | Revisión de rutas, metadatos y descubrimiento sin promesas de ranking. |
| Accesibilidad, movimiento y revisión visual | `ACCESSIBILITY_UX.md` | Teclado, tacto, móvil/escritorio, animación y capturas. |
| Inventario y sustitución de imágenes | `../IMAGE_PLAN.md` | Cada ruta activa, dimensiones y reemplazo seguro. |

## Comprobaciones derivadas de defectos observados

- Si cambia una página o su contenido indexable, construye el sitio y revisa su HTML final, sitemap y alternates.
- Si cambia la cabecera, una página larga, un embed o una animación, mira el resultado real en móvil y escritorio; las reglas CSS por sí solas no verifican el layout.
- Mantén los seis vídeos de portada cargados desde el primer render; solo el primero tiene autoplay silenciado.
- Mantén en UTF-8 los archivos HTML/JS/JSON. Busca `Ã`, `Â` y `â€` cuando aparezcan acentos o signos dañados en pantalla.
- El editor es local: conserva la escritura atómica, control de versión y validación en servidor para cada archivo editable.
