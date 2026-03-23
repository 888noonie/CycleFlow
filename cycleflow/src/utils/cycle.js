import { differenceInCalendarDays, parseISO } from 'date-fns'

export const CYCLE_LENGTH = 28

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
