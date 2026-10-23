import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getExperiment } from '../data/experiments.js'
import { ResourceList } from '../components/ResourceList.jsx'
import { MarkdownContent } from '../components/MarkdownContent.jsx'
import { Reveal } from '../components/Reveal.jsx'

export function Experiment() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const experiment = getExperiment(id)
  const labels = spanish
    ? { notFound: 'Ese experimento todavía no existe.', experiment: 'EXPERIMENTO', status: 'ESTADO', year: 'AÑO', imageAlt: 'Material del laboratorio', objective: 'OBJETIVO', constraint: 'RESTRICCIÓN', success: 'ASÍ SE VE EL ÉXITO', resources: 'RECURSOS', alive: 'Este experimento sigue vivo.', next: 'Siguiente experimento', meta: 'META', software: 'SOFTWARE', learning: 'APRENDIZAJE', running: 'EN MARCHA', idea: 'IDEA', planned: 'PLANEADO', file: 'ARCHIVO', open: 'ABRIR' }
    : { notFound: "That experiment doesn't exist yet.", experiment: 'EXPERIMENT', status: 'STATUS', year: 'YEAR', imageAlt: 'Lab material', objective: 'OBJECTIVE', constraint: 'CONSTRAINT', success: 'SUCCESS LOOKS LIKE', resources: 'RESOURCES', alive: 'This experiment is intentionally alive.', next: 'Next experiment', meta: 'META', software: 'SOFTWARE', learning: 'LEARNING', running: 'RUNNING', idea: 'IDEA', planned: 'PLANNED', file: 'FILE', open: 'OPEN' }

  if (!experiment) return <main className="not-found section-pad"><p className="eyebrow">404</p><h1>{labels.notFound}</h1><Link to={`${prefix}/experiments`}>← {t('nav.experiments')}</Link></main>

  const item = t(`experiments.${id}`, { returnObjects: true })
  const type = labels[String(item.type).toLowerCase()] || item.type
  const statusKey = String(item.status).toLowerCase()
  const status = labels[statusKey] || t(`archive.status.${item.status}`)
  const next = String(Number(id) + 1).padStart(3, '0')
  const resources = [...experiment.attachments, ...experiment.links]
  const markdown = experiment.markdown?.[spanish ? 'es' : 'en']?.trim()

  return <main className="dossier section-pad">
    <Reveal><Link className="back-link" to={`${prefix}/experiments`}>← {t('nav.experiments')}</Link></Reveal>
    <Reveal delay={80}><header className="dossier-head" style={{ '--experiment-accent': experiment.accent }}><div className="dossier-number">#{id}</div><div><p className="eyebrow">{type} · {status}</p><h1>{item.title}</h1></div></header></Reveal>
    <div className="dossier-layout">
      <Reveal><aside className="dossier-side" style={{ '--experiment-accent': experiment.accent }}><span>{labels.experiment}</span><strong>#{id}</strong><span>{labels.status}</span><strong>{status}</strong><span>{labels.year}</span><strong>2026</strong></aside></Reveal>
      <article className="dossier-content">
        {markdown ? <Reveal delay={100}><MarkdownContent source={markdown} /></Reveal> : <>
          <Reveal delay={100}>{experiment.image && <img className="dossier-image" src={experiment.image} alt={labels.imageAlt} loading="eager" />}</Reveal>
          <Reveal delay={130}><section><p className="label">01 / {t('home.hypothesis')}</p><p className="big-answer">{item.hypothesis}</p></section></Reveal>
          <Reveal delay={150}><section className="dossier-grid"><div><p className="label">02 / {labels.objective}</p><p>{item.objective}</p></div><div><p className="label">03 / {labels.constraint}</p><p>{item.constraint}</p></div></section></Reveal>
          <Reveal delay={170}><section className="result-box"><p className="label">04 / {labels.success}</p><p>{item.success}</p></section></Reveal>
        </>}
        {resources.length > 0 && <Reveal delay={markdown ? 130 : 190}><section className="resources"><p className="label">{markdown ? 'RESOURCES' : '05 / ' + labels.resources}</p><ResourceList resources={resources} labels={labels} /></section></Reveal>}
        <Reveal delay={markdown ? 160 : 210}><div className="dossier-footer"><span>{labels.alive}</span><Link to={id === '003' ? `${prefix}/experiments` : `${prefix}/experiments/${next}`}>{labels.next} →</Link></div></Reveal>
      </article>
    </div>
  </main>
}
