import { useTranslation } from 'react-i18next'
import { TikTokCarousel } from './TikTokCarousel.jsx'
import { Reveal } from './Reveal.jsx'

export function VideoGallery() {
  const { t } = useTranslation()
  return <section className="video-section section-pad" aria-labelledby="video-title"><Reveal><div className="section-intro"><div><p className="eyebrow">{t('home.videoEyebrow')}</p><h2 id="video-title">{t('home.videoTitle')}</h2></div><p>{t('home.videoIntro')}</p></div></Reveal><Reveal delay={90}><TikTokCarousel /></Reveal><div className="social-proof"><span>{t('home.socialProof')}</span><a href="https://www.tiktok.com/@braisgfroom" target="_blank" rel="noreferrer">TikTok</a><a href="https://www.youtube.com/@braisgfroom" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.instagram.com/braisgfroom" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.twitch.tv/braisgfroom" target="_blank" rel="noreferrer">Twitch</a></div></section>
}
