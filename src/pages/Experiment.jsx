import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getExperiment } from '../data/experiments.js'

export function Experiment() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''
  const experiment = getExperiment(id)

  if (!experiment) return <main className="not-found section-pad"><p className="eyebrow">404</p><h1>That experiment doesn't exist yet.</h1><Link to={`${prefix}/experiments`}>← {t('archive.back')}</Link></main>

  const item = t(`experiments.${id}`, { returnObjects: true })
  const next = String(Number(id) + 1).padStart(3, '0')

  return (
    <main className="dossier section-pad">
      <Link className="back-link" to={`${prefix}/experiments`}>← {t('archive.title')}</Link>
      <header className="dossier-head">
        <div className="dossier-number">#{id}</div>
        <div><p className="eyebrow">{item.type} · {t(`archive.status.${item.status}`)}</p><h1>{item.title}</h1></div>
      </header>
      <div className="dossier-layout">
        <aside className="dossier-side"><span>EXPERIMENT</span><strong>#{id}</strong><span>STATUS</span><strong>{t(`archive.status.${item.status}`)}</strong><span>YEAR</span><strong>2026</strong></aside>
        <article className="dossier-content">
          {experiment.image && <img className="dossier-image" src={experiment.image} alt="The personal lab" />}
          <section><p className="label">01 / HYPOTHESIS</p><p className="big-answer">{item.hypothesis}</p></section>
          <section className="dossier-grid"><div><p className="label">02 / OBJECTIVE</p><p>{item.objective}</p></div><div><p className="label">03 / CONSTRAINT</p><p>{item.constraint}</p></div></section>
          <section className="result-box"><p className="label">04 / SUCCESS LOOKS LIKE</p><p>{item.success}</p></section>
          <div className="dossier-footer"><span>More soon. This experiment is intentionally alive.</span><Link to={id === '003' ? `${prefix}/experiments` : `${prefix}/experiments/${next}`}>Next experiment →</Link></div>
        </article>
      </div>
    </main>
  )
}
