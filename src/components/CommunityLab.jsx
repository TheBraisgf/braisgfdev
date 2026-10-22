import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { pollOptions } from '../data/site.js'
import { Reveal } from './Reveal.jsx'

const publicPollUrl = (() => {
  const query = new URLSearchParams({ qTitle: "What should Brais build next?", qDesc: 'No account. Public results. Pick one rabbit hole.', type: 'radio' })
  ;['A better digital reader', 'Learn by building', 'Something completely ridiculous'].forEach((option) => query.append('a', option))
  return `https://app.polling.com/quick-poll?${query.toString()}`
})()

export function CommunityLab() {
  const { pathname } = useLocation()
  const spanish = pathname.startsWith('/es')
  const [vote, setVote] = useState(() => localStorage.getItem('braisgf-next-experiment') || '')
  const [suggestion, setSuggestion] = useState('')
  const [sent, setSent] = useState(false)

  const copyVote = async (id) => {
    setVote(id)
    localStorage.setItem('braisgf-next-experiment', id)
    const option = pollOptions.find((item) => item.id === id)
    try { await navigator.clipboard.writeText(`I think Brais should build #${option?.number} next. https://braisgf.dev/#community`) } catch {}
  }

  const sendSuggestion = (event) => {
    event.preventDefault()
    if (!suggestion.trim()) return
    const text = suggestion.trim()
    const endpoint = import.meta.env.VITE_SUGGESTION_ENDPOINT
    if (endpoint) {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ message: text, source: 'braisgf.dev', language: spanish ? 'es' : 'en' }) }).catch(() => {})
      setSent(true)
    } else {
      window.location.href = `mailto:?subject=${encodeURIComponent('Lab suggestion')}&body=${encodeURIComponent(`${text}\n\nSent from braisgf.dev`)}`
      setSent(true)
    }
    setSuggestion('')
  }

  const labels = spanish ? { eyebrow: 'TU TURNO', title: '¿Qué debería construir después?', intro: 'Yo tomo la decisión final. Pero si mucha gente señala el mismo objeto brillante, me va a costar ignorarlo.', poll: 'ENCUESTA PÚBLICA', open: 'Votar sin cuenta', local: 'Vista rápida', saved: 'Elección guardada', note: 'Esta vista rápida se guarda solo en este navegador.', suggestion: 'BUZÓN DE IDEAS', suggestionTitle: 'Dame una idea terrible.', suggestionText: 'Proyectos raros, herramientas útiles, experimentos absurdos. Si se puede construir, quiero escucharla.', placeholder: '¿Qué debería hacer?', button: 'Enviar idea', sent: 'Idea enviada' } : { eyebrow: 'YOUR TURN', title: 'What should I build next?', intro: "I make the final call. But if enough people point at the same shiny object, I'm going to have a very hard time ignoring it.", poll: 'PUBLIC VOTE', open: 'Vote without an account', local: 'Quick pick', saved: 'Choice saved', note: 'This quick pick is stored only in this browser.', suggestion: 'OPEN IDEA BOX', suggestionTitle: 'Give me a terrible idea.', suggestionText: 'Weird projects, useful tools, ridiculous experiments. If it can be made, I want to hear it.', placeholder: 'What should I make?', button: 'Send idea', sent: 'Idea sent' }

  return <section className="community-section section-pad" id="community" aria-labelledby="community-title">
    <Reveal><div className="community-head"><div><p className="eyebrow">{labels.eyebrow}</p><h2 id="community-title">{labels.title}</h2></div><p>{labels.intro}</p></div></Reveal>
    <div className="community-grid">
      <Reveal><div className="poll-card">
        <div className="poll-top"><span>{labels.poll}</span><span>{vote ? labels.saved : labels.local}</span></div>
        <h3>{spanish ? 'Elige un agujero de conejo:' : 'Pick a rabbit hole:'}</h3>
        <div className="poll-options" role="group" aria-label={labels.title}>
          {pollOptions.map((option) => <button key={option.id} className={`poll-option accent-${option.accent} ${vote === option.id ? 'is-voted' : ''}`} onClick={() => copyVote(option.id)} aria-pressed={vote === option.id}>
            <span>#{option.number}</span><strong>{spanish ? ({ reader: 'Un lector digital mejor', maker: 'Aprender construyendo', wildcard: 'Algo completamente ridículo' }[option.id]) : ({ reader: 'A better digital reader', maker: 'Learn by building', wildcard: 'Something completely ridiculous' }[option.id])}</strong><small>{spanish ? ({ reader: 'Cómics + libros + inmersión', maker: 'Elige una habilidad. Haz algo.', wildcard: 'Tú decides el agujero de conejo.' }[option.id]) : ({ reader: 'Comics + books + immersion', maker: 'Pick a skill. Make something.', wildcard: 'You decide the rabbit hole.' }[option.id])}</small><b>{vote === option.id ? '✓' : '→'}</b>
          </button>)}
        </div>
        <p className="poll-note">{labels.note}</p>
        <a className="public-vote" href={publicPollUrl} target="_blank" rel="noreferrer"><span>↗</span><strong>{labels.open}</strong><small>{spanish ? 'Encuesta pública independiente · resultados en directo' : 'Independent public poll · live results'}</small></a>
      </div></Reveal>
      <Reveal delay={90}><form className="suggestion-card" onSubmit={sendSuggestion}>
        <p className="eyebrow">{labels.suggestion}</p><h3>{labels.suggestionTitle}</h3><p>{labels.suggestionText}</p>
        <label htmlFor="suggestion">{labels.placeholder}</label><textarea id="suggestion" name="message" value={suggestion} onChange={(event) => setSuggestion(event.target.value)} maxLength={500} rows={5} placeholder={labels.placeholder} />
        <button className="button button-light" type="submit">{sent ? labels.sent : labels.button} <span>↗</span></button>
        <small className="suggestion-foot">{import.meta.env.VITE_SUGGESTION_ENDPOINT ? 'Public form endpoint connected.' : (spanish ? 'Se abre tu correo. No necesitas GitHub.' : 'Opens your email. No GitHub account needed.')}</small>
      </form></Reveal>
    </div>
  </section>
}
