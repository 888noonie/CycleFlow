import { useMemo, useState } from 'react'
import { addDays, format, parseISO } from 'date-fns'
import { SYMPTOM_OPTIONS, getSymptomLabel } from '../data/symptomOptions'
import { enrichEntries } from '../utils/patterns'

const OFFSETS = [-3, -2, -1, 0, 1, 2, 3]

function dateKeyFromOffset(date, offset) {
  return format(addDays(parseISO(date), offset), 'yyyy-MM-dd')
}

function offsetLabel(offset) {
  if (offset === 0) return 'trigger day'
  if (offset < 0) return `${Math.abs(offset)}d before`
  return `${offset}d after`
}

function summarizeOffset(days, selectedSymptom) {
  if (days.length === 0) {
    return {
      averageScore: null,
      lowRate: null,
      topSymptoms: [],
    }
  }

  const counts = new Map()
  let scoreTotal = 0
  let lowDays = 0

  days.forEach((day) => {
    scoreTotal += day.functionScore
    if (day.functionScore < 60) {
      lowDays += 1
    }
    day.symptoms.forEach((symptom) => {
      if (symptom === selectedSymptom) {
        return
      }
      counts.set(symptom, (counts.get(symptom) ?? 0) + 1)
    })
  })

  return {
    averageScore: Math.round(scoreTotal / days.length),
    lowRate: Math.round((lowDays / days.length) * 100),
    topSymptoms: [...counts.entries()]
      .map(([symptom, count]) => ({
        symptom,
        label: getSymptomLabel(symptom),
        count,
        rate: Math.round((count / days.length) * 100),
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 4),
  }
}

function getDayChip(day) {
  if (!day) {
    return { text: 'No log', tone: 'empty' }
  }
  const firstSymptoms = day.symptoms.slice(0, 3).join('') || '....'
  return {
    text: `${Math.round(day.functionScore)} ${firstSymptoms}`,
    tone: day.functionScore < 60 ? 'low' : 'ok',
  }
}

function CorrelationLab({ entries, cycleStartDate, onSelectDate }) {
  const [selectedSymptom, setSelectedSymptom] = useState('🎨')
  const points = useMemo(
    () => enrichEntries(entries, cycleStartDate),
    [entries, cycleStartDate]
  )
  const dateMap = useMemo(
    () => new Map(points.map((point) => [point.date, point])),
    [points]
  )
  const availableSymptoms = useMemo(() => {
    const counts = new Map()
    points.forEach((point) => {
      new Set(point.symptoms).forEach((symptom) => {
        counts.set(symptom, (counts.get(symptom) ?? 0) + 1)
      })
    })

    return SYMPTOM_OPTIONS.map((option) => ({
      ...option,
      count: counts.get(option.emoji) ?? 0,
    })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  }, [points])

  const triggerDays = useMemo(
    () => points.filter((point) => point.symptoms.includes(selectedSymptom)),
    [points, selectedSymptom]
  )

  const offsetStats = useMemo(
    () =>
      OFFSETS.map((offset) => {
        const matchedDays = triggerDays
          .map((day) => dateMap.get(dateKeyFromOffset(day.date, offset)))
          .filter(Boolean)
        return {
          offset,
          days: matchedDays,
          ...summarizeOffset(matchedDays, selectedSymptom),
        }
      }),
    [dateMap, selectedSymptom, triggerDays]
  )

  const occurrenceRows = useMemo(
    () =>
      triggerDays.map((day) => ({
        day,
        window: OFFSETS.map((offset) => ({
          offset,
          entry: dateMap.get(dateKeyFromOffset(day.date, offset)),
        })),
      })),
    [dateMap, triggerDays]
  )

  const strongestBefore = offsetStats
    .filter((item) => item.offset < 0 && item.days.length > 0)
    .sort((a, b) => a.averageScore - b.averageScore)[0]
  const strongestAfter = offsetStats
    .filter((item) => item.offset > 0 && item.days.length > 0)
    .sort((a, b) => a.averageScore - b.averageScore)[0]

  if (points.length === 0) {
    return (
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Load demo data or save entries, then pick a symptom to inspect the 3 days before and after
        it.
      </p>
    )
  }

  return (
    <div className="space-y-4">

      <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-gray-50/60 p-2 shadow-inner dark:border-white/10 dark:bg-black/20">
        <div className="flex min-w-max gap-2">
          {availableSymptoms.map((option) => {
            const isSelected = selectedSymptom === option.emoji
            return (
              <button
                key={option.emoji}
                type="button"
                onClick={() => setSelectedSymptom(option.emoji)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-black transition active:scale-95 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                    : 'border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200'
                }`}
                title={option.label}
              >
                <span className="block text-lg leading-none">{option.emoji}</span>
                <span className="mt-1 block max-w-24 truncate">{option.label}</span>
                <span className="mt-0.5 block font-mono text-[10px] opacity-70">
                  {option.count}x
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/60 bg-gray-50/60 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
            Selected
          </p>
          <p className="mt-1 text-lg font-black text-gray-900 dark:text-gray-100">
            {selectedSymptom} {getSymptomLabel(selectedSymptom)}
          </p>
          <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
            seen {triggerDays.length} time{triggerDays.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="rounded-2xl border border-red-200/60 bg-red-50/70 p-4 dark:border-red-900/30 dark:bg-red-950/20">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-900/60 dark:text-red-100/70">
            Lowest before
          </p>
          <p className="mt-1 text-lg font-black text-red-950 dark:text-red-100">
            {strongestBefore ? offsetLabel(strongestBefore.offset) : '-'}
          </p>
          <p className="mt-1 text-xs font-bold text-red-900/60 dark:text-red-100/60">
            {strongestBefore ? `avg ${strongestBefore.averageScore}` : 'needs adjacent logs'}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/70 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-900/60 dark:text-indigo-100/70">
            Lowest after
          </p>
          <p className="mt-1 text-lg font-black text-indigo-950 dark:text-indigo-100">
            {strongestAfter ? offsetLabel(strongestAfter.offset) : '-'}
          </p>
          <p className="mt-1 text-xs font-bold text-indigo-900/60 dark:text-indigo-100/60">
            {strongestAfter ? `avg ${strongestAfter.averageScore}` : 'needs adjacent logs'}
          </p>
        </div>
      </div>

      {triggerDays.length === 0 ? (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/70 p-4 text-sm font-semibold text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-100">
          No saved entries contain {selectedSymptom} {getSymptomLabel(selectedSymptom)} yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white/70 p-3 shadow-inner dark:border-white/10 dark:bg-black/20">
            <div className="grid min-w-[760px] grid-cols-7 gap-2">
              {offsetStats.map((item) => (
                <div
                  key={`offset-${item.offset}`}
                  className={`rounded-xl border p-3 ${
                    item.offset === 0
                      ? 'border-teal-200 bg-teal-50 dark:border-teal-900/30 dark:bg-teal-950/25'
                      : 'border-gray-200 bg-gray-50/70 dark:border-white/10 dark:bg-white/5'
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                    {offsetLabel(item.offset)}
                  </p>
                  <p className="mt-2 text-2xl font-black text-gray-900 dark:text-gray-100">
                    {item.averageScore ?? '-'}
                  </p>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    {item.days.length} logs · low {item.lowRate ?? '-'}%
                  </p>
                  <div className="mt-3 space-y-1">
                    {item.topSymptoms.length === 0 ? (
                      <p className="text-[11px] font-semibold text-gray-400">No paired signal</p>
                    ) : (
                      item.topSymptoms.map((symptom) => (
                        <p
                          key={`${item.offset}-${symptom.symptom}`}
                          className="truncate text-[11px] font-bold text-gray-700 dark:text-gray-300"
                          title={symptom.label}
                        >
                          {symptom.symptom} {symptom.rate}%
                        </p>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Occurrence windows
            </h3>
            <div className="space-y-2 overflow-x-auto">
              {occurrenceRows.map((row) => (
                <div
                  key={`occurrence-${row.day.date}`}
                  className="grid min-w-[760px] items-center gap-2"
                  style={{ gridTemplateColumns: '78px repeat(7, minmax(82px, 1fr))' }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectDate?.(row.day.date)}
                    className="rounded-lg bg-white px-2 py-2 text-left text-[11px] font-black text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-black/20 dark:text-gray-200 dark:ring-white/10"
                  >
                    {format(parseISO(row.day.date), 'dd MMM')}
                  </button>
                  {row.window.map(({ offset, entry }) => {
                    const chip = getDayChip(entry)
                    return (
                      <button
                        key={`${row.day.date}-${offset}`}
                        type="button"
                        onClick={() => entry && onSelectDate?.(entry.date)}
                        className={`rounded-lg px-2 py-2 text-left text-[11px] font-bold ${
                          chip.tone === 'empty'
                            ? 'bg-gray-200/60 text-gray-400 dark:bg-white/10'
                            : chip.tone === 'low'
                              ? 'bg-red-100 text-red-950 dark:bg-red-950/35 dark:text-red-100'
                              : 'bg-teal-100 text-teal-950 dark:bg-teal-950/35 dark:text-teal-100'
                        }`}
                        title={entry ? `${entry.date}: ${entry.symptoms.join('')}` : 'No log'}
                      >
                        <span className="block text-[10px] uppercase opacity-60">
                          {offsetLabel(offset)}
                        </span>
                        <span className="block truncate">{chip.text}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="px-1 text-[11px] font-medium leading-relaxed text-gray-400 dark:text-gray-500">
        Reads calendar days, not just adjacent rows. Missing days are shown as no log so gaps do
        not masquerade as correlations.
      </p>
    </div>
  )
}

export default CorrelationLab
