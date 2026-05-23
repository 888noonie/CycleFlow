import { useState } from 'react'
import { DEMO_ENTRIES } from '../data/demoEntries'
import { useSectionCollapse } from '../hooks/useSectionCollapse'
import { useToast } from '../hooks/useToast'
import useCycleStore from '../store/useCycleStore'

function DemoDataBanner() {
  const entries = useCycleStore((state) => state.entries)
  const loadDemoData = useCycleStore((state) => state.loadDemoData)
  const { setSectionOpen } = useSectionCollapse()
  const { pushToast } = useToast()
  const [message, setMessage] = useState(null)

  if (entries.length > 0) {
    return null
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-dashed border-teal-300/80 bg-gradient-to-br from-teal-50 via-white to-teal-50/40 p-5 shadow-sm dark:border-teal-700/50 dark:from-teal-950/50 dark:via-[#121214] dark:to-teal-950/20">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-400/15 blur-2xl dark:bg-teal-500/10" />
      <p className="text-sm font-bold text-teal-950 dark:text-teal-50">Preview with sample data</p>
      <p className="mt-1 text-sm font-medium leading-relaxed text-teal-900/90 dark:text-teal-100/90">
        Load {DEMO_ENTRIES.length} demo days to see the Pattern Stream, summary grid, and correlation
        tools — nothing leaves your device.
      </p>
      <button
        type="button"
        onClick={() => {
          const result = loadDemoData()
          if (result.ok) {
            setSectionOpen('pattern-stream', true)
            setSectionOpen('summary', true)
            pushToast(`Loaded ${DEMO_ENTRIES.length} demo days`)
          }
          setMessage(
            result.ok
              ? `Loaded ${DEMO_ENTRIES.length} demo days — Pattern Stream is open below.`
              : 'You already have saved entries; demo data is only for empty storage.'
          )
        }}
        className="btn-primary mt-4 w-full py-3.5 text-sm"
      >
        Load demo data
      </button>
      {message ? (
        <p className="mt-2 text-xs font-semibold text-teal-800 dark:text-teal-200">{message}</p>
      ) : null}
    </section>
  )
}

export default DemoDataBanner
