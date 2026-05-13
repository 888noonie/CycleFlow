import { differenceInCalendarDays, parseISO } from 'date-fns'
import { getCycleDay } from './cycle'
import { getSymptomLabel } from '../data/symptomOptions'

const SYMPTOM_WEIGHTS = new Map([
  ['⚰️', 30],
  ['🪓', 26],
  ['👽', 22],
  ['🫩', 20],
  ['🌫️', 18],
  ['🤹🏼', 16],
  ['💀', 15],
  ['🧠', 15],
  ['🤬', 14],
  ['🥺', 13],
  ['⚡️', 11],
  ['💦', 10],
  ['⏰', 9],
  ['😑', 8],
  ['🥤', 7],
  ['🍩', 6],
  ['🎨', 5],
  ['🩸', 4],
  ['💡', 3],
  ['🫥', 0],
  ['🏆', -18],
  ['🪩', -18],
  ['🧘🏼‍♀️', -16],
  ['🛼', -14],
])

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value))

export function getEntrySymptoms(entry) {
  if (Array.isArray(entry?.symptoms)) {
    return entry.symptoms
  }
  if (entry?.emoji) {
    return [entry.emoji]
  }
  return []
}

export function scoreEntry(entry) {
  const symptoms = getEntrySymptoms(entry)
  const rawStack = symptoms.reduce(
    (sum, symptom) => sum + (SYMPTOM_WEIGHTS.get(symptom) ?? 8),
    0
  )
  const negativeCount = symptoms.filter((symptom) => (SYMPTOM_WEIGHTS.get(symptom) ?? 8) > 0).length
  const averageStackLoad = negativeCount
    ? clamp((rawStack / negativeCount / 22) * 100)
    : clamp(rawStack)
  const stackDensity = clamp(Math.max(0, symptoms.length - 2) * 11)
  const stackLoad = clamp(averageStackLoad * 0.7 + stackDensity * 0.3)
  const fogLoad = clamp(Number(entry?.fog ?? 0) * 100)
  const clarityLoad = clamp((1 - Number(entry?.estrogen ?? 0.7)) * 100)
  const symptomLoad = clamp(stackLoad * 0.55 + fogLoad * 0.35 + clarityLoad * 0.1)
  const functionScore = clamp(100 - symptomLoad)

  return {
    averageStackLoad,
    stackDensity,
    symptomLoad,
    functionScore,
  }
}

export function enrichEntries(entries, cycleStartDate) {
  const ascending = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  return ascending.map((entry, index) => {
    const scored = scoreEntry(entry)
    const previous = ascending[index - 1]
    const previousScore = previous ? scoreEntry(previous).functionScore : null
    return {
      ...entry,
      ...scored,
      symptoms: getEntrySymptoms(entry),
      cycleDay: cycleStartDate ? getCycleDay(entry.date, cycleStartDate) : null,
      dayIndex: index,
      delta: previousScore === null ? 0 : scored.functionScore - previousScore,
    }
  })
}

export function rollingAverage(points, windowSize = 3) {
  return points.map((point, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2))
    const end = Math.min(points.length, index + Math.ceil(windowSize / 2))
    const window = points.slice(start, end)
    const average =
      window.reduce((sum, item) => sum + item.functionScore, 0) / Math.max(1, window.length)
    return { ...point, smoothedScore: average }
  })
}

export function findLowWindows(points, threshold = 55) {
  const windows = []
  let current = null

  for (const point of points) {
    if (point.functionScore < threshold) {
      if (!current) {
        current = { start: point, end: point, points: [point] }
      } else {
        current.end = point
        current.points.push(point)
      }
      continue
    }

    if (current) {
      windows.push(current)
      current = null
    }
  }

  if (current) {
    windows.push(current)
  }

  return windows.map((window) => ({
    ...window,
    lowest: window.points.reduce((lowest, point) =>
      point.functionScore < lowest.functionScore ? point : lowest
    ),
  }))
}

export function summarizeSignals(points) {
  const bySymptom = new Map()

  points.forEach((point, index) => {
    point.symptoms.forEach((symptom) => {
      const item = bySymptom.get(symptom) ?? {
        symptom,
        label: getSymptomLabel(symptom),
        count: 0,
        scoreTotal: 0,
        lowDays: 0,
        nextDayDrops: 0,
      }

      item.count += 1
      item.scoreTotal += point.functionScore
      if (point.functionScore < 60) {
        item.lowDays += 1
      }

      const next = points[index + 1]
      if (next && next.functionScore <= point.functionScore - 15) {
        item.nextDayDrops += 1
      }

      bySymptom.set(symptom, item)
    })
  })

  const rows = [...bySymptom.values()].map((item) => ({
    ...item,
    averageScore: Math.round(item.scoreTotal / item.count),
    lowRate: Math.round((item.lowDays / item.count) * 100),
    dropRate: Math.round((item.nextDayDrops / item.count) * 100),
  }))

  return {
    lowSignals: [...rows]
      .filter((item) => item.count >= 2)
      .sort((a, b) => a.averageScore - b.averageScore || b.lowRate - a.lowRate),
    stabilizers: [...rows]
      .filter((item) => item.count >= 2)
      .sort((a, b) => b.averageScore - a.averageScore || a.lowRate - b.lowRate),
    repeated: [...rows].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
  }
}

export function summarizeCycleHotspots(points) {
  const byCycleDay = new Map()

  points.forEach((point) => {
    if (!point.cycleDay) {
      return
    }
    const item = byCycleDay.get(point.cycleDay) ?? {
      day: point.cycleDay,
      count: 0,
      scoreTotal: 0,
      lowDays: 0,
    }
    item.count += 1
    item.scoreTotal += point.functionScore
    if (point.functionScore < 60) {
      item.lowDays += 1
    }
    byCycleDay.set(point.cycleDay, item)
  })

  return [...byCycleDay.values()]
    .map((item) => ({
      ...item,
      averageScore: Math.round(item.scoreTotal / item.count),
      lowRate: Math.round((item.lowDays / item.count) * 100),
    }))
    .filter((item) => item.count >= 1)
    .sort((a, b) => a.averageScore - b.averageScore || b.count - a.count)
    .slice(0, 5)
}

export function daysBetween(startDate, endDate) {
  try {
    return differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1
  } catch {
    return 0
  }
}
