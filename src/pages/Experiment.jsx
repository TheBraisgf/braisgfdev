import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getExperiment } from '../data/experiments.js'

export function Experiment() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''
  const experiment = getExperiment(id)

  if (!experiment) return <main className="not-found section-pad"><p className="eyebrow">404</p><h1>{t('experiment.notFound')}</h1><Link to={`${prefix}/experiments`}>← {t('archive.back')}</Link></main>

  const item = t(`experiments.${id}`, { returnObjects: true })
  const next = String(Number(id) + 1).padStart(3, '0')

  return <main className="dossier section-pad">
    <Link className="back-link" to={`${prefix}/experiments`}>← {t('archive.title')}</Link>
    <header className="dossier-head"><div className="dossier-number">#{id}</div><div><p className="eyebrow">{item.type} · {t(`archive.status.${item.status}`)}</p><h1>{item.title}</h1></div></header>
    <div className="dossier-layout">
      <aside className="dossier-side"><span>{t('experiment.experiment')}</span><strong>#{id}</strong><span>{t('experiment.status')}</span><strong>{t(`archive.status.${item.status}`)}</strong><span>{t('experiment.year')}</span><strong>2026</strong></aside>
      <article className="dossier-content">
        {experiment.image && <img className="dossier-image" src={experiment.image} alt={t('experiment.imageAlt')} />}
        <section><p className="label">01 / {t('home.hypothesis')}</p><p className="big-answer">{item.hypothesis}</p></section>
        <section className="dossier-grid"><div><p className="label">02 / {t('experiment.objective')}</p><p>{item.objective}</p></div><div><p className="label">03 / {t('experiment.constraint')}</p><p>{item.constraint}</p></div></section>
        <section className="result-box"><p className="label">04 / {t('experiment.success')}</p><p>{item.success}</p></section>
        {(experiment.attachments.length > 0 || experiment.links.length > 0) && <section className="resources"><p className="label">05 / {t('experiment.resources')}</p><div className="resource-list">{[...experiment.attachments, ...experiment.links].map((resource) => <a href={resource.href} key={`${resource.href}-${resource.label}`} target={resource.external ? '_blank' : undefined} rel={resource.external ? 'noreferrer' : undefined}><span>{resource.kind || t('experiment.file')}</span><strong>{resource.label}</strong><b>↗</b></a>)}</div></section>}
        <div className="dossier-footer"><span>{t('experiment.alive')}</span><Link to={id === '003' ? `${prefix}/experiments` : `${prefix}/experiments/${next}`}>{t('experiment.next')} →</Link></div>
      </article>
    </div>
  </main>
}
