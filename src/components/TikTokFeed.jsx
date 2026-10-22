import { useEffect, useRef } from 'react'

export function TikTokFeed() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    host.innerHTML = ''
    const blockquote = document.createElement('blockquote')
    blockquote.className = 'tiktok-embed'
    blockquote.setAttribute('cite', 'https://www.tiktok.com/@braisgfroom')
    blockquote.setAttribute('data-unique-id', 'braisgfroom')
    blockquote.setAttribute('data-embed-type', 'creator')
    blockquote.style.maxWidth = '720px'
    blockquote.style.minWidth = '288px'
    const section = document.createElement('section')
    const link = document.createElement('a')
    link.href = 'https://www.tiktok.com/@braisgfroom'
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.textContent = '@braisgfroom'
    section.appendChild(link)
    blockquote.appendChild(section)
    host.appendChild(blockquote)

    const existing = document.querySelector('script[data-tiktok-embed]')
    if (existing) {
      window.tiktokEmbed?.lib?.render?.()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.tiktok.com/embed.js'
    script.async = true
    script.dataset.tiktokEmbed = 'true'
    document.body.appendChild(script)
    return () => {
      host.innerHTML = ''
    }
  }, [])

  return <div className="tiktok-live-wrap"><div ref={hostRef} className="tiktok-live" /><div className="tiktok-live-caption"><span>LIVE FROM TIKTOK</span><strong>Latest uploads appear here automatically ↗</strong></div></div>
}
