export const experiments = [
  { id: '001', slug: 'make-the-lab-worth-visiting', image: '/assets/labImg/braisgfdev.jpg', attachments: [], links: [] },
  { id: '002', slug: 'build-a-better-digital-reader', attachments: [], links: [] },
  { id: '003', slug: 'learn-by-building-the-thing', attachments: [], links: [] }
]

export const getExperiment = (id) => experiments.find((experiment) => experiment.id === id)
