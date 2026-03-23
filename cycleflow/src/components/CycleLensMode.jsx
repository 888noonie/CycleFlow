import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getCycleDay, getSymptomsText } from '../utils/cycle'

function CycleLensMode({ entries, cycleStartDate }) {
  const buckets = useMemo(() => {
    const map = new Map(Array.from({ length: 28 }, (_, i) => [i + 1, []]))
    for (const entry of entries) {
      const day = getCycleDay(entry.date, cycleStartDate)
      if (day) {
        map.get(day).push(entry)
      }
    }
    return map
  }, [entries, cycleStartDate])

  const stats = useMemo(
    () =>
      Array.from({ length: 28 }, (_, idx) => {
        const day = idx + 1
        const dayEntries = buckets.get(day) ?? []
        const avgClarity =
          dayEntries.length === 0
            ? null
            : Math.round(
                (dayEntries.reduce((sum, entry) => sum + (Number(entry.estrogen) || 0), 0) /
                  dayEntries.length) *
                  100
              )
        return { day, count: dayEntries.length, avgClarity }
      }),
    [buckets]
  )

  const hotspots = useMemo(
    () =>
      [...stats]
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count || a.day - b.day)
        .slice(0, 3),
    [stats]
  )

  const [selectedDay, setSelectedDay] = useState(hotspots[0]?.day ?? 1)
  const selectedEntries = buckets.get(selectedDay) ?? []
  const maxCount = Math.max(...stats.map((item) => item.count), 1)

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Cycle Lens mode</h2>
      <p className="mt-1 text-xs text-gray-500">
        See repeated patterns by cycle day across multiple months.
      </p>

      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-semibold text-gray-700">Hotspot days</p>
        {hotspots.length === 0 ? (
          <p className="mt-1 text-xs text-gray-600">Save a few entries to reveal hotspots.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {hotspots.map((item) => (
              <button
                key={`hotspot-${item.day}`}
                type="button"
                onClick={() => setSelectedDay(item.day)}
                className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800"
              >
                Day {item.day} ({item.count} logs, {item.avgClarity ?? '-'}% clarity)
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {stats.map((item) => {
          const intensity = item.count / maxCount
          const bg =
            item.count === 0 ? '#f3f4f6' : `color-mix(in oklab, #0f766e ${20 + intensity * 65}%, white)`
          return (
            <button
              key={`lens-${item.day}`}
              type="button"
              onClick={() => setSelectedDay(item.day)}
              className={`rounded-md border px-1 py-2 text-[11px] font-semibold ${
                selectedDay === item.day ? 'border-gray-900' : 'border-gray-200'
              }`}
              style={{ backgroundColor: bg }}
              title={`Day ${item.day}: ${item.count} logs`}
            >
              {item.day}
              <span className="block text-[10px] font-normal">{item.count}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
        <p className="font-semibold text-gray-800">Day {selectedDay} details</p>
        {selectedEntries.length === 0 ? (
          <p className="mt-1 text-gray-600">No entries logged on this cycle day yet.</p>
        ) : (
          <ul className="mt-1 space-y-1">
            {selectedEntries
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <li key={`lens-entry-${entry.id}`}>
                  {format(parseISO(entry.date), 'dd/MM/yyyy EEE')} | {getSymptomsText(entry)}
                  {entry.note ? ` | "${entry.note}"` : ''}
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default CycleLensMode
