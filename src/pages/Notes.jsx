import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const notes = ['1', '2', '3']

export function Notes() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return (
    <main className="notes-page section-pad">
      <Link className="back-link" to={prefix || '/'}>← {t('notes.back')}</Link>
      <header className="archive-hero">
        <p className="eyebrow">{t('notes.eyebrow')}</p>
        <h1>{t('notes.title')}</h1>
        <p>{t('notes.intro')}</p>
      </header>
      <div className="notes-list">
        {notes.map((id) => (
          <article className="note-row" key={id}>
            <span className="archive-number">{t(`notes.items.${id}.date`)}</span>
            <div><h2>{t(`notes.items.${id}.title`)}</h2><p>{t(`notes.items.${id}.summary`)}</p></div>
            <span className="note-arrow">↗</span>
          </article>
        ))}
      </div>
    </main>
  )
}
