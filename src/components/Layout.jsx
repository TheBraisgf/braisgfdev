import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Layout({ children }) {
  const { t } = useTranslation()
  const location = useLocation()
  const spanish = location.pathname === '/es' || location.pathname.startsWith('/es/')
  const prefix = spanish ? '/es' : ''
  const currentPath = spanish ? (location.pathname.slice(3) || '/') : location.pathname
  const alternate = spanish ? currentPath : `/es${currentPath === '/' ? '' : currentPath}`

  return (
    <div className="site">
      <header className="nav-shell">
        <div className="nav">
          <Link className="wordmark" to={prefix || '/'} aria-label="braisgf.dev">braisgf<span>.dev</span></Link>
          <nav className="nav-links" aria-label="Main navigation">
            <Link to={`${prefix}/experiments`}>{t('nav.experiments')}</Link>
            <a href={`${prefix || ''}/#about`}>{t('nav.about')}</a>
            <Link to={`${prefix}/experiments`}>{t('nav.archive')}</Link>
          </nav>
          <Link className="language" to={alternate}>{t('nav.language')}</Link>
        </div>
      </header>

      {children}

      <footer className="footer-shell">
        <div className="footer">
          <span>© 2026 Braisgf</span>
          <span>{t('home.footer')}</span>
          <div className="footer-links">
            <a href="https://www.youtube.com/@braisgfroom" target="_blank" rel="noreferrer">YouTube</a><span>·</span>
            <a href="https://www.tiktok.com/@braisgfroom" target="_blank" rel="noreferrer">TikTok</a><span>·</span>
            <a href="https://www.instagram.com/braisgfroom" target="_blank" rel="noreferrer">Instagram</a><span>·</span>
            <a href="https://www.twitch.tv/braisgfroom" target="_blank" rel="noreferrer">Twitch</a><span>·</span>
            <a href="https://github.com/TheBraisgf" target="_blank" rel="noreferrer">GitHub</a><span>·</span>
            <a href="https://linkedin.com/in/braisgf" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
