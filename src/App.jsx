import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import i18n from './i18n/config.js'
import { Layout } from './components/Layout.jsx'
import { Home } from './pages/Home.jsx'
import { Archive } from './pages/Archive.jsx'
import { Experiment } from './pages/Experiment.jsx'
import { Notes } from './pages/Notes.jsx'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const spanish = location.pathname === '/es' || location.pathname.startsWith('/es/')
    const language = spanish ? 'es' : 'en'
    if (i18n.language !== language) i18n.changeLanguage(language)
    document.documentElement.lang = language
    document.title = spanish ? 'braisgf.dev — Laboratorio personal' : 'braisgf.dev — Personal Lab'
  }, [location.pathname])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiments" element={<Archive />} />
        <Route path="/experiments/:id" element={<Experiment />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/es" element={<Home />} />
        <Route path="/es/experiments" element={<Archive />} />
        <Route path="/es/experiments/:id" element={<Experiment />} />
        <Route path="/es/notes" element={<Notes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
