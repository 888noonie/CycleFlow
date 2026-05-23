import { useSectionCollapse } from '../hooks/useSectionCollapse'

function Chevron({ open }) {
  return (
    <span
      aria-hidden
      className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white/80 text-sm font-black text-gray-500 transition-transform dark:border-white/10 dark:bg-black/30 dark:text-gray-300 ${
        open ? 'rotate-180' : ''
      }`}
    >
      ▾
    </span>
  )
}

function CollapsibleSection({
  sectionId,
  title,
  description,
  badge,
  children,
  className = '',
}) {
  const { isOpen, toggleSection } = useSectionCollapse()
  const open = isOpen(sectionId)
  const panelId = `section-panel-${sectionId}`

  return (
    <section
      id={`section-${sectionId}`}
      className={`smooth-card scroll-mt-20 rounded-[2rem] overflow-hidden shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => toggleSection(sectionId)}
        className="flex w-full min-h-[56px] items-start justify-between gap-3 p-5 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] focus-ring"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
            {badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ${
                  badge === 'careful'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                    : 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100'
                }`}
              >
                {badge}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{description}</p>
          ) : null}
        </div>
        <Chevron open={open} />
      </button>
      {open ? (
        <div
          id={panelId}
          className="section-panel-enter space-y-4 border-t border-gray-100 px-5 pb-5 pt-4 dark:border-white/5"
        >
          {children}
        </div>
      ) : null}
    </section>
  )
}

export default CollapsibleSection
