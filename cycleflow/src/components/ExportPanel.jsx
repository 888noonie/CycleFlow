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
    const fogSuffix = entry.fog === undefined ? '' : ` | fog ${Math.round(entry.fog * 100)}%`
    return `${format(dateObj, 'dd/MM/yyyy')} ${day}  | ${symptomText}${fogSuffix}${noteSuffix}`
  })

  return [startLine, '', legendBlock, legendBlock ? '' : '', ...lines].filter(Boolean).join('\n')
}

function parseImportedTimeline(text) {
  const lines = text.split(/\r?\n/)
  const results = []
  const lineRegex = /^(\d{2})\/(\d{2})\/(\d{4})\s+\w{3}\s+\|\s*(.+)$/

  for (const line of lines) {
    const match = line.trim().match(lineRegex)
    if (!match) {
      continue
    }

    const [, dd, mm, yyyy, payload] = match
    const date = `${yyyy}-${mm}-${dd}`

    const parts = payload.split('|').map((part) => part.trim()).filter(Boolean)
    const first = parts[0] ?? ''
    const fogPart = parts.find((part) => /^fog\s+\d+%$/i.test(part))
    const notePart = parts.find((part) => part.startsWith('"') && part.endsWith('"'))

    const fog = fogPart ? Number(fogPart.replace(/[^\d]/g, '')) / 100 : undefined
    const note = notePart ? notePart.slice(1, -1) : ''

    results.push({
      id: date,
      date,
      symptoms: first,
      fog,
      note,
    })
  }

  return results
}

function ExportPanel({ entries, onImportEntries }) {
  const [includeLegend, setIncludeLegend] = useState(true)
  const [copied, setCopied] = useState(false)
  const [importText, setImportText] = useState('')
  const [importMessage, setImportMessage] = useState('')
  
  const timelineText = useMemo(
    () => exportTimeline({ entries, includeLegend }),
    [entries, includeLegend]
  )

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(timelineText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = timelineText
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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

  const onImport = () => {
    const parsed = parseImportedTimeline(importText)
    if (parsed.length === 0) {
      setImportMessage('No valid timeline rows found to import.')
      return
    }
    onImportEntries(parsed)
    setImportMessage(`Imported ${parsed.length} day rows.`)
  }

  return (
    <section className="smooth-card space-y-4 rounded-[2rem] p-6 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Export / Share</h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-snug">
            Generates a plain-text timeline like the Bearable-style logs.
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-5 h-5 rounded-md border-gray-300 text-teal-600 focus:ring-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700"
            checked={includeLegend}
            onChange={(e) => setIncludeLegend(e.target.checked)}
          />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Legend</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCopy}
          className={`flex-1 rounded-2xl px-4 py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-md border border-[var(--button-border)] ${
            copied 
            ? 'bg-green-600 text-white shadow-green-500/20' 
            : 'bg-teal-600 text-white shadow-teal-500/20 dark:bg-teal-500'
          }`}
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-black uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:bg-gray-50 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Download .txt
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/5 to-transparent pointer-events-none rounded-2xl dark:from-white/5" />
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-gray-200/60 bg-gray-50/50 p-5 text-[11px] font-mono leading-relaxed text-gray-700 shadow-inner dark:border-white/10 dark:bg-black/30 dark:text-gray-300">
          {timelineText}
        </pre>
      </div>

      <div className="space-y-2 rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4 dark:border-white/10 dark:bg-black/30">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          Import timeline
        </h3>
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Paste exported timeline text here..."
          className="min-h-24 w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-white/10 dark:bg-black/20 dark:text-gray-100"
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onImport}
            className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-md"
          >
            Import + Merge
          </button>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">{importMessage}</span>
        </div>
      </div>
    </section>
  )
}

export default ExportPanel
