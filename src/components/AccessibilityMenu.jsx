import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const initial = { large: false, contrast: false, links: false, motion: false }

export function AccessibilityMenu() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(initial)
  const [storageReady, setStorageReady] = useState(false)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('braisgf-a11y'))
      if (saved && typeof saved === 'object') {
        setSettings(Object.fromEntries(Object.keys(initial).map((key) => [key, saved[key] === true])))
      }
    } catch { /* Storage may be disabled or contain invalid data. */ }
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!storageReady) return
    const root = document.documentElement
    root.classList.toggle('a11y-large', settings.large)
    root.classList.toggle('a11y-contrast', settings.contrast)
    root.classList.toggle('a11y-links', settings.links)
    root.classList.toggle('a11y-motion', settings.motion)
    try { localStorage.setItem('braisgf-a11y', JSON.stringify(settings)) } catch { /* Storage may be disabled. */ }
  }, [settings, storageReady])

  useEffect(() => {
    const onKey = (event) => {
      if (event.altKey && event.key.toLowerCase() === 'a') { event.preventDefault(); setOpen((value) => !value) }
      if (event.key === 'Escape' && open) {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))

  const closePanel = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return <div className="a11y-wrap">
    <button ref={triggerRef} className="a11y-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="dialog" aria-controls="a11y-panel" title={t('accessibility.open')}>
      <span aria-hidden="true">A</span><span className="sr-only">{t('accessibility.open')}</span>
    </button>
    <section className="a11y-panel" id="a11y-panel" role="dialog" aria-label={t('accessibility.title')} hidden={!open}>
      <div className="a11y-head"><strong>{t('accessibility.title')}</strong><button ref={closeRef} onClick={closePanel} aria-label={t('accessibility.close')}>×</button></div>
      <p>{t('accessibility.hint')}</p>
      {['large', 'contrast', 'links', 'motion'].map((key) => <label key={key}><input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />{t(`accessibility.${key}`)}</label>)}
      <button className="a11y-reset" onClick={() => setSettings({ ...initial })}>{t('accessibility.reset')}</button>
    </section>
  </div>
}
