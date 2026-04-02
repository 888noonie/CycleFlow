import { getDayOfYear } from 'date-fns'

/** Mix independent parts so the same calendar day maps to a stable, varied line year to year. */
const OPEN = [
  'Gentle consistency beats intensity.',
  'Small logs add up to real clarity.',
  'You do not have to fix everything today.',
  'One honest line in the log is enough.',
  'Patterns emerge when you show up softly.',
  'Rest is part of the data, not failure.',
  'Curiosity about your body beats judgment.',
  'Tracking is a kindness to future-you.',
  'You are allowed to have uneven days.',
  'Notice without grading yourself.',
  'Soft effort still counts as effort.',
  'Your nervous system is doing its best.',
  'Hydration and sleep are silent heroes.',
  'Name the feeling; you do not have to solve it.',
  'Progress can look like showing up.',
  'You deserve tools that feel safe.',
  'Symptoms are signals, not character flaws.',
  'Let the timeline hold what your memory cannot.',
  'Breath first, then the next tiny step.',
  'You are not behind; you are in motion.',
]

const MID = [
  'Log a little today',
  'Note one symptom honestly',
  'Capture mood in a single tap',
  'Add clarity even if the day was loud',
  'Write a short note if words help',
  'Stack emojis that match reality',
  'Let the sliders reflect how you feel',
  'Save even when the day felt messy',
  'Trust the next entry over perfection',
  'Pick the color that fits, not the ideal',
  'Track fog without debating it',
  'Mark hydration if you remember',
  'Honor pain without dramatizing it',
  'Record sleep honestly, not heroically',
  'Let the map surprise you later',
  'Keep the streak of truth, not guilt',
  'Choose one signal to notice today',
  'Stay curious about the pattern',
  'Let today be data, not a verdict',
  'Give your body credit for adapting',
]

const CLOSE = [
  'Let patterns tell the story.',
  'The chart will meet you where you are.',
  'Tomorrow reads today more kindly.',
  'Small dots become a line you can trust.',
  'You are building evidence, not a report card.',
  'Consistency is quieter than motivation.',
  'The timeline remembers when you forget.',
  'Soft data still counts as data.',
  'You are allowed to revise tomorrow.',
  'Grace is compatible with tracking.',
  'Let the export be for you first.',
  'Curiosity keeps the app on your side.',
  'One week of truth beats a month of guessing.',
  'You are doing something brave by noticing.',
  'Let the cycle map be a mirror, not a judge.',
  'Patterns need patience, not pressure.',
  'Your log is a conversation, not a trial.',
  'Keep going; the lens sharpens with time.',
  'You matter beyond the metrics.',
  'Let the next save be an act of care.',
]

const PRIME = 7919

/**
 * Returns a stable message for the given calendar day (same all day; changes by day of year).
 * Combines ~8k unique-ish sentences from 20×20×20 parts.
 */
export function getDailyAffirmation(date = new Date()) {
  const doy = getDayOfYear(date)
  const y = date.getFullYear()
  const n = OPEN.length * MID.length * CLOSE.length
  const idx = (doy * PRIME + y * 13) % n
  const i = idx % OPEN.length
  const j = Math.floor(idx / OPEN.length) % MID.length
  const k = Math.floor(idx / (OPEN.length * MID.length)) % CLOSE.length
  return `${OPEN[i]} ${MID[j]} — ${CLOSE[k]}`
}
