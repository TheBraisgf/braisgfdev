import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import es from './es.json'

const pathname = typeof window === 'undefined' ? '/' : window.location.pathname
const isSpanish = pathname === '/es' || pathname.startsWith('/es/')

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: isSpanish ? 'es' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
