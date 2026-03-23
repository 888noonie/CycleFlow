import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getCycleDay, getSymptomsText } from '../utils/cycle'

function CycleLensMode({ entries, cycleStartDate }) {
  const buckets = useMemo(() => {
    const map = new Map(Array.from({ length: 28 }, (_, i) => [i + 1, []]))
    for (const entry of entries) {
      const day = getCycleDay(entry.date, cycleStartDate)
      if (day) {
        if (!map.has(day)) map.set(day, [])
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
    <section className="smooth-card space-y-4 rounded-[2rem] p-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Cycle Lens mode</h2>
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          See repeated patterns by cycle day across multiple months.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200/50 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10">
        <p className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">Hotspot days</p>
        {hotspots.length === 0 ? (
          <p className="mt-2 text-sm font-medium text-amber-800/70 dark:text-amber-300/60">Save a few entries to reveal hotspots.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {hotspots.map((item) => (
              <button
                key={`hotspot-${item.day}`}
                type="button"
                onClick={() => setSelectedDay(item.day)}
                className="rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm transition-all active:scale-95 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-100"
              >
                Day {item.day} ({item.count} logs, {item.avgClarity ?? '-'}% clarity)
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2 rounded-2xl bg-gray-50/50 p-3 shadow-inner ring-1 ring-gray-900/5 dark:bg-black/20 dark:ring-white/10">
        {stats.map((item) => {
          const intensity = item.count / maxCount
          const isSelected = selectedDay === item.day
          const hasData = item.count > 0
          
          // Using a color mix that works in both light and dark
          const baseColor = hasData ? '#0f766e' : 'transparent'
          
          return (
            <button
              key={`lens-${item.day}`}
              type="button"
              onClick={() => setSelectedDay(item.day)}
              className={`flex flex-col items-center justify-center rounded-xl py-2 transition-all active:scale-90 ${
                isSelected
                  ? 'ring-2 ring-gray-900 ring-offset-1 z-10 scale-110 shadow-md dark:ring-gray-100 dark:ring-offset-gray-900'
                  : 'ring-1 ring-black/5 hover:scale-105 dark:ring-white/5'
              } ${hasData ? 'text-white' : 'text-gray-400 dark:text-gray-600'}`}
              style={{ 
                backgroundColor: hasData 
                  ? `color-mix(in srgb, ${baseColor} ${20 + intensity * 80}%, ${isSelected ? '#14b8a6' : '#f3f4f6'})` 
                  : 'var(--card-bg)' 
              }}
              title={`Day ${item.day}: ${item.count} logs`}
            >
              <span className="text-xs font-bold">{item.day}</span>
              <span className="text-[10px] font-medium opacity-80">{item.count}</span>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300">
        <p className="font-bold text-gray-900 dark:text-gray-100">Day {selectedDay} details</p>
        {selectedEntries.length === 0 ? (
          <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">No entries logged on this cycle day yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {selectedEntries
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <li key={`lens-entry-${entry.id}`} className="border-l-2 border-teal-500/30 pl-3">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {format(parseISO(entry.date), 'dd/MM/yyyy EEE')}
                  </p>
                  <p className="text-lg tracking-widest my-1">{getSymptomsText(entry)}</p>
                  {entry.note && (
                    <p className="italic text-gray-500 dark:text-gray-400">"{entry.note}"</p>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default CycleLensMode
