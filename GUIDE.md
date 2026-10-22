# GUIDE — Mantener y publicar braisgf.dev

Esta guía existe para que dentro de seis meses puedas volver al repositorio y saber exactamente qué tocar sin reconstruir la web desde cero.

## 1. Regla principal

**El código define la experiencia. Los datos definen el contenido.**

No dupliques páginas para cada idioma ni copies HTML para cada publicación.

La aplicación está hecha con React + Vite. La traducción de interfaz vive en `src/i18n/` y el contenido reutilizable vive en `src/data/`.

---

## 2. Estructura que importa

```text
src/
├── components/          # Piezas reutilizables de UX
│   ├── AccessibilityMenu.jsx
│   ├── CommunityLab.jsx
│   ├── LabTest.jsx
│   ├── Layout.jsx
│   ├── ResourceList.jsx
│   ├── ValuesLoop.jsx
│   └── VideoGallery.jsx
├── data/
│   ├── experiments.js   # Índice de experimentos + recursos
│   └── site.js          # Valores, vídeos, carrera y comunidad
├── i18n/
│   ├── config.js
│   ├── en.json
│   └── es.json
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Career.jsx
│   ├── Archive.jsx
│   ├── Experiment.jsx
│   └── Notes.jsx
└── styles/
    ├── global.css
    └── resources.css

public/
├── robots.txt
├── sitemap.xml
└── files/              # Archivos descargables / adjuntos de publicaciones
```

Los assets históricos están en `assets/`. No los dupliques sin necesidad.

---

## 3. Cómo añadir un experimento / publicación

Abre `src/data/experiments.js` y añade una entrada:

```js
{
  id: '004',
  slug: 'nombre-del-experimento',
  image: '/assets/labImg/imagen.jpg',
  attachments: [
    {
      label: 'Código fuente',
      href: '/files/004/source.zip',
      kind: 'ZIP'
    },
    {
      label: 'Informe PDF',
      href: '/files/004/report.pdf',
      kind: 'PDF'
    },
    {
      label: 'Demo online',
      href: 'https://example.com',
      kind: 'URL',
      external: true
    }
  ],
  links: []
}
```

Después añade las traducciones en `src/i18n/en.json` y `src/i18n/es.json` bajo `experiments.004`.

### El dossier admite cualquier tipo de recurso

El sistema de recursos no está limitado a imágenes:

- imágenes: JPG, JPEG, PNG, GIF, WebP, AVIF, SVG
- vídeo: MP4, WebM, MOV, M4V
- audio: MP3, WAV, OGG, M4A, FLAC
- documentos: PDF
- código: `.js`, `.ts`, `.py`, `.cpp`, `.html`, `.css`, etc.
- comprimidos: ZIP, 7Z, TAR, GZ, RAR, etc.
- modelos y binarios: STL, OBJ, GLB, APK, EXE, etc.
- URLs externas

Los formatos conocidos se previsualizan. El resto se presenta como archivo descargable/enlazable.

### Dónde poner los archivos

Para un experimento concreto:

```text
public/files/004/
├── source.zip
├── report.pdf
├── prototype.mp4
├── wiring.png
└── notes.txt
```

**No hace falta registrar cada extensión en React.** Solo hay que añadir el recurso al array `attachments`.

Para archivos muy grandes, no metas gigabytes en Git. Usa almacenamiento externo, releases o un servicio de objetos y guarda la URL como `external: true`.

---

## 4. Publicar un artículo o nota antigua

Las notas antiguas se mantienen en `src/i18n/en.json` y `src/i18n/es.json` dentro de `notes.items`.

Si una nota crece hasta convertirse en una publicación importante, conviértela en una publicación/dossier propio en vez de seguir aumentando el componente de notas.

La regla es:

> **Una página = una idea que merece ser encontrada, compartida y conservada.**

Esto también ayuda al SEO: cada pieza importante debe tener una URL estable, título descriptivo, descripción y contenido propio.

---

## 5. Cómo actualizar los vídeos

Edita `src/data/site.js`:

```js
export const videos = [
  {
    id: '05',
    image: '/assets/labImg/mi-miniatura.jpg',
    platform: 'YouTube',
    title: 'Mi nuevo experimento',
    url: 'https://www.youtube.com/watch?v=...'
  }
]
```

Añade el texto traducido en `videos.05` de ambos JSON.

La galería está pensada como **puerta de entrada**, no como el centro de la web. El vídeo dice "sí, este es el Brais que conoces de redes" y el CTA intenta llevar al visitante al laboratorio.

---

## 6. Cambiar "Imaginar → Crear → Compartir → Repetir"

El componente está en `src/components/ValuesLoop.jsx`.

El contenido está en:

```text
src/i18n/en.json
src/i18n/es.json
```

Cada etapa tiene:

- título
- titular
- explicación
- color/acento

No cambies el componente para modificar el texto. Cambia las traducciones.

---

## 7. Cambiar la encuesta

Las opciones viven en `src/data/site.js` (`pollOptions`).

El texto vive en `poll` dentro de los JSON de idioma.

Actualmente la selección local se recuerda en `localStorage`. El enlace de votación pública apunta a GitHub Discussions para que exista un espacio comunitario real y auditable.

Si se habilita un backend de votación posteriormente, **mantén el componente `CommunityLab` como interfaz** y cambia solo la capa de persistencia. No vuelvas a meter lógica de backend en la landing.

---

## 8. Buzón de sugerencias

El buzón abre una nueva propuesta de GitHub Issue con el texto escrito por el visitante.

Esto evita crear un formulario propio con una base de datos y, al mismo tiempo, deja las ideas públicas y moderables.

Si en el futuro se añade un backend propio, conserva la misma UX y sustituye únicamente `sendSuggestion()`.

---

## 9. Test / minijuego

`src/components/LabTest.jsx` contiene el pequeño test de visitante del lab.

Es deliberadamente local:

- no guarda datos
- no necesita backend
- no usa analytics para calcular el resultado
- se puede repetir

Si se amplía, mantén el resultado rápido, compartible y sin convertirlo en un cuestionario interminable.

---

## 10. Accesibilidad

El menú de accesibilidad está siempre disponible mediante el pequeño botón `A` de la esquina inferior izquierda.

También se puede abrir con:

```text
Alt + A
```

Incluye:

- texto grande
- contraste alto
- enlaces subrayados
- reducción de movimiento
- restauración de preferencias

Además existe un enlace "Saltar al contenido principal" visible al recibir foco.

No elimines los `aria-*`, los estados `aria-selected`/`aria-pressed` ni los elementos semánticos al editar componentes.

La reducción de movimiento también respeta `prefers-reduced-motion`.

---

## 11. SEO

El SEO se trata como parte de la arquitectura, no como una capa de keywords al final.

La app genera en navegación:

- `<title>` específico
- `description`
- canonical
- `hreflang` EN/ES/x-default
- Open Graph
- datos estructurados JSON-LD de persona, sitio y página

También existen:

```text
public/robots.txt
public/sitemap.xml
```

### Regla para nuevas páginas

Una página nueva debe tener:

1. URL legible.
2. Título específico.
3. Descripción específica.
4. Contenido que aporte algo por sí mismo.
5. Enlace desde otra página relevante.
6. Variante EN/ES si corresponde.
7. Entrada en `public/sitemap.xml` si es una página indexable permanente.

No generes páginas vacías solo para posicionar palabras clave.

El objetivo es que Google y otros sistemas de descubrimiento puedan entender quién es Brais, qué hace y qué ha construido, pero siempre con contenido real para personas.

---

## 12. Contador de visitas

El contador usa GoatCounter.

Configura en Vercel:

```text
VITE_GOATCOUNTER_CODE=tu-codigo
```

Sin esa variable el sitio simplemente muestra `—`; **no rompe la página**.

La integración está pensada para ser ligera y respetuosa con la privacidad.

---

## 13. Desarrollo local

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

Antes de publicar:

- probar `/`
- probar `/es`
- abrir `/about` y `/es/about`
- abrir `/career` y `/es/career`
- abrir los tres experimentos en ambos idiomas
- probar el cambio de idioma desde una página profunda
- probar móvil
- activar todas las opciones de accesibilidad
- comprobar consola sin errores
- comprobar que los assets cargan

---

## 14. Despliegue

Vercel debe desplegar la rama `DEV` durante esta fase.

`vercel.json` declara explícitamente:

```text
npm run build
output: dist
SPA rewrite: /(.*) → /index.html
```

Cuando el sitio esté validado visual y funcionalmente, se hará el merge a `main`.

---

## 15. Filosofía del repositorio

No volver a crear:

- una carpeta HTML por idioma
- un CSS por página
- un JS duplicado para cada sección
- componentes gigantes que hagan veinte cosas
- páginas creadas solo para "tener más SEO"
- una nueva librería para cada animación

Sí crear:

- componentes pequeños
- contenido separado de presentación
- URLs estables
- recursos reutilizables
- experiencias que tengan un motivo para existir
- accesibilidad desde el principio
- documentación cuando una decisión no sea obvia

**La web es un laboratorio. El repositorio también debería sentirse como uno.**
