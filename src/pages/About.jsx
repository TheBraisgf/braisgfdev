import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { career } from '../data/site.js'
import { portrait } from '../data/assets.js'

export function About() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return <main className="about-page section-pad">
    <Link className="back-link" to={prefix || '/'}>← {t('about.back')}</Link>
    <header className="about-hero"><div><p className="eyebrow">{t('about.eyebrow')}</p><h1>{t('about.titleA')}<br /><em>{t('about.titleB')}</em></h1></div><img src={portrait} alt={t('about.photoAlt')} /></header>
    <div className="about-grid"><div><p className="about-lead">{t('about.lead')}</p></div><div className="about-copy"><p>{t('about.copy1')}</p><p>{t('about.copy2')}</p><div className="about-facts"><span>{t('about.fact1')}</span><span>{t('about.fact2')}</span><span>{t('about.fact3')}</span><span>{t('about.fact4')}</span></div></div></div>
    <section className="career-preview" aria-labelledby="career-preview-title"><div className="section-intro"><div><p className="eyebrow">{t('about.careerEyebrow')}</p><h2 id="career-preview-title">{t('about.careerTitle')}</h2></div><Link className="text-link" to={`${prefix}/career`}>{t('about.fullCareer')} ↗</Link></div><div className="career-strip">{career.slice(-4).map((item) => <div className="career-mini" key={item.key}><span>{item.year}</span><strong>{t(`career.${item.key}.role`)}</strong><small>{t(`career.${item.key}.company`)}</small></div>)}</div></section>
    <section className="about-cta"><p className="eyebrow">{t('about.ctaEyebrow')}</p><h2>{t('about.ctaTitle')}</h2><Link className="button button-dark" to={`${prefix}/experiments`}>{t('about.ctaButton')} ↓</Link></section>
  </main>
}
