import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getCycleDay, inferCycleStartDate } from '../utils/cycle'
import { getSymptomsLabeledText } from '../data/symptomOptions'

const OVULATION_DAY = 14

function buildPoints(entries, cycleStartDate) {
  return entries
    .map((entry) => {
      const day = getCycleDay(entry.date, cycleStartDate)
      if (!day) {
        return null
      }
      return {
        ...entry,
        cycleDay: day,
        symptomsLabeled: getSymptomsLabeledText(entry),
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.cycleDay - b.cycleDay)
}

function markerYFromClarity(estrogen) {
  const clarity = Math.max(0, Math.min(1, Number(estrogen) || 0))
  return 235 - clarity * 150
}

function CycleOverlayChart({ entries, cycleStartDate, onApplySuggestedCycleStart }) {
  const [selectedId, setSelectedId] = useState(null)
  const points = useMemo(
    () => buildPoints(entries, cycleStartDate),
    [entries, cycleStartDate]
  )
  const selected = points.find((point) => point.id === selectedId) ?? null
  const inferred = useMemo(
    () => inferCycleStartDate(entries, cycleStartDate),
    [entries, cycleStartDate]
  )
  const todayKey = new Date().toISOString().slice(0, 10)
  const currentCycleDay = getCycleDay(todayKey, cycleStartDate)
  const inferredTodayCycleDay = getCycleDay(todayKey, inferred.suggestedCycleStartDate)
  const activeCycleDay = inferredTodayCycleDay || currentCycleDay
  const activeX = activeCycleDay ? 25 + ((activeCycleDay - 1) / 27) * 790 : null

  return (
    <section className="smooth-card space-y-4 rounded-[2rem] p-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Cycle map with emoji overlays</h2>
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          Fixed 28-day view. Tap markers to inspect notes and symptom stacks.
        </p>
      </div>

      <div className="mt-2 overflow-x-auto rounded-[1.5rem] border border-gray-200/60 bg-white/50 p-3 shadow-inner dark:border-white/10 dark:bg-black/20">
        <svg viewBox="0 0 840 300" className="h-auto min-w-[700px] drop-shadow-sm">
          <rect x="0" y="0" width="840" height="300" fill="transparent" />
          <rect x="0" y="30" width="420" height="235" fill="rgba(99, 102, 241, 0.05)" />
          <rect x="420" y="30" width="420" height="235" fill="rgba(59, 130, 246, 0.05)" />

          <text x="120" y="24" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontSize="18" fontWeight="700">
            FOLLICULAR PHASE
          </text>
          <text x="535" y="24" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontSize="18" fontWeight="700">
            LUTEAL PHASE
          </text>

          <line x1="420" y1="30" x2="420" y2="255" stroke="#ef4444" strokeWidth="4" opacity="0.4" />
          <g transform="translate(420, 275)">
            <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#ef4444" />
            <text x="0" y="5" fill="white" fontSize="12" fontWeight="900" textAnchor="middle" className="uppercase tracking-widest">
              OVULATION
            </text>
          </g>

          {/* Estrogen-like curve */}
          <path
            d="M 20 260 C 180 250, 250 240, 300 150 C 350 65, 390 85, 420 160 C 455 240, 530 255, 610 200 C 690 145, 770 240, 830 260"
            fill="none"
            stroke="#ec4899"
            strokeWidth="4"
            opacity="0.6"
          />
          {/* LH-like spike */}
          <path
            d="M 20 260 C 260 258, 330 254, 390 110 C 420 35, 450 70, 485 170 C 520 250, 690 248, 830 260"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            opacity="0.6"
          />
          {/* Progesterone-like luteal hump */}
          <path
            d="M 20 260 C 300 260, 390 258, 450 240 C 520 220, 560 120, 620 95 C 700 65, 765 170, 830 260"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            opacity="0.6"
          />

          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
            const x = 25 + ((day - 1) / 27) * 790
            return (
              <g key={`tick-${day}`}>
                <line x1={x} y1="265" x2={x} y2="272" stroke="currentColor" className="text-gray-300 dark:text-gray-700" strokeWidth="1" />
                <text x={x - 5} y="288" fill="currentColor" className="text-gray-400 dark:text-gray-500 font-bold" fontSize="11">
                  {day}
                </text>
              </g>
            )
          })}

          {activeX && (
            <g>
              <line x1={activeX} y1="35" x2={activeX} y2="265" stroke="#7c3aed" strokeDasharray="6 4" strokeWidth="2" />
              <rect x={activeX - 25} y="38" width="50" height="20" rx="4" fill="#7c3aed" />
              <text x={activeX - 12} y="52" fill="white" fontSize="12" fontWeight="700">
                YOU
              </text>
            </g>
          )}

          {points.map((point) => {
            const x = 25 + ((point.cycleDay - 1) / 27) * 790
            const y = markerYFromClarity(point.estrogen)
            const isSelected = selectedId === point.id
            return (
              <g key={point.id} onClick={() => setSelectedId(point.id)} className="cursor-pointer group">
                <title>
                  {format(parseISO(point.date), 'dd/MM/yyyy')} · Cycle day {point.cycleDay} · {point.symptomsLabeled}
                </title>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 18 : 15}
                  fill={point.color || '#0f766e'}
                  stroke="currentColor"
                  className={`${isSelected ? 'text-gray-900 dark:text-white' : 'text-white/20 dark:text-black/20'}`}
                  strokeWidth="2"
                />
                <text x={x - 13} y={y + 6} fontSize="16" className="pointer-events-none select-none">
                  {point.emoji ?? '🫥'}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="rounded-2xl border border-indigo-200/50 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-900/10">
        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
          Best-fit cycle position: Day {activeCycleDay ?? '?'}
        </p>
        <p className="mt-1 text-xs font-medium text-indigo-800/70 dark:text-indigo-300/60">
          Model confidence: {inferred.confidence}% | Suggested start: {inferred.suggestedCycleStartDate}
        </p>
        {inferred.suggestedCycleStartDate !== cycleStartDate && (
          <button
            type="button"
            onClick={() => onApplySuggestedCycleStart(inferred.suggestedCycleStartDate)}
            className="mt-3 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm transition-all active:scale-95 dark:bg-indigo-800 dark:text-indigo-100"
          >
            Apply Suggestion
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300 min-h-[4.5rem] flex items-center">
        {selected ? (
          <div className="space-y-1">
            <p className="font-bold text-gray-900 dark:text-gray-100">
              {format(parseISO(selected.date), 'dd/MM/yyyy EEE')} | Cycle day {selected.cycleDay}
            </p>
            <p className="text-base font-medium leading-relaxed tracking-wide">{selected.symptomsLabeled}</p>
            {selected.note && <p className="italic text-gray-500 dark:text-gray-400">"{selected.note}"</p>}
          </div>
        ) : (
          <p className="font-medium text-gray-500 dark:text-gray-400 italic">Select an overlay marker to read notes and symptom details.</p>
        )}
      </div>
    </section>
  )
}

export default CycleOverlayChart
