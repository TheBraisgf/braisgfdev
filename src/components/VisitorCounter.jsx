import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function VisitorCounter() {
  const { t } = useTranslation()
  const [count, setCount] = useState('—')

  useEffect(() => {
    const code = import.meta.env.VITE_GOATCOUNTER_CODE
    if (!code) return
    const script = document.createElement('script')
    script.src = 'https://gc.zgo.at/count.js'
    script.async = true
    script.dataset.goatcounter = `https://${code}.goatcounter.com/count`
    document.body.appendChild(script)
    const poll = window.setInterval(() => {
      if (!window.goatcounter?.get_data) return
      window.clearInterval(poll)
      const path = window.goatcounter.get_data().p || '/'
      fetch(`https://${code}.goatcounter.com/counter/${encodeURIComponent(path)}.json`)
        .then((response) => response.ok ? response.json() : null)
        .then((data) => data?.count && setCount(data.count))
        .catch(() => {})
    }, 300)
    return () => { window.clearInterval(poll); script.remove() }
  }, [])

  return <div className="visitor-counter" title={t('home.counterHint')}><span className="counter-led" /> <span>{t('home.counterLabel')}</span><strong>{count}</strong><small>{t('home.counterSuffix')}</small></div>
}
