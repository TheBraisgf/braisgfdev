import data from '../content/field-notes.json'

export const fieldNotes = data.entries
export const getFieldNote = (slug) => fieldNotes.find((entry) => entry.slug === slug)
