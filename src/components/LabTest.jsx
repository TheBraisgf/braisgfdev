import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const choices = ['builder', 'explorer', 'storyteller', 'systems']

export function LabTest() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState({ builder: 0, explorer: 0, storyteller: 0, systems: 0 })
  const [result, setResult] = useState('')

  const questions = useMemo(() => ['one', 'two', 'three'], [])
  const answer = (choice) => {
    const next = { ...scores, [choice]: scores[choice] + 1 }
    if (step === questions.length - 1) {
      const winner = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0]
      setScores(next); setResult(winner)
    } else { setScores(next); setStep(step + 1) }
  }

  const reset = () => { setStep(0); setScores({ builder: 0, explorer: 0, storyteller: 0, systems: 0 }); setResult('') }

  return <section className="test-section section-pad" aria-labelledby="test-title">
    <div className="test-frame">
      <div className="test-intro"><p className="eyebrow">{t('home.testEyebrow')}</p><h2 id="test-title">{t('home.testTitle')}</h2><p>{t('home.testIntro')}</p></div>
      {!result ? <div className="test-game"><div className="test-progress"><span>{String(step + 1).padStart(2, '0')} / 03</span><span>{t('home.testQuestion')}</span></div><h3>{t(`test.questions.${questions[step]}`)}</h3><div className="test-options">{choices.map((choice) => <button key={choice} onClick={() => answer(choice)}>{t(`test.choices.${choice}`)} <span>→</span></button>)}</div></div> : <div className="test-result"><span className="result-symbol">✦</span><p className="eyebrow">{t('home.testResult')}</p><h3>{t(`test.results.${result}.title`)}</h3><p>{t(`test.results.${result}.text`)}</p><button className="text-link" onClick={reset}>{t('home.testAgain')} ↻</button></div>}
    </div>
  </section>
}
