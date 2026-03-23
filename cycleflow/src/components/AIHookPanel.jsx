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
    window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer')
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="smooth-card space-y-4 rounded-[2rem] p-6 shadow-xl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">AI handoff</h2>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-snug">
          One-tap context pack for ChatGPT to discuss patterns and self-improvement ideas.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={async () => {
            await copyPrompt()
            openChatGPT()
          }}
          className="flex-[2] rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-md shadow-indigo-500/20 border border-[var(--button-border)] transition-all active:scale-95 dark:bg-indigo-500 dark:shadow-none"
        >
          COPY + OPEN CHATGPT
        </button>
        <button
          type="button"
          onClick={copyPrompt}
          className={`flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 dark:border-white/10 dark:bg-white/5 ${
            copied ? 'text-green-600 border-green-200 dark:text-green-400' : 'text-gray-900 dark:text-white'
          }`}
        >
          {copied ? 'DONE' : 'PROMPT'}
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/5 to-transparent pointer-events-none rounded-2xl dark:from-white/5" />
        <pre className="max-h-52 overflow-auto whitespace-pre-wrap rounded-2xl border border-gray-200/60 bg-gray-50/50 p-5 text-[11px] font-mono leading-relaxed text-gray-700 shadow-inner dark:border-white/10 dark:bg-black/30 dark:text-gray-300">
          {promptText}
        </pre>
      </div>

      <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 text-center px-2">
        Prompt-in-URL is blocked by some ChatGPT flows, so this copies first and opens a new chat reliably.
      </p>
      {window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.') ? (
        <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 text-center px-2">
          On local dev URLs, iOS may open web ChatGPT. On deployed HTTPS domains, iOS typically deep-links
          into the ChatGPT app if installed.
        </p>
      ) : null}
    </section>
  )
}

export default AIHookPanel
