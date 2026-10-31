import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const isExternal = (href = '') => /^https?:\/\//i.test(href)

export function MarkdownContent({ source = '' }) {
  if (!source.trim()) return null

  return <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ node, ...props }) => <figure className="markdown-media markdown-image"><img {...props} loading="lazy" />{props.alt && <figcaption>{props.alt}</figcaption>}</figure>,
        video: ({ node, ...props }) => <div className="markdown-media markdown-video"><video controls playsInline preload="metadata" {...props} /></div>,
        audio: ({ node, ...props }) => <div className="markdown-media markdown-audio"><audio controls preload="metadata" {...props} /></div>,
        iframe: ({ node, ...props }) => <div className="markdown-media markdown-embed"><iframe loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen {...props} /></div>,
        a: ({ node, ...props }) => <a {...props} target={isExternal(props.href) ? '_blank' : undefined} rel={isExternal(props.href) ? 'noreferrer' : undefined} />
      }}
    >{source}</ReactMarkdown>
  </div>
}
