import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import media from '../data/videos.json'

const validItems = (media.videos || []).filter((item) => item?.url && !item.url.includes('REPLACE_WITH_VIDEO_ID'))

const getTikTokId = (url) => url.match(/\/video\/(\d+)/)?.[1] || ''
const getYouTubeId = (url) => url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&/]+)/)?.[1] || ''
const getInstagramPath = (url) => url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/)?.[1] || ''
const getTwitchVideoId = (url) => url.match(/twitch\.tv\/videos\/(\d+)/)?.[1] || ''
const getTwitchClipId = (url) => url.match(/twitch\.tv\/(?:[^/]+\/clip|clip)\/([^/?#]+)/)?.[1] || ''

function embedFor(item) {
  const url = item.url.trim()
  const social = item.social.toLowerCase()
  if (social === 'tiktok') {
    const id = getTikTokId(url)
    return id ? `https://www.tiktok.com/player/v1/${id}?controls=1&description=1&music_info=1` : ''
  }
  if (social === 'youtube') {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : ''
  }
  if (social === 'instagram') {
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/)
    return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : ''
  }
  if (social === 'twitch') {
    const video = getTwitchVideoId(url)
    if (video) return `https://player.twitch.tv/?video=${video}&parent=${window.location.hostname}`
    const clip = getTwitchClipId(url)
    if (clip) return `https://clips.twitch.tv/embed?clip=${clip}&parent=${window.location.hostname}`
  }
  return url.includes('/embed') ? url : ''
}

export function TikTokCarousel() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const [active, setActive] = useState(0)
  const items = useMemo(() => validItems, [])
  const copy = spanish
    ? { eyebrow: 'GALERÍA / VÍDEO', empty: 'Añade 6–10 URLs de vídeo en src/data/videos.json.', open: 'Abrir en la red social', previous: 'Vídeo anterior', next: 'Siguiente vídeo', unsupported: 'Este formato se abre en la red social.' }
    : { eyebrow: 'VIDEO / GALLERY', empty: 'Add 6–10 video URLs in src/data/videos.json.', open: 'Open on social network', previous: 'Previous video', next: 'Next video', unsupported: 'This format opens on the social network.' }

  if (!items.length) {
    return <div className="media-gallery media-gallery-empty" aria-live="polite"><span className="eyebrow">{copy.eyebrow}</span><strong>{copy.empty}</strong></div>
  }

  const current = items[active % items.length]
  const embed = embedFor(current)
  const go = (direction) => setActive((value) => (value + direction + items.length) % items.length)

  return (
    <div className="media-gallery" aria-label={t('home.videoTitle')}>
      <div className="media-stage">
        <div className={`media-frame is-${current.orientation === 'horizontal' ? 'horizontal' : 'vertical'}`}>
          {embed ? <iframe src={embed} title={`${current.social} video ${active + 1}`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="eager" /> : <div className="media-fallback"><span>{copy.unsupported}</span><a href={current.url} target="_blank" rel="noreferrer">{copy.open} ↗</a></div>}
          <span className="media-badge">{current.social}</span>
          <span className="media-index">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        </div>
        <div className="media-controls">
          <button type="button" onClick={() => go(-1)} aria-label={copy.previous}>←</button>
          <div className="media-dots" aria-label={`${active + 1} / ${items.length}`}>{items.map((item, index) => <button key={`${item.url}-${index}`} type="button" className={index === active ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`${item.social} ${index + 1}`} />)}</div>
          <button type="button" onClick={() => go(1)} aria-label={copy.next}>→</button>
        </div>
      </div>
      <div className="media-info"><div><p className="eyebrow">{copy.eyebrow}</p><strong>{current.social} · {current.orientation === 'horizontal' ? '16:9' : '9:16'}</strong></div><a href={current.url} target="_blank" rel="noreferrer">{copy.open} ↗</a></div>
    </div>
  )
}
