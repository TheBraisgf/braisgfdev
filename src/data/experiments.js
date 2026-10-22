import { labHero, legacyPi, legacyAws, legacyGleenk } from './assets.js'

export const experiments = [
  { id: '001', slug: 'make-the-lab-worth-visiting', image: labHero, accent: 'acid', attachments: [], links: [] },
  { id: '002', slug: 'build-a-better-digital-reader', image: legacyPi, accent: 'orange', attachments: [], links: [] },
  { id: '003', slug: 'learn-by-building-the-thing', image: legacyAws, accent: 'blue', attachments: [], links: [] }
]

export const archiveVisuals = { wildcard: legacyGleenk }
export const getExperiment = (id) => experiments.find((experiment) => experiment.id === id)
