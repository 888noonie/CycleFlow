/** Single source of truth for symptom emoji ↔ label (picker, legend, export, tooltips). */
export const SYMPTOM_OPTIONS = [
  { emoji: '🧠', label: 'Headache' },
  { emoji: '🪓', label: 'Migraine' },
  { emoji: '💦', label: 'Night sweats' },
  { emoji: '🩸', label: 'Blood Present' },
  { emoji: '⚡️', label: 'Back pain' },
  { emoji: '🌫️', label: 'Low mood' },
  { emoji: '🥺', label: 'Anxiety' },
  { emoji: '🤬', label: 'Anger' },
  { emoji: '🫩', label: 'Brain fog' },
  { emoji: '😑', label: 'Puffy Face' },
  { emoji: '👽', label: 'Sleep paralysis' },
  { emoji: '💀', label: 'Sleep++' },
  { emoji: '🥤', label: 'Thirst' },
  { emoji: '🍩', label: 'Food++' },
  { emoji: '🎨', label: 'Crazy dream' },
  { emoji: '🏆', label: 'Back in the game' },
  { emoji: '🤹🏼', label: 'Chaotic' },
  { emoji: '⚰️', label: 'Kill me now' },
  { emoji: '🪩', label: 'Feeling fab' },
  { emoji: '🧘🏼‍♀️', label: 'Calm' },
  { emoji: '🛼', label: 'Energetic' },
  { emoji: '🫥', label: 'Normal / meh' },
  { emoji: '⏰', label: 'Late start' },
  { emoji: '💡', label: 'Extra amfexa' },
]

const labelByEmoji = new Map(SYMPTOM_OPTIONS.map((o) => [o.emoji, o.label]))

export function getSymptomLabel(emoji) {
  return labelByEmoji.get(emoji) ?? 'Symptom'
}

/** Readable line for UI: "🧠 Headache · 🩸 Blood Present" */
export function getSymptomsLabeledText(entry) {
  const list = Array.isArray(entry?.symptoms) && entry.symptoms.length > 0
    ? entry.symptoms
    : entry?.emoji
      ? [entry.emoji]
      : []
  if (list.length === 0) {
    return '....'
  }
  return list.map((e) => `${e} ${getSymptomLabel(e)}`).join(' · ')
}

/** Labels only, for compact export lines: "Headache · Blood Present" */
export function getSymptomLabelsOnly(entry) {
  const list = Array.isArray(entry?.symptoms) && entry.symptoms.length > 0
    ? entry.symptoms
    : entry?.emoji
      ? [entry.emoji]
      : []
  if (list.length === 0) {
    return ''
  }
  return list.map((e) => getSymptomLabel(e)).join(' · ')
}
