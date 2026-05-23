import { APP_VERSION, WHATS_NEW_STORAGE_KEY } from '../constants'

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'system', label: 'System', icon: '◐' },
]

function AppHeader({
  theme,
  onThemeChange,
  today,
  entryCount,
  dailyAffirmation,
  cycleStartDate,
  onCycleStartChange,
  activeDate,
  onActiveDateChange,
  showWhatsNew,
  onDismissWhatsNew,
}) {
  return (
    <header className="mb-1 rounded-[1.75rem] glass p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-teal-50 to-white text-xl shadow-sm dark:from-teal-950/40 dark:to-black/30"
            aria-hidden
          >
            🌺
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              CycleFlow <span className="text-teal-600 dark:text-teal-400">v{APP_VERSION}</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-[1.65rem]">
              Today
            </h1>
            <p className="truncate text-sm font-medium text-[var(--text-secondary)]">
              {today} · {entryCount} day{entryCount === 1 ? '' : 's'} saved
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 items-center gap-0.5 rounded-xl border border-[var(--button-border)] bg-white/70 p-0.5 dark:border-white/10 dark:bg-black/25"
          role="group"
          aria-label="Color theme"
        >
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              title={option.label}
              onClick={() => onThemeChange(option.id)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition focus-ring ${
                theme === option.id
                  ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                  : 'text-gray-600 hover:bg-gray-100/90 dark:text-gray-300 dark:hover:bg-white/10'
              }`}
              aria-pressed={theme === option.id}
            >
              <span aria-hidden>{option.icon}</span>
              <span className="sr-only">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showWhatsNew ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-teal-200/70 bg-teal-50/95 px-3 py-3 text-xs text-teal-950 shadow-sm dark:border-teal-800/50 dark:bg-teal-950/40 dark:text-teal-50">
          <span className="text-base leading-none" aria-hidden>
            ✨
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">What&apos;s new in v2.1</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 font-medium leading-snug opacity-95">
              <li>Collapsible sections that remember how you left them.</li>
              <li>Pattern Stream and summary up top — log below.</li>
              <li>
                Tap the bright <strong className="text-teal-700 dark:text-teal-300">›</strong> on the
                left (FlowDock) — FlowBar at the bottom is optional.
              </li>
              <li>Data management with hold-to-delete and type DELETE for erase-all.</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(WHATS_NEW_STORAGE_KEY, '1')
              onDismissWhatsNew()
            }}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-teal-800 hover:bg-teal-100/90 focus-ring dark:text-teal-100 dark:hover:bg-white/10"
          >
            OK
          </button>
        </div>
      ) : null}

      <blockquote className="affirmation-quote mt-3 rounded-2xl border border-[var(--card-border)] bg-white/60 px-4 py-3.5 text-center text-sm font-medium leading-relaxed text-[var(--text-secondary)] shadow-sm dark:bg-black/20">
        <p className="mx-auto max-w-[28rem] text-pretty">
          <span className="text-teal-600 dark:text-teal-400" aria-hidden>
            “
          </span>
          {dailyAffirmation}
          <span className="text-teal-600 dark:text-teal-400" aria-hidden>
            ”
          </span>
        </p>
      </blockquote>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-black/[0.03] px-4 py-3 transition-colors dark:bg-white/[0.04]">
          <span className="text-sm font-bold text-[var(--text-secondary)]">Cycle start</span>
          <input
            id="cycle-start"
            type="date"
            value={cycleStartDate}
            onChange={(event) => onCycleStartChange(event.target.value)}
            className="focus-ring cursor-pointer rounded-lg border-none bg-transparent text-sm font-black text-[var(--text-primary)]"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-2xl bg-black/[0.03] px-4 py-3 transition-colors dark:bg-white/[0.04]">
          <span className="text-sm font-bold text-[var(--text-secondary)]">Editing day</span>
          <input
            id="entry-date"
            type="date"
            value={activeDate}
            onChange={(event) => onActiveDateChange(event.target.value)}
            className="focus-ring cursor-pointer rounded-lg border-none bg-transparent text-sm font-black text-[var(--text-primary)]"
          />
        </label>
      </div>
    </header>
  )
}

export default AppHeader
