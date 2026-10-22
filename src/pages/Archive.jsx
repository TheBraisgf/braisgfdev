import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { experiments, archiveVisuals } from '../data/experiments.js'
import { Reveal } from '../components/Reveal.jsx'

const accentFor = (experiment) => experiment.accent || 'acid'

export function Archive() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return (
    <main className="archive-page section-pad">
      <Reveal>
        <header className="archive-hero">
          <Link className="back-link" to={prefix || '/'}>← {t('archive.back')}</Link>
          <p className="eyebrow">{t('archive.eyebrow')}</p>
          <h1>{t('archive.title')}</h1>
          <p>{t('archive.intro')}</p>
        </header>
      </Reveal>
      <div className="archive-list">
        {experiments.map((experiment, index) => {
          const item = t(`experiments.${experiment.id}`, { returnObjects: true })
          return (
            <Reveal key={experiment.id} delay={index * 70}>
              <Link className={`archive-row accent-${accentFor(experiment)}`} style={{ '--row-accent': `var(--${accentFor(experiment)})` }} to={`${prefix}/experiments/${experiment.id}`}>
                <span className="archive-number">{experiment.id}</span>
                <div className="archive-thumb"><img src={experiment.image} alt="" loading="lazy" /></div>
                <div>
                  <span className="card-kicker">{item.type} · {t(`archive.status.${item.status}`)}</span>
                  <h2>{item.title}</h2>
                  <p>{item.hypothesis}</p>
                </div>
                <span className="archive-arrow" aria-hidden="true">↗</span>
              </Link>
            </Reveal>
          )
        })}
        <Reveal delay={220}>
          <div className="archive-row archive-open" style={{ '--row-accent': 'var(--blue)' }}>
            <span className="archive-number">004</span>
            <div className="archive-thumb"><img src={archiveVisuals.wildcard} alt="" loading="lazy" /></div>
            <div><span className="card-kicker">OPEN</span><h2>???</h2><p>{t('home.unknownText')}</p></div>
            <span className="archive-arrow" aria-hidden="true">+</span>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
