import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { experiments } from '../data/experiments.js'

export function Archive() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return (
    <main className="archive-page section-pad">
      <header className="archive-hero">
        <Link className="back-link" to={prefix || '/'}>← {t('archive.back')}</Link>
        <p className="eyebrow">{t('archive.eyebrow')}</p>
        <h1>{t('archive.title')}</h1>
        <p>{t('archive.intro')}</p>
      </header>
      <div className="archive-list">
        {experiments.map((experiment) => {
          const item = t(`experiments.${experiment.id}`, { returnObjects: true })
          return (
            <Link className="archive-row" to={`${prefix}/experiments/${experiment.id}`} key={experiment.id}>
              <span className="archive-number">{experiment.id}</span>
              <div><span className="card-kicker">{item.type} · {t(`archive.status.${item.status}`)}</span><h2>{item.title}</h2><p>{item.hypothesis}</p></div>
              <span className="archive-arrow">↗</span>
            </Link>
          )
        })}
        <div className="archive-row archive-open"><span className="archive-number">004</span><div><span className="card-kicker">OPEN</span><h2>???</h2><p>{t('home.unknownText')}</p></div><span className="archive-arrow">+</span></div>
      </div>
    </main>
  )
}
