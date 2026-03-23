import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getCycleDay, getSymptomsText } from '../utils/cycle'

function buildAIPrompt(entries, cycleStartDate) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  const cycleLines = sorted.map((entry) => {
    const day = getCycleDay(entry.date, cycleStartDate)
    return `${format(parseISO(entry.date), 'dd/MM/yyyy EEE')} | Cycle day ${day ?? '?'} | ${getSymptomsText(entry)} | clarity ${Math.round((entry.estrogen ?? 0) * 100)}%${entry.note ? ` | note: ${entry.note}` : ''}`
  })

  return [
    'I am tracking PMDD/perimenopause/ADHD-related symptoms.',
    `Cycle start date: ${cycleStartDate}`,
    '',
    'Please help me with:',
    '1) pattern spotting by cycle phase/day',
    '2) possible triggers and stabilizers',
    '3) a gentle 7-day action plan (sleep, hydration, pacing, self-care)',
    '4) warning signs to watch for next cycle window',
    '',
    'Recent log lines:',
    ...cycleLines,
    '',
    'Please keep the guidance practical and compassionate. This is not a medical diagnosis.',
  ].join('\n')
}

function AIHookPanel({ entries, cycleStartDate }) {
  const [copied, setCopied] = useState(false)
  const promptText = useMemo(
    () => buildAIPrompt(entries, cycleStartDate),
    [entries, cycleStartDate]
  )

  const openChatGPT = () => {
    const encoded = encodeURIComponent(promptText)
    window.open(`https://chatgpt.com/?q=${encoded}`, '_blank', 'noopener,noreferrer')
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">AI handoff</h2>
      <p className="mt-1 text-xs text-gray-500">
        One-tap context pack for ChatGPT to discuss patterns and self-improvement ideas.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openChatGPT}
          className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800"
        >
          Send to ChatGPT
        </button>
        <button
          type="button"
          onClick={copyPrompt}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
        >
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>

      <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-[11px] leading-4 text-gray-700">
        {promptText}
      </pre>
    </section>
  )
}

export default AIHookPanel
