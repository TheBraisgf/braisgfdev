import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PROFILE_URL = 'https://www.tiktok.com/@braisgfroom'

export function TikTokCarousel() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const [active, setActive] = useState(0)
  const [remote, setRemote] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const items = useMemo(() => remote, [remote])
  const copy = spanish
    ? { latest: 'ÚLTIMOS VÍDEOS', open: 'Ver vídeo', previous: 'Vídeo anterior', next: 'Siguiente vídeo', loading: 'Cargando vídeos recientes…', error: 'No se han podido cargar los vídeos ahora mismo.' }
    : { latest: 'LATEST VIDEOS', open: 'Watch video', previous: 'Previous video', next: 'Next video', loading: 'Loading recent videos…', error: 'The videos could not be loaded right now.' }

  useEffect(() => {
    fetch('/api/tiktok')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('TikTok feed failed')))
      .then((videos) => {
        setRemote(Array.isArray(videos) ? videos : [])
        setFailed(false)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setActive(0)
  }, [items.length])

  useEffect(() => {
    if (!items.length) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 5000)
    return () => window.clearInterval(timer)
  }, [items.length])

  const go = (direction) => setActive((current) => (current + direction + items.length) % items.length)
  const current = items[active]

  if (loading) {
    return <div className="tiktok-carousel tiktok-feed-state" aria-live="polite"><span className="live-pulse-dot" /><span>{copy.loading}</span></div>
  }

  if (failed || !items.length) {
    return <div className="tiktok-carousel tiktok-feed-state" aria-live="polite"><span>{copy.error}</span><a href={PROFILE_URL} target="_blank" rel="noreferrer">TikTok ↗</a></div>
  }

  return (
    <div className="tiktok-carousel" aria-label={t('home.videoTitle')}>
      <div className="tiktok-carousel-stage">
        {items.map((item, index) => {
          const distance = (index - active + items.length) % items.length
          const visible = distance === 0 || distance === 1 || distance === items.length - 1
          return (
            <div key={`${item.id}-${index}`} className={`tiktok-slide ${distance === 0 ? 'is-active' : ''} ${visible ? '' : 'is-hidden'}`} aria-hidden={distance !== 0}>
              <iframe
                src={item.embedLink}
                title={item.title || `TikTok video ${index + 1}`}
                allow="fullscreen; autoplay"
                loading={distance === 0 ? 'eager' : 'lazy'}
              />
              <span className="tiktok-slide-meta"><b>TikTok</b><small>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</small></span>
            </div>
          )
        })}
        <div className="tiktok-carousel-controls">
          <button type="button" onClick={() => go(-1)} aria-label={copy.previous}>←</button>
          <button type="button" onClick={() => go(1)} aria-label={copy.next}>→</button>
        </div>
      </div>
      <div className="tiktok-carousel-caption">
        <div>
          <p className="eyebrow">TIKTOK / {copy.latest}</p>
          <h3>{current.title || t('home.videoTitle')}</h3>
        </div>
        <a href={current.url || PROFILE_URL} target="_blank" rel="noreferrer">{copy.open} ↗</a>
      </div>
      <div className="tiktok-dots" aria-hidden="true">
        {items.map((item, index) => <span key={`${item.id}-${index}`} className={index === active ? 'is-active' : ''} />)}
      </div>
    </div>
  )
}
