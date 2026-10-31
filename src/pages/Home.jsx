import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { experiments } from '../data/experiments.js'
import { portrait, labHero } from '../data/assets.js'
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
  const spanish = pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  const lang = spanish ? 'es' : 'en'
  const [featured, ...otherProjects] = experiments
  const cards = otherProjects.slice(0, 3)

  const terminal = spanish
    ? { status: 'estado', mode: 'modo', skills: 'habilidades', success: 'éxito', skillsText: 'código / maker / narrativa', marquee: ['CURIOSIDAD POR DEFECTO', 'CONSTRUIDO EN PÚBLICO', 'SIN FEED INFINITO', 'HAZLO Y ENSÉÑALO', 'MÁS COSAS, MENOS FEED', 'APRENDE HACIENDO', 'UN PROYECTO A LA VEZ'] }
    : { status: 'status', mode: 'mode', skills: 'skills', success: 'success', skillsText: 'code / maker / storytelling', marquee: ['CURIOUS BY DEFAULT', 'BUILT IN PUBLIC', 'NO INFINITE FEED', 'MAKE IT AND SHOW IT', 'MORE THINGS, LESS FEED', 'LEARN BY MAKING', 'ONE PROJECT AT A TIME'] }

  const copy = spanish
    ? { section: 'Proyectos', intro: 'No son tutoriales. No es un portfolio.', introStrong: 'Son cosas que realmente estoy haciendo.', featuredLabel: (id) => `PROYECTO ${id} / EL LABORATORIO`, hypothesis: 'PUNTO DE PARTIDA', hypothesisText: 'Una web personal debería dar ganas de quedarse a mirar qué estoy haciendo.', open: 'Abrir proyecto', status: 'PROYECTO', idea: 'EN MARCHA', dossier: 'ABRIR PROYECTO', more: 'VER TODOS LOS PROYECTOS', explore: 'Explorar proyectos', about: 'No quiero elegir una sola cosa.', aboutCopy: 'Programo, hago vídeos, imprimo cosas, dibujo, monto servidores y me meto en hobbies que se me van de las manos. Esta web es el sitio donde todo eso puede convivir.' }
    : { section: 'Projects', intro: 'Not tutorials. Not a portfolio.', introStrong: 'Things I am actually making.', featuredLabel: (id) => `PROJECT ${id} / THE LAB`, hypothesis: 'STARTING POINT', hypothesisText: 'A personal website should make you want to stick around and see what I am making.', open: 'Open project', status: 'PROJECT', idea: 'IN PROGRESS', dossier: 'OPEN PROJECT', more: 'VIEW ALL PROJECTS', explore: 'Explore projects', about: 'I do not want to pick one thing.', aboutCopy: 'I code, make videos, print things, draw, run servers and fall into hobbies that get wildly out of hand. This site is where all of that gets to coexist.' }

  return <main>
    <section className="hero section-pad">
      <div className="hero-grid">
        <Reveal><div className="hero-copy">
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h1>{t('home.heroTitleA')}<br /><em>{t('home.heroTitleB')}</em></h1>
          <p className="hero-lede">{spanish ? 'Soy Brais. Programador, maker, geek y coleccionista profesional de cosas que probablemente no debería empezar. Me gusta aprender haciendo: una idea puede acabar siendo código, una pieza, un vídeo, un dibujo o cualquier otra cosa que me pique la curiosidad.' : 'I am Brais. Developer, maker, geek and professional collector of things I probably should not start. I like learning by making: an idea can become code, a physical object, a video, a drawing or whatever else catches my curiosity.'}</p>
          <div className="hero-actions"><Link className="button button-dark" to={`${prefix}/experiments`}>{copy.explore} <span aria-hidden="true">↓</span></Link><Link className="button button-light" to={`${prefix}/about`}>{t('home.me')} <Arrow /></Link></div>
          <LivePulse />
          <nav className="hero-shortcuts" aria-label={spanish ? 'Saltar a secciones' : 'Jump to sections'}><a href="#experiments">{copy.section}</a><a href="#videos">{t('home.videoTitle')}</a><a href="#community">{spanish ? 'Tu turno' : 'Your turn'}</a></nav>
          <div className="hero-status"><span><i /> {t('home.status')}: <strong>{t('home.online')}</strong></span></div>
        </div></Reveal>
        <Reveal delay={120}><div className="hero-side">
          <div className="hero-lab-image"><img src={labHero} alt={spanish ? 'Vista del laboratorio personal de Brais' : 'View of Brais personal lab'} loading="eager" /><span>PERSONAL LAB / 001</span></div>
          <div className="terminal-card"><div className="terminal-top"><span className="terminal-lights"><i /><i /><i /></span><span>{t('home.terminalTitle')}</span><small>{t('home.terminalLive')}</small></div>
            <div className="terminal-content"><p className="mono-muted">brais@lab:~$ {t('home.current')}</p><p className="terminal-title">#{featured?.id || '---'} — {featured?.title[lang].toUpperCase() || (spanish ? 'BUSCANDO IDEAS' : 'LOOKING FOR IDEAS')}</p><div className="terminal-line" />
              <dl><div><dt>{terminal.status}</dt><dd>{featured?.status || 'IDLE'}</dd></div><div><dt>{terminal.mode}</dt><dd>{featured ? t('home.public') : '—'}</dd></div><div><dt>{terminal.skills}</dt><dd>{terminal.skillsText}</dd></div><div><dt>{terminal.success}</dt><dd>{t('home.success')}</dd></div></dl><p className="terminal-next">{t('home.next')} <span className="blink">█</span></p>
            </div>
          </div>
        </div></Reveal>
      </div>
      <div className="hero-marquee" aria-hidden="true">{[...terminal.marquee, ...terminal.marquee].map((text, index) => <span key={`${text}-${index}`}>{text}<b> · </b></span>)}</div>
    </section>

    <section className="section-pad experiments-section" id="experiments">
      <Reveal><div className="section-intro"><div><p className="eyebrow">{t('home.event')}</p><h2>{copy.section}</h2></div><p>{copy.intro}<br /><strong>{copy.introStrong}</strong></p></div></Reveal>
      {featured ? <Reveal delay={80}><article className="featured-card">
        <div className="featured-visual"><img src={featured.image || labHero} alt={featured.title[lang]} loading="eager" /><span>{copy.featuredLabel(featured.id)}</span></div>
        <div className="featured-body"><p className="card-kicker">#{featured.id} · {featured.type} · {featured.status}</p><h3>{featured.title[lang]}</h3><p>{featured.summary[lang]}</p>
          <div className="hypothesis"><span>{copy.hypothesis}</span><p>{copy.hypothesisText}</p></div><Link className="arrow-link" to={`${prefix}/experiments/${featured.id}`}>{copy.open} <Arrow /></Link>
        </div>
      </article></Reveal> : <p className="empty-projects">{spanish ? 'El próximo experimento todavía está por decidir.' : 'The next experiment is still taking shape.'}</p>}
      {cards.length > 0 && <div className="card-grid">{cards.map((project, index) => <Reveal key={project.id} delay={120 + index * 60}>
        <Link className={`experiment-card${index === cards.length - 1 ? ' card-open' : ''}`} style={{ '--card-accent': project.accent }} to={`${prefix}/experiments/${project.id}`}>
          <div className="card-meta"><span>{copy.status} #{project.id}</span><b>{copy.idea}</b></div><h3>{project.title[lang]}</h3><p>{project.summary[lang]}</p><span className="card-link">{copy.dossier} <Arrow /></span>
        </Link>
      </Reveal>)}</div>}
      <Reveal><Link className="experiments-more" to={`${prefix}/experiments`}><span>{copy.more}</span><Arrow /></Link></Reveal>
    </section>

    <section className="manifesto" id="about"><div className="manifesto-inner section-pad"><Reveal><p className="eyebrow">{t('home.why')}</p><h2>{copy.about}<br /><em>{spanish ? 'Y eso está bien.' : 'And that is fine.'}</em></h2><p className="manifesto-copy">{copy.aboutCopy}</p></Reveal><ValuesLoop /></div></section>
    <Reveal><section className="about-teaser section-pad"><div className="about-teaser-image"><img src={portrait} alt={t('about.photoAlt')} loading="lazy" /></div><div><p className="eyebrow">{t('home.aboutEyebrow')}</p><h2>{t('home.aboutTitle')}</h2><p>{t('home.aboutText')}</p><div className="teaser-links"><Link className="button button-dark" to={`${prefix}/about`}>{t('home.aboutButton')} <Arrow /></Link><Link className="button button-light" to={`${prefix}/career`}>{t('home.careerButton')} <Arrow /></Link></div></div></section></Reveal>
    <VideoGallery />
    <CommunityLab />
    <LabTest />
  </main>
}
