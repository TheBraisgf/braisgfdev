import { labHero, legacyPi, legacyAws, legacyGleenk } from './assets.js'

export const experiments = [
  {
    id: '001',
    slug: 'make-the-lab-worth-visiting',
    image: labHero,
    accent: '#b7ff3c',
    attachments: [],
    links: [],
    markdown: {
      es: `## El laboratorio es el experimento

Un laboratorio personal es más interesante cuando documenta **intentos**, no solo éxitos.

![El laboratorio personal](${labHero})

### La idea

Esta web es la casa para todo lo que construyo, aprendo, rompo y, de vez en cuando, termino.

No quiero que cada proyecto tenga que convertirse en un portfolio perfecto. Quiero poder enseñar el proceso: decisiones, prototipos, errores, archivos y resultados.

> El objetivo no es que todo salga bien. Es que siempre haya algo nuevo que probar.

### Y esto es solo el principio

A partir de aquí, cada curiosidad puede convertirse en un experimento numerado. El siguiente puede ser software, hardware, una historia, una pieza física o algo completamente absurdo.`,
      en: `## The lab is the experiment

A personal lab is more interesting when it documents **attempts**, not just successes.

![The personal lab](${labHero})

### The idea

This site is the home for everything I build, learn, break and, occasionally, finish.

I do not want every project to become a polished portfolio piece. I want to show the process: decisions, prototypes, failures, files and results.

> The goal is not for everything to work. The goal is to always have something new to try.

### And this is only the beginning

From here, every curiosity can become a numbered experiment. The next one might be software, hardware, a story, a physical object or something completely absurd.`
    }
  },
  {
    id: '002',
    slug: 'build-a-better-digital-reader',
    image: legacyPi,
    accent: '#a98cff',
    attachments: [],
    links: [],
    markdown: { es: '', en: '' }
  },
  {
    id: '003',
    slug: 'learn-by-building-the-thing',
    image: legacyAws,
    accent: '#8bb8ff',
    attachments: [],
    links: [],
    markdown: { es: '', en: '' }
  }
]

export const archiveVisuals = { wildcard: legacyGleenk }
export const getExperiment = (id) => experiments.find((experiment) => experiment.id === id)
