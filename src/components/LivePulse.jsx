import { useEffect, useState } from 'react'

const signals = [
  ['01', 'OBSERVING', 'ideas becoming prototypes'],
  ['02', 'BUILDING', 'something is being made'],
  ['03', 'SHARING', 'the process is leaving the lab'],
  ['04', 'REPEATING', 'another rabbit hole is loading']
]

export function LivePulse() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % signals.length), 3200)
    return () => window.clearInterval(timer)
  }, [])

  const [number, state, text] = signals[index]
  return <div className="live-pulse" aria-live="polite">
    <span className="live-pulse-dot" aria-hidden="true" />
    <span className="live-pulse-id">SIGNAL {number}</span>
    <strong>{state}</strong>
    <span>{text}</span>
  </div>
}
