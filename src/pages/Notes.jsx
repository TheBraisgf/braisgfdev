import { Link, useLocation, useParams } from 'react-router-dom'
import { fieldNotes, getFieldNote } from '../data/fieldNotes.js'
import { MarkdownContent } from '../components/MarkdownContent.jsx'
import { Reveal } from '../components/Reveal.jsx'

export function Notes() {
  const { pathname } = useLocation()
  const { slug } = useParams()
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const locale = spanish ? 'es' : 'en'
  const note = slug ? getFieldNote(slug) : null
  if (slug && !note) return <main className="archive-page section-pad"><h1>{spanish ? 'Esta nota aún no existe.' : 'This field note does not exist yet.'}</h1><Link to={`${prefix}/notes`}>← {spanish ? 'Notas de campo' : 'Field notes'}</Link></main>
  if (note) return <main className="dossier section-pad"><Reveal><Link className="back-link" to={`${prefix}/notes`}>← {spanish ? 'Todas las notas' : 'All field notes'}</Link></Reveal><Reveal><header className="dossier-head"><p className="eyebrow">{spanish ? 'NOTA DE CAMPO' : 'FIELD NOTE'} · {note.date}</p><div><p className="eyebrow">{(note.tags || []).join(' · ')}</p><h1>{note.title[locale]}</h1><p>{note.summary[locale]}</p></div></header></Reveal><article className="dossier-content note-content"><MarkdownContent source={note.markdown[locale]} /></article><nav className="note-related" aria-label={spanish ? 'Contenido relacionado' : 'Related content'}>{(note.related || []).map((item) => <Link key={item.href} to={item.href}>{item.label[locale]} ↗</Link>)}</nav></main>
  return <main className="archive-page section-pad"><Reveal><header className="archive-hero"><p className="eyebrow">{spanish ? 'NOTAS DE CAMPO / CUADERNO ABIERTO' : 'FIELD NOTES / OPEN NOTEBOOK'}</p><h1>{spanish ? 'Notas de campo' : 'Field notes'}</h1><p>{spanish ? 'Reseñas, ideas y observaciones que no necesitan convertirse en un proyecto.' : 'Reviews, ideas and observations that do not need to become a project.'}</p></header></Reveal>{fieldNotes.length ? <div className="archive-list">{fieldNotes.filter((entry) => entry.visibility === 'public').sort((a,b) => b.date.localeCompare(a.date)).map((entry) => <Reveal key={entry.slug}><Link className="archive-row note-row" to={`${prefix}/notes/${entry.slug}`}><span className="archive-number">{entry.date}</span><div><span className="card-kicker">{(entry.tags || []).join(' · ')}</span><h2>{entry.title[locale]}</h2><p>{entry.summary[locale]}</p></div><span className="archive-arrow" aria-hidden="true">↗</span></Link></Reveal>)}</div> : <p className="note-empty">{spanish ? 'El cuaderno está abierto. Las próximas notas aparecerán aquí.' : 'The notebook is open. New field notes will appear here.'}</p>}</main>
}
