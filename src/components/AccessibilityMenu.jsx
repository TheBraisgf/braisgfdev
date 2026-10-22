import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const initial = { large: false, contrast: false, links: false, motion: false }

export function AccessibilityMenu() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('braisgf-a11y')) || initial } catch { return initial }
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-large', settings.large)
    root.classList.toggle('a11y-contrast', settings.contrast)
    root.classList.toggle('a11y-links', settings.links)
    root.classList.toggle('a11y-motion', settings.motion)
    localStorage.setItem('braisgf-a11y', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const onKey = (event) => {
      if (event.altKey && event.key.toLowerCase() === 'a') { event.preventDefault(); setOpen((value) => !value) }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))

  return <div className="a11y-wrap">
    <button className="a11y-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="a11y-panel" title={t('accessibility.open')}>
      <span aria-hidden="true">A</span><span className="sr-only">{t('accessibility.open')}</span>
    </button>
    {open && <section className="a11y-panel" id="a11y-panel" aria-label={t('accessibility.title')}>
      <div className="a11y-head"><strong>{t('accessibility.title')}</strong><button onClick={() => setOpen(false)} aria-label={t('accessibility.close')}>×</button></div>
      <p>{t('accessibility.hint')}</p>
      {['large', 'contrast', 'links', 'motion'].map((key) => <label key={key}><input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />{t(`accessibility.${key}`)}</label>)}
      <button className="a11y-reset" onClick={() => setSettings(initial)}>{t('accessibility.reset')}</button>
    </section>}
  </div>
}
