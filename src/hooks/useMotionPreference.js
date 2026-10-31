import { useEffect, useState } from 'react'

export function useMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches || document.documentElement.classList.contains('a11y-motion'))
    const observer = new MutationObserver(update)

    update()
    media.addEventListener('change', update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      media.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return reducedMotion
}
