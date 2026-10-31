import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import i18n from './i18n/config.js'
import { Layout } from './components/Layout.jsx'

const Home = lazy(() => import('./pages/Home.jsx').then((module) => ({ default: module.Home })))
const Archive = lazy(() => import('./pages/Archive.jsx').then((module) => ({ default: module.Archive })))
const Experiment = lazy(() => import('./pages/Experiment.jsx').then((module) => ({ default: module.Experiment })))
const About = lazy(() => import('./pages/About.jsx').then((module) => ({ default: module.About })))
const Career = lazy(() => import('./pages/Career.jsx').then((module) => ({ default: module.Career })))
const Notes = lazy(() => import('./pages/Notes.jsx').then((module) => ({ default: module.Notes })))
const Journal = lazy(() => import('./pages/Journal.jsx').then((module) => ({ default: module.Journal })))
const NotFound = lazy(() => import('./pages/NotFound.jsx').then((module) => ({ default: module.NotFound })))

export default function App() {
  const location = useLocation()
  useEffect(() => {
    const spanish = location.pathname === '/es' || location.pathname.startsWith('/es/')
    const language = spanish ? 'es' : 'en'
    if (i18n.language !== language) i18n.changeLanguage(language)
    document.documentElement.lang = language
  }, [location.pathname])

  return <Layout><Suspense fallback={<main className="page-loading" role="status">{location.pathname.startsWith('/es') ? 'Cargando…' : 'Loading…'}</main>}><Routes>
    <Route path="/" element={<Home />} /><Route path="/experiments" element={<Archive />} /><Route path="/experiments/:id" element={<Experiment />} /><Route path="/about" element={<About />} /><Route path="/career" element={<Career />} /><Route path="/notes" element={<Notes />} /><Route path="/notes/:slug" element={<Notes />} /><Route path="/journal" element={<Journal />} />
    <Route path="/es" element={<Home />} /><Route path="/es/experiments" element={<Archive />} /><Route path="/es/experiments/:id" element={<Experiment />} /><Route path="/es/about" element={<About />} /><Route path="/es/career" element={<Career />} /><Route path="/es/notes" element={<Notes />} /><Route path="/es/notes/:slug" element={<Notes />} /><Route path="/es/journal" element={<Journal />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense></Layout>
}
