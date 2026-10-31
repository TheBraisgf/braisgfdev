import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

export function VisitorCounter() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [count, setCount] = useState('15')
  const lastPath = useRef(pathname)

  useEffect(() => {
    const code = import.meta.env.VITE_GOATCOUNTER_CODE
    if (!code) return
    const script = document.createElement('script')
    script.src = 'https://gc.zgo.at/count.js'
    script.async = true
    script.dataset.goatcounter = `https://${code}.goatcounter.com/count`
    document.body.appendChild(script)
    return () => script.remove()
  }, [])

  useEffect(() => {
    const code = import.meta.env.VITE_GOATCOUNTER_CODE
    if (!code) return
    const path = pathname.replace(/\/$/, '') || '/'
    const isClientNavigation = lastPath.current !== pathname
    lastPath.current = pathname
    let timer
    let cancelled = false
    const readCount = () => {
      if (cancelled) return
      if (!window.goatcounter?.get_data) { timer = window.setTimeout(readCount, 150); return }
      if (isClientNavigation && window.goatcounter.count) window.goatcounter.count({ path })
      timer = window.setTimeout(() => fetch(`https://${code}.goatcounter.com/counter/${encodeURIComponent(path)}.json`)
        .then((response) => response.ok ? response.json() : null)
        .then((data) => { if (!cancelled && data?.count) setCount(String(Math.max(15, Number(data.count) || 0))) })
        .catch(() => {}), isClientNavigation ? 500 : 150)
    }
    readCount()
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [pathname])

  const perPage = /^(?:\/es)?\/experiments\/\d{3}\/?$/.test(pathname)
  return <div className="visitor-counter" title={t('home.counterHint')}><span className="counter-led" /> <span>{t('home.counterLabel')}</span><strong>{count}</strong><small>{perPage ? (pathname.startsWith('/es') ? 'visitas a este proyecto' : 'visits to this project') : t('home.counterSuffix')}</small></div>
}
