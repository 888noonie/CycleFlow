import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'

function SummaryView({ entries }) {
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
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">30-day summary</h2>
      <p className="mt-1 text-xs text-gray-500">Tap a day to see details.</p>

      <div className="mt-3 grid grid-cols-6 gap-2">
        {days.map((day) => {
          const isSelected = selectedDate === day.key
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDate(day.key)}
              className={`h-9 rounded-md border text-[10px] font-medium transition ${
                isSelected ? 'border-gray-900' : 'border-gray-200'
              }`}
              style={{ backgroundColor: day.entry?.color ?? '#f3f4f6' }}
              title={format(day.date, 'MMM d')}
              aria-label={`Summary day ${format(day.date, 'MMM d')}`}
            >
              {format(day.date, 'd')}
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
        {selectedDate && selectedEntry ? (
          <p>
            {selectedEntry.date}: {symptomLine(selectedEntry)} |{' '}
            {Math.round(selectedEntry.estrogen * 100)}% clarity
            {selectedEntry.note ? ` | "${selectedEntry.note}"` : ''}
          </p>
        ) : selectedDate ? (
          <p>{selectedDate}: no entry saved.</p>
        ) : (
          <p>Select a day in the grid for details.</p>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-600">
        <p>Logged days (30d): {days.filter((day) => day.entry).length}/30</p>
        <p>Avg clarity (7d): {avgClarity === null ? 'No data yet' : `${avgClarity}%`}</p>
      </div>
    </section>
  )
}

export default SummaryView
