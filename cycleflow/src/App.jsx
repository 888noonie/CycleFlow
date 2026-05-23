import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { getSymptomsLabeledText } from './data/symptomOptions'
import { getDailyAffirmation } from './data/dailyAffirmations'
import EmojiPicker from './components/EmojiPicker'
import MoodGrid from './components/MoodGrid'
import EstrogenSlider from './components/EstrogenSlider'
import FogSlider from './components/FogSlider'
import QuickNote from './components/QuickNote'
import SummaryView from './components/SummaryView'
import ExportPanel from './components/ExportPanel'
import PatternStream from './components/PatternStream'
import CorrelationLab from './components/CorrelationLab'
import CycleLensMode from './components/CycleLensMode'
import AIHookPanel from './components/AIHookPanel'
import PwaReadinessPanel from './components/PwaReadinessPanel'
import CollapsibleSection from './components/CollapsibleSection'
import DemoDataBanner from './components/DemoDataBanner'
import AppHeader from './components/AppHeader'
import FlowDock from './components/FlowDock'
import FlowBar from './components/FlowBar'
import FlowBarFab from './components/FlowBarFab'
import {
  readFlowBarEnabled,
  syncFlowBarBodyClass,
  writeFlowBarEnabled,
} from './utils/dockPreferences'
import DataManagementPanel from './components/DataManagementPanel'
import { APP_VERSION, WHATS_NEW_STORAGE_KEY } from './constants'
import SectionCollapseProvider from './components/SectionCollapseProvider'
import ToastProvider from './components/ToastProvider'
import { useToast } from './hooks/useToast'
import useCycleStore from './store/useCycleStore'
import { hasUnsavedDraftChanges } from './utils/draftState'

const THEME_STORAGE_KEY = 'cycleflow-theme-preference'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function AppContent() {
  const { pushToast } = useToast()
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
  const loadDemoData = useCycleStore((state) => state.loadDemoData)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'system')
  const [showWhatsNew, setShowWhatsNew] = useState(
    () => !localStorage.getItem(WHATS_NEW_STORAGE_KEY)
  )
  const [flowBarEnabled, setFlowBarEnabled] = useState(() => readFlowBarEnabled())

  useEffect(() => {
    syncFlowBarBodyClass(flowBarEnabled)
  }, [flowBarEnabled])

  const setFlowBar = (enabled) => {
    setFlowBarEnabled(enabled)
    writeFlowBarEnabled(enabled)
  }

  const today = useMemo(() => format(new Date(), 'EEE, MMM d'), [])
  const dailyAffirmation = useMemo(() => getDailyAffirmation(new Date()), [])
  const recentEntries = entries.slice(0, 3)
  const entryLine = `${format(new Date(activeDate), 'dd/MM/yyyy EEE')} | ${
    draft.symptoms?.join('') || '....'
  }`
  const draftLabeledSymptoms = getSymptomsLabeledText({
    symptoms: draft.symptoms,
    emoji: draft.emoji,
  })
  const symptomPreview = draft.symptoms?.join('') || draft.emoji || ''
  const hasUnsavedChanges = useMemo(
    () => hasUnsavedDraftChanges(draft, entries, activeDate),
    [draft, entries, activeDate]
  )

  const handleSave = () => {
    saveDraftEntry()
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12)
    }
    pushToast(`Saved ${format(new Date(activeDate), 'EEE d MMM')}`)
  }

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
    <>
      <a
        href="#cycleflow-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-xl focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main
        id="cycleflow-main"
        className={`relative mx-auto flex w-full max-w-[560px] flex-col gap-3 px-2 py-5 pt-safe sm:px-3 md:px-4 min-h-screen ${
          flowBarEnabled ? 'pb-sticky-save' : 'pb-safe'
        }`}
      >
      <AppHeader
        theme={theme}
        onThemeChange={setTheme}
        today={today}
        entryCount={entries.length}
        dailyAffirmation={dailyAffirmation}
        cycleStartDate={cycleStartDate}
        onCycleStartChange={setCycleStartDate}
        activeDate={activeDate}
        onActiveDateChange={setActiveDate}
        showWhatsNew={showWhatsNew}
        onDismissWhatsNew={() => setShowWhatsNew(false)}
      />

      <SectionCollapseProvider>
        <FlowDock flowBarEnabled={flowBarEnabled} onFlowBarChange={setFlowBar} />
        <div className="flex flex-col gap-3">
          <DemoDataBanner />

          <CollapsibleSection
            sectionId="pattern-stream"
            title="Pattern Stream"
            description="Continuous history graph — high = clearer days, low = heavier symptom load."
          >
            <PatternStream
              entries={entries}
              cycleStartDate={cycleStartDate}
              onSelectDate={setActiveDate}
            />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="summary"
            title="30-day summary"
            description="Tap a day to jump and see details."
          >
            <SummaryView entries={entries} activeDate={activeDate} onSelectDate={setActiveDate} />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="symptoms"
            title="Symptoms"
            description="Tap to track. Tap active tags to remove."
          >
            <EmojiPicker
              selectedEmojis={draft.symptoms ?? []}
              onAdd={addSymptom}
              onRemove={removeSymptomAt}
            />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="mood"
            title="Mood color"
            description="Low to high — pastel calming gradient."
          >
            <MoodGrid
              selectedColor={draft.color}
              onSelect={(value) => setDraftField('color', value)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="clarity"
            title="Clarity"
            description="0 = fatigue, 100 = clarity."
          >
            <EstrogenSlider
              value={draft.estrogen}
              onChange={(value) => setDraftField('estrogen', value)}
            />
          </CollapsibleSection>

          <CollapsibleSection sectionId="fog" title="Brain fog" description="0 = clear, 100 = very foggy.">
            <FogSlider value={draft.fog} onChange={(value) => setDraftField('fog', value)} />
          </CollapsibleSection>

          <CollapsibleSection sectionId="note" title="One word for today" description="Optional short note.">
            <QuickNote value={draft.note} onChange={(value) => setDraftField('note', value)} />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="save-preview"
            title="Save Day"
            description="Save the editing day and review recent logs."
          >
            <button type="button" onClick={handleSave} className="btn-primary w-full py-5 text-base">
              Save selected day
            </button>

            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  Preview entry
                </h3>
                <p className="mt-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {entryLine}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {draftLabeledSymptoms}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  color {draft.color} | clarity {Math.round(draft.estrogen * 100)}%
                  {' | '}fog {Math.round((draft.fog ?? 0) * 100)}%
                  {draft.note ? ` | "${draft.note}"` : ''}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  Recent entries ({entries.length})
                </h3>
                {recentEntries.length === 0 ? (
                  <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    No saved entries yet.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {recentEntries.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                        title={getSymptomsLabeledText(entry)}
                      >
                        <span className="w-16 font-black text-gray-400 dark:text-gray-500">
                          {format(new Date(entry.date), 'dd/MM')}
                        </span>
                        <span className="text-xl tracking-widest">
                          {entry.symptoms?.join('') || entry.emoji}
                        </span>
                        <span className="ml-auto font-mono font-bold">
                          {Math.round(entry.estrogen * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="correlation-lab"
            title="Correlation Lab"
            description="Before/after windows for a selected symptom."
            badge="optional"
          >
            <CorrelationLab
              entries={entries}
              cycleStartDate={cycleStartDate}
              onSelectDate={setActiveDate}
            />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="cycle-lens"
            title="Cycle Lens"
            description="Patterns by cycle day across months."
            badge="optional"
          >
            <CycleLensMode entries={entries} cycleStartDate={cycleStartDate} />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="export"
            title="Export / share"
            description="Plain-text timeline with labels for clinicians or backup."
          >
            <ExportPanel
              entries={entries}
              onImportEntries={importEntries}
              onApplyCycleStart={setCycleStartDate}
              onLoadDemo={loadDemoData}
            />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="ai-handoff"
            title="AI handoff"
            description="Copy a context pack for ChatGPT-style tools."
          >
            <AIHookPanel entries={entries} cycleStartDate={cycleStartDate} />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="pwa"
            title="Install & readiness"
            description="Add to Home Screen — no App Store required."
          >
            <PwaReadinessPanel />
          </CollapsibleSection>

          <CollapsibleSection
            sectionId="data-management"
            title="Data management"
            description="Remove logs by date range — hold 3 seconds to confirm."
            badge="careful"
          >
            <DataManagementPanel />
          </CollapsibleSection>
        </div>

        {flowBarEnabled ? (
          <FlowBar
            activeDate={activeDate}
            symptomPreview={symptomPreview}
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={handleSave}
            onHide={() => setFlowBar(false)}
          />
        ) : (
          <FlowBarFab
            hasUnsavedChanges={hasUnsavedChanges}
            onShow={() => setFlowBar(true)}
          />
        )}
      </SectionCollapseProvider>

      <footer className="mt-2 border-t border-gray-200/70 pt-8 pb-6 text-center dark:border-white/10">
        <p className="text-xs font-semibold tracking-wide text-[var(--text-secondary)]">
          <span className="text-[var(--text-primary)]">CycleFlow</span>{' '}
          <span className="text-teal-600 dark:text-teal-400">v{APP_VERSION}</span>
        </p>
        <p className="mt-2 max-w-sm mx-auto text-[11px] leading-relaxed text-[var(--text-secondary)]">
          Free & open source — share with anyone who needs gentle cycle & symptom tracking. Not medical advice.
        </p>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
          <a
            href="https://github.com/888noonie/CycleFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-700 underline decoration-teal-600/30 underline-offset-2 hover:decoration-teal-600 dark:text-teal-400"
          >
            Star on GitHub
          </a>
          {' · '}
          MIT license
        </p>
        <p
          className="mt-5 font-black text-xl tracking-[0.4em] text-gray-500 dark:text-gray-400 select-none"
          aria-label="N infinity N"
        >
          N∞N
        </p>
      </footer>
    </main>
    </>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
