import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { career } from '../data/site.js'
import { careerLogos } from '../data/assets.js'
import { Reveal } from '../components/Reveal.jsx'

const logoFor = { telecom: careerLogos.telecom, film: careerLogos.film, hab: careerLogos.hab, zara: careerLogos.zara, imageai: careerLogos.santander, forms: careerLogos.santander, backend: careerLogos.santander }
const signalFor = { telecom: 'FOUNDATION', film: 'STORY', hab: 'ENTRY', zara: 'SCALE', imageai: 'AI / FRONTEND', forms: 'AI / WORKFLOW', backend: 'AI / BACKEND' }

export function Career() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return <main className="career-page section-pad">
    <Reveal><Link className="back-link" to={`${prefix}/about`}>← {t('careerPage.back')}</Link></Reveal>
    <Reveal delay={70}><header className="archive-hero"><p className="eyebrow">{t('careerPage.eyebrow')}</p><h1>{t('careerPage.title')}</h1><p>{t('careerPage.intro')}</p></header></Reveal>
    <div className="career-timeline">
      {career.map((item, index) => <Reveal key={item.key} delay={Math.min(index * 60, 300)}><article className={`career-item ${index % 2 ? 'right' : 'left'} career-${item.key}`} style={{ '--career-accent': `var(--${index % 3 === 0 ? 'acid' : index % 3 === 1 ? 'orange' : 'blue'})` }}><div className="career-dot" aria-hidden="true" /><div className="career-card"><div className="career-card-top"><span>{item.year}</span><img className="career-logo" src={logoFor[item.key]} alt="" loading="lazy" /></div><p className="eyebrow">{t(`career.${item.key}.company`)}</p><h2>{t(`career.${item.key}.role`)}</h2><p>{t(`career.${item.key}.text`)}</p><span className="career-signal"><i />{signalFor[item.key]}</span></div></article></Reveal>)}
    </div>
  </main>
}
