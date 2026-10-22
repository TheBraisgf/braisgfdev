import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { career } from '../data/site.js'

export function Career() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return <main className="career-page section-pad">
    <Link className="back-link" to={`${prefix}/about`}>← {t('careerPage.back')}</Link>
    <header className="archive-hero"><p className="eyebrow">{t('careerPage.eyebrow')}</p><h1>{t('careerPage.title')}</h1><p>{t('careerPage.intro')}</p></header>
    <div className="career-timeline">{career.map((item, index) => <article className={`career-item ${index % 2 ? 'right' : 'left'}`} key={item.key}><div className="career-dot" aria-hidden="true" /><div className="career-card"><div className="career-card-top"><span>{item.year}</span><img src={item.image} alt="" loading="lazy" /></div><p className="eyebrow">{t(`career.${item.key}.company`)}</p><h2>{t(`career.${item.key}.role`)}</h2><p>{t(`career.${item.key}.text`)}</p></div></article>)}</div>
  </main>
}
