import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMotionPreference } from '../hooks/useMotionPreference.js'

const signals = {
  en: [['01', 'OBSERVING', 'ideas becoming prototypes'], ['02', 'BUILDING', 'something is being made'], ['03', 'SHARING', 'the process is leaving the lab'], ['04', 'REPEATING', 'another rabbit hole is loading']],
  es: [['01', 'OBSERVANDO', 'las ideas se convierten en prototipos'], ['02', 'CONSTRUYENDO', 'algo está tomando forma'], ['03', 'COMPARTIENDO', 'el proceso sale del laboratorio'], ['04', 'REPITIENDO', 'se está cargando otro agujero de conejo']]
}

export function LivePulse() {
  const { pathname } = useLocation()
  const language = pathname.startsWith('/es') ? 'es' : 'en'
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useMotionPreference()
  useEffect(() => {
    if (paused || reducedMotion) return undefined
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % signals[language].length), 3200)
    return () => window.clearInterval(timer)
  }, [language, paused, reducedMotion])
  const [number, state, text] = signals[language][index]
  const pauseLabel = reducedMotion
    ? language === 'es' ? 'Cambios automáticos detenidos por movimiento reducido' : 'Automatic changes stopped for reduced motion'
    : paused
      ? language === 'es' ? 'Reanudar señales automáticas' : 'Resume automatic signals'
      : language === 'es' ? 'Pausar señales automáticas' : 'Pause automatic signals'
  return <div className="live-pulse"><span className="live-pulse-dot" aria-hidden="true" /><span className="live-pulse-id">{language === 'es' ? 'SEÑAL' : 'SIGNAL'} {number}</span><strong>{state}</strong><span>{text}</span><button className="live-pulse-toggle" type="button" aria-label={pauseLabel} title={pauseLabel} aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => setPaused((value) => !value)}><span aria-hidden="true">{paused || reducedMotion ? '▶' : 'Ⅱ'}</span></button></div>
}
