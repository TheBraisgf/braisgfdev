# Mapa de imágenes de braisgf.dev

Coloca las imágenes generadas en estas rutas dentro de `public/images/`. El sitio ya usa esos nombres; puedes sustituir los archivos actuales conservando el nombre y la extensión. No cambies `src/data/assets.js` si mantienes las rutas de esta lista.

Exporta fotografías como JPEG de calidad 85–90 o WebP; los nombres actuales terminan en `.jpg` para facilitar el reemplazo directo. Si exportas a WebP/PNG, cambia la extensión en `src/data/assets.js` y en `src/content/projects.json` si aplica. Convierte a sRGB, elimina metadatos privados y conserva el original fuera del repositorio.

## Imágenes actuales que usa el sitio

| Ruta de reemplazo | Uso | Tamaño recomendado | Relación | Dirección para generar |
| --- | --- | ---: | ---: | --- |
| `public/images/profile/portrait.jpg` | Retrato de portada y página «Sobre mí» | 1200 × 1500 px | 4:5 | Retrato editorial cercano de Brais en su espacio de trabajo. Mantener identidad real a partir de una foto de referencia; no inventar rasgos ni sustituir por una persona sintética. |
| `public/images/lab/hero.png` | Imagen principal del laboratorio en la portada y portada del proyecto 001 | 1800 × 1013 px | 16:9 | Espacio maker/desarrollador realista, impresora 3D, electrónica, cuaderno, herramientas y ordenador; sin personas ni texto legible. |
| `public/images/lab/detail.svg` | Imagen interior del dossier del proyecto 001 | ViewBox 1200 × 800 | 3:2 | Ilustración vectorial nítida de una mesa de trabajo, con libros, bocetos, dados y tecnología. Si la sustituyes por una imagen rasterizada de IA, guárdala como `detail.jpg` y actualiza la ruta en `src/data/assets.js`. |
| `public/images/projects/rpg-bell.jpg` | Portada del proyecto 002 | 1600 × 1000 px | 8:5 | Campana de rol impresa en 3D como objeto protagonista en una mesa de juego, con dados y hojas; fotografía de producto creíble. |
| `public/images/projects/drawing.jpg` | Portada del proyecto 003 | 1600 × 1000 px | 8:5 | Cuaderno con estudios de dibujo, grafito, tinta y borrador; mostrar proceso e imperfecciones reales, sin texto añadido. |
| `public/images/projects/building-in-public.jpg` | Portada del proyecto 004 | 1600 × 1000 px | 8:5 | Proyecto a medio hacer en un escritorio, móvil en trípode, cámara, micrófono y luz; documental, sin estética de influencer genérica. |
| `public/images/projects/vault-42.jpg` | Portada del proyecto 005 y estantería de «Sobre mí» | 1600 × 1000 px | 8:5 | Home lab compacto con mini servidor, almacenamiento, red y luz natural; nada de direcciones IP o logotipos inventados. |
| `public/images/about/video-transcoder.jpg` | Tarjeta de trabajo AWS en «Sobre mí» | 1200 × 900 px | 4:3 | Concepto editorial de transcodificación de vídeo y nube, sin paneles de AWS falsos ni texto legible. |
| `public/images/about/gleenk.jpg` | Tarjeta del producto Gleenk en «Sobre mí» | 1200 × 900 px | 4:3 | Comunidad de hobbies e intereses representada como objetos compartidos; evitar personas identificables o interfaces ficticias con texto. |

Los ficheros de la tabla están presentes como imágenes actuales para que la web no quede rota mientras preparas las sustituciones. Las tarjetas de trayectoria usan iniciales tipográficas: no hacen falta logotipos de empresas ni hay que generarlos con IA.

## Imágenes nuevas para el cuaderno

Guarda fotografías de reseñas/notas en `public/images/notes/` y fotografías del collage en `public/images/journal/`. Usa nombres descriptivos en minúsculas, por ejemplo `public/images/journal/2026-10-31-prototipo.jpg`. Recomendación: 1600 px en el lado largo, calidad 85–90, WebP/JPEG y peso objetivo menor de 400 KB. El editor referencia la ruta absoluta del sitio, como `/images/journal/2026-10-31-prototipo.jpg`.

Los vídeos de YouTube, Twitch, TikTok e Instagram se insertan como URL de origen en el cuaderno visual; no descargues ni vuelvas a alojar vídeos de terceros. Se requiere que la plataforma permita la inserción y el usuario no haya desactivado embeds.

## Gráficos de identidad que no conviene generar como fotos

- `public/og.svg`: tarjeta social compartida. Mantén el vector y el wordmark oficiales; si se rediseña, exporta una versión de 1200 × 630 px (1.91:1), con alto contraste y texto legible en miniatura.
- `public/favicon.svg`: icono vectorial de marca. No usar una foto generada; conservar geometría simple y probarla a 16, 32 y 180 px.

## Revisión al sustituir

1. Sustituye el archivo conservando la ruta indicada.
2. Comprueba que el sujeto principal siga visible en recortes 16:10, 4:3 y móvil.
3. Actualiza el texto alternativo si cambia el contenido descrito; la imagen decorativa debe llevar `alt=""`.
4. Ejecuta `npm run build` y abre portada, archivo, trayectoria, «Sobre mí» y los dossiers en móvil/escritorio.
5. Comprueba que los nuevos archivos no incluyan firmas, rostros o marcas que no tengas derecho a publicar.
