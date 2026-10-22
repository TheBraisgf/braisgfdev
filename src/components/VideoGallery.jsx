import { useTranslation } from 'react-i18next'
import { videos } from '../data/site.js'
import { TikTokFeed } from './TikTokFeed.jsx'
import { Reveal } from './Reveal.jsx'

export function VideoGallery() {
  const { t } = useTranslation()
  return (
    <section className="video-section section-pad" aria-labelledby="video-title">
      <Reveal><div className="section-intro"><div><p className="eyebrow">{t('home.videoEyebrow')}</p><h2 id="video-title">{t('home.videoTitle')}</h2></div><p>{t('home.videoIntro')}</p></div></Reveal>
      <Reveal delay={90}>
        <div className="video-live-grid">
          <TikTokFeed />
          <aside className="video-live-side">
            <div><span className="live-number">∞</span><p className="eyebrow">LIVE ARCHIVE</p><h3>New stuff should feel new.</h3><p>The TikTok profile below is live: TikTok supplies the creator profile and its latest uploads instead of a frozen screenshot pretending to be a feed.</p></div>
            <a className="arrow-link" href="https://www.tiktok.com/@braisgfroom" target="_blank" rel="noreferrer">Open TikTok <span>↗</span></a>
          </aside>
        </div>
      </Reveal>
      <div className="video-grid" style={{ marginTop: '12px' }}>
        {videos.slice(1).map((video, index) => <Reveal key={video.id} delay={120 + index * 60}><a className="video-card" href={video.url} target="_blank" rel="noreferrer">
          <div className="video-image"><img src={video.image} alt="" loading="lazy" /><span className="play">▶</span><span className="video-platform">{video.platform}</span></div>
          <div className="video-copy"><span>0{video.id}</span><h3>{t(`videos.${video.id}.title`)}</h3><b>↗</b></div>
        </a></Reveal>)}
      </div>
      <div className="social-proof"><span>{t('home.socialProof')}</span><a href="https://www.tiktok.com/@braisgfroom" target="_blank" rel="noreferrer">TikTok</a><a href="https://www.youtube.com/@braisgfroom" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.instagram.com/braisgfroom" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.twitch.tv/braisgfroom" target="_blank" rel="noreferrer">Twitch</a></div>
    </section>
  )
}
