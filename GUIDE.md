# GUIDE — Mantener y publicar braisgf.dev

La web es un **laboratorio personal vivo**. El código define la experiencia; los datos definen el contenido.

## Arquitectura

```text
src/
├── components/          # UX reutilizable + interacciones
│   ├── AccessibilityMenu.jsx
│   ├── CommunityLab.jsx
│   ├── LabTest.jsx
│   ├── Layout.jsx
│   ├── LivePulse.jsx
│   ├── ResourceList.jsx
│   ├── Reveal.jsx
│   ├── TikTokFeed.jsx
│   ├── ValuesLoop.jsx
│   └── VideoGallery.jsx
├── data/
│   ├── assets.js
│   ├── experiments.js
│   └── site.js
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
    ├── navigation.css
    ├── resources.css
    ├── about.css
    ├── experience.css
    ├── community.css
    └── motion.css

public/
├── robots.txt
├── sitemap.xml
└── files/              # Adjuntos de experimentos
```

Los assets históricos siguen disponibles en `main` y se consumen temporalmente mediante URLs raw para no perder material mientras se sustituyen por fotografías nuevas.

## Experimentos

Añade el índice en `src/data/experiments.js`:

```js
{
  id: '004',
  slug: 'nombre-del-experimento',
  image: '/ruta/o/import',
  accent: 'acid',
  attachments: [],
  links: []
}
```

Después añade las traducciones en `src/i18n/en.json` y `src/i18n/es.json` bajo `experiments.004`.

El dossier acepta recursos arbitrarios:

- imágenes
- vídeo
- audio
- PDF
- código
- ZIP/7Z/TAR/GZ/RAR
- STL/OBJ/GLB/APK/EXE
- URLs externas

Para archivos propios usa:

```text
public/files/004/
├── source.zip
├── report.pdf
├── prototype.mp4
└── notes.txt
```

Los formatos conocidos se previsualizan. Los demás se ofrecen como descarga/enlace.

## Vídeos

La galería tiene dos capas:

1. **TikTok live**: `TikTokFeed.jsx` embebe el perfil de `@braisgfroom`. TikTok mantiene ahí la selección de vídeos recientes, así que no hay que congelar manualmente una miniatura cada vez que publiques.
2. **Archivo social**: `src/data/site.js` mantiene enlaces visuales a YouTube, Twitch y otras plataformas.

Si cambias la estrategia de vídeo, conserva la idea: la web debe enseñar contenido real y reciente, no capturas decorativas.

## Comunidad

La encuesta pública ya no depende de GitHub Discussions.

`CommunityLab.jsx` genera una **encuesta pública sin cuenta** mediante el Quick Poll público de Polling.com. La selección rápida de la propia web sigue siendo local para ofrecer feedback inmediato sin obligar a nadie a salir de la página.

### Buzón de ideas

El formulario acepta un endpoint externo mediante:

```text
VITE_SUGGESTION_ENDPOINT=https://tu-endpoint-de-formulario
```

Si la variable existe, se envía JSON a ese endpoint. Si no existe, se abre el cliente de correo del visitante con la sugerencia preparada.

Para un buzón público real, conecta un endpoint de formularios (por ejemplo FormSubmit/FormDrop/Formz o uno propio) en Vercel. **No metas claves privadas en el frontend.**

## Interacciones

`Reveal.jsx` proporciona entrada por scroll mediante `IntersectionObserver`.

`LivePulse.jsx` rota señales del laboratorio.

`ValuesLoop.jsx` cambia automáticamente entre IMAGINE → CREATE → SHARE → REPEAT y también admite interacción manual.

La reducción de movimiento se respeta mediante `prefers-reduced-motion` y el menú de accesibilidad.

## Carrera profesional

`Career.jsx` usa la trayectoria profesional y recupera temporalmente los logos históricos de:

- Universidad
- formación audiovisual
- Hack A Boss
- Zara
- Santander

Cada evento tiene su propio acento, logo, microanimación y comportamiento hover.

Cuando haya fotografías/proyectos nuevos, sustituye `careerLogos` en `src/data/assets.js`.

## Accesibilidad

El menú `A` permite:

- texto grande
- contraste alto
- enlaces subrayados
- reducción de movimiento
- restaurar preferencias

También existe un skip-link y estados ARIA en los controles interactivos.

## SEO

La aplicación actualiza por ruta:

- `<title>`
- description
- canonical
- `hreflang` EN/ES/x-default
- Open Graph
- JSON-LD de persona, sitio y página

También existen `public/robots.txt` y `public/sitemap.xml`.

Una página indexable nueva necesita URL estable, título, descripción, contenido real y entrada en sitemap.

## Contador

El contador usa GoatCounter.

Configura en Vercel:

```text
VITE_GOATCOUNTER_CODE=tu-codigo
```

Sin esa variable se muestra `—`; no se inventa una cifra.

## Desarrollo

```bash
npm install
npm run dev
npm run build
npm run preview
```

Antes de publicar revisa EN/ES, rutas profundas, móvil, accesibilidad, consola y carga de assets.

## Despliegue

Durante esta fase Vercel debe desplegar `DEV`. `main` permanece como referencia del sitio anterior hasta que la nueva experiencia esté validada.

## Regla creativa

No convertir la web en una colección de animaciones sin propósito.

La sensación buscada es:

> **cada visita encuentra algo distinto, pero todo parece pertenecer al mismo laboratorio.**

Movimiento, imágenes, vídeo, datos, estados, hover, scroll y pequeñas sorpresas deben reforzar esa sensación sin convertirla en una feria de efectos.
