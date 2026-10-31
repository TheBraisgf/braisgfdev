import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { values } from '../data/site.js'
import { useMotionPreference } from '../hooks/useMotionPreference.js'

export function ValuesLoop() {
  const { t } = useTranslation()
  const spanish = useLocation().pathname.startsWith('/es')
  const reducedMotion = useMotionPreference()
  const [active, setActive] = useState('imagine')
  const [paused, setPaused] = useState(false)
  const tabRefs = useRef([])
  const item = values.find((value) => value.id === active) || values[0]

  useEffect(() => {
    if (paused || reducedMotion) return undefined
    const timer = window.setInterval(() => {
      setActive((current) => values[(values.findIndex((value) => value.id === current) + 1) % values.length].id)
    }, 4800)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  const handleTabKeyDown = (event) => {
    const currentIndex = values.findIndex((value) => value.id === active)
    let nextIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % values.length
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + values.length) % values.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = values.length - 1
    else return
    event.preventDefault()
    setActive(values[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  const pauseLabel = reducedMotion
    ? spanish ? 'Cambios automáticos detenidos por movimiento reducido' : 'Automatic changes stopped for reduced motion'
    : paused
      ? spanish ? 'Reanudar cambios automáticos' : 'Resume automatic changes'
      : spanish ? 'Pausar cambios automáticos' : 'Pause automatic changes'

  return (
    <div className="values-loop">
      <div className="values-loop-controls">
        <div className="values-tabs" role="tablist" aria-label={t('home.valuesLabel')} onKeyDown={handleTabKeyDown} onFocus={() => setPaused(true)} onPointerEnter={() => setPaused(true)}>
          {values.map((value, index) => (
            <button
              key={value.id}
              ref={(node) => { tabRefs.current[index] = node }}
              id={`value-tab-${value.id}`}
              className={`value-tab accent-${value.accent} ${active === value.id ? 'is-active' : ''}`}
              onClick={() => setActive(value.id)}
              role="tab"
              tabIndex={active === value.id ? 0 : -1}
              aria-selected={active === value.id}
              aria-controls="value-panel"
            >
              <span>{value.icon}</span>{t(`values.${value.id}.title`)} <b aria-hidden="true">→</b>
            </button>
          ))}
        </div>
        <button className="loop-toggle" type="button" aria-label={pauseLabel} title={pauseLabel} aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => setPaused((value) => !value)}>
          <span aria-hidden="true">{paused || reducedMotion ? '▶' : 'Ⅱ'}</span>
        </button>
      </div>
      <div className={`value-panel accent-${item.accent}`} id="value-panel" role="tabpanel" aria-labelledby={`value-tab-${item.id}`} tabIndex="0">
        <span className="value-panel-number">{item.icon}</span>
        <div><p className="eyebrow">{t(`values.${item.id}.title`)}</p><h3 key={item.id} className="value-panel-copy">{t(`values.${item.id}.headline`)}</h3><p>{t(`values.${item.id}.text`)}</p></div>
      </div>
    </div>
  )
}
