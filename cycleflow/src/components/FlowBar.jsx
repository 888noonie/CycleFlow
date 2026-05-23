import { format } from 'date-fns'

function FlowBar({ activeDate, symptomPreview, hasUnsavedChanges, onSave, onHide }) {
  const dateLabel = format(new Date(activeDate), 'EEE d MMM')

  return (
    <div className="flow-bar fixed inset-x-0 bottom-0 z-[80] pointer-events-none px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto flex max-w-[560px] items-center gap-2 rounded-[1.35rem] border border-[var(--card-border)] bg-[color-mix(in_oklab,var(--surface-bg-strong)_94%,transparent)] p-2 pl-4 shadow-[0_-8px_32px_-8px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.55)]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-black uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            FlowBar · {dateLabel}
            {hasUnsavedChanges ? (
              <span className="ml-2 text-amber-600 dark:text-amber-400">· unsaved</span>
            ) : null}
          </p>
          <p className="truncate text-lg tracking-widest text-[var(--text-primary)]">
            {symptomPreview || '····'}
          </p>
        </div>
        <button type="button" onClick={onSave} className="btn-primary shrink-0 px-5 py-3.5 text-sm">
          Save day
        </button>
        {onHide ? (
          <button
            type="button"
            onClick={onHide}
            className="focus-ring ml-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Hide FlowBar"
            title="Hide FlowBar"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default FlowBar
