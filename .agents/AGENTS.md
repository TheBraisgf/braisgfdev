# Directrices de desarrollo para braisgf.dev

Estas instrucciones se aplican a todo el repositorio. Lee `README.md` para conocer el producto y `GUIDE.md` para saber cómo publicar contenido. Si la documentación contradice la implementación, inspecciona el código pertinente y actualiza la documentación cuando el cambio la deje desfasada.

Lee `PERSONALIZATION.md` para conocer el estilo de colaboración y la revisión obligatoria del arnés. Usa `SOURCE_OF_TRUTH.md` como índice breve y abre únicamente las guías de arquitectura, contenido, experiencia o descubrimiento relacionadas con la tarea.

## Producto y diseño

- Trata el sitio como el laboratorio personal de Brais, no como un portfolio convencional ni como un feed social interminable.
- Mantén una experiencia editorial, humana, curiosa y basada en trabajo real. El movimiento y la decoración deben tener un propósito claro.
- Prioriza soluciones sencillas y fáciles de mantener que encajen con la arquitectura actual de React y Vite. No añadas dependencias ni abstracciones sin una necesidad concreta.
- Conserva el contenido y el comportamiento existentes salvo que la petición requiera cambiarlos.

## Estructura del proyecto

- `src/pages/` contiene las páginas asociadas a rutas; `src/components/` contiene elementos de interfaz reutilizables.
- `src/data/` contiene contenido estructurado y referencias a recursos; `src/i18n/` contiene los textos en inglés y español; `src/styles/` contiene el sistema visual.
- Usa `public/` para archivos que se sirven tal cual. Importa los recursos que deban incluirse en el paquete mediante `src/data/assets.js` o el módulo de datos pertinente.
- `src/content/projects.json` contiene metadatos y visibilidad; `src/content/experiments/<id>/<idioma>.md` contiene el cuerpo. `src/data/experiments.js` valida y deriva la lista pública, que usa el archivo, los dossiers, la portada, sitemap y `llms.txt`.
- Conserva el esquema de rutas existente: inglés en `/…` y español en `/es/…`.

## Reglas de implementación

- Mantén alineados el comportamiento y el contenido en inglés y español para toda función visible al usuario. Cuando sea práctico, usa los recursos i18n existentes. Algunas páginas actuales mantienen etiquetas breves en el propio componente: sigue las convenciones cercanas salvo que la tarea incluya una refactorización.
- Usa HTML semántico, nombres accesibles, foco de teclado visible y estados ARIA adecuados en los controles interactivos.
- Respeta las preferencias de movimiento reducido, incluida la opción de accesibilidad del sitio.
- Los ciclos automáticos deben ofrecer pausa, detenerse con movimiento reducido del sistema y del menú de accesibilidad, y no anunciar cada cambio periódico con `aria-live`. La galería conserva sus seis entradas y reproduce automáticamente, sin sonido, como máximo el primer vídeo. Monta solo el iframe activo: los proveedores pueden limitar o bloquear varios reproductores simultáneos; ofrece siempre un enlace al original. Al cambiar de vídeo, desmonta el anterior y carga el seleccionado. Los controles deben funcionar con teclado y los controles de diapositivas inactivas deben quedar fuera del foco.
- Asegúrate de que los diseños sigan siendo utilizables en pantallas estrechas y no generen desbordamiento horizontal.
- Usa enlaces de React Router para la navegación interna y los atributos de seguridad adecuados en enlaces externos que se abren en otra pestaña.
- No incluyas secretos ni credenciales privadas en el código, en archivos de entorno versionados ni en variables `VITE_*` visibles para el cliente. Las variables `VITE_*` quedan expuestas en el sitio compilado.
- Mantén actualizados los metadatos de página, las URL canónicas, las alternativas de idioma y las entradas del sitemap cuando cambien las rutas o el contenido indexable. Inspecciona la implementación antes de dar por hecho que existe todo lo descrito en la documentación sobre SEO.
- Actualiza `README.md`, `GUIDE.md` o `DEVLOG.md` si un cambio deja sustancialmente desfasadas sus indicaciones.

## Contenido y recursos

- Asigna a cada experimento un identificador estable de tres cifras y un slug descriptivo. Mantén el título, el resumen y el contenido del dossier en ambos idiomas.
- Guarda los adjuntos de cada experimento en `public/files/<id>/` y enlázalos con rutas desde la raíz del sitio. Siempre que sea posible, usa el modelo de recursos y las vistas previas existentes.
- Prioriza los recursos optimizados e incluidos en el repositorio frente a las URL raw de GitHub. Los recursos remotos heredados son provisionales; evita añadir nuevas dependencias de ese tipo.
- No inventes hechos sobre proyectos, experiencia laboral, métricas ni afirmaciones. Conserva el sentido del autor al editar textos.

## Flujo de cambios

1. Antes de editar, inspecciona los archivos pertinentes y sigue las convenciones existentes.
2. Haz el cambio coherente más pequeño que resuelva por completo la petición.
3. Revisa el diff para detectar ediciones ajenas a la tarea, archivos generados accidentales, imports rotos y daños en los textos o su codificación.
4. Ejecuta `npm run build` cuando los cambios de implementación afecten a la aplicación, salvo que el usuario pida que no lo hagas. No afirmes haber realizado comprobaciones que no se hayan ejecutado. Para cambios solo de texto o documentación, decide si hace falta y evita compilaciones innecesarias.
5. Explica qué cambió y qué comprobaciones se ejecutaron realmente. Indica cualquier limitación conocida que afecte al resultado.

No despliegues, publiques ni contactes con servicios externos durante el trabajo habitual de desarrollo salvo que el usuario lo pida explícitamente.


## HTML estático, SEO y contenido editorial

- Sigue `CONTENT_EDITOR.md` para el modelo y la edición local, `SEO_GEO.md` para descubrimiento, `ACCESSIBILITY_UX.md` para interacción y revisión visual, y `ARCHITECTURE.md` para las fuentes de verdad y límites del proyecto.

- Las páginas públicas deben ser útiles en el HTML inicial. Mantén el prerenderizado de scripts/prerender.js y la hidratación en cliente; cualquier acceso a window, document, almacenamiento o APIs del navegador debe quedar en efectos o manejadores, y el primer render debe coincidir entre servidor y navegador.
- Al añadir una página pública, actualiza sus metadatos localizados en src/data/seo.js, las rutas prerenderizadas, el sitemap derivado y las variantes EN/ES. No anuncies en sitemap o datos estructurados contenido que no exista.
- El build es la comprobación de integración del prerenderizado: ejecuta npm run build para cambios de aplicación y confirma que el HTML en dist/<ruta>/index.html contiene contenido, idioma, canonical y metadatos de esa ruta. Revisa también el sitemap cuando cambien rutas o proyectos.
- src/content/projects.json es la fuente de metadatos de proyectos. El cuerpo vive en src/content/experiments/<id>/; mantén título, resumen y cuerpo en inglés y español. Los borradores y archivados deben quedar fuera de rutas públicas, datos estructurados, sitemap y llms.txt.
- El editor de scripts/editor/ solo puede escuchar en loopback (127.0.0.1), usar un token temporal y validar autorización y contenido en el servidor. No añadas comprobaciones de origen estrictas que impidan el uso local. Nunca lo añadas a una ruta pública ni expongas su puerto mediante proxy. Las cargas deben validar el formato real, limitar el tamaño y guardarse bajo public/images/ con rutas seguras. El flujo Git debe mostrar cambios, permitir elegir una rama local, pedir confirmación y bloquear archivos de credenciales; usa la autenticación Git local y nunca guardes tokens en el editor.
- La revisión final del editor es local y determinista: distingue errores que impiden publicar de recomendaciones, revisa señales editoriales GEO/SEO por idioma y muestra una vista previa de metadatos; vuelve a validar al publicar. No la presentes como una revisión con IA ni como predicción de rankings o sustituto de comprobar experiencia propia, hechos, traducciones o permisos.
- El prerender debe validar las señales SEO que realmente emite el HTML público (idioma, título, descripción, canonical, hreflang, Open Graph, Twitter y JSON-LD), además de la integridad del sitemap y la política de rastreo. Corrige el generador si falla la auditoría; no relajes el control para ocultar un defecto.
- Los cambios de layout deben conservar la composición visual acordada, comprobar foco y teclado, preferencias de movimiento y uso táctil, y revisar al menos un ancho de escritorio y uno móvil estrecho. Las animaciones y el parallax deben ser discretos, progresivos y quedar desactivados con movimiento reducido del sistema o del menú de accesibilidad. Corrige el origen de cualquier desbordamiento horizontal en vez de ocultarlo en el contenedor.
- Trata llms.txt como un índice de descubrimiento complementario. No garantiza que un buscador o agente cite o posicione la web, y no sustituye al HTML rastreable, a un sitemap válido ni al contenido original y preciso.
