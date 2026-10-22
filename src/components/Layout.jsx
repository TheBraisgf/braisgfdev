import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityMenu } from './AccessibilityMenu.jsx'
import { VisitorCounter } from './VisitorCounter.jsx'

const SITE = 'https://braisgf.dev'

export function Layout({ children }) {
  const { t } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const spanish = location.pathname === '/es' || location.pathname.startsWith('/es/')
  const prefix = spanish ? '/es' : ''
  const currentPath = spanish ? (location.pathname.slice(3) || '/') : location.pathname
  const alternate = spanish ? currentPath : `/es${currentPath === '/' ? '' : currentPath}`

  useEffect(() => { setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    const path = location.pathname || '/'; const cleanPath = path.replace(/\/$/, '') || '/'; const isHome = cleanPath === '/' || cleanPath === '/es'; const isAbout = cleanPath.endsWith('/about'); const isCareer = cleanPath.endsWith('/career'); const isArchive = cleanPath.endsWith('/experiments'); const idMatch = cleanPath.match(/\/experiments\/(\d+)$/)
    const title = isHome ? (spanish ? 'Braisgf.dev — Laboratorio personal' : 'Braisgf.dev — Personal Lab') : isAbout ? (spanish ? 'Sobre mí — Braisgf.dev' : 'About Brais — Braisgf.dev') : isCareer ? (spanish ? 'Trayectoria profesional — Braisgf.dev' : 'Professional path — Braisgf.dev') : isArchive ? (spanish ? 'Experimentos — Braisgf.dev' : 'Experiments — Braisgf.dev') : idMatch ? `${spanish ? 'Experimento' : 'Experiment'} #${idMatch[1]} — Braisgf.dev` : 'Braisgf.dev'
    const description = isHome ? (spanish ? 'Laboratorio personal de Brais: experimentos, proyectos, desarrollo, maker, IA, aprendizaje y cosas que merece la pena construir.' : 'Brais\' personal lab: experiments, software, maker projects, AI, learning and things worth building.') : 'Braisgf.dev — personal lab, experiments, projects and professional work.'
    document.title = title; document.documentElement.lang = spanish ? 'es' : 'en'
    const setMeta = (name, content) => { let node = document.head.querySelector(`meta[name="${name}"]`); if (!node) { node = document.createElement('meta'); node.name = name; document.head.appendChild(node) } node.content = content }
    const setProperty = (property, content) => { let node = document.head.querySelector(`meta[property="${property}"]`); if (!node) { node = document.createElement('meta'); node.setAttribute('property', property); document.head.appendChild(node) } node.content = content }
    setMeta('description', description); setMeta('author', 'Brais'); setProperty('og:title', title); setProperty('og:description', description); setProperty('og:type', isHome ? 'website' : 'article'); setProperty('og:url', `${SITE}${cleanPath}`)
    let canonical = document.head.querySelector('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) } canonical.href = `${SITE}${cleanPath === '/' ? '' : cleanPath}`
    document.head.querySelectorAll('link[data-hreflang]').forEach((node) => node.remove()); const addAlt = (lang, href) => { const node = document.createElement('link'); node.rel = 'alternate'; node.hreflang = lang; node.href = href; node.dataset.hreflang = lang; document.head.appendChild(node) }
    addAlt('en', `${SITE}${spanish ? currentPath : cleanPath === '/' ? '' : cleanPath}`); addAlt('es', `${SITE}${spanish ? cleanPath : `/es${cleanPath === '/' ? '' : cleanPath}`}`); addAlt('x-default', `${SITE}${cleanPath === '/es' ? '' : cleanPath}`)
    const schema = { '@context': 'https://schema.org', '@graph': [{ '@type': 'Person', '@id': `${SITE}/#brais`, name: 'Brais', alternateName: 'Braisgf', url: SITE, jobTitle: 'Developer and maker', sameAs: ['https://github.com/TheBraisgf','https://www.linkedin.com/in/braisgf','https://www.youtube.com/@braisgfroom','https://www.tiktok.com/@braisgfroom','https://www.instagram.com/braisgfroom','https://www.twitch.tv/braisgfroom'] }, { '@type': isHome ? 'WebSite' : 'WebPage', '@id': `${SITE}${cleanPath}#page`, url: `${SITE}${cleanPath === '/' ? '' : cleanPath}`, name: title, description, isPartOf: { '@id': `${SITE}/#site` }, about: { '@id': `${SITE}/#brais` } }, { '@type': 'WebSite', '@id': `${SITE}/#site`, url: SITE, name: 'Braisgf.dev', publisher: { '@id': `${SITE}/#brais` }, inLanguage: ['en','es'] }] }
    let script = document.getElementById('site-schema'); if (!script) { script = document.createElement('script'); script.id = 'site-schema'; script.type = 'application/ld+json'; document.head.appendChild(script) } script.textContent = JSON.stringify(schema)
  }, [location.pathname, spanish, currentPath])

  const closeMenu = () => setMenuOpen(false)
  return <div className="site">
    <a className="skip-link" href="#main-content">{t('accessibility.skip')}</a>
    <header className="nav-shell"><div className="nav"><Link className="wordmark" to={prefix || '/'} aria-label="braisgf.dev">braisgf<span>.dev</span></Link><nav className="nav-links" aria-label={t('nav.main')}><Link to={`${prefix}/experiments`}>{t('nav.experiments')}</Link><Link to={`${prefix}/about`}>{t('nav.about')}</Link><a href={`${prefix || ''}/#community`}>{t('nav.community')}</a><Link to={`${prefix}/career`}>{t('nav.career')}</Link></nav><button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-nav">{menuOpen ? '×' : 'MENU'}</button><Link className="language" to={alternate}>{t('nav.language')}</Link></div>{menuOpen && <nav className="mobile-nav" id="mobile-nav" aria-label={t('nav.main')}><Link onClick={closeMenu} to={`${prefix}/experiments`}>{t('nav.experiments')}</Link><Link onClick={closeMenu} to={`${prefix}/about`}>{t('nav.about')}</Link><a onClick={closeMenu} href={`${prefix || ''}/#community`}>{t('nav.community')}</a><Link onClick={closeMenu} to={`${prefix}/career`}>{t('nav.career')}</Link></nav>}</header>
    <div id="main-content">{children}</div>
    <footer className="footer-shell"><div className="footer-counter section-pad"><VisitorCounter /></div><div className="footer-top section-pad"><span>{t('home.footer')}</span><Link className="footer-career" to={`${prefix}/career`}>{t('nav.career')} ↗</Link></div><div className="footer section-pad"><span>© 2026 Braisgf</span><span>{t('home.footer')}</span><div className="footer-links"><a href="https://www.youtube.com/@braisgfroom" target="_blank" rel="noreferrer">YouTube</a><span>·</span><a href="https://www.tiktok.com/@braisgfroom" target="_blank" rel="noreferrer">TikTok</a><span>·</span><a href="https://www.instagram.com/braisgfroom" target="_blank" rel="noreferrer">Instagram</a><span>·</span><a href="https://www.twitch.tv/braisgfroom" target="_blank" rel="noreferrer">Twitch</a><span>·</span><a href="https://github.com/TheBraisgf" target="_blank" rel="noreferrer">GitHub</a><span>·</span><a href="https://linkedin.com/in/braisgf" target="_blank" rel="noreferrer">LinkedIn</a></div></div></footer><AccessibilityMenu />
  </div>
}
