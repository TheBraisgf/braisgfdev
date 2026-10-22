import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { experiments, archiveVisuals } from '../data/experiments.js'
import { Reveal } from '../components/Reveal.jsx'

const accentFor = (experiment) => experiment.accent || 'acid'

export function Archive() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const labels = spanish ? { eyebrow: 'EL LABORATORIO', title: 'Experimentos', intro: 'Ideas con un número. Una hipótesis. Una restricción. Un resultado. Algunos funcionan. Otros fallan espectacularmente. Todos me enseñan algo.', back: 'Volver al inicio', open: 'ABRIR DOSSIER', running: 'EN MARCHA', idea: 'IDEA', planned: 'PLANEADO', meta: 'META', software: 'SOFTWARE' } : { eyebrow: 'THE LAB', title: 'Experiments', intro: 'An idea with a number. A hypothesis. A constraint. A result. Some work. Some fail spectacularly. All of them teach me something.', back: 'Back home', open: 'OPEN DOSSIER', running: 'RUNNING', idea: 'IDEA', planned: 'PLANNED', meta: 'META', software: 'SOFTWARE' }
  const status = (value) => labels[String(value).toLowerCase()] || value
  const type = (value) => labels[String(value).toLowerCase()] || value

  return <main className="archive-page section-pad">
    <Reveal><header className="archive-hero"><Link className="back-link" to={prefix || '/'}>← {labels.back}</Link><p className="eyebrow">{labels.eyebrow}</p><h1>{labels.title}</h1><p>{labels.intro}</p></header></Reveal>
    <div className="archive-list">
      {experiments.map((experiment, index) => {
        const item = t(`experiments.${experiment.id}`, { returnObjects: true })
        return <Reveal key={experiment.id} delay={index * 70}><Link className={`archive-row accent-${accentFor(experiment)}`} style={{ '--row-accent': `var(--${accentFor(experiment)})` }} to={`${prefix}/experiments/${experiment.id}`}><span className="archive-number">{experiment.id}</span><div className="archive-thumb"><img src={experiment.image} alt="" loading="lazy" /></div><div><span className="card-kicker">{type(item.type)} · {status(item.status)}</span><h2>{item.title}</h2><p>{item.hypothesis}</p><span className="archive-open-label">{labels.open} ↗</span></div><span className="archive-arrow" aria-hidden="true">↗</span></Link></Reveal>
      })}
      <Reveal delay={220}><div className="archive-row archive-open" style={{ '--row-accent': 'var(--blue)' }}><span className="archive-number">004</span><div className="archive-thumb"><img src={archiveVisuals.wildcard} alt="" loading="lazy" /></div><div><span className="card-kicker">{spanish ? 'ABIERTO' : 'OPEN'}</span><h2>???</h2><p>{t('home.unknownText')}</p></div><span className="archive-arrow" aria-hidden="true">+</span></div></Reveal>
    </div>
  </main>
}
