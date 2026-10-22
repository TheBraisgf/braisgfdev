import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { videoBlaze, videoRoc, videoDice } from '../data/assets.js'

const fallback = [
  { id: '01', image: videoBlaze, url: 'https://www.tiktok.com/@braisgfroom', platform: 'TikTok' },
  { id: '02', image: videoRoc, url: 'https://www.tiktok.com/@braisgfroom', platform: 'TikTok' },
  { id: '03', image: videoDice, url: 'https://www.tiktok.com/@braisgfroom', platform: 'TikTok' }
]

export function TikTokCarousel() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const [remote, setRemote] = useState([])
  const items = useMemo(() => remote.length ? remote : fallback, [remote])

  useEffect(() => {
    const endpoint = import.meta.env.VITE_TIKTOK_FEED_ENDPOINT
    if (!endpoint) return
    fetch(endpoint).then((r) => r.ok ? r.json() : []).then((data) => Array.isArray(data) && setRemote(data.slice(0, 6))).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 5000)
    return () => window.clearInterval(timer)
  }, [items.length])

  const go = (direction) => setActive((current) => (current + direction + items.length) % items.length)
  const current = items[active]

  return <div className="tiktok-carousel" aria-label={t('home.videoTitle')}>
    <div className="tiktok-carousel-stage">
      {items.map((item, index) => {
        const distance = (index - active + items.length) % items.length
        const visible = distance === 0 || distance === 1 || distance === items.length - 1
        return <a key={`${item.id}-${index}`} className={`tiktok-slide ${distance === 0 ? 'is-active' : ''} ${visible ? '' : 'is-hidden'}`} href={item.url || 'https://www.tiktok.com/@braisgfroom'} target="_blank" rel="noreferrer" aria-hidden={distance !== 0}>
          <img src={item.image} alt="" loading={distance === 0 ? 'eager' : 'lazy'} />
          <span className="tiktok-slide-shade" />
          <span className="tiktok-slide-meta"><b>{item.platform || 'TikTok'}</b><small>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</small></span>
          <span className="tiktok-slide-play">▶</span>
        </a>
      })}
      <div className="tiktok-carousel-controls"><button type="button" onClick={() => go(-1)} aria-label="Previous video">←</button><button type="button" onClick={() => go(1)} aria-label="Next video">→</button></div>
    </div>
    <div className="tiktok-carousel-caption"><div><p className="eyebrow">TIKTOK / {t('home.videoLatest')}</p><h3>{t(`videos.${current.id}.title`, { defaultValue: t('home.videoTitle') })}</h3></div><a href={current.url || 'https://www.tiktok.com/@braisgfroom'} target="_blank" rel="noreferrer">{t('home.videoOpen')} ↗</a></div>
    <div className="tiktok-dots" aria-hidden="true">{items.map((item, index) => <span key={item.id} className={index === active ? 'is-active' : ''} />)}</div>
  </div>
}
