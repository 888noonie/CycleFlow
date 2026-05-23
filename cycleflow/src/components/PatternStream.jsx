import { useMemo, useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getSymptomsLabeledText } from '../data/symptomOptions'
import {
  daysBetween,
  enrichEntries,
  findLowWindows,
  rollingAverage,
  summarizeCycleHotspots,
  summarizeSignals,
} from '../utils/patterns'

const CHART_HEIGHT = 300
const TOP_PAD = 34
const BOTTOM_PAD = 238
const DAY_WIDTH = 54

function scoreToY(score) {
  return BOTTOM_PAD - (Math.max(0, Math.min(100, score)) / 100) * (BOTTOM_PAD - TOP_PAD)
}

function buildSmoothPath(points) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[Math.min(points.length - 1, index + 2)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return path
}

function formatShortDate(date) {
  return format(parseISO(date), 'dd MMM')
}

function emojiMarkerText(point, isSelected) {
  const symptoms = Array.isArray(point.symptoms) ? point.symptoms : []
  const visible = symptoms.slice(0, isSelected ? 3 : 1).join('')
  return visible || point.emoji || '•'
}

function PatternStream({ entries, cycleStartDate, onSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [mode, setMode] = useState('smooth')
  const scrollerRef = useRef(null)

  const points = useMemo(
    () => rollingAverage(enrichEntries(entries, cycleStartDate), 3),
    [entries, cycleStartDate]
  )
  const chartWidth = Math.max(860, 92 + Math.max(0, points.length - 1) * DAY_WIDTH + 72)

  const plotPoints = useMemo(
    () =>
      points.map((point, index) => {
        const score = mode === 'smooth' ? point.smoothedScore : point.functionScore
        return {
          ...point,
          x: 52 + index * DAY_WIDTH,
          y: scoreToY(score),
          plottedScore: score,
        }
      }),
    [mode, points]
  )

  const path = useMemo(() => buildSmoothPath(plotPoints), [plotPoints])
  const selected = points.find((point) => point.date === selectedDate) ?? points.at(-1) ?? null
  const signalSummary = useMemo(() => summarizeSignals(points), [points])
  const lowWindows = useMemo(() => findLowWindows(points), [points])
  const cycleHotspots = useMemo(() => summarizeCycleHotspots(points), [points])
  const streamSpan =
    points.length > 1 ? daysBetween(points[0].date, points[points.length - 1].date) : points.length
  const averageScore =
    points.length > 0
      ? Math.round(points.reduce((sum, point) => sum + point.functionScore, 0) / points.length)
      : null
  const visibleSignals = signalSummary.repeated.slice(0, 8)

  const selectPoint = (point) => {
    setSelectedDate(point.date)
    onSelectDate?.(point.date)
  }

  const jumpLatest = () => {
    scrollerRef.current?.scrollTo({ left: scrollerRef.current.scrollWidth, behavior: 'smooth' })
    const latest = points.at(-1)
    if (latest) {
      selectPoint(latest)
    }
  }

  if (points.length === 0) {
    return (
      <p className="text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
        No saved entries yet. Use <strong>Load demo data</strong> above, save a day, or import a
        timeline in Export — good days plot high; heavier symptom-load days plot low.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 text-[11px] font-black uppercase tracking-wide dark:border-white/10 dark:bg-black/20">
            {['smooth', 'raw'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={`rounded-lg px-3 py-1.5 ${
                  mode === option
                    ? 'bg-teal-600 text-white dark:bg-teal-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={jumpLatest}
            className="rounded-xl bg-gray-900 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-white shadow-sm dark:bg-white dark:text-gray-950"
          >
            Latest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200/60 bg-gray-50/60 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
            Logged
          </p>
          <p className="mt-1 text-2xl font-black text-gray-900 dark:text-gray-100">
            {points.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200/60 bg-gray-50/60 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
            Span
          </p>
          <p className="mt-1 text-2xl font-black text-gray-900 dark:text-gray-100">
            {streamSpan}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200/60 bg-gray-50/60 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
            Average
          </p>
          <p className="mt-1 text-2xl font-black text-gray-900 dark:text-gray-100">
            {averageScore ?? '-'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200/60 bg-gray-50/60 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
            Low runs
          </p>
          <p className="mt-1 text-2xl font-black text-gray-900 dark:text-gray-100">
            {lowWindows.length}
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white/70 p-3 shadow-inner dark:border-white/10 dark:bg-black/20"
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
          width={chartWidth}
          height={CHART_HEIGHT}
          className="min-w-full text-gray-400 dark:text-gray-500"
          role="img"
          aria-label="Continuous function score graph"
        >
          <rect width={chartWidth} height={CHART_HEIGHT} fill="transparent" />
          {[100, 75, 50, 25, 0].map((score) => {
            const y = scoreToY(score)
            return (
              <g key={`grid-${score}`}>
                <line
                  x1="42"
                  x2={chartWidth - 20}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity={score === 50 ? 0.35 : 0.18}
                />
                <text x="4" y={y + 4} fontSize="11" fontWeight="800" fill="currentColor">
                  {score}
                </text>
              </g>
            )
          })}

          {lowWindows.map((window) => {
            const start = plotPoints.find((point) => point.date === window.start.date)
            const end = plotPoints.find((point) => point.date === window.end.date)
            if (!start || !end) return null
            return (
              <rect
                key={`window-${window.start.date}-${window.end.date}`}
                x={start.x - 18}
                y={TOP_PAD - 10}
                width={Math.max(36, end.x - start.x + 36)}
                height={BOTTOM_PAD - TOP_PAD + 20}
                rx="10"
                fill="#ef4444"
                opacity="0.08"
              />
            )
          })}

          <path d={path} fill="none" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
          <path
            d={path}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.7"
          />

          {plotPoints.map((point, index) => {
            const isSelected = selected?.date === point.date
            const isLow = point.functionScore < 55
            const showLabel = index === 0 || index === plotPoints.length - 1 || index % 7 === 0
            return (
              <g
                key={point.date}
                onClick={() => selectPoint(point)}
                className="cursor-pointer"
              >
                <line
                  x1={point.x}
                  x2={point.x}
                  y1={BOTTOM_PAD + 8}
                  y2={BOTTOM_PAD + 15}
                  stroke="currentColor"
                  opacity="0.25"
                />
                {showLabel && (
                  <text
                    x={point.x}
                    y={BOTTOM_PAD + 31}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="currentColor"
                  >
                    {formatShortDate(point.date)}
                  </text>
                )}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? 18 : 15}
                  fill={isLow ? '#fee2e2' : '#ccfbf1'}
                  stroke={isLow ? '#ef4444' : '#14b8a6'}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text
                  x={point.x}
                  y={point.y + 5}
                  textAnchor="middle"
                  fontSize={isSelected ? 14 : 13}
                  className="pointer-events-none select-none"
                >
                  {emojiMarkerText(point, isSelected)}
                </text>
                <title>
                  {format(parseISO(point.date), 'dd/MM/yyyy EEE')} · function{' '}
                  {Math.round(point.functionScore)} · {getSymptomsLabeledText(point)}
                </title>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
        {selected ? (
          <div className="space-y-1">
            <p className="text-sm font-black text-gray-900 dark:text-gray-100">
              {format(parseISO(selected.date), 'dd/MM/yyyy EEE')} · function{' '}
              {Math.round(selected.functionScore)} · load {Math.round(selected.symptomLoad)}
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {getSymptomsLabeledText(selected)}
            </p>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              fog {Math.round(Number(selected.fog ?? 0) * 100)}%
              {selected.cycleDay ? ` · cycle day ${selected.cycleDay}` : ''}
              {selected.delta ? ` · change ${selected.delta > 0 ? '+' : ''}${Math.round(selected.delta)}` : ''}
            </p>
            {selected.note && (
              <p className="text-sm italic text-gray-500 dark:text-gray-400">"{selected.note}"</p>
            )}
          </div>
        ) : null}
      </div>

      <details className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-white/5">
        <summary className="cursor-pointer text-sm font-black text-gray-800 dark:text-gray-100">
          Pattern details
        </summary>

        <div className="mt-4 space-y-4">
          <div className="space-y-2 rounded-2xl border border-gray-200/60 bg-white/70 p-4 dark:border-white/10 dark:bg-black/20">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Repeated signals
              </h3>
              <span className="text-[11px] font-bold text-gray-400">Rows align with graph dates</span>
            </div>
            <div className="space-y-2 overflow-x-auto pb-1">
              {visibleSignals.map((signal) => (
                <div
                  key={`signal-row-${signal.symptom}`}
                  className="grid min-w-[680px] items-center gap-2"
                  style={{ gridTemplateColumns: `86px repeat(${points.length}, minmax(10px, 1fr))` }}
                >
                  <span
                    className="truncate text-xs font-bold text-gray-700 dark:text-gray-300"
                    title={signal.label}
                  >
                    {signal.symptom} {signal.label}
                  </span>
                  {points.map((point) => (
                    <button
                      key={`${signal.symptom}-${point.date}`}
                      type="button"
                      onClick={() => selectPoint(point)}
                      className={`h-3 rounded-full ${
                        point.symptoms.includes(signal.symptom)
                          ? point.functionScore < 60
                            ? 'bg-red-500'
                            : 'bg-teal-500'
                          : 'bg-gray-200/80 dark:bg-white/10'
                      }`}
                      aria-label={`${signal.label} on ${point.date}`}
                      title={`${point.date}: ${point.symptoms.includes(signal.symptom) ? 'present' : 'not present'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-red-200/60 bg-red-50/60 p-4 dark:border-red-900/30 dark:bg-red-950/20">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-red-900/70 dark:text-red-100/70">
                Low-day signals
              </h3>
              <ul className="mt-3 space-y-2">
                {signalSummary.lowSignals.slice(0, 3).map((signal) => (
                  <li key={`low-${signal.symptom}`} className="text-sm font-semibold text-red-950 dark:text-red-100">
                    {signal.symptom} {signal.label}
                    <span className="block text-[11px] font-bold opacity-65">
                      avg {signal.averageScore} · low {signal.lowRate}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-teal-200/60 bg-teal-50/70 p-4 dark:border-teal-900/30 dark:bg-teal-950/20">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-teal-900/70 dark:text-teal-100/70">
                Stabilizers
              </h3>
              <ul className="mt-3 space-y-2">
                {signalSummary.stabilizers.slice(0, 3).map((signal) => (
                  <li key={`stable-${signal.symptom}`} className="text-sm font-semibold text-teal-950 dark:text-teal-100">
                    {signal.symptom} {signal.label}
                    <span className="block text-[11px] font-bold opacity-65">
                      avg {signal.averageScore} · seen {signal.count}x
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/70 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-indigo-900/70 dark:text-indigo-100/70">
                Cycle hotspots
              </h3>
              <ul className="mt-3 space-y-2">
                {cycleHotspots.slice(0, 3).map((hotspot) => (
                  <li key={`hotspot-${hotspot.day}`} className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">
                    Day {hotspot.day}
                    <span className="block text-[11px] font-bold opacity-65">
                      avg {hotspot.averageScore} · low {hotspot.lowRate}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </details>

      <p className="px-1 text-[11px] font-medium leading-relaxed text-gray-400 dark:text-gray-500">
        Score is a visual guide, not a diagnosis: 100 means clearer function; lower scores mean
        higher fog plus heavier weighted symptom stack.
      </p>
    </div>
  )
}

export default PatternStream
