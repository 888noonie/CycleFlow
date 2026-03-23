import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'

function SummaryView({ entries, activeDate, onSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(null)

  const entriesByDate = useMemo(
    () => new Map(entries.map((entry) => [entry.date, entry])),
    [entries]
  )

  const days = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const date = subDays(new Date(), 29 - index)
        const key = format(date, 'yyyy-MM-dd')
        return { key, date, entry: entriesByDate.get(key) }
      }),
    [entriesByDate]
  )

  const selectedEntry = selectedDate ? entriesByDate.get(selectedDate) : null
  const last7 = days.slice(-7).map((day) => day.entry).filter(Boolean)
  const avgClarity =
    last7.length > 0
      ? Math.round(
          (last7.reduce((total, entry) => total + entry.estrogen, 0) / last7.length) * 100
        )
      : null

  const symptomLine = (entry) => {
    if (Array.isArray(entry?.symptoms) && entry.symptoms.length > 0) {
      return entry.symptoms.join('')
    }
    return entry?.emoji ?? '....'
  }

  return (
    <section className="smooth-card space-y-4 rounded-[2rem] p-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">30-day summary</h2>
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Tap a day to see details.</p>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:gap-3 rounded-2xl bg-gray-50/50 p-3 shadow-inner ring-1 ring-gray-900/5 dark:bg-black/20 dark:ring-white/10">
        {days.map((day) => {
          const isSelected = selectedDate === day.key
          const isDraft = activeDate === day.key
          const hasEntry = !!day.entry
          
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => {
                setSelectedDate(day.key)
                onSelectDate(day.key)
              }}
              className={`flex aspect-square items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-90 ${
                isSelected || isDraft
                  ? 'ring-2 ring-gray-900 ring-offset-1 scale-105 shadow-md dark:ring-gray-100 dark:ring-offset-gray-900'
                  : 'ring-1 ring-black/5 hover:scale-105 hover:shadow-sm dark:ring-white/10'
              } ${hasEntry ? 'text-gray-900' : 'text-gray-500 dark:text-gray-400'}`}
              style={{ backgroundColor: day.entry?.color ?? 'var(--card-bg)' }}
              title={format(day.date, 'MMM d')}
              aria-label={`Summary day ${format(day.date, 'MMM d')}`}
            >
              {format(day.date, 'd')}
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300">
        {selectedDate && selectedEntry ? (
          <div className="space-y-1">
            <p className="font-semibold">{selectedEntry.date}</p>
            <p className="text-lg tracking-widest">{symptomLine(selectedEntry)}</p>
            <p className="text-gray-500 dark:text-gray-400">
              {Math.round(selectedEntry.estrogen * 100)}% clarity
              {selectedEntry.note ? ` | "${selectedEntry.note}"` : ''}
            </p>
          </div>
        ) : selectedDate ? (
          <p className="font-medium">{selectedDate}: no entry saved.</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Select a day in the grid for details.</p>
        )}
      </div>

      <div className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Logged days (30d)</span>
          <span className="text-gray-900 dark:text-gray-100">{days.filter((day) => day.entry).length}/30</span>
        </div>
        <div className="flex justify-between">
          <span>Avg clarity (7d)</span>
          <span className="text-gray-900 dark:text-gray-100">{avgClarity === null ? 'No data yet' : `${avgClarity}%`}</span>
        </div>
      </div>
    </section>
  )
}

export default SummaryView
