import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { pollContent } from '../data/site.js'
import { Reveal } from './Reveal.jsx'

const contactUrl = 'https://www.linkedin.com/in/braisgf'

export function CommunityLab() {
  const spanish = useLocation().pathname.startsWith('/es')
  const [vote, setVote] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [subject, setSubject] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [countdown, setCountdown] = useState('')
  const endpoint = import.meta.env.VITE_SUGGESTION_ENDPOINT
  const monthKey = (() => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` })()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const deadline = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const remaining = Math.max(0, deadline - now)
      const days = Math.floor(remaining / 86400000)
      const hours = Math.floor((remaining % 86400000) / 3600000)
      setCountdown(spanish ? `${days} d ${hours} h para cambiar la encuesta` : `${days}d ${hours}h until the poll resets`)
    }
    update()
    const timer = window.setInterval(update, 60000)
    return () => window.clearInterval(timer)
  }, [spanish])

  useEffect(() => {
    try { setVote(localStorage.getItem(`braisgf-next-project-${monthKey}`) || '') } catch { /* Storage may be disabled. */ }
  }, [monthKey])

  const locale = spanish ? 'es' : 'en'
  const poll = { title: pollContent.title[locale], desc: pollContent.description[locale], options: pollContent.options.map(({ label }) => label[locale]) }
  const labels = spanish
    ? {
        eyebrow: 'TU TURNO', title: '¿Qué debería construir después?', intro: 'Yo tomo la decisión final. Pero si mucha gente señala el mismo objeto brillante, me va a costar ignorarlo.',
        poll: 'ENCUESTA PÚBLICA', open: 'Votar sin cuenta', local: 'Vista rápida', saved: 'Elección guardada', note: 'Esta vista rápida se guarda solo en este navegador.',
        suggestion: 'BUZÓN DE IDEAS', suggestionTitle: 'Dame una idea terrible.', suggestionText: 'Proyectos raros, herramientas útiles o cosas absurdas. Si se puede construir, quiero escucharla.',
        placeholder: '¿Qué debería hacer?', button: 'Enviar idea', copy: 'Abrir correo', sending: 'Enviando…', sent: 'Borrador de correo abierto', copied: 'Borrador de correo preparado.',
        error: 'No se pudo enviar. Conservé tu texto para que puedas intentarlo de nuevo.', copyError: 'No se pudo copiar; selecciona y copia el texto manualmente.', connected: 'Formulario público conectado.', contact: 'Abrir perfil de LinkedIn'
      }
    : {
        eyebrow: 'YOUR TURN', title: 'What should I build next?', intro: "I make the final call. But if enough people point at the same shiny object, I'm going to have a very hard time ignoring it.",
        poll: 'PUBLIC VOTE', open: 'Vote without an account', local: 'Quick pick', saved: 'Choice saved', note: 'This quick pick is stored only in this browser.',
        suggestion: 'OPEN IDEA BOX', suggestionTitle: 'Give me a terrible idea.', suggestionText: 'Weird projects, useful tools or ridiculous things. If it can be made, I want to hear it.',
        placeholder: 'What should I make?', button: 'Send idea', copy: 'Open email draft', sending: 'Sending…', sent: 'Email draft opened', copied: 'Email draft prepared.',
        error: 'Could not send. Your text is still here so you can try again.', copyError: 'Copy failed; select and copy your message manually.', connected: 'Public form endpoint connected.', contact: 'Open LinkedIn profile'
      }
  const query = new URLSearchParams({ qTitle: poll.title, qDesc: poll.desc, type: 'radio' })
  poll.options.forEach((option) => query.append('a', option))
  const publicPollUrl = `https://app.polling.com/quick-poll?${query.toString()}`

  const copyVote = async (id) => {
    setVote(id)
    try { localStorage.setItem(`braisgf-next-project-${monthKey}`, id) } catch { /* Storage may be disabled. */ }
    const option = pollContent.options.find((item) => item.id === id)
    try {
      await navigator.clipboard.writeText(`${spanish ? 'Creo que Brais debería construir' : 'I think Brais should build'} #${option?.number} ${spanish ? 'después' : 'next'}. https://braisgf.dev/#community`)
    } catch { /* The local choice still updates when clipboard access is unavailable. */ }
  }

  const sendSuggestion = async (event) => {
    event.preventDefault()
    const message = suggestion.trim()
    if (!message || sending) return
    setSendError(false)
    setSent(false)
    setCopied(false)

    if (!endpoint) {
      const title = subject.trim() || (spanish ? 'Idea para el laboratorio' : 'Idea for the lab')
      const body = spanish
        ? `Hola Brais,\n\nQuería proponerte esto:\n${message}\n\n¿Por qué podría ser interesante?\n[Cuéntame el motivo]\n\nReferencias o enlaces (opcional):\n[Pega aquí cualquier enlace]\n\nGracias por leerlo.`
        : `Hi Brais,\n\nHere is an idea I would like to suggest:\n${message}\n\nWhy could it be interesting?\n[Share the reason]\n\nReferences or links (optional):\n[Add any links here]\n\nThanks for reading.`
      window.location.href = `mailto:braisgf@gmail.com?subject=${encodeURIComponent(`[${spanish ? 'Idea para el laboratorio' : 'Lab idea'}] ${title}`)}&body=${encodeURIComponent(body)}`
      setSent(true)
      return
    }

    setSending(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message, source: 'braisgf.dev', language: spanish ? 'es' : 'en' })
      })
      if (!response.ok) throw new Error(`Suggestion endpoint returned ${response.status}`)
      setSent(true)
      setSuggestion('')
    } catch {
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  const resultMessage = sendError ? endpoint ? labels.error : labels.copyError
    : sent ? labels.sent
      : copied ? labels.copied
        : endpoint ? labels.connected
          : ''

  return (
    <section className="community-section section-pad" id="community" aria-labelledby="community-title">
      <Reveal><div className="community-head"><div><p className="eyebrow">{labels.eyebrow}</p><h2 id="community-title">{labels.title}</h2></div><p>{labels.intro}</p></div></Reveal>
      <div className="community-grid">
        <Reveal><div className="poll-card">
          <div className="poll-top"><span>{labels.poll}</span><span aria-live="polite" aria-atomic="true">{vote ? labels.saved : labels.local}</span></div>
          <h3>{poll.title}</h3>
          <div className="poll-options" role="group" aria-label={labels.title}>
            {pollContent.options.map((option) => <button key={option.id} className={`poll-option accent-${option.accent} ${vote === option.id ? 'is-voted' : ''}`} onClick={() => copyVote(option.id)} aria-pressed={vote === option.id}>
              <span>#{option.number}</span><strong>{option.label[locale]}</strong><small>{option.description[locale]}</small><b aria-hidden="true">{vote === option.id ? '✓' : '→'}</b>
            </button>)}
          </div>
          <p className="poll-countdown" aria-label={spanish ? 'Cuenta atrás mensual de la encuesta' : 'Monthly poll countdown'}>{countdown}</p>
          <p className="poll-note">{labels.note}</p>
          <a className="public-vote" href={publicPollUrl} target="_blank" rel="noreferrer"><span aria-hidden="true">↗</span><strong>{labels.open}</strong><small>{spanish ? 'Encuesta pública independiente · resultados en directo' : 'Independent public poll · live results'}</small></a>
        </div></Reveal>
        <Reveal delay={90}><form className="suggestion-card" onSubmit={sendSuggestion}>
          <p className="eyebrow">{labels.suggestion}</p><h3>{labels.suggestionTitle}</h3><p>{labels.suggestionText}</p>
          <label htmlFor="suggestion-subject">{spanish ? 'Asunto del correo' : 'Email subject'}</label>
          <input id="suggestion-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={100} placeholder={spanish ? 'Ej.: una idea para el laboratorio' : 'E.g. an idea for the lab'} />
          <label htmlFor="suggestion">{labels.placeholder}</label>
          <textarea id="suggestion" name="message" value={suggestion} onChange={(event) => { setSuggestion(event.target.value); setSendError(false); setSent(false); setCopied(false) }} maxLength={500} rows={5} placeholder={labels.placeholder} />
          <button className="button button-light" type="submit" disabled={sending}>{sending ? labels.sending : endpoint ? sent ? labels.sent : labels.button : labels.copy} <span aria-hidden="true">↗</span></button>
          <small className="suggestion-foot" aria-live="polite">{resultMessage || (endpoint ? labels.connected : spanish ? 'Se abrirá tu aplicación de correo con un asunto y una estructura sugerida.' : 'Your email app opens with a suggested subject and outline.')}</small>
          {!endpoint && <a className="suggestion-contact" href={contactUrl} target="_blank" rel="noreferrer">{labels.contact} ↗</a>}
        </form></Reveal>
      </div>
    </section>
  )
}
