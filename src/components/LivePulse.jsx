import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const signals = {
  en: [['01', 'OBSERVING', 'ideas becoming prototypes'], ['02', 'BUILDING', 'something is being made'], ['03', 'SHARING', 'the process is leaving the lab'], ['04', 'REPEATING', 'another rabbit hole is loading']],
  es: [['01', 'OBSERVANDO', 'las ideas se convierten en prototipos'], ['02', 'CONSTRUYENDO', 'algo está tomando forma'], ['03', 'COMPARTIENDO', 'el proceso sale del laboratorio'], ['04', 'REPITIENDO', 'se está cargando otro agujero de conejo']]
}

export function LivePulse() {
  const { pathname } = useLocation()
  const language = pathname.startsWith('/es') ? 'es' : 'en'
  const [index, setIndex] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setIndex((value) => (value + 1) % signals[language].length), 3200); return () => window.clearInterval(timer) }, [language])
  const [number, state, text] = signals[language][index]
  return <div className="live-pulse" aria-live="polite"><span className="live-pulse-dot" aria-hidden="true" /><span className="live-pulse-id">{language === 'es' ? 'SEÑAL' : 'SIGNAL'} {number}</span><strong>{state}</strong><span>{text}</span></div>
}
