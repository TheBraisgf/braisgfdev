import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const contentDirectory = resolve(root, 'src/content')
const editorDirectory = resolve(root, 'scripts/editor')
const host = '127.0.0.1'
const port = Number(process.env.BRAIS_EDITOR_PORT || 4179)
const token = randomBytes(32).toString('base64url')
const origin = `http://${host}:${port}`
const knownImageKeys = new Set(['labHero', 'labDetail', 'videoBlaze', 'videoRoc', 'videoDice', 'legacyPi'])
const validLocales = ['en', 'es']
const server = createServer(handleRequest)

if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('BRAIS_EDITOR_PORT must be an integer between 1024 and 65535.')

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') console.error(`The local editor port ${port} is already in use. Set BRAIS_EDITOR_PORT to another port.`)
  else console.error(error)
  process.exitCode = 1
})

server.listen(port, host, () => {
  console.log('Braisgf local content editor')
  console.log('Only this computer can reach it; do not expose or proxy this port.')
  console.log(`Open this one-time local link: ${origin}/#auth=${token}`)
  console.log('Press Ctrl+C to stop the editor.')
})

async function handleRequest(request, response) {
  setSecurityHeaders(response)
  if (request.headers.host !== `${host}:${port}`) return sendError(response, 421, 'Invalid local host.')

  const url = new URL(request.url, origin)
  if (request.method === 'GET' && url.pathname === '/') return serveAsset(response, 'editor.html', 'text/html; charset=utf-8')
  if (request.method === 'GET' && url.pathname === '/editor.css') return serveAsset(response, 'editor.css', 'text/css; charset=utf-8')
  if (request.method === 'GET' && url.pathname === '/editor.js') return serveAsset(response, 'editor.js', 'text/javascript; charset=utf-8')

  if (!url.pathname.startsWith('/api/')) return sendError(response, 404, 'Not found.')
  if (!safeEqual(request.headers.authorization || '', `Bearer ${token}`)) return sendError(response, 401, 'The editor session expired. Restart it from the terminal.')

  try {
    if (request.method === 'GET' && url.pathname === '/api/content') return sendJson(response, 200, await readWorkspace())
    if (request.method === 'PUT' && url.pathname === '/api/site-content') return await saveSiteContent(request, response)
    if (request.method === 'PUT' && url.pathname === '/api/editor-lists') return await saveEditorLists(request, response)
    if (request.method === 'PUT' && url.pathname === '/api/videos') return await saveVideos(request, response)
    if (request.method === 'POST' && url.pathname === '/api/projects') return await createProject(response)
    const match = url.pathname.match(/^\/api\/projects\/(\d{3})$/)
    if (request.method === 'PUT' && match) return await saveProject(request, response, match[1])
    sendError(response, 404, 'Not found.')
  } catch (error) {
    sendError(response, error.status || 500, error.status ? error.message : 'Could not read or save the workspace.')
  }
}

async function readWorkspace() {
  const projects = JSON.parse(await readFile(resolve(contentDirectory, 'projects.json'), 'utf8'))
  const videos = JSON.parse(await readFile(resolve(root, 'src/data/videos.json'), 'utf8'))
  const items = await Promise.all(projects.map(async (project) => {
    const markdown = {}
    for (const locale of validLocales) {
      markdown[locale] = await readFile(resolve(contentDirectory, `experiments/${project.id}/${locale}.md`), 'utf8').catch((error) => error.code === 'ENOENT' ? '' : Promise.reject(error))
    }
    return { ...project, markdown, version: projectVersion(project, markdown) }
  }))
  const siteContent = JSON.parse(await readFile(resolve(contentDirectory, 'site-content.json'), 'utf8'))
  const fieldNotes = JSON.parse(await readFile(resolve(contentDirectory, 'field-notes.json'), 'utf8'))
  const journal = JSON.parse(await readFile(resolve(contentDirectory, 'journal.json'), 'utf8'))
  return { projects: items, videos: videos.videos || [], videosVersion: digest(videos), siteContent, siteContentVersion: digest(siteContent), fieldNotes, fieldNotesVersion: digest(fieldNotes), journal, journalVersion: digest(journal) }
}

async function saveEditorLists(request, response) {
  const body = await readRequestJson(request)
  const notesPath = resolve(contentDirectory, 'field-notes.json')
  const journalPath = resolve(contentDirectory, 'journal.json')
  const currentNotes = JSON.parse(await readFile(notesPath, 'utf8'))
  const currentJournal = JSON.parse(await readFile(journalPath, 'utf8'))
  if (body.fieldNotesVersion !== digest(currentNotes) || body.journalVersion !== digest(currentJournal)) throw problem(409, 'Field notes or the visual journal changed on disk. Reload them before saving.')
  const { fieldNotes, journal } = body
  if (!Array.isArray(fieldNotes?.entries) || fieldNotes.entries.length > 1000 || !Array.isArray(journal?.items) || journal.items.length > 2000) throw problem(400, 'The field notes or journal list is invalid or too large.')
  const slugs = new Set()
  for (const entry of fieldNotes.entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug || '') || slugs.has(entry.slug)) throw problem(400, 'Every field note needs a unique lowercase slug separated by hyphens.')
    slugs.add(entry.slug)
    if (!['draft', 'public', 'archived'].includes(entry.visibility) || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '') || !entry.title?.es || !entry.title?.en || !entry.summary?.es || !entry.summary?.en || !entry.markdown?.es || !entry.markdown?.en) throw problem(400, `Field note “${entry.slug}” needs status, date and complete EN/ES title, summary and Markdown.`)
    if (entry.related && (!Array.isArray(entry.related) || entry.related.length > 50 || entry.related.some((related) => !related.label?.es || !related.label?.en || typeof related.href !== 'string' || !related.href.startsWith('/') || related.href.startsWith('//') || related.href.includes('\\')))) throw problem(400, `Related links in field note “${entry.slug}” must use bilingual labels and local paths.`)
  }
  const projects = JSON.parse(await readFile(resolve(contentDirectory, 'projects.json'), 'utf8'))
  for (const entry of fieldNotes.entries.filter((item) => item.visibility === 'public')) {
    ensureLinkedEntriesArePublic({ markdown: entry.markdown, projects, notes: fieldNotes.entries, message: `Field note “${entry.slug}” links to a project or note that is not public.` })
    for (const related of entry.related || []) ensureLocalContentLinkIsPublic(related.href, projects, fieldNotes.entries, `A related link in field note “${entry.slug}” does not point to public content.`)
  }
  const itemIds = new Set()
  for (const item of journal.items) {
    const mediaSource = item.type === 'image' ? item.src : (item.embedUrl || item.url)
    if (!item.id || itemIds.has(item.id) || !['draft', 'public', 'archived'].includes(item.visibility) || !['image', 'video'].includes(item.type) || !/^\d{4}-\d{2}-\d{2}$/.test(item.date || '') || !item.title?.es || !item.title?.en || !item.description?.es || !item.description?.en || !isLocalOrHttpsUrl(mediaSource || '') || !isHttpsUrl(item.url || '')) throw problem(400, 'Every journal entry needs a unique ID, visibility, date, valid media source, external URL and bilingual title/description.')
    itemIds.add(item.id)
  }
  await writeJsonAtomically(notesPath, fieldNotes)
  await writeJsonAtomically(journalPath, journal)
  sendJson(response, 200, { fieldNotes, fieldNotesVersion: digest(fieldNotes), journal, journalVersion: digest(journal) })
}

async function saveSiteContent(request, response) {
  const body = await readRequestJson(request)
  const path = resolve(contentDirectory, 'site-content.json')
  const current = JSON.parse(await readFile(path, 'utf8'))
  if (body.version !== digest(current)) throw problem(409, 'The editable site content changed on disk. Reload it before saving.')
  const next = body.content
  if (!next || typeof next !== 'object' || !Array.isArray(next.career) || !Array.isArray(next.poll?.options) || !Array.isArray(next.personality?.questions) || !next.personality?.profiles) throw problem(400, 'The site content needs career entries, poll options and personality questions and profiles.')
  if (next.career.length > 80 || next.poll.options.length > 20 || next.personality.questions.length < 5 || next.personality.questions.length > 8) throw problem(400, 'Career, poll or personality content exceeds the supported range (personality: 5–8 questions).')
  const localeText = (value, limit = 300) => ['es', 'en'].every((locale) => typeof value?.[locale] === 'string' && value[locale].length <= limit)
  if (!next.global?.navigation || !localeText(next.global.footer) || !localeText(next.global.banner, 240) || !isLocalOrHttpsUrl(next.global.banner.href || '/')) throw problem(400, 'Global navigation, banner and footer copy must use valid bilingual text and a local or HTTPS banner link.')
  for (const label of Object.values(next.global.navigation)) if (!localeText(label, 80)) throw problem(400, 'Every navigation label needs a short Spanish and English value.')
  if (!localeText(next.global.banner.label, 80)) throw problem(400, 'The optional banner link label must have Spanish and English values.')
  if (!localeText(next.poll.title, 160) || !localeText(next.poll.description, 320) || next.poll.options.length < 2) throw problem(400, 'The poll needs a bilingual title, description and at least two choices.')
  const pollIds = new Set()
  for (const option of next.poll.options) {
    if (!/^[a-z0-9-]+$/.test(option.id || '') || pollIds.has(option.id) || !localeText(option.label, 160) || !localeText(option.description, 240) || !['acid', 'blue', 'violet'].includes(option.accent) || !/^\d{3}$/.test(option.number || '')) throw problem(400, 'Every poll option needs a unique ID, bilingual copy, accent and three-digit project number.')
    pollIds.add(option.id)
  }
  for (const [id, profile] of Object.entries(next.personality.profiles)) if (!/^[a-z0-9-]+$/.test(id) || !localeText(profile.title, 100) || !localeText(profile.text, 1000)) throw problem(400, 'Every personality profile needs a valid ID and bilingual title and explanation.')
  const careerKeys = new Set()
  for (const item of next.career) {
    if (!/^[a-z0-9-]+$/.test(item.key || '') || careerKeys.has(item.key) || typeof item.year !== 'string' || item.year.length > 80 || !localeText(item.role, 160) || !localeText(item.company, 180) || !localeText(item.text, 1200) || !Array.isArray(item.highlights) || item.highlights.length > 30 || item.highlights.some((highlight) => !localeText(highlight, 180))) throw problem(400, 'Every career item needs a unique ID, bilingual role/company/description fields and valid bilingual highlights.')
    careerKeys.add(item.key)
  }
  for (const question of next.personality.questions) {
    if (!question.prompt?.es || !question.prompt?.en || !Array.isArray(question.answers) || question.answers.length !== 4 || question.answers.some((answer) => !answer.text?.es || !answer.text?.en || !next.personality.profiles[answer.type])) throw problem(400, 'Every personality question needs a bilingual prompt and four valid bilingual answers.')
  }
  await writeJsonAtomically(path, next)
  sendJson(response, 200, { content: next, version: digest(next) })
}

async function createProject(response) {
  const projects = JSON.parse(await readFile(resolve(contentDirectory, 'projects.json'), 'utf8'))
  const id = String(Math.max(0, ...projects.map((project) => Number(project.id) || 0)) + 1).padStart(3, '0')
  if (!/^\d{3}$/.test(id) || projects.some((project) => project.id === id)) throw problem(409, 'The next three-digit project ID is already in use.')
  const project = {
    id,
    slug: `new-experiment-${id}`,
    visibility: 'draft',
    image: '@labHero',
    accent: '#a98cff',
    type: 'MAKER',
    status: 'PLANNED',
    title: { es: `Nuevo experimento #${id}`, en: `New experiment #${id}` },
    summary: { es: '', en: '' },
    attachments: [],
    links: []
  }
  const markdown = { es: '', en: '' }
  const nextProjects = [...projects, project]
  await mkdir(resolve(contentDirectory, `experiments/${id}`), { recursive: true })
  await writeTextAtomically(resolve(contentDirectory, `experiments/${id}/es.md`), '')
  await writeTextAtomically(resolve(contentDirectory, `experiments/${id}/en.md`), '')
  await writeJsonAtomically(resolve(contentDirectory, 'projects.json'), nextProjects)
  const version = projectVersion(project, markdown)
  sendJson(response, 201, { project: { ...project, markdown, version } })
}

async function saveProject(request, response, id) {
  const body = await readRequestJson(request)
  const projects = JSON.parse(await readFile(resolve(contentDirectory, 'projects.json'), 'utf8'))
  const index = projects.findIndex((project) => project.id === id)
  if (index < 0) throw problem(404, 'Project not found.')

  const current = projects[index]
  const currentMarkdown = {}
  for (const locale of validLocales) currentMarkdown[locale] = await readFile(resolve(contentDirectory, `experiments/${id}/${locale}.md`), 'utf8').catch((error) => error.code === 'ENOENT' ? '' : Promise.reject(error))
  if (body.version !== projectVersion(current, currentMarkdown)) throw problem(409, 'This project changed on disk. Reload it before saving to avoid overwriting newer work.')

  const project = body.project
  const markdown = body.markdown
  validateProject(project, markdown, projects, id)
  if (project.visibility === 'public') {
    const notes = JSON.parse(await readFile(resolve(contentDirectory, 'field-notes.json'), 'utf8'))
    ensureLinkedEntriesArePublic({ markdown, projects, notes: notes.entries, message: 'Project Markdown links to a field note that is not public.' })
  }
  const nextProjects = [...projects]
  nextProjects[index] = project

  for (const locale of validLocales) await writeTextAtomically(resolve(contentDirectory, `experiments/${id}/${locale}.md`), markdown[locale])
  await writeJsonAtomically(resolve(contentDirectory, 'projects.json'), nextProjects)
  sendJson(response, 200, { project: { ...project, markdown, version: projectVersion(project, markdown) } })
}

function ensureLinkedEntriesArePublic({ markdown, projects, notes, message }) {
  for (const locale of validLocales) {
    const body = typeof markdown === 'string' ? markdown : markdown?.[locale] || ''
    for (const [, href] of body.matchAll(/!?\[[^\]]*\]\((\/[^)\s]+)\)/g)) ensureLocalContentLinkIsPublic(href, projects, notes, message)
  }
}

function ensureLocalContentLinkIsPublic(href, projects, notes, message) {
  const path = href.replace(/[?#].*$/, '').replace(/^\/es(?=\/)/, '')
  const projectMatch = path.match(/^\/experiments\/(\d{3})\/?$/)
  if (projectMatch && !projects.some((project) => project.id === projectMatch[1] && project.visibility === 'public')) throw problem(400, message)
  const noteMatch = path.match(/^\/notes\/([a-z0-9-]+)\/?$/)
  if (noteMatch && !notes.some((note) => note.slug === noteMatch[1] && note.visibility === 'public')) throw problem(400, message)
}

async function saveVideos(request, response) {
  const body = await readRequestJson(request)
  const path = resolve(root, 'src/data/videos.json')
  const current = JSON.parse(await readFile(path, 'utf8'))
  if (body.version !== digest(current)) throw problem(409, 'The video list changed on disk. Reload it before saving.')
  if (!Array.isArray(body.videos) || body.videos.length !== 6) throw problem(400, 'The homepage carousel needs exactly six videos.')

  const videos = body.videos.map((video) => {
    if (!video || !['TikTok', 'YouTube', 'Instagram', 'Twitch'].includes(video.social)) throw problem(400, 'Choose a supported video platform for every entry.')
    if (!['vertical', 'horizontal'].includes(video.orientation)) throw problem(400, 'Choose a valid video orientation for every entry.')
    if (!isHttpsUrl(video.url)) throw problem(400, 'Video URLs must use HTTPS.')
    return { social: video.social, orientation: video.orientation, url: video.url.trim() }
  })
  const saved = { videos }
  await writeJsonAtomically(path, saved)
  sendJson(response, 200, { videos, version: digest(saved) })
}

function validateProject(project, markdown, currentProjects, id) {
  if (!project || typeof project !== 'object' || project.id !== id) throw problem(400, 'Project data is invalid.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || '')) throw problem(400, 'Use a lowercase URL slug with words separated by hyphens.')
  if (currentProjects.some((item) => item.id !== id && item.slug === project.slug)) throw problem(409, 'That project URL is already in use.')
  if (!['public', 'draft', 'archived'].includes(project.visibility)) throw problem(400, 'Choose draft, public or archived visibility.')
  if (!/^#[\da-f]{6}$/i.test(project.accent || '')) throw problem(400, 'Accent color must be a six-digit hex value.')
  if (typeof project.type !== 'string' || !project.type.trim() || project.type.length > 40) throw problem(400, 'Project type is required (maximum 40 characters).')
  if (typeof project.status !== 'string' || !project.status.trim() || project.status.length > 40) throw problem(400, 'Project status is required (maximum 40 characters).')
  if (project.year !== undefined && project.year !== '' && !/^\d{4}$/.test(String(project.year))) throw problem(400, 'Project year must contain four digits or be empty.')
  if (typeof project.image !== 'string' || !isLocalOrHttpsUrl(project.image) && !isImageToken(project.image)) throw problem(400, 'Project images must use an imported image, a root-relative path or HTTPS.')

  for (const locale of validLocales) {
    if (typeof project.title?.[locale] !== 'string' || project.title[locale].length > 160) throw problem(400, `The ${locale} title is invalid.`)
    if (typeof project.summary?.[locale] !== 'string' || project.summary[locale].length > 320) throw problem(400, `The ${locale} summary is invalid.`)
    if (typeof markdown?.[locale] !== 'string' || Buffer.byteLength(markdown[locale], 'utf8') > 1_000_000) throw problem(400, `The ${locale} Markdown body is invalid or exceeds 1 MB.`)
    if (project.visibility === 'public' && (!project.title[locale].trim() || !project.summary[locale].trim() || !markdown[locale].trim())) {
      throw problem(400, `Add a title, summary and Markdown body in ${locale} before publishing.`)
    }
  }

  for (const collection of ['attachments', 'links']) {
    if (!Array.isArray(project[collection]) || project[collection].length > 100) throw problem(400, `${collection} must be a list of at most 100 items.`)
    for (const resource of project[collection]) {
      if (!resource || typeof resource.label !== 'string' || !resource.label.trim() || resource.label.length > 180 || !isLocalOrHttpsUrl(resource.href)) {
        throw problem(400, `Every ${collection} entry needs a label and an HTTPS or root-relative URL.`)
      }
    }
  }
}

async function readRequestJson(request) {
  if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) throw problem(415, 'Send JSON using the application/json content type.')
  let size = 0
  const chunks = []
  for await (const chunk of request) {
    size += chunk.length
    if (size > 2_000_000) throw problem(413, 'Request body exceeds the 2 MB limit.')
    chunks.push(chunk)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw problem(400, 'Request JSON is malformed.') }
}

function isHttpsUrl(value) {
  if (typeof value !== 'string') return false
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

function isLocalOrHttpsUrl(value) {
  return typeof value === 'string' && (isHttpsUrl(value) || (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')))
}

function isImageToken(value) {
  return typeof value === 'string' && value.startsWith('@') && knownImageKeys.has(value.slice(1))
}

function projectVersion(project, markdown) { return digest({ project, markdown }) }
function digest(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex') }
function problem(status, message) { return Object.assign(new Error(message), { status }) }

function safeEqual(actual, expected) {
  const left = Buffer.from(actual)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

async function writeJsonAtomically(path, data) { await writeTextAtomically(path, `${JSON.stringify(data, null, 2)}\n`) }

async function writeTextAtomically(path, text) {
  const temporary = `${path}.${randomBytes(8).toString('hex')}.tmp`
  await mkdir(dirname(path), { recursive: true })
  await writeFile(temporary, text, 'utf8')
  await rename(temporary, path)
}

async function serveAsset(response, filename, contentType) {
  const file = await readFile(resolve(editorDirectory, filename))
  response.writeHead(200, { 'Content-Type': contentType, 'Content-Length': file.length })
  response.end(file)
}

function sendJson(response, status, value) {
  const json = JSON.stringify(value)
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(json) })
  response.end(json)
}

function sendError(response, status, message) { sendJson(response, status, { error: message }) }

function setSecurityHeaders(response) {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'no-referrer')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
}
