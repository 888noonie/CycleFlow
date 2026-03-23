import { useEffect, useMemo } from 'react'
import { format } from 'date-fns'
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

  const today = useMemo(() => format(new Date(), 'EEE, MMM d'), [])
  const recentEntries = entries.slice(0, 3)
  const entryLine = `${format(new Date(activeDate), 'dd/MM/yyyy EEE')} | ${
    draft.symptoms?.join('') || '....'
  }`

  useEffect(() => {
    hydrateDraftForToday()
  }, [hydrateDraftForToday])

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', draft.color)
    document.documentElement.style.setProperty('--accent-color', draft.color)
  }, [draft.color])

  const addSymptom = (emoji) => {
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
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col gap-4 px-4 py-6">
      <header className="mb-4 rounded-2xl bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-500">CycleFlow</p>
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm text-gray-600">{today}</p>
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor="cycle-start" className="text-xs font-semibold text-gray-700">
            Cycle start
          </label>
          <input
            id="cycle-start"
            type="date"
            value={cycleStartDate}
            onChange={(event) => setCycleStartDate(event.target.value)}
            className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="entry-date" className="text-xs font-semibold text-gray-700">
            Editing day
          </label>
          <input
            id="entry-date"
            type="date"
            value={activeDate}
            onChange={(event) => setActiveDate(event.target.value)}
            className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
          />
        </div>
      </header>

      <section className="flex-1 space-y-4 rounded-2xl bg-white p-4 shadow-sm">
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
          className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          Save selected day
        </button>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          <p className="font-semibold text-gray-800">Preview entry</p>
          <p className="mt-1">
            {entryLine}
          </p>
          <p className="mt-1">
            color {draft.color} | clarity {Math.round(draft.estrogen * 100)}%
            {' | '}fog {Math.round((draft.fog ?? 0) * 100)}%
            {draft.note ? ` | "${draft.note}"` : ''}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
          <p className="font-semibold text-gray-800">Recent entries ({entries.length})</p>
          {recentEntries.length === 0 ? (
            <p className="mt-1 text-gray-600">No saved entries yet.</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {recentEntries.map((entry) => (
                <li key={entry.id}>
                  {format(new Date(entry.date), 'dd/MM/yyyy EEE')} |{' '}
                  {entry.symptoms?.join('') || entry.emoji} | {Math.round(entry.estrogen * 100)}% |
                  fog {Math.round((entry.fog ?? 0) * 100)}%
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <SummaryView entries={entries} activeDate={activeDate} onSelectDate={setActiveDate} />

      <CycleOverlayChart
        entries={entries}
        cycleStartDate={cycleStartDate}
        onApplySuggestedCycleStart={setCycleStartDate}
      />
      <CycleLensMode entries={entries} cycleStartDate={cycleStartDate} />

      <ExportPanel entries={entries} />
      <AIHookPanel entries={entries} cycleStartDate={cycleStartDate} />
      <PwaReadinessPanel />
    </main>
  )
}

export default App
