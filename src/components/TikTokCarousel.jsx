import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { videoBlaze, videoRoc, videoDice } from '../data/assets.js'

const PROFILE_URL = 'https://www.tiktok.com/@braisgfroom'
const fallback = [
  { id: '02', image: videoBlaze, url: PROFILE_URL, platform: 'TikTok' },
  { id: '01', image: videoRoc, url: PROFILE_URL, platform: 'TikTok' },
  { id: '04', image: videoDice, url: PROFILE_URL, platform: 'TikTok' },
]

const mapVideo = (video, index) => {
  const id = video.id || video.video_id || String(index + 1)
  return {
    id,
    title: video.title || video.video_description || '',
    image: video.image || video.cover_image_url || video.cover || video.origin_cover,
    url: video.url || video.share_url || `https://www.tiktok.com/@braisgfroom/video/${id}`,
    embedLink: video.embedLink || video.embed_link || (id !== String(index + 1) ? `https://www.tiktok.com/player/v1/${id}?controls=1&description=1&music_info=1` : ''),
    platform: 'TikTok',
  }
}

export function TikTokCarousel() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const [active, setActive] = useState(0)
  const [remote, setRemote] = useState([])
  const items = useMemo(() => remote.length ? remote : fallback, [remote])
  const copy = spanish
    ? { latest: 'ÚLTIMOS VÍDEOS', open: 'Ver vídeo', previous: 'Vídeo anterior', next: 'Siguiente vídeo', loading: 'Cargando vídeos recientes…' }
    : { latest: 'LATEST VIDEOS', open: 'Watch video', previous: 'Previous video', next: 'Next video', loading: 'Loading recent videos…' }

  useEffect(() => {
    const endpoint = import.meta.env.VITE_TIKTOK_FEED_ENDPOINT || 'https://www.tikwm.com/api/user/posts?unique_id=braisgfroom&count=6'
    fetch(endpoint)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : payload?.videos || payload?.data?.videos || []
        const mapped = list.slice(0, 6).map(mapVideo).filter((video) => video.id)
        if (mapped.length) setRemote(mapped)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setActive(0)
  }, [items.length])

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 5000)
    return () => window.clearInterval(timer)
  }, [items.length])

  const go = (direction) => setActive((current) => (current + direction + items.length) % items.length)
  const current = items[active]

  return (
    <div className="tiktok-carousel" aria-label={t('home.videoTitle')}>
      <div className="tiktok-carousel-stage">
        {items.map((item, index) => {
          const distance = (index - active + items.length) % items.length
          const visible = distance === 0 || distance === 1 || distance === items.length - 1
          const player = item.embedLink
          return (
            <div key={`${item.id}-${index}`} className={`tiktok-slide ${distance === 0 ? 'is-active' : ''} ${visible ? '' : 'is-hidden'}`} aria-hidden={distance !== 0}>
              {player ? (
                <iframe
                  src={player}
                  title={item.title || `TikTok video ${index + 1}`}
                  allow="fullscreen; autoplay"
                  loading={distance === 0 ? 'eager' : 'lazy'}
                />
              ) : (
                <a href={item.url || PROFILE_URL} target="_blank" rel="noreferrer">
                  <img src={item.image} alt="" loading={distance === 0 ? 'eager' : 'lazy'} />
                </a>
              )}
              {!player && <span className="tiktok-slide-shade" />}
              <span className="tiktok-slide-meta"><b>{item.platform || 'TikTok'}</b><small>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</small></span>
              {!player && <span className="tiktok-slide-play">▶</span>}
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
          <h3>{current.title || t(`videos.${current.id}.title`, { defaultValue: t('home.videoTitle') })}</h3>
        </div>
        <a href={current.url || PROFILE_URL} target="_blank" rel="noreferrer">{copy.open} ↗</a>
      </div>
      <div className="tiktok-dots" aria-hidden="true">
        {items.map((item, index) => <span key={`${item.id}-${index}`} className={index === active ? 'is-active' : ''} />)}
      </div>
      <p className="sr-only" aria-live="polite">{remote.length ? '' : copy.loading}</p>
    </div>
  )
}
