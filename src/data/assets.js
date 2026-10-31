export const portrait = new URL('../../assets/Braisgf.jpeg', import.meta.url).href
export const labHero = '/images/hero-lab.svg'
export const labDetail = '/images/lab-detail.jpg'
export const videoBlaze = new URL('../../assets/labImg/blaze.jpg', import.meta.url).href
export const videoRoc = new URL('../../assets/labImg/roc.jpg', import.meta.url).href
export const videoDice = new URL('../../assets/labImg/diceduel.jpeg', import.meta.url).href

// Temporary bridge: these legacy assets remain on main until they are replaced with fresh project media.
const LEGACY = 'https://raw.githubusercontent.com/TheBraisgf/braisgfdev/main/'
export const legacyPi = `${LEGACY}assets/labImg/PI.jpg`
export const legacyAws = `${LEGACY}assets/labImg/awstranscoder.jpeg`
export const legacyGleenk = `${LEGACY}assets/labImg/gleenk.jpg`
export const careerLogos = {
  telecom: `${LEGACY}career/img/universidad.jpg`,
  film: `${LEGACY}career/img/masterd.png`,
  hab: `${LEGACY}career/img/hab.jpg`,
  zara: `${LEGACY}career/img/zara.jpg`,
  santander: `${LEGACY}career/img/santander.jpg`
}
