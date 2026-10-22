import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { experiments } from '../data/experiments.js'
import { portrait } from '../data/assets.js'
import { ValuesLoop } from '../components/ValuesLoop.jsx'
import { VideoGallery } from '../components/VideoGallery.jsx'
import { CommunityLab } from '../components/CommunityLab.jsx'
import { LabTest } from '../components/LabTest.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { LivePulse } from '../components/LivePulse.jsx'

function Arrow() { return <span aria-hidden="true">↗</span> }

export function Home() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const prefix = pathname.startsWith('/es') ? '/es' : ''

  return <main>
    <section className="hero section-pad">
      <div className="hero-grid">
        <Reveal><div className="hero-copy">
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h1>{t('home.heroTitleA')}<br /><em>{t('home.heroTitleB')}</em></h1>
          <p className="hero-lede">{t('home.heroText')}</p>
          <div className="hero-actions"><Link className="button button-dark" to={`${prefix}/experiments`}>{t('home.explore')} <span>↓</span></Link><Link className="button button-light" to={`${prefix}/about`}>{t('home.me')} <Arrow /></Link></div>
          <LivePulse />
          <div className="hero-status"><span><i /> {t('home.status')}: <strong>{t('home.online')}</strong></span><span>{t('home.updated')}: <strong>OCT 2026</strong></span></div>
        </div></Reveal>
        <Reveal delay={120}><div className="terminal-card" aria-label={t('home.terminalTitle')}>
          <div className="terminal-top"><span className="terminal-lights"><i /><i /><i /></span><span>{t('home.terminalTitle')}</span><small>{t('home.terminalLive')}</small></div>
          <div className="terminal-content"><p className="mono-muted">brais@lab:~$ {t('home.current')}</p><p className="terminal-title">{t('home.currentTitle')}</p><div className="terminal-line" /><dl><div><dt>status</dt><dd>{t('home.running')}</dd></div><div><dt>mode</dt><dd>{t('home.public')}</dd></div><div><dt>skills</dt><dd>code / maker / storytelling</dd></div><div><dt>success</dt><dd>{t('home.success')}</dd></div></dl><p className="terminal-next">{t('home.next')} <span className="blink">█</span></p></div>
        </div></Reveal>
      </div>
      <div className="hero-marquee" aria-hidden="true"><span>CURIOUS BY DEFAULT</span><b>·</b><span>BUILT IN PUBLIC</span><b>·</b><span>NO FEED REQUIRED</span><b>·</b><span>CURIOUS BY DEFAULT</span></div>
    </section>

    <section className="section-pad experiments-section" id="experiments">
      <Reveal><div className="section-intro"><div><p className="eyebrow">{t('home.event')}</p><h2>{t('home.experiments')}</h2></div><p>{t('home.experimentIntro')}<br /><strong>{t('home.experimentIntroStrong')}</strong></p></div></Reveal>
      <Reveal delay={80}><article className="featured-card"><div className="featured-visual"><img src={experiments[0].image} alt="Braisgf.dev personal lab" loading="eager" /><span>{t('home.featuredLabel')}</span></div><div className="featured-body"><p className="card-kicker">{t('home.featuredTag')}</p><h3>{t('home.featuredTitle')}</h3><p>{t('home.featuredText')}</p><div className="hypothesis"><span>{t('home.hypothesis')}</span><p>{t('home.hypothesisText')}</p></div><Link className="arrow-link" to={`${prefix}/experiments/001`}>{t('home.openExperiment')} <Arrow /></Link></div></article></Reveal>
      <div className="card-grid"><Reveal delay={120}><Link className="experiment-card" to={`${prefix}/experiments/002`}><div className="card-meta"><span>#002</span><b>IDEA</b></div><h3>{t('home.reader')}</h3><p>{t('home.readerText')}</p><span className="card-link">{t('home.readHypothesis')} →</span></Link></Reveal><Reveal delay={180}><Link className="experiment-card" to={`${prefix}/experiments/003`}><div className="card-meta"><span>#003</span><b>PLANNED</b></div><h3>{t('home.learn')}</h3><p>{t('home.learnText')}</p><span className="card-link">{t('home.readHypothesis')} →</span></Link></Reveal><Reveal delay={240}><div className="experiment-card card-open"><div className="card-meta"><span>#004</span><b>{t('home.open')}</b></div><h3>{t('home.unknown')}</h3><p>{t('home.unknownText')}</p><Link className="card-link" to={`${prefix}/experiments`}>{t('home.archive')} →</Link></div></Reveal></div>
      <Reveal><Link className="archive-cta" to={`${prefix}/experiments`}>{t('home.archive')} <Arrow /></Link></Reveal>
    </section>

    <section className="manifesto" id="about"><div className="manifesto-inner section-pad"><Reveal><p className="eyebrow">{t('home.why')}</p><h2>{t('home.manifestoTitleA')}<br /><em>{t('home.manifestoTitleB')}</em></h2><p className="manifesto-copy">{t('home.manifesto')}</p></Reveal><ValuesLoop /></div></section>

    <Reveal><section className="about-teaser section-pad"><div className="about-teaser-image"><img src={portrait} alt={t('about.photoAlt')} loading="lazy" /></div><div><p className="eyebrow">{t('home.aboutEyebrow')}</p><h2>{t('home.aboutTitle')}</h2><p>{t('home.aboutText')}</p><div className="teaser-links"><Link className="arrow-link" to={`${prefix}/about`}>{t('home.aboutButton')} <Arrow /></Link><Link className="text-link" to={`${prefix}/career`}>{t('home.careerButton')} ↗</Link></div></div></section></Reveal>

    <VideoGallery />
    <CommunityLab />
    <Reveal><LabTest /></Reveal>

    <Reveal><section className="section-pad follow-section"><div className="follow-copy"><p className="eyebrow">{t('home.follow')}</p><h2>{t('home.followTitle')}</h2><p>{t('home.followText')}</p></div><div className="follow-links"><Link to={`${prefix}/experiments`}><span>01</span>{t('nav.archive')}<b>↗</b></Link><Link to={`${prefix}/notes`}><span>02</span>{t('home.oldNotes')}<b>↗</b></Link><a href="https://github.com/TheBraisgf" target="_blank" rel="noreferrer"><span>03</span>{t('home.openSource')}<b>↗</b></a></div></section></Reveal>
  </main>
}
