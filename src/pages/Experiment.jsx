import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getExperiment } from '../data/experiments.js'

export function Experiment() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const experiment = getExperiment(id)
  const labels = spanish ? { notFound: 'Ese experimento todavía no existe.', experiment: 'EXPERIMENTO', status: 'ESTADO', year: 'AÑO', imageAlt: 'El laboratorio personal', objective: 'OBJETIVO', constraint: 'RESTRICCIÓN', success: 'ASÍ SE VE EL ÉXITO', resources: 'RECURSOS', file: 'ARCHIVO', alive: 'Este experimento sigue vivo.', next: 'Siguiente experimento' } : { notFound: "That experiment doesn't exist yet.", experiment: 'EXPERIMENT', status: 'STATUS', year: 'YEAR', imageAlt: 'The personal lab', objective: 'OBJECTIVE', constraint: 'CONSTRAINT', success: 'SUCCESS LOOKS LIKE', resources: 'RESOURCES', file: 'FILE', alive: 'This experiment is intentionally alive.', next: 'Next experiment' }

  if (!experiment) return <main className="not-found section-pad"><p className="eyebrow">404</p><h1>{labels.notFound}</h1><Link to={`${prefix}/experiments`}>← {t('archive.back')}</Link></main>

  const item = t(`experiments.${id}`, { returnObjects: true })
  const next = String(Number(id) + 1).padStart(3, '0')

  return <main className="dossier section-pad">
    <Link className="back-link" to={`${prefix}/experiments`}>← {t('archive.title')}</Link>
    <header className="dossier-head"><div className="dossier-number">#{id}</div><div><p className="eyebrow">{item.type} · {t(`archive.status.${item.status}`)}</p><h1>{item.title}</h1></div></header>
    <div className="dossier-layout">
      <aside className="dossier-side"><span>{labels.experiment}</span><strong>#{id}</strong><span>{labels.status}</span><strong>{t(`archive.status.${item.status}`)}</strong><span>{labels.year}</span><strong>2026</strong></aside>
      <article className="dossier-content">
        {experiment.image && <img className="dossier-image" src={experiment.image} alt={labels.imageAlt} />}
        <section><p className="label">01 / {t('home.hypothesis')}</p><p className="big-answer">{item.hypothesis}</p></section>
        <section className="dossier-grid"><div><p className="label">02 / {labels.objective}</p><p>{item.objective}</p></div><div><p className="label">03 / {labels.constraint}</p><p>{item.constraint}</p></div></section>
        <section className="result-box"><p className="label">04 / {labels.success}</p><p>{item.success}</p></section>
        {(experiment.attachments.length > 0 || experiment.links.length > 0) && <section className="resources"><p className="label">05 / {labels.resources}</p><div className="resource-list">{[...experiment.attachments, ...experiment.links].map((resource) => <a href={resource.href} key={`${resource.href}-${resource.label}`} target={resource.external ? '_blank' : undefined} rel={resource.external ? 'noreferrer' : undefined}><span>{resource.kind || labels.file}</span><strong>{resource.label}</strong><b>↗</b></a>)}</div></section>}
        <div className="dossier-footer"><span>{labels.alive}</span><Link to={id === '003' ? `${prefix}/experiments` : `${prefix}/experiments/${next}`}>{labels.next} →</Link></div>
      </article>
    </div>
  </main>
}
