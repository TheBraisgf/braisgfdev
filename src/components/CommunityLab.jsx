import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pollOptions } from '../data/site.js'

export function CommunityLab() {
  const { t } = useTranslation()
  const [vote, setVote] = useState(() => localStorage.getItem('braisgf-next-experiment') || '')
  const [suggestion, setSuggestion] = useState('')
  const [sent, setSent] = useState(false)

  const castVote = (id) => {
    setVote(id)
    localStorage.setItem('braisgf-next-experiment', id)
  }

  const sendSuggestion = (event) => {
    event.preventDefault()
    if (!suggestion.trim()) return
    const body = encodeURIComponent(`${suggestion.trim()}\n\nSent from braisgf.dev`)
    window.open(`https://github.com/TheBraisgf/braisgfdev/issues/new?title=Lab%20suggestion&body=${body}`, '_blank', 'noopener,noreferrer')
    setSent(true)
    setSuggestion('')
  }

  return <section className="community-section section-pad" id="community" aria-labelledby="community-title">
    <div className="community-head"><div><p className="eyebrow">{t('home.communityEyebrow')}</p><h2 id="community-title">{t('home.communityTitle')}</h2></div><p>{t('home.communityIntro')}</p></div>
    <div className="community-grid">
      <div className="poll-card">
        <div className="poll-top"><span>{t('home.pollLabel')}</span><span>{vote ? t('home.pollVoted') : t('home.pollOpen')}</span></div>
        <h3>{t('home.pollQuestion')}</h3>
        <div className="poll-options" role="group" aria-label={t('home.pollQuestion')}>
          {pollOptions.map((option) => <button key={option.id} className={`poll-option accent-${option.accent} ${vote === option.id ? 'is-voted' : ''}`} onClick={() => castVote(option.id)} aria-pressed={vote === option.id}>
            <span>#{option.number}</span><strong>{t(`poll.${option.id}.title`)}</strong><small>{t(`poll.${option.id}.text`)}</small><b>{vote === option.id ? '✓' : '→'}</b>
          </button>)}
        </div>
        <p className="poll-note">{t('home.pollNote')}</p>
        <a className="text-link" href="https://github.com/TheBraisgf/braisgfdev/discussions" target="_blank" rel="noreferrer">{t('home.publicVote')} ↗</a>
      </div>
      <form className="suggestion-card" onSubmit={sendSuggestion}>
        <p className="eyebrow">{t('home.suggestionLabel')}</p><h3>{t('home.suggestionTitle')}</h3><p>{t('home.suggestionText')}</p>
        <label htmlFor="suggestion">{t('home.suggestionPlaceholder')}</label><textarea id="suggestion" value={suggestion} onChange={(event) => setSuggestion(event.target.value)} maxLength={500} rows={4} placeholder={t('home.suggestionPlaceholder')} />
        <button className="button button-dark" type="submit">{sent ? t('home.suggestionSent') : t('home.suggestionButton')} <span>↗</span></button>
      </form>
    </div>
  </section>
}
