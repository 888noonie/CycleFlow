function normalizeSymptoms(entry) {
  if (Array.isArray(entry?.symptoms)) return entry.symptoms
  if (entry?.emoji) return [entry.emoji]
  return []
}

function draftSignature(draft) {
  return JSON.stringify({
    symptoms: normalizeSymptoms(draft),
    color: draft.color,
    estrogen: Number(draft.estrogen ?? 0),
    fog: Number(draft.fog ?? 0),
    note: draft.note ?? '',
    emoji: draft.emoji ?? '🫥',
  })
}

function entrySignature(entry) {
  return JSON.stringify({
    symptoms: normalizeSymptoms(entry),
    color: entry.color,
    estrogen: Number(entry.estrogen ?? 0),
    fog: Number(entry.fog ?? 0),
    note: entry.note ?? '',
    emoji: entry.emoji ?? '🫥',
  })
}

export function hasUnsavedDraftChanges(draft, entries, activeDate) {
  const saved = entries.find((entry) => entry.date === activeDate)
  if (!saved) {
    const symptoms = normalizeSymptoms(draft)
    return (
      symptoms.length > 0 ||
      Boolean(draft.note?.trim()) ||
      draft.emoji !== '🫥' ||
      Number(draft.fog ?? 0) !== 0.4
    )
  }
  return draftSignature(draft) !== entrySignature(saved)
}
