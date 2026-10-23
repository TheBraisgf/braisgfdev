import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { values } from '../data/site.js'

export function ValuesLoop() {
  const { t } = useTranslation()
  const [active, setActive] = useState('imagine')
  const item = values.find((value) => value.id === active)

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => values[(values.findIndex((value) => value.id === current) + 1) % values.length].id), 4800)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="values-loop">
      <div className="values-tabs" role="tablist" aria-label={t('home.valuesLabel')}>
        {values.map((value) => (
          <button key={value.id} className={`value-tab accent-${value.accent} ${active === value.id ? 'is-active' : ''}`} onClick={() => setActive(value.id)} role="tab" aria-selected={active === value.id} aria-controls={`value-panel-${value.id}`}>
            <span>{value.icon}</span>{t(`values.${value.id}.title`)} <b>→</b>
          </button>
        ))}
      </div>
      <div className={`value-panel accent-${item.accent}`} id={`value-panel-${item.id}`} role="tabpanel" aria-live="polite">
        <span className="value-panel-number">{item.icon}</span>
        <div><p className="eyebrow">{t(`values.${item.id}.title`)}</p><h3 key={item.id} className="value-panel-copy">{t(`values.${item.id}.headline`)}</h3><p>{t(`values.${item.id}.text`)}</p></div>
      </div>
    </div>
  )
}
