import { experiments } from './experiments.js'
import { fieldNotes } from './fieldNotes.js'

export const SITE_URL = 'https://braisgf.dev'

export function getPageMetadata(pathname) {
  const path = pathname.replace(/\/$/, '') || '/'
  const spanish = path === '/es' || path.startsWith('/es/')
  const localPath = spanish ? path.slice(3) || '/' : path
  const experimentMatch = localPath.match(/^\/experiments\/(\d{3})$/)
  const experiment = experimentMatch && experiments.find(({ id }) => id === experimentMatch[1])
  const noteMatch = localPath.match(/^\/notes\/([a-z0-9-]+)$/)
  const note = noteMatch && fieldNotes.find((entry) => entry.slug === noteMatch[1] && entry.visibility === 'public')

  if (experiment) {
    const title = experiment.title[spanish ? 'es' : 'en']
    return {
      path, spanish, title: `${title} — ${spanish ? 'Experimento' : 'Experiment'} #${experiment.id} | Braisgf.dev`,
      description: experiment.summary[spanish ? 'es' : 'en'], type: 'article', experiment
    }
  }
  if (note) return { path, spanish, title: `${note.title[spanish ? 'es' : 'en']} — ${spanish ? 'Nota de campo' : 'Field note'} | Braisgf.dev`, description: note.summary[spanish ? 'es' : 'en'], type: 'article', note }

  const pages = {
    '/': {
      en: ['Braisgf.dev — Personal Lab for Software, Making and Experiments', "I'm Brais: developer and maker. Follow real experiments in software, creative work, learning and things built in public."],
      es: ['Braisgf.dev — Laboratorio personal de proyectos y experimentos', 'Soy Brais, programador y maker. Comparto experimentos reales de software, creación, aprendizaje y proyectos en proceso.']
    },
    '/experiments': {
      en: ['Projects and Experiments | Braisgf.dev', 'Browse Brais’ project archive: software, maker builds, learning challenges and creative experiments, with notes on the process.'],
      es: ['Proyectos y experimentos | Braisgf.dev', 'Explora el archivo de proyectos de Brais: software, proyectos maker, retos de aprendizaje y experimentos creativos con notas del proceso.']
    },
    '/about': {
      en: ['About Brais — Developer and Maker | Braisgf.dev', 'Meet Brais: a developer and maker who learns by building software, physical projects and creative experiments.'],
      es: ['Sobre Brais — Programador y maker | Braisgf.dev', 'Conoce a Brais: programador y maker que aprende creando software, proyectos físicos y experimentos creativos.']
    },
    '/career': {
      en: ['Career and Professional Experience | Braisgf.dev', 'Explore Brais’ professional path across software development, AI, creative production and technology.'],
      es: ['Trayectoria y experiencia profesional | Braisgf.dev', 'Recorre la trayectoria profesional de Brais en desarrollo de software, IA, producción creativa y tecnología.']
    },
    '/notes': { en: ['Field Notes — Reviews and Ideas | Braisgf.dev', 'Reviews, observations and ideas from Brais that do not need to become a project.'], es: ['Notas de campo — Reseñas e ideas | Braisgf.dev', 'Reseñas, observaciones e ideas de Brais que no necesitan convertirse en un proyecto.'] },
    '/journal': { en: ['Visual Journal — Photos and Videos | Braisgf.dev', 'A dated visual log of videos, photographs and moments from Brais’ creative process.'], es: ['Cuaderno visual — Fotos y vídeos | Braisgf.dev', 'Un registro visual fechado de vídeos, fotografías y momentos del proceso creativo de Brais.'] }
  }
  if (!pages[localPath]) return { path, spanish, title: spanish ? 'Página no encontrada | Braisgf.dev' : 'Page not found | Braisgf.dev', description: '', type: 'website', notFound: true }
  const entry = pages[localPath]
  const [title, description] = entry[spanish ? 'es' : 'en']
  return { path, spanish, title, description, type: 'website' }
}

export function getPageStructuredData(metadata) {
  const canonical = `${SITE_URL}${metadata.path === '/' ? '/' : metadata.path}`
  const graph = [
    { '@type': 'Person', '@id': `${SITE_URL}/#brais`, name: 'Brais', alternateName: 'Braisgf', url: `${SITE_URL}/`, jobTitle: 'Developer and maker', sameAs: ['https://github.com/TheBraisgf', 'https://www.linkedin.com/in/braisgf', 'https://www.youtube.com/@braisgfroom', 'https://www.tiktok.com/@braisgfroom', 'https://www.instagram.com/braisgfroom', 'https://www.twitch.tv/braisgfroom'] },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Braisgf.dev', inLanguage: ['en', 'es'], publisher: { '@id': `${SITE_URL}/#brais` } },
    { '@type': metadata.experiment || metadata.note ? 'Article' : 'WebPage', '@id': `${canonical}#page`, url: canonical, name: metadata.title, description: metadata.description, inLanguage: metadata.spanish ? 'es' : 'en', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#brais` }, ...(metadata.experiment || metadata.note ? { author: { '@id': `${SITE_URL}/#brais` }, headline: metadata.experiment?.title[metadata.spanish ? 'es' : 'en'] || metadata.note?.title[metadata.spanish ? 'es' : 'en'], mainEntityOfPage: canonical } : {}) }
  ]
  const alternateBase = metadata.path.startsWith('/es') ? metadata.path.slice(3) || '/' : metadata.path
  const alternateEn = `${SITE_URL}${alternateBase === '/' ? '/' : alternateBase}`
  const alternateEs = `${SITE_URL}/es${alternateBase === '/' ? '' : alternateBase}`
  return { graph, alternates: { en: alternateEn, es: alternateEs, default: alternateEn } }
}
