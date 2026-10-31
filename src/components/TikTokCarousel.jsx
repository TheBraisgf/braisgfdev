import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import media from '../data/videos.json'

const validItems = (media.videos || []).filter((item) => item?.url && !item.url.includes('REPLACE_WITH_VIDEO_ID'))
const getTikTokId = (url) => url.match(/\/video\/(\d+)/)?.[1] || ''
const getYouTubeId = (url) => url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/)?.[1] || ''
const getTwitchVideoId = (url) => url.match(/twitch\.tv\/videos\/(\d+)/)?.[1] || ''
const getTwitchClipId = (url) => url.match(/twitch\.tv\/(?:[^/]+\/clip|clip)\/([^/?#]+)/)?.[1] || ''

export function embedFor(item, { autoplayMuted = false } = {}) {
  const url = item.url.trim()
  const social = item.social.toLowerCase()
  if (social === 'tiktok') {
    const id = getTikTokId(url)
    const params = new URLSearchParams({ controls: '1', description: '1', music_info: '1' })
    if (autoplayMuted) {
      params.set('autoplay', '1')
      params.set('muted', '1')
    }
    return id ? `https://www.tiktok.com/player/v1/${id}?${params}` : ''
  }
  if (social === 'youtube') {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?rel=0${autoplayMuted ? '&autoplay=1&mute=1' : ''}` : ''
  }
  if (social === 'instagram') {
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/)
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : ''
  }
  if (social === 'twitch') {
    const parent = typeof window === 'undefined' ? 'braisgf.dev' : window.location.hostname
    const video = getTwitchVideoId(url)
    if (video) return `https://player.twitch.tv/?video=${video}&parent=${parent}${autoplayMuted ? '&autoplay=true&muted=true' : ''}`
    const clip = getTwitchClipId(url)
    if (clip) return `https://clips.twitch.tv/embed?clip=${clip}&parent=${parent}`
  }
  return url.includes('/embed') ? url : ''
}

function offsetFor(index, active, total) {
  let offset = index - active
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total
  return offset
}

export function TikTokCarousel() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const [active, setActive] = useState(0)
  const [firstAutoplayPending, setFirstAutoplayPending] = useState(true)
  const items = useMemo(() => validItems, [])
  const copy = spanish
    ? { eyebrow: 'GALERÍA / VÍDEO', empty: 'Añade tus seis vídeos en src/data/videos.json.', open: 'Abrir en la red social', previous: 'Vídeo anterior', next: 'Siguiente vídeo', unsupported: 'Este formato se abre en la red social.', waiting: 'Selecciona este vídeo para cargarlo.' }
    : { eyebrow: 'VIDEO / GALLERY', empty: 'Add your six videos in src/data/videos.json.', open: 'Open on social network', previous: 'Previous video', next: 'Next video', unsupported: 'This format opens on the social network.', waiting: 'Select this video to load it.' }

  if (!items.length) return <div className="media-gallery media-gallery-empty"><span className="eyebrow">{copy.eyebrow}</span><strong>{copy.empty}</strong></div>

  const current = items[active % items.length]
  const go = (direction) => { setFirstAutoplayPending(false); setActive((value) => (value + direction + items.length) % items.length) }

  return <div className="media-gallery" aria-label={t('home.videoTitle')}>
    <div className="media-stage"><div className="media-track">
      {items.map((item, index) => {
        const offset = offsetFor(index, active, items.length)
        const distance = Math.abs(offset)
        const isActive = offset === 0
        const embed = embedFor(item, { autoplayMuted: index === 0 && firstAutoplayPending })
        const title = spanish ? `Vídeo de ${item.social}, ${index + 1} de ${items.length}` : `${item.social} video, ${index + 1} of ${items.length}`
        return <div key={`${item.url}-${index}`} className={`media-frame media-card ${isActive ? 'is-active' : ''} ${distance > 1 ? 'is-far' : ''} is-${item.orientation === 'horizontal' ? 'horizontal' : 'vertical'}`} style={{ '--media-offset': offset, '--media-distance': distance }} aria-hidden={!isActive}>
          {embed && isActive
            ? <iframe src={embed} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="eager" tabIndex={0} />
            : <div className="media-fallback"><span>{embed ? copy.waiting : copy.unsupported}</span><a href={item.url} target="_blank" rel="noreferrer" tabIndex={isActive ? 0 : -1}>{copy.open} &#8599;</a></div>}
          <span className="media-badge">{item.social}</span><span className="media-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
      })}
    </div><div className="media-controls"><button type="button" onClick={() => go(-1)} aria-label={copy.previous}>&lt;</button><div className="media-dots" role="group" aria-label={`${active + 1} / ${items.length}`}>{items.map((item, index) => <button key={`${item.url}-${index}`} type="button" className={index === active ? 'is-active' : ''} onClick={() => { setFirstAutoplayPending(false); setActive(index) }} aria-label={`${item.social} ${index + 1}`} aria-pressed={index === active} />)}</div><button type="button" onClick={() => go(1)} aria-label={copy.next}>&gt;</button></div><p className="sr-only" aria-live="polite" aria-atomic="true">{spanish ? `Vídeo ${active + 1} de ${items.length}: ${current.social}` : `Video ${active + 1} of ${items.length}: ${current.social}`}</p></div>
    <div className="media-info"><div><p className="eyebrow">{copy.eyebrow}</p><strong>{current.social} · {current.orientation === 'horizontal' ? '16:9' : '9:16'}</strong></div><a href={current.url} target="_blank" rel="noreferrer">{copy.open} ↗</a></div>
  </div>
}
