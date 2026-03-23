import { useMemo, useState } from 'react'
import { format } from 'date-fns'

const LEGEND = [
  { emoji: '🧠', label: 'Headache' },
  { emoji: '🪓', label: 'Migraine' },
  { emoji: '💦', label: 'Night sweats' },
  { emoji: '⚡️', label: 'Back pain' },
  { emoji: '🌫️', label: 'Low mood' },
  { emoji: '🥺', label: 'Anxiety' },
  { emoji: '🤬', label: 'Anger' },
  { emoji: '🫩', label: 'Brain fog' },
  { emoji: '👽', label: 'Sleep paralysis' },
  { emoji: '💀', label: 'Sleep++' },
  { emoji: '🥤', label: 'Thirst' },
  { emoji: '🍩', label: 'Food++' },
  { emoji: '🎨', label: 'Crazy dream' },
  { emoji: '🏆', label: 'Back in the game' },
  { emoji: '🤹🏼', label: 'Chaotic' },
  { emoji: '⚰️', label: 'Kill me now' },
  { emoji: '🪩', label: 'Feeling fab' },
  { emoji: '🧘🏼‍♀️', label: 'Calm' },
  { emoji: '🛼', label: 'Energetic' },
  { emoji: '🫥', label: 'Normal / meh' },
  { emoji: '⏰', label: 'Late start' },
  { emoji: '💡', label: 'Extra amfexa' },
]

function exportTimeline({ entries, includeLegend }) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length === 0) {
    return 'Start: (no entries yet)'
  }

  const startDate = new Date(sorted[0].date)
  const startLine = `Start: ${format(startDate, 'dd/MM/yyyy')}`

  const legendBlock = includeLegend
    ? [
        'Legend / Key:',
        ...LEGEND.map((item) => `${item.emoji} = ${item.label}`),
      ].join('\n')
    : ''

  const lines = sorted.map((entry) => {
    const dateObj = new Date(entry.date)
    const day = format(dateObj, 'EEE')
    const symptoms = Array.isArray(entry.symptoms) ? entry.symptoms.join('') : null
    const symptomFallback = entry.emoji ?? '....'
    const symptomText = symptoms && symptoms.length > 0 ? symptoms : symptomFallback

    const noteSuffix = entry.note ? ` | "${entry.note}"` : ''
    return `${format(dateObj, 'dd/MM/yyyy')} ${day}  | ${symptomText}${noteSuffix}`
  })

  return [startLine, '', legendBlock, legendBlock ? '' : '', ...lines].filter(Boolean).join('\n')
}

function ExportPanel({ entries }) {
  const [includeLegend, setIncludeLegend] = useState(true)
  const timelineText = useMemo(
    () => exportTimeline({ entries, includeLegend }),
    [entries, includeLegend]
  )

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(timelineText)
      alert('Copied timeline to clipboard.')
    } catch {
      // Fallback: select via a temporary textarea.
      const textarea = document.createElement('textarea')
      textarea.value = timelineText
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      alert('Copied timeline to clipboard.')
    }
  }

  const onDownload = () => {
    const blob = new Blob([timelineText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cycleflow-timeline.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Export / Share</h2>
          <p className="mt-1 text-xs text-gray-500">
            Generates a plain-text timeline like the Bearable-style logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={includeLegend}
              onChange={(e) => setIncludeLegend(e.target.checked)}
            />
            Legend
          </label>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
        >
          Download .txt
        </button>
      </div>

      <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-[11px] leading-4 text-gray-700">
        {timelineText}
      </pre>
    </section>
  )
}

export default ExportPanel
