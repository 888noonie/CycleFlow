import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { getSymptomsLabeledText } from './data/symptomOptions'
import EmojiPicker from './components/EmojiPicker'
import MoodGrid from './components/MoodGrid'
import EstrogenSlider from './components/EstrogenSlider'
import FogSlider from './components/FogSlider'
import QuickNote from './components/QuickNote'
import SummaryView from './components/SummaryView'
import ExportPanel from './components/ExportPanel'
import CycleOverlayChart from './components/CycleOverlayChart'
import CycleLensMode from './components/CycleLensMode'
import AIHookPanel from './components/AIHookPanel'
import PwaReadinessPanel from './components/PwaReadinessPanel'
import useCycleStore from './store/useCycleStore'

const THEME_STORAGE_KEY = 'cycleflow-theme-preference'
const WHATS_NEW_STORAGE_KEY = 'cycleflow-whats-new-dismissed-2026-04'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function App() {
  const draft = useCycleStore((state) => state.draft)
  const entries = useCycleStore((state) => state.entries)
  const setDraftField = useCycleStore((state) => state.setDraftField)
  const saveDraftEntry = useCycleStore((state) => state.saveDraftEntry)
  const hydrateDraftForToday = useCycleStore((state) => state.hydrateDraftForToday)
  const cycleStartDate = useCycleStore((state) => state.cycleStartDate)
  const setCycleStartDate = useCycleStore((state) => state.setCycleStartDate)
  const activeDate = useCycleStore((state) => state.activeDate)
  const setActiveDate = useCycleStore((state) => state.setActiveDate)
  const importEntries = useCycleStore((state) => state.importEntries)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'system')
  const [resolvedTheme, setResolvedTheme] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )
  const [showWhatsNew, setShowWhatsNew] = useState(
    () => !localStorage.getItem(WHATS_NEW_STORAGE_KEY)
  )

  const today = useMemo(() => format(new Date(), 'EEE, MMM d'), [])
  const recentEntries = entries.slice(0, 3)
  const entryLine = `${format(new Date(activeDate), 'dd/MM/yyyy EEE')} | ${
    draft.symptoms?.join('') || '....'
  }`
  const draftLabeledSymptoms = getSymptomsLabeledText({
    symptoms: draft.symptoms,
    emoji: draft.emoji,
  })

  useEffect(() => {
    hydrateDraftForToday()
  }, [hydrateDraftForToday])

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', draft.color)
    document.documentElement.style.setProperty('--accent-color', draft.color)
  }, [draft.color])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)

    const applyDark = (enabled) => {
      document.documentElement.classList.toggle('dark', enabled)
      document.documentElement.style.colorScheme = enabled ? 'dark' : 'light'
      setResolvedTheme(enabled ? 'dark' : 'light')
    }

    if (theme === 'dark') {
      applyDark(true)
      return () => {}
    }

    if (theme === 'light') {
      applyDark(false)
      return () => {}
    }

    applyDark(systemPrefersDark())
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event) => applyDark(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])

  const addSymptom = (emoji) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(10)
    }
    const current = Array.isArray(draft.symptoms) ? draft.symptoms : []
    setDraftField('symptoms', [...current, emoji])
    if (!draft.emoji || draft.emoji === '🫥') {
      setDraftField('emoji', emoji)
    }
  }

  const removeSymptomAt = (indexToRemove) => {
    const current = Array.isArray(draft.symptoms) ? draft.symptoms : []
    const next = current.filter((_, index) => index !== indexToRemove)
    setDraftField('symptoms', next)
    setDraftField('emoji', next[0] ?? '🫥')
  }

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-col gap-4 px-2 py-6 pb-safe pt-safe sm:px-3 md:px-4 min-h-screen">
      <header className="mb-2 rounded-2xl glass p-4 shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-white/90 text-2xl shadow-sm dark:bg-black/30">
              🌺
            </div>
            <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">CycleFlow</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Today</h1>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {today} · {entries.length} day{entries.length === 1 ? '' : 's'} saved
            </p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-[var(--button-border)] bg-white/60 p-1 text-[11px] dark:border-white/10 dark:bg-black/20 shadow-sm">
            {['light', 'dark', 'system'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                className={`rounded-lg px-2 py-1 font-semibold uppercase tracking-wide transition ${
                  theme === option
                    ? 'bg-teal-600 text-white dark:bg-teal-500'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {showWhatsNew && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-teal-200/70 bg-teal-50/90 px-3 py-2.5 text-xs text-teal-950 shadow-sm dark:border-teal-800/50 dark:bg-teal-950/35 dark:text-teal-50">
            <span className="text-base leading-none" aria-hidden>
              ✨
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">What&apos;s new</p>
              <p className="mt-0.5 font-medium leading-snug opacity-95">
                Puffy face and blood tracking, readable labels under Timeline view, and richer tooltips on the cycle map.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(WHATS_NEW_STORAGE_KEY, '1')
                setShowWhatsNew(false)
              }}
              className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-black uppercase tracking-wide text-teal-800 hover:bg-teal-100/90 dark:text-teal-100 dark:hover:bg-white/10"
            >
              OK
            </button>
          </div>
        )}

        <div className="mt-3 rounded-xl border border-[var(--card-border)] bg-white/70 px-3 py-2 text-xs text-[var(--text-secondary)] shadow-sm dark:bg-black/20">
          Gentle consistency beats intensity. Log a little today, and let patterns tell the story.
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
          <span>Theme</span>
          <span className="rounded-md border border-[var(--card-border)] px-2 py-0.5 uppercase">
            pref: {theme} | active: {resolvedTheme}
          </span>
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] p-3 px-4 transition-colors">
            <label htmlFor="cycle-start" className="text-sm font-bold text-[var(--text-secondary)]">
              Cycle start
            </label>
            <input
              id="cycle-start"
              type="date"
              value={cycleStartDate}
              onChange={(event) => setCycleStartDate(event.target.value)}
              className="rounded-lg border-none bg-transparent text-sm font-black text-[var(--text-primary)] focus:ring-0 text-right cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] p-3 px-4 transition-colors">
            <label htmlFor="entry-date" className="text-sm font-bold text-[var(--text-secondary)]">
              Editing day
            </label>
            <input
              id="entry-date"
              type="date"
              value={activeDate}
              onChange={(event) => setActiveDate(event.target.value)}
              className="rounded-lg border-none bg-transparent text-sm font-black text-[var(--text-primary)] focus:ring-0 text-right cursor-pointer"
            />
          </div>
        </div>
      </header>

      <section className="flex-1 space-y-8 rounded-[2rem] smooth-card p-6 shadow-xl">
        <EmojiPicker
          selectedEmojis={draft.symptoms ?? []}
          onAdd={addSymptom}
          onRemove={removeSymptomAt}
        />
        <MoodGrid
          selectedColor={draft.color}
          onSelect={(value) => setDraftField('color', value)}
        />
        <EstrogenSlider
          value={draft.estrogen}
          onChange={(value) => setDraftField('estrogen', value)}
        />
        <FogSlider value={draft.fog} onChange={(value) => setDraftField('fog', value)} />
        <QuickNote value={draft.note} onChange={(value) => setDraftField('note', value)} />

        <button
          type="button"
          onClick={saveDraftEntry}
          className="w-full rounded-[1.5rem] bg-[var(--accent-color)] px-6 py-5 text-lg font-black tracking-wide text-white shadow-lg shadow-[var(--accent-color)]/20 border border-[var(--button-border)] transition-all hover:opacity-90 active:scale-[0.97]"
        >
          SAVE SELECTED DAY
        </button>

        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Preview entry</h3>
            <p className="mt-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {entryLine}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{draftLabeledSymptoms}</p>
            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              color {draft.color} | clarity {Math.round(draft.estrogen * 100)}%
              {' | '}fog {Math.round((draft.fog ?? 0) * 100)}%
              {draft.note ? ` | "${draft.note}"` : ''}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Recent entries ({entries.length})</h3>
            {recentEntries.length === 0 ? (
              <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">No saved entries yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                    title={getSymptomsLabeledText(entry)}
                  >
                    <span className="w-16 font-black text-gray-400 dark:text-gray-500">{format(new Date(entry.date), 'dd/MM')}</span>
                    <span className="text-xl tracking-widest">{entry.symptoms?.join('') || entry.emoji}</span>
                    <span className="ml-auto font-mono font-bold">{Math.round(entry.estrogen * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="space-y-6 pb-12">
        <SummaryView entries={entries} activeDate={activeDate} onSelectDate={setActiveDate} />

        <CycleOverlayChart
          entries={entries}
          cycleStartDate={cycleStartDate}
          onApplySuggestedCycleStart={setCycleStartDate}
        />
        <CycleLensMode entries={entries} cycleStartDate={cycleStartDate} />

        <div className="grid grid-cols-1 gap-4">
          <ExportPanel entries={entries} onImportEntries={importEntries} />
          <AIHookPanel entries={entries} cycleStartDate={cycleStartDate} />
          <PwaReadinessPanel />
        </div>
      </div>
    </main>
  )
}

export default App
