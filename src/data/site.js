import { videoBlaze, videoDice, videoRoc, labHero } from './assets.js'

export const values = [
  { id: 'imagine', icon: '01', accent: 'acid' },
  { id: 'create', icon: '02', accent: 'violet' },
  { id: 'share', icon: '03', accent: 'blue' },
  { id: 'repeat', icon: '04', accent: 'acid' }
]

export const videos = [
  { id: '01', image: labHero, platform: 'TikTok', title: 'The lab in public', url: 'https://www.tiktok.com/@braisgfroom' },
  { id: '02', image: videoBlaze, platform: 'TikTok', title: 'Building a game from scratch', url: 'https://www.tiktok.com/@braisgfroom' },
  { id: '03', image: videoRoc, platform: 'YouTube', title: 'Longer experiments & stories', url: 'https://www.youtube.com/@braisgfroom' },
  { id: '04', image: videoDice, platform: 'Twitch', title: 'Making things live', url: 'https://www.twitch.tv/braisgfroom' }
]

export const pollOptions = [
  { id: 'reader', number: '002', accent: 'acid' },
  { id: 'maker', number: '003', accent: 'violet' },
  { id: 'wildcard', number: '004', accent: 'blue' }
]

export const career = [
  { year: '2016 — 2020', role: 'Telecommunications Engineering', company: 'University', key: 'telecom' },
  { year: '2020 — 2021', role: 'Filmmaking & Production', company: 'Creative training', key: 'film' },
  { year: '2021', role: 'Fullstack Developer', company: 'Hack A Boss', key: 'hab' },
  { year: '2021 — 2023', role: 'Frontend Developer', company: 'Zara.com', key: 'zara' },
  { year: '2023', role: 'AI Image Editor', company: 'Santander', key: 'imageai' },
  { year: '2023 — 2024', role: 'Smart Form Evaluator', company: 'Santander', key: 'forms' },
  { year: '2024 — now', role: 'Python AI Backend', company: 'Santander / Universia', key: 'backend' }
]

export const gameQuestions = [
  { id: 'q1', answers: ['builder', 'explorer', 'storyteller', 'learn'] },
  { id: 'q2', answers: ['curious', 'hands', 'story', 'system'] },
  { id: 'q3', answers: ['prototype', 'publish', 'iterate', 'system'] }
]
