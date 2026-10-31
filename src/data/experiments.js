import projectData from '../content/projects.json'
import { labHero, labDetail, videoBlaze, videoRoc, videoDice, legacyPi, legacyGleenk } from './assets.js'

const imageAssets = { labHero, labDetail, videoBlaze, videoRoc, videoDice, legacyPi }
const markdownFiles = import.meta.glob('../content/experiments/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

function readMarkdown(id, locale) {
  const key = `../content/experiments/${id}/${locale}.md`
  const content = markdownFiles[key]
  if (typeof content !== 'string') throw new Error(`Missing ${locale} Markdown for experiment ${id}: ${key}`)
  return content
    .replaceAll('{{labHero}}', labHero)
    .replaceAll('{{labDetail}}', labDetail)
}

const ids = new Set()
for (const project of projectData) {
  if (!/^\d{3}$/.test(project.id) || ids.has(project.id)) throw new Error(`Project ID must be a unique three-digit number: ${project.id}`)
  ids.add(project.id)
}

export const allProjects = projectData

export const experiments = projectData
  .filter(({ visibility }) => !['draft', 'archived'].includes(visibility))
  .map((project) => {
    const image = project.image?.startsWith('@') ? imageAssets[project.image.slice(1)] : project.image
    if (project.image?.startsWith('@') && !image) throw new Error(`Unknown project image asset: ${project.image}`)

    for (const locale of ['en', 'es']) {
      if (!project.title[locale]?.trim() || !project.summary[locale]?.trim()) {
        throw new Error(`Public project ${project.id} needs a title and summary in ${locale}.`)
      }
    }

    return {
      ...project,
      image,
      attachments: project.attachments || [],
      links: project.links || [],
      markdown: { en: readMarkdown(project.id, 'en'), es: readMarkdown(project.id, 'es') }
    }
  })

export const archiveVisuals = { wildcard: legacyGleenk }
export const getExperiment = (id) => experiments.find((project) => project.id === id)
