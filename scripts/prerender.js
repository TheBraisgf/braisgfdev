import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const siteUrl = 'https://braisgf.dev'
const server = await createServer({ configFile: resolve(root, 'vite.config.js'), server: { middlewareMode: true }, appType: 'custom' })

try {
  const [{ default: App }, { default: i18n }, { experiments }, { fieldNotes }, { getPageMetadata, getPageStructuredData }] = await Promise.all([
    server.ssrLoadModule('/src/App.jsx'),
    server.ssrLoadModule('/src/i18n/config.js'),
    server.ssrLoadModule('/src/data/experiments.js'),
    server.ssrLoadModule('/src/data/fieldNotes.js'),
    server.ssrLoadModule('/src/data/seo.js')
  ])
  const { MemoryRouter } = await import('react-router-dom')
  const template = await readFile(resolve(root, 'dist/index.html'), 'utf8')
  for (const project of experiments) {
    for (const locale of ['en', 'es']) {
      const markdown = project.markdown[locale]
      if (markdown.includes('\\n') && !/\r?\n/.test(markdown)) {
        throw new Error(`Experiment ${project.id} (${locale}) contains escaped newline text instead of Markdown line breaks.`)
      }
    }
  }
  const routes = ['/', '/es', '/experiments', '/es/experiments', '/about', '/es/about', '/career', '/es/career', '/notes', '/es/notes', '/journal', '/es/journal', ...fieldNotes.filter(({ visibility }) => visibility === 'public').flatMap(({ slug }) => [`/notes/${slug}`, `/es/notes/${slug}`]), ...experiments.flatMap(({ id }) => [`/experiments/${id}`, `/es/experiments/${id}`]), '/404']

  for (const route of routes) {
    const metadata = getPageMetadata(route)
    await i18n.changeLanguage(metadata.spanish ? 'es' : 'en')
    const markup = await renderPage(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)))
    const { graph, alternates } = getPageStructuredData(metadata)
    const head = [
      `<title>${escapeHtml(metadata.title)}</title>`,
      `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
      '<meta name="author" content="Brais" />',
      `<meta name="robots" content="${metadata.notFound ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}" />`,
      `<link rel="canonical" href="${siteUrl}${route === '/' ? '/' : route}" />`,
      `<link rel="alternate" hreflang="en" href="${alternates.en}" />`,
      `<link rel="alternate" hreflang="es" href="${alternates.es}" />`,
      `<link rel="alternate" hreflang="x-default" href="${alternates.default}" />`,
      `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
      `<meta property="og:url" content="${siteUrl}${route === '/' ? '/' : route}" />`,
      `<meta property="og:type" content="${metadata.type}" />`,
      `<meta property="og:image" content="${siteUrl}/og.svg" />`,
      `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
      `<meta name="twitter:image" content="${siteUrl}/og.svg" />`,
      `<script id="structured-data" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`
    ].join('\n    ')

    let html = template.replace(/<html lang="[^"]*">/, `<html lang="${metadata.spanish ? 'es' : 'en'}">`)
    html = html.replace(/\s*<title>[\s\S]*?<\/title>/i, '')
      .replace(/\s*<meta\s+name="description"[^>]*>/i, '')
      .replace(/\s*<meta\s+name="author"[^>]*>/i, '')
      .replace(/\s*<meta\s+name="robots"[^>]*>/i, '')
      .replace(/\s*<meta\s+(?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/gi, '')
      .replace(/\s*<link\s+rel="canonical"[^>]*>/i, '')
      .replace(/\s*<link\s+rel="alternate"[^>]*>/gi, '')
      .replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, '')
    html = html.replace('</head>', `    ${head}\n  </head>`)
      .replace(/<div id="root"><\/div>/, `<div id="root">${markup}</div>`)

    const output = route === '/' ? resolve(root, 'dist/index.html') : route === '/404' ? resolve(root, 'dist/404.html') : resolve(root, `dist${route}/index.html`)
    if (route === '/404') html = html.replace(/\s*<script\s+type="module"[^>]*><\/script>/i, '').replace(/\s*<link\s+rel="modulepreload"[^>]*>/gi, '')
    validateRenderedPage(html, metadata, route)
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, html)
  }

  const sitemapEntries = routes.filter((route) => !getPageMetadata(route).notFound).map((route) => {
    const base = route.startsWith('/es') ? route.slice(3) || '/' : route
    const en = `${siteUrl}${base === '/' ? '/' : base}`
    const es = `${siteUrl}/es${base === '/' ? '' : base}`
    const loc = `${siteUrl}${route === '/' ? '/' : route}`
    return `  <url>\n    <loc>${loc}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${en}" />\n    <xhtml:link rel="alternate" hreflang="es" href="${es}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />\n  </url>`
  }).join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`
  await writeFile(resolve(root, 'dist/sitemap.xml'), sitemap)
  await writeFile(resolve(root, 'public/sitemap.xml'), sitemap)
  validateDiscoveryFiles(sitemap, routes.filter((route) => !getPageMetadata(route).notFound).length, await readFile(resolve(root, 'dist/robots.txt'), 'utf8'))

  const llms = `# Braisgf.dev\n\n> Personal lab of Brais: software, maker projects, learning challenges and creative experiments, documented in English and Spanish.\n\nThe site is a primary source for Brais’ own projects and professional background. Project pages describe work in progress; do not assume a project is finished unless its page says so.\n\n## Main pages\n\n- [Home (English)](${siteUrl}/): Introduction and featured experiments.\n- [Projects (English)](${siteUrl}/experiments): Bilingual project archive.\n- [About (English)](${siteUrl}/about): Background and interests.\n- [Career (English)](${siteUrl}/career): Professional experience.\n- [Field notes (English)](${siteUrl}/notes): Reviews, observations and ideas outside the project archive.\n- [Visual journal (English)](${siteUrl}/journal): Dated photos and videos from the creative process.\n- [Inicio (español)](${siteUrl}/es): Presentación y proyectos destacados.\n- [Proyectos (español)](${siteUrl}/es/experiments): Archivo de proyectos.\n- [Sobre Brais (español)](${siteUrl}/es/about): Trayectoria e intereses.\n- [Trayectoria profesional (español)](${siteUrl}/es/career): Experiencia profesional.\n\n## Experiments\n\n${experiments.map((project) => `- [#${project.id}: ${project.title.en}](${siteUrl}/experiments/${project.id}) — ${project.summary.en}`).join('\n')}\n\n## Discovery\n\n- [XML sitemap](${siteUrl}/sitemap.xml)\n- [Robots policy](${siteUrl}/robots.txt)\n`
  await writeFile(resolve(root, 'dist/llms.txt'), llms)
  await writeFile(resolve(root, 'public/llms.txt'), llms)
  console.log(`Prerendered ${routes.length - 1} localized pages plus a custom 404 page; generated sitemap.xml and llms.txt.`)
} finally {
  await server.close()
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function validateRenderedPage(html, metadata, route) {
  const problems = []
  const requireMatch = (pattern, label) => { if (!pattern.test(html)) problems.push(label) }
  requireMatch(new RegExp(`<html lang="${metadata.spanish ? 'es' : 'en'}">`), 'idioma HTML')
  requireMatch(new RegExp(`<title>${escapeRegExp(escapeHtml(metadata.title))}<\\/title>`), 'título')
  if (!metadata.notFound) {
    requireMatch(/<meta name="description" content="[^"<>]+"\s*\/>/, 'descripción')
    requireMatch(new RegExp(`<link rel="canonical" href="${escapeRegExp(siteUrl + (route === '/' ? '/' : route))}"\\s*\\/>`), 'canonical')
    requireMatch(/<link rel="alternate" hreflang="en" href="https:\/\/braisgf\.dev\//, 'alternate en inglés')
    requireMatch(/<link rel="alternate" hreflang="es" href="https:\/\/braisgf\.dev\//, 'alternate en español')
    requireMatch(/<meta property="og:title" content="[^"<>]+"\s*\/>/, 'Open Graph')
    requireMatch(/<meta name="twitter:title" content="[^"<>]+"\s*\/>/, 'Twitter cards')
    const structuredData = html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)
    if (!structuredData) problems.push('JSON-LD')
    else {
      try { JSON.parse(structuredData[1]) } catch { problems.push('JSON-LD válido') }
    }
    const h1Count = (html.match(/<h1\b/g) || []).length
    if (h1Count !== 1) problems.push(`un único H1 (encontrados ${h1Count})`)
  } else {
    requireMatch(/<meta name="robots" content="noindex,follow"\s*\/>/, 'noindex del 404')
  }
  if (problems.length) throw new Error(`SEO prerender check failed for ${route}: ${problems.join(', ')}`)
}

function validateDiscoveryFiles(sitemap, expectedUrls, robots) {
  const foundUrls = (sitemap.match(/<loc>/g) || []).length
  if (foundUrls !== expectedUrls) throw new Error(`Sitemap check failed: expected ${expectedUrls} URLs, found ${foundUrls}.`)
  if (!robots.includes('User-agent: OAI-SearchBot') || !robots.includes('Allow: /')) {
    throw new Error('Robots check failed: OAI-SearchBot must be allowed to crawl the site.')
  }
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) throw new Error('Robots check failed: sitemap URL is missing.')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderPage(element) {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough()
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    let renderError
    stream.on('end', () => renderError ? reject(renderError) : resolve(Buffer.concat(chunks).toString('utf8')))
    const { pipe } = renderToPipeableStream(element, {
      onAllReady: () => pipe(stream),
      onShellError: reject,
      onError: (error) => { renderError = error }
    })
  })
}
