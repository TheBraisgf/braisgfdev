import { Link, useLocation } from 'react-router-dom'

export function NotFound() {
  const spanish = useLocation().pathname.startsWith('/es')
  const prefix = spanish ? '/es' : ''
  return <main className="archive-page section-pad"><p className="eyebrow">404 / {spanish ? 'PÁGINA PERDIDA' : 'PAGE LOST'}</p><header className="archive-hero"><h1>{spanish ? 'Has encontrado un rincón que todavía no existe.' : 'You found a corner that does not exist yet.'}</h1><p>{spanish ? 'Probablemente acabas de descubrir el lado experimental de la web.' : 'You may have just discovered the experimental side of the website.'}</p></header><Link className="button button-dark" to={prefix || '/'}>{spanish ? 'Volver al laboratorio' : 'Back to the lab'} ↗</Link></main>
}
