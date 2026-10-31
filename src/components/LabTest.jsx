import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { personality } from '../data/site.js'

export function LabTest() {
  const { t } = useTranslation()
  const locale = t('nav.language') === 'EN' ? 'es' : 'en'
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState({ builder: 0, explorer: 0, storyteller: 0, systems: 0, connector: 0, craftsperson: 0 })
  const [result, setResult] = useState('')
  const [certificate, setCertificate] = useState(false)
  const questions = personality.questions
  const answerQuestion = (key) => {
    const next = { ...scores, [key]: scores[key] + 1 }
    if (step === questions.length - 1) { const highest = Math.max(...Object.values(next)); const winner = next[key] === highest ? key : Object.keys(next).find((type) => next[type] === highest); setScores(next); setResult(winner); window.setTimeout(() => setCertificate(true), 250) } else { setScores(next); setStep(step + 1) }
  }
  const reset = () => { setStep(0); setScores({ builder: 0, explorer: 0, storyteller: 0, systems: 0, connector: 0, craftsperson: 0 }); setResult(''); setCertificate(false) }
  const profile = personality.profiles[result]
  const title = (value) => value?.[locale] || value?.en || ''
  return <section className="test-section section-pad" aria-labelledby="test-title"><div className="test-frame"><div className="test-intro"><p className="eyebrow">{t('home.testEyebrow')}</p><h2 id="test-title">{t('home.testTitle')}</h2><p>{t('home.testIntro')}</p><small>{locale === 'es' ? '6 preguntas · 4 respuestas · sin respuestas buenas o malas' : '6 questions · 4 choices · no right or wrong answers'}</small></div>{!result ? <div className="test-game"><div className="test-progress"><span>{String(step + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span><span>{t('home.testQuestion')}</span></div><progress max={questions.length} value={step + 1} aria-label={`${step + 1} / ${questions.length}`} /><h3 key={step} className="test-question-animated">{title(questions[step].prompt)}</h3><div className="test-options">{questions[step].answers.map((choice, index) => <button key={`${questions[step].id}-${index}`} onClick={() => answerQuestion(choice.type)}><span>{title(choice.text)}</span><span aria-hidden="true">→</span></button>)}</div></div> : <div className={`test-result ${certificate ? 'is-awarded' : ''}`} aria-live="polite"><span className="result-symbol" aria-hidden="true">✦</span><p className="eyebrow">{locale === 'es' ? 'INSIGNIA DEL LABORATORIO' : 'LAB BADGE'}</p><h3>{title(profile.title)}</h3><p>{title(profile.text)}</p><div className="certificate-seal" aria-label={locale === 'es' ? 'Insignia conseguida' : 'Badge earned'}>✳<small>{locale === 'es' ? 'CURIOSIDAD CERTIFICADA' : 'CURIOSITY CERTIFIED'}</small></div><button className="text-link" onClick={reset}>{t('home.testAgain')} ↻</button></div>}</div></section>
}
