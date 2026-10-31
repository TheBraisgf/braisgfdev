import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { career } from '../data/site.js'
import { Reveal } from '../components/Reveal.jsx'

const signals = { es: ['BASE', 'NARRATIVA', 'ENTRADA', 'ESCALA', 'IA / FRONTEND', 'IA / FLUJO', 'IA / BACKEND'], en: ['FOUNDATION', 'STORY', 'ENTRY', 'SCALE', 'AI / FRONTEND', 'AI / WORKFLOW', 'AI / BACKEND'] }

export function Career() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const locale = spanish ? 'es' : 'en'
  return <main className="career-page section-pad"><Reveal><Link className="back-link" to={`${prefix}/about`}>← {t('careerPage.back')}</Link></Reveal><Reveal delay={70}><header className="archive-hero"><p className="eyebrow">{t('careerPage.eyebrow')}</p><h1>{t('careerPage.title')}</h1><p>{t('careerPage.intro')}</p></header></Reveal><ol className="career-timeline" aria-label={spanish ? 'Trayectoria profesional en orden cronológico' : 'Professional experience in chronological order'}>{career.map((item, index) => <li key={item.key} className={`career-item ${index % 2 ? 'right' : 'left'} career-${item.key}`} style={{ '--career-accent': `var(--${index % 3 === 0 ? 'acid' : index % 3 === 1 ? 'violet' : 'blue'})` }}><Reveal delay={Math.min(index * 60, 300)}><article className="career-card"><div className="career-card-top"><span>{item.year}</span><span className="career-company-mark" aria-hidden="true">{item.key.slice(0, 2).toUpperCase()}</span></div><p className="eyebrow">{item.company[locale]}</p><h2>{item.role[locale]}</h2><p className="career-description">{item.text[locale]}</p><span className="career-signal"><i aria-hidden="true" />{signals[locale][index] || (spanish ? 'EXPERIENCIA' : 'EXPERIENCE')}</span><ul className="career-highlights" aria-label={spanish ? 'Áreas y contribuciones' : 'Focus and contributions'}>{item.highlights.map((highlight, highlightIndex) => <li key={`${item.key}-${highlightIndex}`}><span aria-hidden="true">✳</span>{highlight[locale]}</li>)}</ul></article></Reveal></li>)}</ol></main>
}
