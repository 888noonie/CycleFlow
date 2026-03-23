import { differenceInCalendarDays, parseISO } from 'date-fns'

export const CYCLE_LENGTH = 28
export const LATE_LUTEAL_DAYS = [23, 24, 25, 26, 27, 28]

export function getCycleDay(dateKey, cycleStartDate) {
  try {
    const diff = differenceInCalendarDays(parseISO(dateKey), parseISO(cycleStartDate))
    return ((diff % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH + 1
  } catch {
    return null
  }
}

export function getSymptomsText(entry) {
  if (Array.isArray(entry?.symptoms) && entry.symptoms.length > 0) {
    return entry.symptoms.join('')
  }
  return entry?.emoji ?? '....'
}

// Rough template for expected vulnerability over a 28-day cycle.
function expectedLoadByCycleDay(day) {
  if (day >= 1 && day <= 5) {
    return 0.55
  }
  if (day >= 6 && day <= 12) {
    return 0.25
  }
  if (day >= 13 && day <= 15) {
    return 0.35
  }
  if (day >= 16 && day <= 21) {
    return 0.45
  }
  return 0.85
}

export function symptomLoad(entry) {
  const symptomCount = Array.isArray(entry?.symptoms) ? entry.symptoms.length : entry?.emoji ? 1 : 0
  const normalizedCount = Math.min(1, symptomCount / 8)
  const lowClarityWeight = 1 - (Number(entry?.estrogen) || 0)
  const fogWeight = Number(entry?.fog ?? 0)
  return Math.max(0, Math.min(1, normalizedCount * 0.45 + lowClarityWeight * 0.35 + fogWeight * 0.2))
}

// Finds the cycle start date offset that best matches current symptom trajectory.
export function inferCycleStartDate(entries, currentCycleStartDate) {
  if (!currentCycleStartDate || entries.length < 5) {
    return { suggestedCycleStartDate: currentCycleStartDate, confidence: 0, score: 0 }
  }

  const baseDate = parseISO(currentCycleStartDate)
  let best = { offset: 0, score: Number.NEGATIVE_INFINITY }

  for (let offset = 0; offset < CYCLE_LENGTH; offset += 1) {
    let score = 0

    for (const entry of entries) {
      const day = getCycleDay(entry.date, currentCycleStartDate)
      if (!day) {
        continue
      }
      const shiftedDay = ((day - 1 + offset) % CYCLE_LENGTH) + 1
      const observed = symptomLoad(entry)
      const expected = expectedLoadByCycleDay(shiftedDay)
      score += 1 - Math.abs(observed - expected)
    }

    if (score > best.score) {
      best = { offset, score }
    }
  }

  const suggested = new Date(baseDate)
  suggested.setDate(suggested.getDate() - best.offset)

  const normalizedConfidence = Math.max(0, Math.min(1, best.score / Math.max(1, entries.length)))
  return {
    suggestedCycleStartDate: suggested.toISOString().slice(0, 10),
    confidence: Math.round(normalizedConfidence * 100),
    score: best.score,
  }
}
