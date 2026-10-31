const ui = {
  gate: document.querySelector('#access-gate'),
  app: document.querySelector('#app-shell'),
  list: document.querySelector('#project-list'),
  search: document.querySelector('#project-search'),
  panel: document.querySelector('#editor-panel'),
  saveState: document.querySelector('#save-state'),
  toast: document.querySelector('#toast'),
  projectsTab: document.querySelector('#tab-projects'),
  videosTab: document.querySelector('#tab-videos'),
  siteContentTab: document.querySelector('#tab-site-content'),
  editorListsTab: document.querySelector('#tab-editor-lists')
}

const state = {
  token: '',
  projects: [],
  videos: [],
  videosVersion: '',
  siteContent: null,
  siteContentVersion: '',
  dirtySiteContent: false,
  fieldNotes: { entries: [] },
  fieldNotesVersion: '',
  journal: { items: [] },
  journalVersion: '',
  dirtyEditorLists: false,
  selectedId: '',
  filter: 'all',
  query: '',
  locale: 'es',
  section: 'projects',
  dirtyProjects: new Set(),
  dirtyVideos: false,
  saving: false,
  toastTimer: 0
}

const imageChoices = ['@labHero', '@labDetail', '@videoDice', '@videoRoc', '@videoBlaze', '@legacyPi']
const resourceTypes = ['attachments', 'links']

async function start() {
  const params = new URLSearchParams(location.hash.slice(1))
  let savedToken = ''
  try { savedToken = sessionStorage.getItem('braisgf-editor-token') || '' } catch { /* Session storage may be disabled. */ }
  const token = params.get('auth') || savedToken
  if (!token) return showGate()
  await connect(token)
}

async function connect(token) {
  state.token = token.trim()
  try { sessionStorage.setItem('braisgf-editor-token', state.token) } catch { /* The session can still run for this page. */ }
  history.replaceState(null, '', location.pathname + location.search)
  ui.saveState.textContent = 'Comprobando sesión…'
  try {
    const data = await api('/api/content')
    state.projects = data.projects
    state.videos = data.videos
    state.videosVersion = data.videosVersion
    state.siteContent = data.siteContent
    state.siteContentVersion = data.siteContentVersion
    state.fieldNotes = data.fieldNotes
    state.fieldNotesVersion = data.fieldNotesVersion
    state.journal = data.journal
    state.journalVersion = data.journalVersion
    state.selectedId = state.projects.find((project) => project.visibility !== 'archived')?.id || state.projects[0]?.id || ''
    ui.gate.hidden = true
    ui.app.hidden = false
    render()
  } catch (error) {
    showGate(error.message)
  }
}

function tokenFromInput(value) {
  const raw = value.trim()
  try {
    const url = new URL(raw)
    return new URLSearchParams(url.hash.slice(1)).get('auth') || ''
  } catch {
    return raw
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${state.token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`)
  return data
}

function showGate(message = '') {
  ui.gate.hidden = false
  ui.app.hidden = true
  ui.saveState.textContent = message ? 'Sesión no disponible' : 'Sesión requerida'
  ui.saveState.dataset.kind = message ? 'error' : ''
  const error = document.querySelector('#gate-error')
  if (error) error.textContent = message || ''
  if (message) showToast(message, true)
}

document.querySelector('#session-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const input = document.querySelector('#session-link')
  const token = tokenFromInput(input.value)
  if (!token) {
    document.querySelector('#gate-error').textContent = 'No auth token found. Paste the full terminal link.'
    input.focus()
    return
  }
  document.querySelector('#gate-error').textContent = 'Connecting…'
  await connect(token)
})

function selectedProject() { return state.projects.find((project) => project.id === state.selectedId) }
function isDirty() { return state.dirtyProjects.size > 0 || state.dirtyVideos || state.dirtySiteContent || state.dirtyEditorLists }

function setSaveState() {
  const count = state.dirtyProjects.size + (state.dirtyVideos ? 1 : 0) + (state.dirtySiteContent ? 1 : 0) + (state.dirtyEditorLists ? 1 : 0)
  ui.saveState.textContent = count ? `${count} cambio${count === 1 ? '' : 's'} sin guardar` : 'Todo guardado en local'
  ui.saveState.dataset.kind = count ? 'dirty' : ''
  const save = ui.panel.querySelector('#save-current')
  if (save) save.disabled = state.saving || (state.section === 'videos' ? !state.dirtyVideos : state.section === 'site-content' ? !state.dirtySiteContent : state.section === 'editor-lists' ? !state.dirtyEditorLists : !state.dirtyProjects.has(state.selectedId))
  const indicator = ui.panel.querySelector('#project-visibility')
  if (indicator && selectedProject()) {
    indicator.textContent = visibilityLabel(selectedProject().visibility)
    indicator.dataset.visibility = selectedProject().visibility
  }
}

function render() {
  const tabs = [
    [ui.projectsTab, 'projects'], [ui.videosTab, 'videos'],
    [ui.siteContentTab, 'site-content'], [ui.editorListsTab, 'editor-lists']
  ]
  tabs.forEach(([tab, section]) => {
    const selected = state.section === section
    tab.setAttribute('aria-selected', String(selected))
    tab.tabIndex = selected ? 0 : -1
  })
  ui.panel.setAttribute('aria-labelledby', state.section === 'projects' ? 'tab-projects' : state.section === 'videos' ? 'tab-videos' : state.section === 'site-content' ? 'tab-site-content' : 'tab-editor-lists')
  renderList()
  if (state.section === 'videos') renderVideos()
  else if (state.section === 'site-content') renderSiteContent()
  else if (state.section === 'editor-lists') renderEditorLists()
  else renderProject()
  setSaveState()
}

function renderSiteContent() {
  const data = state.siteContent
  const navFields = Object.entries(data.global.navigation).map(([key, labels]) => `<div class="content-inline-card"><strong>${escapeHtml(key)}</strong>${contentField('Español', `global.navigation.${key}.es`, labels.es)}${contentField('English', `global.navigation.${key}.en`, labels.en)}</div>`).join('')
  const careerFields = data.career.map((item,index) => `<article class="content-card"><header><h3>${escapeHtml(item.role.es || `Puesto ${index+1}`)}</h3><button type="button" class="remove-button" data-remove-content="career" data-index="${index}" aria-label="Quitar puesto ${index+1}">×</button></header><div class="field-grid">${contentField('Periodo',`career.${index}.year`,item.year)}${contentField('Cargo · ES',`career.${index}.role.es`,item.role.es)}${contentField('Role · EN',`career.${index}.role.en`,item.role.en)}${contentField('Empresa · ES',`career.${index}.company.es`,item.company.es)}${contentField('Company · EN',`career.${index}.company.en`,item.company.en)}${contentField('Descripción · ES',`career.${index}.text.es`,item.text.es,true)}${contentField('Description · EN',`career.${index}.text.en`,item.text.en,true)}${contentField('Tarjetas bajo el puesto · una por línea',`career.${index}.highlights`,item.highlights.map((entry)=>entry.es).join('\n'),true,'es-lines')}${contentField('Cards under the role · one per line',`career.${index}.highlights`,item.highlights.map((entry)=>entry.en).join('\n'),true,'en-lines')}</div></article>`).join('')
  const pollOptions = data.poll.options.map((item,index) => `<article class="content-inline-card"><strong>Opción ${index+1}</strong>${contentField('ID',`poll.options.${index}.id`,item.id)}${contentField('Proyecto #',`poll.options.${index}.number`,item.number)}${contentField('Nombre · ES',`poll.options.${index}.label.es`,item.label.es)}${contentField('Name · EN',`poll.options.${index}.label.en`,item.label.en)}${contentField('Descripción · ES',`poll.options.${index}.description.es`,item.description.es,true)}${contentField('Description · EN',`poll.options.${index}.description.en`,item.description.en,true)}<button type="button" class="small-button" data-remove-content="poll" data-index="${index}">Quitar opción</button></article>`).join('')
  const profiles = Object.entries(data.personality.profiles).map(([key,item]) => `<article class="content-inline-card"><strong>${escapeHtml(key)}</strong>${contentField('Nombre · ES',`personality.profiles.${key}.title.es`,item.title.es)}${contentField('Name · EN',`personality.profiles.${key}.title.en`,item.title.en)}${contentField('Explicación · ES',`personality.profiles.${key}.text.es`,item.text.es,true)}${contentField('Explanation · EN',`personality.profiles.${key}.text.en`,item.text.en,true)}</article>`).join('')
  const typeOptions = Object.keys(data.personality.profiles).map((key)=>`<option value="${attr(key)}">${escapeHtml(key)}</option>`).join('')
  const questions = data.personality.questions.map((question,index) => `<article class="content-card"><header><h3>Pregunta ${index+1}</h3><button type="button" class="remove-button" data-remove-content="question" data-index="${index}" aria-label="Quitar pregunta ${index+1}">×</button></header><div class="field-grid">${contentField('Pregunta · ES',`personality.questions.${index}.prompt.es`,question.prompt.es,true)}${contentField('Question · EN',`personality.questions.${index}.prompt.en`,question.prompt.en,true)}</div><div class="content-answer-list">${question.answers.map((answer,answerIndex)=>`<div class="content-answer"><span class="eyebrow">Respuesta ${answerIndex+1}</span>${contentField('Texto · ES',`personality.questions.${index}.answers.${answerIndex}.text.es`,answer.text.es)}${contentField('Answer · EN',`personality.questions.${index}.answers.${answerIndex}.text.en`,answer.text.en)}<label class="field"><span>Perfil asignado</span><select data-site-content-path="personality.questions.${index}.answers.${answerIndex}.type">${typeOptions.replace(`value="${attr(answer.type)}"`,`value="${attr(answer.type)}" selected`)}</select></label></div>`).join('')}</div></article>`).join('')
  ui.panel.innerHTML = `<header class="editor-header"><div><p class="eyebrow">CONTENIDO RECURRENTE</p><h1>La web, en tus manos.</h1><p class="field hint">Edita textos y contenidos en campos bilingües. Los enlaces y el pie se actualizan junto con la página; los puestos incluyen mini tarjetas bajo cada experiencia.</p></div></header><section class="panel"><div class="panel-head"><h2>Navegación y banner</h2></div><div class="panel-body"><div class="content-inline-grid">${navFields}</div><div class="field-grid">${contentField('Texto del pie · ES','global.footer.es',data.global.footer.es,true)}${contentField('Footer text · EN','global.footer.en',data.global.footer.en,true)}${contentField('Banner · ES (vacío para ocultar)','global.banner.es',data.global.banner.es)}${contentField('Banner · EN (blank hides it)','global.banner.en',data.global.banner.en)}${contentField('Enlace del banner','global.banner.href',data.global.banner.href)}${contentField('Texto del enlace · ES','global.banner.label.es',data.global.banner.label.es)}${contentField('Link label · EN','global.banner.label.en',data.global.banner.label.en)}</div></div></section><section class="panel"><div class="panel-head"><h2>Trayectoria y logros</h2><button class="small-button" type="button" data-add-career>+ Añadir puesto</button></div><div class="panel-body content-card-list">${careerFields}</div></section><section class="panel"><div class="panel-head"><h2>Encuesta mensual</h2><button class="small-button" type="button" data-add-poll-option>+ Añadir opción</button></div><div class="panel-body"><div class="field-grid">${contentField('Pregunta · ES','poll.title.es',data.poll.title.es,true)}${contentField('Question · EN','poll.title.en',data.poll.title.en,true)}${contentField('Descripción · ES','poll.description.es',data.poll.description.es,true)}${contentField('Description · EN','poll.description.en',data.poll.description.en,true)}</div><div class="content-inline-grid">${pollOptions}</div></div></section><section class="panel"><div class="panel-head"><h2>Perfiles del test</h2><button class="small-button" type="button" data-add-profile>+ Añadir tipo</button></div><div class="panel-body"><div class="content-inline-grid">${profiles}</div></div></section><section class="panel"><div class="panel-head"><h2>Preguntas y respuestas</h2><button class="small-button" type="button" data-add-question>+ Añadir pregunta</button></div><div class="panel-body content-card-list">${questions}<p class="hint">El test necesita entre 5 y 8 preguntas. Cada pregunta tiene cuatro respuestas y cada respuesta debe asignarse a uno de los perfiles definidos.</p></div></section><details class="panel advanced-content"><summary>JSON avanzado · copia técnica del contenido</summary><div class="panel-body"><label class="field full" for="site-content-source">Configuración · src/content/site-content.json</label><textarea id="site-content-source" rows="30" spellcheck="false">${escapeHtml(JSON.stringify(data,null,2))}</textarea><button type="button" class="small-button" data-format-content>Formatear JSON</button></div></details><div class="editor-actions"><span class="shortcut-hint">Atajo: Ctrl + S</span><button class="button" id="save-current" type="button" data-save-site-content>Guardar contenido <span aria-hidden="true">↗</span></button></div>`
}

function contentField(label,path,value,multiline=false,lines='') {
  const id=`content-${path.replaceAll('.','-')}-${lines}`
  return `<label class="field"><span>${escapeHtml(label)}</span>${multiline?`<textarea id="${attr(id)}" data-site-content-path="${attr(path)}" ${lines?`data-lines="${attr(lines)}"`:''}>${escapeHtml(value||'')}</textarea>`:`<input id="${attr(id)}" data-site-content-path="${attr(path)}" value="${attr(value||'')}" />`}</label>`
}

function renderEditorLists() {
  const notes = state.fieldNotes.entries.map((item, index) => `<article class="content-card"><header><h3>${escapeHtml(item.title?.es || `Nota ${index + 1}`)}</h3><button type="button" class="remove-button" data-remove-note="${index}" aria-label="Eliminar nota ${index + 1}">Eliminar</button></header><div class="field-grid">${listField('Slug', `fieldNotes.entries.${index}.slug`, item.slug)}${listSelect('Visibilidad', `fieldNotes.entries.${index}.visibility`, item.visibility, [['draft','Borrador'],['public','Público'],['archived','Archivado']])}${listField('Fecha', `fieldNotes.entries.${index}.date`, item.date, 'date')}${listField('Etiquetas (separadas por coma)', `fieldNotes.entries.${index}.tags`, (item.tags || []).join(', '))}${listField('Título · ES', `fieldNotes.entries.${index}.title.es`, item.title?.es)}${listField('Title · EN', `fieldNotes.entries.${index}.title.en`, item.title?.en)}${listField('Resumen · ES', `fieldNotes.entries.${index}.summary.es`, item.summary?.es, 'textarea')}${listField('Summary · EN', `fieldNotes.entries.${index}.summary.en`, item.summary?.en, 'textarea')}${listField('Markdown · ES', `fieldNotes.entries.${index}.markdown.es`, item.markdown?.es, 'textarea')}${listField('Markdown · EN', `fieldNotes.entries.${index}.markdown.en`, item.markdown?.en, 'textarea')}</div></article>`).join('')
  const journal = state.journal.items.map((item, index) => `<article class="content-card"><header><h3>${escapeHtml(item.title?.es || `Pieza ${index + 1}`)}</h3><button type="button" class="remove-button" data-remove-journal="${index}" aria-label="Eliminar pieza ${index + 1}">Eliminar</button></header><div class="field-grid">${listField('ID', `journal.items.${index}.id`, item.id)}${listSelect('Visibilidad', `journal.items.${index}.visibility`, item.visibility, [['draft','Borrador'],['public','Público'],['archived','Archivado']])}${listSelect('Tipo', `journal.items.${index}.type`, item.type, [['image','Foto'],['video','Vídeo']])}${listField('Fecha', `journal.items.${index}.date`, item.date, 'date')}${listField('Plataforma', `journal.items.${index}.platform`, item.platform)}${listField('Archivo local (foto)', `journal.items.${index}.src`, item.src)}${listField('URL original', `journal.items.${index}.url`, item.url)}${listField('URL de inserción (vídeo)', `journal.items.${index}.embedUrl`, item.embedUrl)}${listField('Título · ES', `journal.items.${index}.title.es`, item.title?.es)}${listField('Title · EN', `journal.items.${index}.title.en`, item.title?.en)}${listField('Descripción · ES', `journal.items.${index}.description.es`, item.description?.es, 'textarea')}${listField('Description · EN', `journal.items.${index}.description.en`, item.description?.en, 'textarea')}${listField('Texto alternativo · ES', `journal.items.${index}.alt.es`, item.alt?.es)}${listField('Alt text · EN', `journal.items.${index}.alt.en`, item.alt?.en)}</div></article>`).join('')
  ui.panel.innerHTML = `<header class="editor-header"><div><p class="eyebrow">CUADERNO ABIERTO</p><h1>Notas y registro visual.</h1><p class="field hint">Crea reseñas, ideas y piezas visuales desde estos campos. Usa Markdown para dar formato y enlaza proyectos con <code>/experiments/001</code>; puedes ajustar relaciones y etiquetas en las opciones avanzadas.</p></div></header><section class="panel"><div class="panel-head"><h2>Notas de campo</h2><button class="small-button" type="button" data-new-note>+ Nueva nota</button></div><div class="panel-body">${notes || '<p class="hint">Aún no hay notas. Crea una para empezar.</p>'}</div></section><section class="panel"><div class="panel-head"><h2>Cuaderno visual</h2><button class="small-button" type="button" data-new-journal-item>+ Nueva pieza</button></div><div class="panel-body">${journal || '<p class="hint">Aún no hay piezas. Crea una para añadir fotos o vídeos.</p>'}<p class="hint">Guarda fotos en <code>public/images/journal/</code>. Usa la ruta web <code>/images/journal/nombre.webp</code>. Las piezas nuevas quedan como borrador.</p></div></section><details class="panel advanced-json"><summary>Opciones avanzadas · JSON y enlaces relacionados</summary><div class="panel-body"><label class="field full" for="field-notes-source">Notas · src/content/field-notes.json</label><textarea id="field-notes-source" rows="12" spellcheck="false">${escapeHtml(JSON.stringify(state.fieldNotes, null, 2))}</textarea><label class="field full" for="journal-source">Cuaderno · src/content/journal.json</label><textarea id="journal-source" rows="12" spellcheck="false">${escapeHtml(JSON.stringify(state.journal, null, 2))}</textarea></div></details><div class="editor-actions"><span class="shortcut-hint">Atajo: Ctrl + S</span><button class="button" id="save-current" type="button" data-save-editor-lists>Guardar notas y cuaderno <span aria-hidden="true">↗</span></button></div>`
}

function listField(label, path, value, kind = 'text') {
  const id = `list-${path.replaceAll('.', '-')}`
  return `<label class="field" for="${attr(id)}">${escapeHtml(label)}${kind === 'textarea' ? `<textarea id="${attr(id)}" data-list-path="${attr(path)}" rows="${path.includes('markdown') ? 12 : 4}">${escapeHtml(value || '')}</textarea>` : `<input id="${attr(id)}" data-list-path="${attr(path)}" type="${kind}" value="${attr(value || '')}" />`}</label>`
}

function listSelect(label, path, value, options) {
  return `<label class="field">${escapeHtml(label)}<select data-list-path="${attr(path)}">${options.map(([key, text]) => `<option value="${key}" ${value === key ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`
}

function renderList() {
  const normalizedQuery = state.query.trim().toLowerCase()
  const projects = state.projects.filter((project) => {
    const visibility = project.visibility || 'public'
    const matchesFilter = state.filter === 'all' || visibility === state.filter
    const matchesQuery = !normalizedQuery || `${project.id} ${project.title.es} ${project.title.en} ${project.slug}`.toLowerCase().includes(normalizedQuery)
    return matchesFilter && matchesQuery
  })

  ui.list.innerHTML = projects.length ? projects.map((project) => `
    <button type="button" class="project-link" data-select-project="${attr(project.id)}" aria-current="${project.id === state.selectedId && state.section === 'projects' ? 'page' : 'false'}">
      <span class="project-link-number">#${escapeHtml(project.id)}</span>
      <span class="project-link-copy"><span class="project-link-title">${escapeHtml(project.title.es || project.title.en || 'Sin título')}</span><span class="project-link-sub">${escapeHtml(project.type || 'PROJECT')} · ${escapeHtml(visibilityLabel(project.visibility))}</span></span>
    </button>`).join('') : '<p class="eyebrow empty-list">No hay proyectos con este filtro.</p>'
}

function renderProject() {
  const project = selectedProject()
  if (!project) {
    ui.panel.innerHTML = `<div class="empty-state"><p class="eyebrow">EMPIEZA AQUÍ</p><h1>Todo proyecto empieza con una nota.</h1><p>Crea un borrador y escribe los dos idiomas antes de publicarlo.</p><button class="button" type="button" data-create-project>Crear mi primer borrador <span aria-hidden="true">↗</span></button></div>`
    return
  }

  ui.panel.innerHTML = `
    <header class="editor-header">
      <div><p class="eyebrow">${escapeHtml(project.type)} · ${escapeHtml(project.status)}</p><h1>${escapeHtml(project.title.es || project.title.en || 'Proyecto sin título')}</h1></div>
      <span id="project-visibility" class="visibility-tag" data-visibility="${attr(project.visibility || 'public')}">${visibilityLabel(project.visibility)}</span>
    </header>
    <div class="editor-grid">
      <section class="panel" aria-labelledby="details-title"><div class="panel-head"><h2 id="details-title">Ficha del proyecto</h2><span class="editor-id">#${escapeHtml(project.id)}</span></div>
        <div class="panel-body"><div class="field-grid">
          ${field('URL corta', 'slug', project.slug, 'slug', 'nombre-del-proyecto')}
          ${selectField('Visibilidad', 'visibility', project.visibility || 'public', [['draft','Borrador'],['public','Publicado'],['archived','Archivado']])}
          ${field('Tipo', 'type', project.type, 'text', 'MAKER')}
          ${field('Estado visible', 'status', project.status, 'text', 'RUNNING')}
          ${field('Año del proyecto (opcional)', 'year', project.year, 'text', 'AAAA', 'Déjalo vacío si no conoces el año real.', true)}
          ${field('Imagen de portada', 'image', project.image, 'text', '/images/portada.jpg', 'Usa un recurso @importado o una ruta local como /files/006/cover.jpg.', true)}
          <div class="field"><span class="field-label">Color de acento</span><div class="color-field"><input aria-label="Selector de color" type="color" value="${attr(project.accent || '#a98cff')}" data-project-field="accent"><input aria-label="Color hexadecimal" type="text" value="${attr(project.accent || '#a98cff')}" data-project-field="accent" maxlength="7"></div></div>
          ${field('Título · Español', 'title.es', project.title.es, 'text', 'Un proyecto en marcha', 'Hasta 160 caracteres.', true)}
          ${field('Título · English', 'title.en', project.title.en, 'text', 'A project in progress', 'Hasta 160 caracteres.', true)}
          ${textField('Resumen · Español', 'summary.es', project.summary.es, 'Describe qué estás haciendo y por qué importa.', true)}
          ${textField('Summary · English', 'summary.en', project.summary.en, 'Describe what you are making and why it matters.', true)}
        </div></div>
      </section>
      <section class="panel" aria-labelledby="writing-title"><div class="panel-head"><h2 id="writing-title">Dossier en Markdown</h2><span class="eyebrow">${project.visibility === 'draft' ? 'NO APARECE EN LA WEB' : 'EN · ES'}</span></div>
        <div class="markdown-layout"><div class="markdown-editor"><div class="language-tabs" role="group" aria-label="Idioma del dossier"><button type="button" data-locale="es" aria-pressed="${state.locale === 'es'}">ESPAÑOL</button><button type="button" data-locale="en" aria-pressed="${state.locale === 'en'}">ENGLISH</button></div>
          <div class="format-toolbar" role="group" aria-label="Formato del texto">
            <div class="toolbar-group" aria-label="Estilos"><button type="button" data-format="h1" aria-label="Título principal" title="Título principal">H1</button><button type="button" data-format="h2" aria-label="Subtítulo" title="Subtítulo">H2</button><button type="button" data-format="h3" aria-label="Título corto" title="Título pequeño">H3</button></div>
            <div class="toolbar-group" aria-label="Formato de texto"><button type="button" data-format="bold" aria-label="Negrita" title="Negrita (Ctrl+B)"><strong>B</strong></button><button type="button" data-format="italic" aria-label="Cursiva" title="Cursiva (Ctrl+I)"><em>I</em></button><button type="button" data-format="code" aria-label="Código en línea" title="Código">&lt;/&gt;</button></div>
            <div class="toolbar-group" aria-label="Bloques"><button type="button" data-format="ul" aria-label="Lista con viñetas" title="Lista con viñetas">Lista</button><button type="button" data-format="ol" aria-label="Lista numerada" title="Lista numerada">1. Lista</button><button type="button" data-format="quote" aria-label="Cita" title="Cita">Cita</button></div>
            <div class="toolbar-group" aria-label="Insertar"><button type="button" data-format="link" aria-label="Insertar enlace" title="Enlace (Ctrl+K)">Enlace</button><button type="button" data-format="image" aria-label="Insertar imagen" title="Imagen">Imagen</button></div>
          </div><label class="sr-only" for="markdown-source">Texto Markdown del idioma seleccionado</label><textarea id="markdown-source" spellcheck="true" data-project-body="${state.locale}" placeholder="## La pregunta\n\n¿Qué quieres descubrir?\n\n## El proceso\n\nCuenta qué probaste, qué cambió y qué aprendiste.">${escapeHtml(project.markdown[state.locale] || '')}</textarea></div><div class="preview" aria-label="Vista previa del texto"><p class="preview-label">VISTA PREVIA · ${state.locale.toUpperCase()}</p><div id="markdown-preview">${renderMarkdown(project.markdown[state.locale] || '')}</div></div></div>
      </section>
    </div>
    ${resourceEditor(project, 'links', 'Enlaces externos', 'GitHub, vídeo, demo o fuente relacionada.')}
    ${resourceEditor(project, 'attachments', 'Archivos y recursos', 'PDF, prototipo, imagen, ZIP o descarga. Usa /files/ID/nombre.ext para archivos del repo.')}
    <div class="editor-actions"><span class="shortcut-hint">Atajo: Ctrl + S</span><div class="editor-action-buttons"><button class="button button-secondary" type="button" data-run-review>Revisión final</button><button class="button" id="save-current" type="button" data-save-project>Guardar cambios <span aria-hidden="true">&gt;</span></button></div></div>
    <section class="review-report" id="review-report" tabindex="-1" aria-live="polite" aria-atomic="true" hidden></section>`
}

function resourceEditor(project, collection, title, hint) {
  const entries = project[collection] || []
  return `<section class="panel resource-section" aria-labelledby="${collection}-title"><div class="panel-head"><h2 id="${collection}-title">${title}</h2><button class="small-button" type="button" data-add-resource="${collection}">+ Añadir</button></div><div class="panel-body"><p class="field hint">${hint}</p><div class="resource-list">${entries.map((resource, index) => `
    <div class="resource-row"><label class="sr-only" for="${collection}-${index}-label">Nombre del recurso ${index + 1}</label><input id="${collection}-${index}-label" data-collection="${collection}" data-index="${index}" data-resource-field="label" value="${attr(resource.label)}" placeholder="Nombre visible" />
    <label class="sr-only" for="${collection}-${index}-href">URL del recurso ${index + 1}</label><input id="${collection}-${index}-href" data-collection="${collection}" data-index="${index}" data-resource-field="href" value="${attr(resource.href)}" placeholder="https:// o /files/…" />
    <label class="sr-only" for="${collection}-${index}-kind">Tipo del recurso ${index + 1}</label><input id="${collection}-${index}-kind" data-collection="${collection}" data-index="${index}" data-resource-field="kind" value="${attr(resource.kind || '')}" placeholder="Tipo opcional" />
    <button class="remove-button" type="button" data-remove-resource="${collection}" data-index="${index}" aria-label="Quitar recurso ${escapeHtml(resource.label || index + 1)}">×</button></div>`).join('')}</div>${entries.length ? '' : '<p class="empty-list">Todavía no hay recursos. Añade uno cuando tengas una URL o archivo preparado.</p>'}</div></section>`
}

function renderVideos() {
  ui.panel.innerHTML = `<header class="editor-header"><div><p class="eyebrow">CONTENIDO MULTIMEDIA</p><h1>La galería de vídeo.</h1><p class="field hint">Edita las seis fuentes de src/data/videos.json. La galería de portada mantiene seis posiciones fijas y carga todos los reproductores desde el primer render.</p></div><span class="editor-id">${state.videos.length} / 6 vídeos</span></header>
    <div class="video-controls"><span class="eyebrow">YOUTUBE · TIKTOK · INSTAGRAM · TWITCH</span></div>
    <div class="video-list">${state.videos.map((video, index) => `<article class="video-row">
      <label>Plataforma<select data-video-index="${index}" data-video-field="social">${['TikTok','YouTube','Instagram','Twitch'].map((option) => `<option ${video.social === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label>
      <label>Formato<select data-video-index="${index}" data-video-field="orientation"><option value="vertical" ${video.orientation === 'vertical' ? 'selected' : ''}>Vertical</option><option value="horizontal" ${video.orientation === 'horizontal' ? 'selected' : ''}>Horizontal</option></select></label>
      <label>URL del vídeo<input type="url" inputmode="url" autocomplete="url" data-video-index="${index}" data-video-field="url" value="${attr(video.url)}" placeholder="https://…" /></label>
    </article>`).join('') || '<p class="empty-list">La galería está vacía. Añade un enlace de vídeo con su plataforma y formato.</p>'}</div>
    <div class="editor-actions"><span class="shortcut-hint">Atajo: Ctrl + S</span><button class="button" id="save-current" type="button" data-save-videos>Guardar galería <span aria-hidden="true">↗</span></button></div>`
}

function field(label, path, value, type, placeholder = '', hint = '', full = false) {
  const inputType = type === 'slug' ? 'text' : type
  return `<div class="field${full ? ' full' : ''}"><label for="field-${path.replaceAll('.', '-')}">${label}</label><input id="field-${path.replaceAll('.', '-')}" ${type === 'slug' ? 'autocomplete="off" autocapitalize="none"' : ''} type="${inputType}" data-project-field="${path}" value="${attr(value || '')}" placeholder="${attr(placeholder)}" />${hint ? `<span class="hint">${hint}</span>` : ''}</div>`
}

function textField(label, path, value, placeholder, full = false) {
  return `<div class="field${full ? ' full' : ''}"><label for="field-${path.replaceAll('.', '-')}">${label}</label><textarea id="field-${path.replaceAll('.', '-')}" data-project-field="${path}" maxlength="320" placeholder="${attr(placeholder)}">${escapeHtml(value || '')}</textarea><span class="hint">Máximo 320 caracteres.</span></div>`
}

function selectField(label, path, current, options) {
  return `<div class="field"><label for="field-${path}">${label}</label><select id="field-${path}" data-project-field="${path}">${options.map(([value, text]) => `<option value="${value}" ${current === value ? 'selected' : ''}>${text}</option>`).join('')}</select></div>`
}

function renderMarkdown(source) {
  if (!source.trim()) return '<p class="empty-list">La vista previa aparece aquí mientras escribes.</p>'
  const escaped = escapeHtml(source)
  const codeBlocks = []
  const protectedSource = escaped.replace(/```([^\n]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const marker = `%%CODE${codeBlocks.length}%%`
    codeBlocks.push(`<pre><code>${code.trimEnd()}</code></pre>`)
    return marker
  })
  const blocks = protectedSource.split(/\n\s*\n/).map((block) => {
    const value = block.trim()
    if (!value) return ''
    const codeMatch = value.match(/^%%CODE(\d+)%%$/)
    if (codeMatch) return codeBlocks[Number(codeMatch[1])]
    const heading = value.match(/^(#{1,3})\s+(.+)$/)
    if (heading) return `<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`
    const items = value.split('\n')
    if (items.every((item) => /^\s*[-*+]\s+/.test(item))) return `<ul>${items.map((item) => `<li>${inlineMarkdown(item.replace(/^\s*[-*+]\s+/, ''))}</li>`).join('')}</ul>`
    if (items.every((item) => /^\s*\d+\.\s+/.test(item))) return `<ol>${items.map((item) => `<li>${inlineMarkdown(item.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`
    if (items.every((item) => /^&gt;\s?/.test(item))) return `<blockquote><p>${items.map((item) => inlineMarkdown(item.replace(/^&gt;\s?/, ''))).join('<br>')}</p></blockquote>`
    return `<p>${items.map(inlineMarkdown).join('<br>')}</p>`
  }).join('')
  return blocks
}

function inlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\((https:\/\/[^\s)]+|\/(?!\/)[^\s)]+)\)/g, (_match, alt, src) => `<img src="${attr(src)}" alt="${alt}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+|\/(?!\/)[^\s)]+)\)/g, (_match, label, href) => `<a href="${attr(href)}" target="_blank" rel="noreferrer">${label}</a>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function escapeHtml(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;') }
function attr(value) { return escapeHtml(value) }
function visibilityLabel(visibility) { return ({ public: 'Publicado', draft: 'Borrador', archived: 'Archivado' })[visibility] || 'Publicado' }

function markProjectDirty() {
  state.dirtyProjects.add(state.selectedId)
  const report = ui.panel.querySelector('#review-report')
  if (report) report.hidden = true
  setSaveState()
}

function showToast(message, error = false) {
  ui.toast.textContent = message
  ui.toast.dataset.kind = error ? 'error' : ''
  ui.toast.classList.add('is-visible')
  clearTimeout(state.toastTimer)
  state.toastTimer = setTimeout(() => ui.toast.classList.remove('is-visible'), 3600)
}

ui.search.addEventListener('input', (event) => { state.query = event.target.value; renderList() })
ui.list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-select-project]')
  if (!button) return
  state.selectedId = button.dataset.selectProject
  state.section = 'projects'
  render()
})
document.querySelector('.project-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]')
  if (!button) return
  state.filter = button.dataset.filter
  document.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
  renderList()
})
ui.projectsTab.addEventListener('click', () => { state.section = 'projects'; render() })
ui.videosTab.addEventListener('click', () => { state.section = 'videos'; render() })
ui.siteContentTab.addEventListener('click', () => { state.section = 'site-content'; render() })
ui.editorListsTab.addEventListener('click', () => { state.section = 'editor-lists'; render() })
document.querySelector('[role="tablist"]').addEventListener('keydown', (event) => {
  const tabs = [...document.querySelectorAll('[role="tab"]')]
  const current = tabs.indexOf(document.activeElement)
  if (current < 0) return
  const next = event.key === 'ArrowRight' ? (current + 1) % tabs.length
    : event.key === 'ArrowLeft' ? (current - 1 + tabs.length) % tabs.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1
  if (next < 0) return
  event.preventDefault()
  tabs[next].focus()
  tabs[next].click()
})
document.querySelector('#new-project').addEventListener('click', createDraft)
ui.panel.addEventListener('click', handlePanelClick)
ui.panel.addEventListener('input', handleFieldChange)
ui.panel.addEventListener('change', handleFieldChange)
ui.panel.addEventListener('keydown', (event) => {
  if (event.target.id !== 'markdown-source' || !(event.ctrlKey || event.metaKey)) return
  const format = ({ b: 'bold', i: 'italic', k: 'link' })[event.key.toLowerCase()]
  if (!format) return
  event.preventDefault()
  formatMarkdown(format)
})
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    saveCurrent()
  }
})
window.addEventListener('beforeunload', (event) => {
  if (!isDirty()) return
  event.preventDefault()
  event.returnValue = ''
})

async function handlePanelClick(event) {
  const target = event.target.closest('button')
  if (!target) return
  if (target.matches('[data-create-project]')) return createDraft()
  if (target.matches('[data-save-project], [data-save-videos]')) return saveCurrent()
  if (target.matches('[data-save-site-content]')) return saveCurrent()
  if (target.matches('[data-save-editor-lists]')) return saveCurrent()
  if (target.matches('[data-format-content]')) {
    const area = ui.panel.querySelector('#site-content-source')
    try { area.value = JSON.stringify(JSON.parse(area.value), null, 2); area.focus() } catch { showToast('El JSON no es válido todavía.', true) }
    return
  }
  if (target.matches('[data-format-list]')) {
    const area = ui.panel.querySelector(`#${target.dataset.formatList}`)
    try { area.value = JSON.stringify(JSON.parse(area.value), null, 2); area.focus() } catch { showToast('El JSON no es válido todavía.', true) }
    return
  }
  if (target.matches('[data-remove-note]')) {
    state.fieldNotes.entries.splice(Number(target.dataset.removeNote), 1)
    state.dirtyEditorLists = true; renderEditorLists(); setSaveState(); return
  }
  if (target.matches('[data-remove-journal]')) {
    state.journal.items.splice(Number(target.dataset.removeJournal), 1)
    state.dirtyEditorLists = true; renderEditorLists(); setSaveState(); return
  }
  if (target.matches('[data-add-career]')) {
    state.siteContent.career.push({ key: `role-${Date.now()}`, year: '', role: { es: '', en: '' }, company: { es: '', en: '' }, text: { es: '', en: '' }, highlights: [] })
    state.dirtySiteContent = true; renderSiteContent(); setSaveState(); showToast('Puesto añadido. Completa los dos idiomas y sus tarjetas antes de guardar.')
    return
  }
  if (target.matches('[data-add-question]')) {
    if (state.siteContent.personality.questions.length >= 8) return showToast('El test admite hasta 8 preguntas.', true)
    state.siteContent.personality.questions.push({ id: `q${Date.now()}`, prompt: { es: '', en: '' }, answers: Object.keys(state.siteContent.personality.profiles).slice(0,4).map((type) => ({ text: { es: '', en: '' }, type })) })
    state.dirtySiteContent = true; renderSiteContent(); setSaveState(); showToast('Pregunta con cuatro opciones añadida. Completa sus textos bilingües.')
    return
  }
  if (target.matches('[data-add-poll-option]')) {
    const index=state.siteContent.poll.options.length
    state.siteContent.poll.options.push({ id:`idea-${Date.now()}`,number:String(index+1).padStart(3,'0'),accent:'blue',label:{es:'',en:''},description:{es:'',en:''} })
    state.dirtySiteContent=true;renderSiteContent();setSaveState();return
  }
  if (target.matches('[data-add-profile]')) {
    let index=Object.keys(state.siteContent.personality.profiles).length+1;let key=`visitor-${index}`
    while(state.siteContent.personality.profiles[key])key=`visitor-${++index}`
    state.siteContent.personality.profiles[key]={title:{es:'',en:''},text:{es:'',en:''}}
    state.dirtySiteContent=true;renderSiteContent();setSaveState();showToast('Perfil añadido. Después podrás asignarlo a respuestas del test.');return
  }
  if(target.matches('[data-remove-content]')){
    const index=Number(target.dataset.index)
    if(target.dataset.removeContent==='career')state.siteContent.career.splice(index,1)
    if(target.dataset.removeContent==='poll')state.siteContent.poll.options.splice(index,1)
    if(target.dataset.removeContent==='question')state.siteContent.personality.questions.splice(index,1)
    state.dirtySiteContent=true;renderSiteContent();setSaveState();return
  }
  if (target.matches('[data-new-note]')) {
    const date = new Date().toISOString().slice(0, 10)
    const slug = `nota-${date.replaceAll('-', '')}-${state.fieldNotes.entries.length + 1}`
    state.fieldNotes.entries.push({ slug, visibility: 'draft', date, title: { es: 'Nueva nota', en: 'New field note' }, summary: { es: '', en: '' }, tags: [], markdown: { es: '## La idea\n\n', en: '## The idea\n\n' }, related: [] })
    state.dirtyEditorLists = true; renderEditorLists(); setSaveState(); showToast('Borrador creado. Completa los campos en español e inglés.')
    return
  }
  if (target.matches('[data-new-journal-item]')) {
    const date = new Date().toISOString().slice(0, 10)
    const id = `media-${Date.now()}`
    state.journal.items.push({ id, visibility: 'draft', type: 'image', date, platform: 'Photo', src: `/images/journal/${date}-media.webp`, url: 'https://www.instagram.com/', title: { es: 'Nueva pieza visual', en: 'New visual piece' }, description: { es: '', en: '' }, alt: { es: '', en: '' } })
    state.dirtyEditorLists = true; renderEditorLists(); setSaveState(); showToast('Borrador creado. Completa el archivo, título y descripción.')
    return
  }
  if (target.matches('[data-format]')) return formatMarkdown(target.dataset.format)
  if (target.matches('[data-run-review]')) return showFinalReview(reviewProject(selectedProject()))
  if (target.matches('[data-locale]')) {
    state.locale = target.dataset.locale
    renderProject()
    return setSaveState()
  }
  if (target.matches('[data-add-resource]')) {
    selectedProject()[target.dataset.addResource].push({ label: '', href: '', kind: '' })
    markProjectDirty(); renderProject(); return
  }
  if (target.matches('[data-remove-resource]')) {
    selectedProject()[target.dataset.removeResource].splice(Number(target.dataset.index), 1)
    markProjectDirty(); renderProject(); return
  }
}

function handleFieldChange(event) {
  const target = event.target
  if (target.matches('[data-list-path]')) {
    const parts = target.dataset.listPath.split('.').map((part) => /^\d+$/.test(part) ? Number(part) : part)
    const value = parts.at(-1) === 'tags' ? target.value.split(',').map((tag) => tag.trim()).filter(Boolean) : target.value
    setNestedValue(state, parts, value)
    state.dirtyEditorLists = true
    const notes = ui.panel.querySelector('#field-notes-source'); const journal = ui.panel.querySelector('#journal-source')
    if (notes) notes.value = JSON.stringify(state.fieldNotes, null, 2)
    if (journal) journal.value = JSON.stringify(state.journal, null, 2)
    setSaveState(); return
  }
  if(target.matches('[data-site-content-path]')){
    const parts=target.dataset.siteContentPath.split('.')
    if(target.dataset.lines){
      const index=Number(parts[1]);const locale=target.dataset.lines==='es-lines'?'es':'en'
      const item=state.siteContent.career[index];const lines=target.value.split(/\r?\n/).map((line)=>line.trim()).filter(Boolean)
      const length=Math.max(lines.length,item.highlights.length)
      item.highlights=Array.from({length},(_,lineIndex)=>({es:locale==='es'?lines[lineIndex]||'':item.highlights[lineIndex]?.es||'',en:locale==='en'?lines[lineIndex]||'':item.highlights[lineIndex]?.en||''})).filter((entry)=>entry.es||entry.en)
    }else setNestedValue(state.siteContent,parts,target.value)
    state.dirtySiteContent=true
    const advanced=ui.panel.querySelector('#site-content-source');if(advanced)advanced.value=JSON.stringify(state.siteContent,null,2)
    setSaveState();return
  }
  if (target.matches('#field-notes-source, #journal-source')) {
    try {
      const value = JSON.parse(target.value); target.setCustomValidity('')
      if (target.id === 'field-notes-source') state.fieldNotes = value; else state.journal = value
      state.dirtyEditorLists = true; setSaveState()
    }
    catch { target.setCustomValidity('Completa un JSON válido antes de guardar.'); state.dirtyEditorLists = true; setSaveState() }
    return
  }
  if (target.matches('#site-content-source')) {
    try { state.siteContent = JSON.parse(target.value); state.dirtySiteContent = true; target.setCustomValidity(''); setSaveState() }
    catch { target.setCustomValidity('Completa un JSON válido antes de guardar.'); state.dirtySiteContent = true; setSaveState() }
    return
  }
  if (target.matches('[data-project-field]')) {
    const project = selectedProject()
    const parts = target.dataset.projectField.split('.')
    if (parts.length === 2) project[parts[0]][parts[1]] = target.value
    else project[parts[0]] = target.value
    if (target.type === 'color') {
      ui.panel.querySelectorAll('[data-project-field="accent"]').forEach((input) => { if (input !== target) input.value = target.value })
    }
    if (target.type === 'textarea' || target.dataset.projectField.startsWith('title.')) {
      const heading = ui.panel.querySelector('.editor-header h1')
      if (heading) heading.textContent = project.title.es || project.title.en || 'Proyecto sin título'
    }
    if (target.dataset.projectField === 'visibility') {
      const note = ui.panel.querySelector('.panel-head .eyebrow')
      if (note) note.textContent = project.visibility === 'draft' ? 'NO APARECE EN LA WEB' : 'EN · ES'
    }
    markProjectDirty()
    return
  }
  if (target.matches('[data-project-body]')) {
    const project = selectedProject()
    project.markdown[target.dataset.projectBody] = target.value
    const preview = ui.panel.querySelector('#markdown-preview')
    if (preview) preview.innerHTML = renderMarkdown(target.value)
    markProjectDirty()
    return
  }
  if (target.matches('[data-collection][data-resource-field]')) {
    const collection = target.dataset.collection
    const entry = selectedProject()[collection][Number(target.dataset.index)]
    entry[target.dataset.resourceField] = target.value
    if (target.dataset.resourceField === 'href') entry.external = /^https:\/\//i.test(target.value)
    markProjectDirty()
    return
  }
  if (target.matches('[data-video-index][data-video-field]')) {
    state.videos[Number(target.dataset.videoIndex)][target.dataset.videoField] = target.value
    state.dirtyVideos = true
    setSaveState()
  }
}

function setJsonArea(area, data) {
  area.value = JSON.stringify(data, null, 2)
  area.dispatchEvent(new Event('input', { bubbles: true }))
  area.focus()
  area.setSelectionRange(area.value.length, area.value.length)
}

function setNestedValue(object,parts,value){const last=parts.pop();const target=parts.reduce((node,key)=>node[key],object);target[last]=value}

function formatMarkdown(format) {
  const textarea = ui.panel.querySelector('#markdown-source')
  if (!textarea) return

  const source = textarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = source.slice(start, end)
  let next = source
  let selectionStart = start
  let selectionEnd = start

  if (['bold', 'italic', 'code'].includes(format)) {
    const [before, after] = { bold: ['**', '**'], italic: ['*', '*'], code: ['`', '`'] }[format]
    const content = selected || 'texto'
    next = `${source.slice(0, start)}${before}${content}${after}${source.slice(end)}`
    selectionStart = start + before.length
    selectionEnd = selectionStart + content.length
  } else if (format === 'link' || format === 'image') {
    const label = selected || (format === 'link' ? 'texto del enlace' : 'Descripción de la imagen')
    const url = window.prompt(format === 'link' ? 'Pega una URL HTTPS o una ruta local (/files/...)' : 'Pega una URL HTTPS o la ruta local de la imagen', format === 'image' ? `/files/${selectedProject().id}/` : 'https://')
    if (url === null) return
    const validUrl = /^https:\/\//i.test(url.trim()) || (url.trim().startsWith('/') && !url.trim().startsWith('//') && !url.trim().includes('\\'))
    if (!validUrl) return showToast('Usa una URL HTTPS o una ruta local que empiece por /.', true)
    const prefix = format === 'image' ? '!' : ''
    const insertion = `${prefix}[${label}](${url.trim()})`
    next = `${source.slice(0, start)}${insertion}${source.slice(end)}`
    selectionStart = start + prefix.length + 1
    selectionEnd = selectionStart + label.length
  } else {
    const lineStart = source.lastIndexOf('\n', Math.max(0, start - 1)) + 1
    let lineEnd = source.indexOf('\n', end)
    if (lineEnd < 0) lineEnd = source.length
    const block = source.slice(lineStart, lineEnd)
    const lines = block.split('\n')
    const prefixes = { h1: '# ', h2: '## ', h3: '### ', ul: '- ', ol: '1. ', quote: '> ' }
    const prefix = prefixes[format]
    if (!prefix) return
    const formatted = lines.map((line, index) => {
      const clean = line.replace(/^\s*(?:#{1,3}\s+|[-*+]\s+|\d+\.\s+|>\s?)/, '')
      if (format === 'ol') return `${index + 1}. ${clean}`
      return `${prefix}${clean}`
    }).join('\n')
    next = `${source.slice(0, lineStart)}${formatted}${source.slice(lineEnd)}`
    selectionStart = lineStart
    selectionEnd = lineStart + formatted.length
  }

  textarea.value = next
  textarea.focus()
  textarea.setSelectionRange(selectionStart, selectionEnd)
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
}

function reviewProject(project) {
  const errors = []
  const recommendations = []
  if (!project) return { errors: ['Selecciona un proyecto antes de revisarlo.'], recommendations }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || '')) errors.push('La URL corta debe usar minúsculas, números y guiones entre palabras.')
  if (state.projects.some((item) => item.id !== project.id && item.slug === project.slug)) errors.push('La URL corta ya está asignada a otro proyecto.')
  if (!project.image?.trim()) errors.push('Falta la imagen de portada o su ruta.')
  else if (!imageChoices.includes(project.image) && !isSafeContentUrl(project.image)) errors.push('La imagen debe ser un recurso importado, una ruta local o una URL HTTPS.')
  if (!/^#[\da-f]{6}$/i.test(project.accent || '')) errors.push('El color de acento debe ser un hexadecimal de seis dígitos.')
  if (!project.type?.trim()) errors.push('Completa el tipo de proyecto.')
  else if (project.type.trim().length > 40) errors.push('El tipo de proyecto supera el máximo de 40 caracteres.')
  if (!project.status?.trim()) errors.push('Completa el estado visible del proyecto.')
  else if (project.status.trim().length > 40) errors.push('El estado visible supera el máximo de 40 caracteres.')
  if (project.year && !/^\d{4}$/.test(String(project.year))) errors.push('El año del proyecto debe tener cuatro cifras o quedar vacío.')

  const headingLevels = {}
  for (const locale of ['es', 'en']) {
    const language = locale === 'es' ? 'español' : 'inglés'
    const title = project.title?.[locale]?.trim() || ''
    const summary = project.summary?.[locale]?.trim() || ''
    const body = project.markdown?.[locale]?.trim() || ''
    if (!title) errors.push(`Falta el título en ${language}.`)
    else if (title.length > 160) errors.push(`El título en ${language} supera los 160 caracteres.`)
    else if (title.length < 15) recommendations.push(`El título en ${language} es muy breve; comprueba que describa claramente el proyecto.`)
    if (title && state.projects.some((item) => item.id !== project.id && item.title?.[locale]?.trim().toLocaleLowerCase() === title.toLocaleLowerCase())) {
      recommendations.push(`El título en ${language} coincide con el de otro proyecto; busca una formulación más distintiva.`)
    }
    if (!summary) errors.push(`Falta el resumen en ${language}.`)
    else if (summary.length > 320) errors.push(`El resumen en ${language} supera los 320 caracteres.`)
    else if (summary.length < 45) recommendations.push(`El resumen en ${language} es muy breve para explicar qué es el proyecto y por qué merece atención.`)
    if (!body) errors.push(`Falta el dossier en ${language}.`)
    const headings = [...body.matchAll(/^(#{1,3})\s+.+$/gm)].map(([heading]) => heading.match(/^#+/)[0].length)
    headingLevels[locale] = headings
    if (body && headings.length === 0) recommendations.push(`Añade al menos un encabezado Markdown al dossier en ${language}.`)
    if (headings.includes(1)) recommendations.push(`Usa encabezados ## o ### en ${language}; el título del proyecto ya se publica como encabezado principal.`)
    const words = body.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#>*_`~]/g, ' ').trim().split(/\s+/).filter(Boolean).length
    if (body && words < 45) recommendations.push(`El dossier en ${language} tiene ${words} palabras; añade contexto sobre proceso, decisiones y resultado si hace falta.`)
    if (/\b(?:TODO|TBD|REPLACE_WITH|LOREM IPSUM)\b/i.test(body)) recommendations.push(`Parece que el dossier en ${language} conserva texto provisional (TODO/TBD).`)
    if ([...body.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)].some(([, alt]) => !alt.trim())) recommendations.push(`Añade texto alternativo descriptivo a las imágenes del dossier en ${language}.`)
    for (const [, url] of body.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const tokenImage = /^\{\{(?:labHero|labDetail)\}\}$/.test(url)
      if (!tokenImage && !isSafeContentUrl(url)) errors.push(`Hay una URL no permitida en el dossier en ${language}: ${url}`)
    }
  }

  if (headingLevels.es.length && headingLevels.en.length && headingLevels.es.join(',') !== headingLevels.en.join(',')) {
    recommendations.push('Los encabezados no tienen la misma estructura en español e inglés; comprueba que ambos dossiers cubran las mismas secciones.')
  }

  for (const collection of ['links', 'attachments']) {
    const resources = project[collection] || []
    resources.forEach((resource, index) => {
      const label = collection === 'links' ? 'enlace' : 'archivo'
      if (!resource.label?.trim()) errors.push(`El ${label} ${index + 1} necesita un nombre visible.`)
      if (!isSafeContentUrl(resource.href || '')) errors.push(`El ${label} ${index + 1} necesita una URL HTTPS o una ruta local válida.`)
    })
  }

  return { errors: [...new Set(errors)], recommendations: [...new Set(recommendations)] }
}

function isSafeContentUrl(value) {
  if (typeof value !== 'string') return false
  if (/^https:\/\//i.test(value)) {
    try { return new URL(value).protocol === 'https:' } catch { return false }
  }
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')
}

function showFinalReview(result) {
  const report = ui.panel.querySelector('#review-report')
  if (!report) return
  report.hidden = false
  report.replaceChildren()

  const title = document.createElement('h2')
  title.id = 'review-title'
  title.textContent = result.errors.length ? `Revisión: ${result.errors.length} ${result.errors.length === 1 ? 'error' : 'errores'}` : 'Revisión completada'
  report.setAttribute('aria-labelledby', title.id)
  report.append(title)

  const summary = document.createElement('p')
  summary.textContent = result.errors.length
    ? 'Corrige los errores antes de publicar. El borrador se puede seguir guardando.'
    : result.recommendations.length
      ? 'No hay bloqueos. Revisa estas sugerencias antes de publicar.'
      : 'No encontré errores en los campos y la estructura comprobados.'
  report.append(summary)

  for (const [items, className, heading] of [
    [result.errors, 'review-errors', 'Hay que corregir'],
    [result.recommendations, 'review-recommendations', 'Sugerencias']
  ]) {
    if (!items.length) continue
    const section = document.createElement('div')
    section.className = className
    const sectionTitle = document.createElement('h3')
    sectionTitle.textContent = heading
    const list = document.createElement('ul')
    for (const item of items) {
      const entry = document.createElement('li')
      entry.textContent = item
      list.append(entry)
    }
    section.append(sectionTitle, list)
    report.append(section)
  }

  const note = document.createElement('p')
  note.className = 'review-note'
  note.textContent = 'La revisión GEO/SEO automática comprueba señales técnicas y de claridad, no predice posiciones. La búsqueda con IA no requiere palabras clave repetidas ni un marcado especial. Comprueba manualmente la experiencia propia, la veracidad, la calidad de la traducción y los permisos de imágenes.'
  report.append(note)
  appendSearchPreview(report, selectedProject())
  report.focus()
}

function appendSearchPreview(report, project) {
  if (!project) return
  const details = document.createElement('details')
  details.className = 'review-search-preview'
  const summary = document.createElement('summary')
  summary.textContent = 'Vista previa SEO por idioma'
  details.append(summary)

  for (const locale of ['en', 'es']) {
    const spanish = locale === 'es'
    const path = `${spanish ? '/es' : ''}/experiments/${project.id}`
    const title = `${project.title?.[locale]?.trim() || '(falta título)'} — ${spanish ? 'Experimento' : 'Experiment'} #${project.id} | Braisgf.dev`
    const item = document.createElement('div')
    item.className = 'review-search-locale'
    const heading = document.createElement('h4')
    heading.textContent = spanish ? 'Español' : 'English'
    const titleText = document.createElement('p')
    titleText.textContent = `Title: ${title}`
    const description = document.createElement('p')
    description.textContent = `Description: ${project.summary?.[locale]?.trim() || '(falta resumen)'}`
    const canonical = document.createElement('p')
    canonical.textContent = `Canonical: https://braisgf.dev${path}`
    item.append(heading, titleText, description, canonical)
    details.append(item)
  }

  const generated = document.createElement('p')
  generated.className = 'review-generated-meta'
  generated.textContent = 'Cuando el proyecto sea público y ejecutes npm run build, se generan estas etiquetas en el HTML prerenderizado, hreflang EN/ES, Open Graph, Twitter, datos estructurados y rutas del sitemap. Esta vista previa comprueba los datos de origen; el build comprueba los archivos generados.'
  details.append(generated)
  report.append(details)
}

async function createDraft() {
  try {
    const result = await api('/api/projects', { method: 'POST', body: '{}' })
    state.projects.push(result.project)
    state.selectedId = result.project.id
    state.section = 'projects'
    state.filter = 'all'
    document.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.filter === 'all')))
    showToast(`Borrador #${result.project.id} creado. Escribe el contenido antes de publicarlo.`)
    render()
    ui.panel.querySelector('#field-title-es')?.focus()
  } catch (error) { showToast(error.message, true) }
}

async function saveCurrent() {
  if (state.saving) return
  const project = selectedProject()
  if (state.section === 'projects' && (!project || !state.dirtyProjects.has(project.id))) return
  if (state.section === 'videos' && !state.dirtyVideos) return
  if (state.section === 'site-content' && !state.dirtySiteContent) return
  if (state.section === 'editor-lists' && !state.dirtyEditorLists) return
  if (state.section === 'projects' && project.visibility === 'public') {
    const review = reviewProject(project)
    if (review.errors.length) {
      showFinalReview(review)
      showToast('Corrige los errores de la revisión antes de publicar.', true)
      return
    }
  }
  state.saving = true
  setSaveState()
  try {
    if (state.section === 'editor-lists') {
      const fieldNotes = JSON.parse(ui.panel.querySelector('#field-notes-source').value)
      const journal = JSON.parse(ui.panel.querySelector('#journal-source').value)
      const result = await api('/api/editor-lists', { method: 'PUT', body: JSON.stringify({ fieldNotes, journal, fieldNotesVersion: state.fieldNotesVersion, journalVersion: state.journalVersion }) })
      state.fieldNotes = result.fieldNotes
      state.fieldNotesVersion = result.fieldNotesVersion
      state.journal = result.journal
      state.journalVersion = result.journalVersion
      state.dirtyEditorLists = false
      showToast('Notas y cuaderno visual guardados en src/content.')
    } else if (state.section === 'site-content') {
      const source = ui.panel.querySelector('#site-content-source')
      const content = JSON.parse(source.value)
      const result = await api('/api/site-content', { method: 'PUT', body: JSON.stringify({ content, version: state.siteContentVersion }) })
      state.siteContent = result.content
      state.siteContentVersion = result.version
      state.dirtySiteContent = false
      showToast('Trayectoria, encuesta y test guardados en src/content/site-content.json.')
    } else if (state.section === 'videos') {
      const result = await api('/api/videos', { method: 'PUT', body: JSON.stringify({ videos: state.videos, version: state.videosVersion }) })
      state.videos = result.videos
      state.videosVersion = result.version
      state.dirtyVideos = false
      showToast('Galería guardada en src/data/videos.json.')
    } else {
      const result = await api(`/api/projects/${project.id}`, { method: 'PUT', body: JSON.stringify({ project: editableProject(project), markdown: project.markdown, version: project.version }) })
      Object.assign(project, result.project)
      state.dirtyProjects.delete(project.id)
      showToast(project.visibility === 'public' ? `Proyecto #${project.id} publicado en el registro.` : `Proyecto #${project.id} guardado como ${visibilityLabel(project.visibility).toLowerCase()}.`)
    }
  } catch (error) {
    showToast(error.message, true)
  } finally {
    state.saving = false
    render()
  }
}

function editableProject(project) {
  const { id, slug, visibility, image, accent, type, status, year, title, summary, attachments, links } = project
  return { id, slug: slug.trim(), visibility, image: image.trim(), accent: accent.trim(), type: type.trim(), status: status.trim(), year: String(year || '').trim(), title, summary, attachments, links }
}

start()
