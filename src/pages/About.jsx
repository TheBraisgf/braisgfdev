import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { career } from '../data/site.js'
import { portrait, careerLogos } from '../data/assets.js'
import { Reveal } from '../components/Reveal.jsx'

const logoFor = { telecom: careerLogos.telecom, film: careerLogos.film, hab: careerLogos.hab, zara: careerLogos.zara, imageai: careerLogos.santander, forms: careerLogos.santander, backend: careerLogos.santander }

export function About() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const extras = spanish ? { motto: 'Construyo cosas útiles, divertidas o simplemente guays.', stack: 'JS · Node · React · Python · MongoDB · AWS', background: 'Telecomunicaciones + Fullstack', interests: 'Web Dev · IA · Electrónica · Juegos indie · DIY', goal: 'Crecer cada día y compartir lo que aprendo' } : { motto: 'I build useful, fun or just plain cool stuff.', stack: 'JS · Node · React · Python · MongoDB · AWS', background: 'Telecommunications + Fullstack', interests: 'Web Dev · AI · Electronics · Indie Games · DIY', goal: 'Grow every day and share what I learn' }

  return <main className="about-page section-pad">
    <Reveal><Link className="back-link" to={prefix || '/'}>← {t('about.back')}</Link></Reveal>
    <Reveal delay={70}><header className="about-hero"><div><p className="eyebrow">{t('about.eyebrow')}</p><h1>{t('about.titleA')}<br /><em>{t('about.titleB')}</em></h1><p className="about-motto">“{extras.motto}”</p></div><img src={portrait} alt={t('about.photoAlt')} /></header></Reveal>
    <Reveal delay={100}><div className="about-grid"><div><p className="about-lead">{t('about.lead')}</p></div><div className="about-copy"><p>{t('about.copy1')}</p><p>{t('about.copy2')}</p><div className="about-facts"><span>{t('about.fact1')}</span><span>{t('about.fact2')}</span><span>{t('about.fact3')}</span><span>{t('about.fact4')}</span><span>{extras.background}</span><span>{extras.goal}</span></div></div></div></Reveal>
    <Reveal><section className="about-details"><p className="eyebrow">{spanish ? 'MAPA RÁPIDO' : 'QUICK MAP'}</p><div className="about-detail-grid"><div><span>{spanish ? 'INTERESES' : 'INTERESTS'}</span><strong>{extras.interests}</strong></div><div><span>STACK</span><strong>{extras.stack}</strong></div></div></section></Reveal>
    <Reveal><section className="career-preview" aria-labelledby="career-preview-title"><div className="section-intro"><div><p className="eyebrow">{t('about.careerEyebrow')}</p><h2 id="career-preview-title">{t('about.careerTitle')}</h2></div><Link className="text-link" to={`${prefix}/career`}>{t('about.fullCareer')} ↗</Link></div><div className="career-strip">{career.slice(-4).map((item) => <div className="career-mini" key={item.key}><img src={logoFor[item.key]} alt="" loading="lazy" /><span>{item.year}</span><strong>{t(`career.${item.key}.role`)}</strong><small>{t(`career.${item.key}.company`)}</small></div>)}</div></section></Reveal>
    <Reveal><section className="about-cta"><p className="eyebrow">{t('about.ctaEyebrow')}</p><h2>{t('about.ctaTitle')}</h2><Link className="button button-dark" to={`${prefix}/experiments`}>{t('about.ctaButton')} ↓</Link></section></Reveal>
  </main>
}
