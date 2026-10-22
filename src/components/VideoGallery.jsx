import { useTranslation } from 'react-i18next'
import { videos } from '../data/site.js'

export function VideoGallery() {
  const { t } = useTranslation()
  return (
    <section className="video-section section-pad" aria-labelledby="video-title">
      <div className="section-intro"><div><p className="eyebrow">{t('home.videoEyebrow')}</p><h2 id="video-title">{t('home.videoTitle')}</h2></div><p>{t('home.videoIntro')}</p></div>
      <div className="video-grid">
        {videos.map((video) => <a className="video-card" href={video.url} target="_blank" rel="noreferrer" key={video.id}>
          <div className="video-image"><img src={video.image} alt="" loading="lazy" /><span className="play">▶</span><span className="video-platform">{video.platform}</span></div>
          <div className="video-copy"><span>0{video.id}</span><h3>{t(`videos.${video.id}.title`)}</h3><b>↗</b></div>
        </a>)}
      </div>
      <div className="social-proof"><span>{t('home.socialProof')}</span><a href="https://www.tiktok.com/@braisgfroom" target="_blank" rel="noreferrer">TikTok</a><a href="https://www.youtube.com/@braisgfroom" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.instagram.com/braisgfroom" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.twitch.tv/braisgfroom" target="_blank" rel="noreferrer">Twitch</a></div>
    </section>
  )
}
