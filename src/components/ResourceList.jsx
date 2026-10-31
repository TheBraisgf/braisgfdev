import { useMemo } from 'react'

const media = {
  image: ['jpg','jpeg','png','gif','webp','avif','svg'],
  video: ['mp4','webm','mov','m4v'],
  audio: ['mp3','wav','ogg','m4a','flac'],
  document: ['pdf']
}

function typeOf(href = '') {
  const extension = href.split('?')[0].split('.').pop()?.toLowerCase()
  if (media.image.includes(extension)) return 'image'
  if (media.video.includes(extension)) return 'video'
  if (media.audio.includes(extension)) return 'audio'
  if (media.document.includes(extension)) return 'document'
  return 'file'
}

export function ResourceList({ resources = [], labels }) {
  const normalized = useMemo(() => resources.map((resource) => ({ ...resource, type: resource.type || typeOf(resource.href) })), [resources])
  if (!normalized.length) return null

  return <div className="resource-stack">
    {normalized.map((resource) => <article className="resource-item" key={`${resource.href}-${resource.label}`}>
      {resource.type === 'image' && <img src={resource.href} alt={resource.alt || resource.label} loading="lazy" />}
      {resource.type === 'video' && <video controls preload="metadata"><source src={resource.href} /></video>}
      {resource.type === 'audio' && <audio controls preload="metadata"><source src={resource.href} /></audio>}
      {resource.type === 'document' && <iframe title={resource.label} src={resource.href} loading="lazy" />}
      <div className="resource-info"><span>{resource.kind || labels.file}</span><strong>{resource.label}</strong><a href={resource.href} download={!resource.external} target={resource.external ? '_blank' : undefined} rel={resource.external ? 'noreferrer' : undefined}>{labels.open} ↗</a></div>
    </article>)}
  </div>
}
