import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getCycleDay, getSymptomsText } from '../utils/cycle'

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
        symptomsText: getSymptomsText(entry),
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.cycleDay - b.cycleDay)
}

function markerYFromClarity(estrogen) {
  const clarity = Math.max(0, Math.min(1, Number(estrogen) || 0))
  return 235 - clarity * 150
}

function CycleOverlayChart({ entries, cycleStartDate }) {
  const [selectedId, setSelectedId] = useState(null)
  const points = useMemo(
    () => buildPoints(entries, cycleStartDate),
    [entries, cycleStartDate]
  )
  const selected = points.find((point) => point.id === selectedId) ?? null

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Cycle map with emoji overlays</h2>
      <p className="mt-1 text-xs text-gray-500">
        Fixed 28-day view. Tap markers to inspect notes and symptom stacks.
      </p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-2">
        <svg viewBox="0 0 840 300" className="h-auto min-w-[700px]">
          <rect x="0" y="0" width="840" height="300" fill="#f8fafc" />
          <rect x="0" y="30" width="420" height="235" fill="#eef2ff" />
          <rect x="420" y="30" width="420" height="235" fill="#eff6ff" />

          <text x="120" y="24" fill="#334155" fontSize="18" fontWeight="700">
            FOLLICULAR PHASE
          </text>
          <text x="535" y="24" fill="#334155" fontSize="18" fontWeight="700">
            LUTEAL PHASE
          </text>

          <line x1="420" y1="30" x2="420" y2="265" stroke="#ef4444" strokeWidth="3" />
          <text x="387" y="286" fill="#b91c1c" fontSize="13" fontWeight="700">
            Ovulation (Day 14)
          </text>

          {/* Estrogen-like curve */}
          <path
            d="M 20 260 C 180 250, 250 240, 300 150 C 350 65, 390 85, 420 160 C 455 240, 530 255, 610 200 C 690 145, 770 240, 830 260"
            fill="none"
            stroke="#ec4899"
            strokeWidth="4"
          />
          {/* LH-like spike */}
          <path
            d="M 20 260 C 260 258, 330 254, 390 110 C 420 35, 450 70, 485 170 C 520 250, 690 248, 830 260"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
          />
          {/* Progesterone-like luteal hump */}
          <path
            d="M 20 260 C 300 260, 390 258, 450 240 C 520 220, 560 120, 620 95 C 700 65, 765 170, 830 260"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
          />

          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
            const x = 25 + ((day - 1) / 27) * 790
            return (
              <g key={`tick-${day}`}>
                <line x1={x} y1="265" x2={x} y2="272" stroke="#64748b" strokeWidth="1" />
                <text x={x - 5} y="288" fill="#475569" fontSize="11">
                  {day}
                </text>
              </g>
            )
          })}

          {points.map((point) => {
            const x = 25 + ((point.cycleDay - 1) / 27) * 790
            const y = markerYFromClarity(point.estrogen)
            return (
              <g key={point.id} onClick={() => setSelectedId(point.id)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={selectedId === point.id ? 15 : 12}
                  fill={point.color || '#0f766e'}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <text x={x - 11} y={y + 5} fontSize="13">
                  {point.emoji ?? '🫥'}
                </text>
                <title>
                  {point.date} | Day {point.cycleDay} | {point.symptomsText}
                  {point.note ? ` | ${point.note}` : ''}
                </title>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
        {selected ? (
          <p>
            {format(parseISO(selected.date), 'dd/MM/yyyy EEE')} | Cycle day {selected.cycleDay} |{' '}
            {selected.symptomsText}
            {selected.note ? ` | "${selected.note}"` : ''}
          </p>
        ) : (
          <p>Select an overlay marker to read notes and symptom details.</p>
        )}
      </div>
    </section>
  )
}

export default CycleOverlayChart
