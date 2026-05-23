const DEFAULT_COLOR = '#86d4c6'

export const DELETE_SCOPES = [
  {
    id: 'entries',
    label: 'Full logged days',
    description: 'Removes entire day records in the range (graph, summary, export).',
  },
  {
    id: 'symptoms',
    label: 'Symptoms & emoji stacks',
    description: 'Clears symptom tags only; keeps clarity, mood, and notes if present.',
  },
  {
    id: 'metrics',
    label: 'Mood, clarity & fog',
    description: 'Resets mood colour and sliders to defaults for days in range.',
  },
  {
    id: 'notes',
    label: 'One-word notes',
    description: 'Clears note text only.',
  },
]

export function isEntryEmpty(entry) {
  const hasSymptoms = Array.isArray(entry?.symptoms) && entry.symptoms.length > 0
  const hasNote = Boolean(entry?.note?.trim())
  const hasCustomEmoji = entry?.emoji && entry.emoji !== '🫥'
  return !hasSymptoms && !hasNote && !hasCustomEmoji
}

export function isDateInRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate
}

export function previewDeletion(entries, startDate, endDate, scopes) {
  if (!startDate || !endDate || startDate > endDate || scopes.length === 0) {
    return { affectedDays: 0, summary: 'Choose a valid range and at least one data type.' }
  }

  const inRange = (date) => isDateInRange(date, startDate, endDate)
  const rangedEntries = entries.filter((entry) => inRange(entry.date))

  if (scopes.includes('entries')) {
    return {
      affectedDays: rangedEntries.length,
      summary:
        rangedEntries.length === 0
          ? 'No logged days in this range.'
          : `Permanently removes ${rangedEntries.length} full day record${
              rangedEntries.length === 1 ? '' : 's'
            }.`,
    }
  }

  let affected = 0
  for (const entry of rangedEntries) {
    let touched = false
    if (scopes.includes('symptoms') && (entry.symptoms?.length > 0 || entry.emoji !== '🫥')) {
      touched = true
    }
    if (
      scopes.includes('metrics') &&
      (entry.color !== DEFAULT_COLOR ||
        Number(entry.estrogen) !== 0.7 ||
        Number(entry.fog ?? 0.4) !== 0.4)
    ) {
      touched = true
    }
    if (scopes.includes('notes') && entry.note?.trim()) {
      touched = true
    }
    if (touched) affected += 1
  }

  return {
    affectedDays: affected,
    summary:
      affected === 0
        ? 'Nothing to remove for the selected types in this range.'
        : `Clears selected data on ${affected} day${affected === 1 ? '' : 's'}. Empty days are removed.`,
  }
}

export function applyDeletion(entries, startDate, endDate, scopes, defaultDraftForDate) {
  if (!startDate || !endDate || startDate > endDate || scopes.length === 0) {
    return { entries, removedCount: 0 }
  }

  const inRange = (date) => isDateInRange(date, startDate, endDate)
  let removedCount = 0

  if (scopes.includes('entries')) {
    const next = entries.filter((entry) => {
      if (inRange(entry.date)) {
        removedCount += 1
        return false
      }
      return true
    })
    return { entries: next, removedCount }
  }

  const next = entries
    .map((entry) => {
      if (!inRange(entry.date)) {
        return entry
      }

      let nextEntry = { ...entry }
      let touched = false

      if (scopes.includes('symptoms')) {
        nextEntry.symptoms = []
        nextEntry.emoji = '🫥'
        touched = true
      }
      if (scopes.includes('metrics')) {
        const defaults = defaultDraftForDate(entry.date)
        nextEntry.color = defaults.color
        nextEntry.estrogen = defaults.estrogen
        nextEntry.fog = defaults.fog
        touched = true
      }
      if (scopes.includes('notes')) {
        nextEntry.note = ''
        touched = true
      }

      if (touched) {
        removedCount += 1
      }
      return nextEntry
    })
    .filter((entry) => !inRange(entry.date) || !isEntryEmpty(entry))

  return { entries: next, removedCount }
}
