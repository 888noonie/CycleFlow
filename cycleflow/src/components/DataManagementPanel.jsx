import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import HoldDeleteButton from './HoldDeleteButton'
import { useToast } from '../hooks/useToast'
import useCycleStore from '../store/useCycleStore'
import {
  DELETE_SCOPES,
  previewDeletion,
} from '../utils/dataDeletion'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function DataManagementPanel() {
  const entries = useCycleStore((state) => state.entries)
  const deleteDataInRange = useCycleStore((state) => state.deleteDataInRange)
  const resetAllData = useCycleStore((state) => state.resetAllData)
  const { pushToast } = useToast()

  const bounds = useMemo(() => {
    if (entries.length === 0) {
      const today = todayKey()
      return { min: today, max: today }
    }
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
    return { min: sorted[0].date, max: sorted[sorted.length - 1].date }
  }, [entries])

  const [fromDate, setFromDate] = useState(bounds.min)
  const [toDate, setToDate] = useState(bounds.max)
  const [scopes, setScopes] = useState(['entries'])
  const [eraseEverything, setEraseEverything] = useState(false)
  const [eraseConfirmText, setEraseConfirmText] = useState('')

  const eraseConfirmOk = eraseConfirmText.trim().toUpperCase() === 'DELETE'

  const orderedRange = fromDate <= toDate ? { start: fromDate, end: toDate } : { start: toDate, end: fromDate }

  const preview = useMemo(
    () =>
      eraseEverything
        ? {
            affectedDays: entries.length,
            summary: `Erases all ${entries.length} saved day${
              entries.length === 1 ? '' : 's'
            }, cycle start, and resets the editor.`,
          }
        : previewDeletion(entries, orderedRange.start, orderedRange.end, scopes),
    [eraseEverything, entries, orderedRange.end, orderedRange.start, scopes]
  )

  const toggleScope = (scopeId) => {
    if (eraseEverything) return
    setScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((id) => id !== scopeId) : [...prev, scopeId]
    )
  }

  const applyPreset = (preset) => {
    const today = todayKey()
    if (preset === 'all') {
      setFromDate(bounds.min)
      setToDate(bounds.max)
      return
    }
    if (preset === '30') {
      setFromDate(format(subDays(new Date(), 29), 'yyyy-MM-dd'))
      setToDate(today)
      return
    }
    setFromDate(format(subDays(new Date(), 6), 'yyyy-MM-dd'))
    setToDate(today)
  }

  const handleRangeDelete = () => {
    const result = deleteDataInRange({
      startDate: orderedRange.start,
      endDate: orderedRange.end,
      scopes,
    })
    if (!result.ok) {
      pushToast(result.message ?? 'Nothing was deleted', { tone: 'error' })
      return
    }
    pushToast(result.message ?? 'Data removed', { tone: 'info' })
  }

  const handleEraseAll = () => {
    resetAllData()
    pushToast('All CycleFlow data erased on this device', { tone: 'info' })
    setEraseEverything(false)
    setEraseConfirmText('')
    const today = todayKey()
    setFromDate(today)
    setToDate(today)
    setScopes(['entries'])
  }

  const rangeDeleteDisabled = eraseEverything || preview.affectedDays === 0 || scopes.length === 0

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 p-4 dark:border-rose-900/40 dark:bg-rose-950/25">
        <p className="text-sm font-bold text-rose-950 dark:text-rose-100">Private & permanent</p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-rose-900/90 dark:text-rose-100/85">
          CycleFlow stores data only in this browser. Deleting here cannot be undone and is not
          recoverable from our servers — export first if you may need a backup.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-rose-300/60 bg-white/60 p-4 dark:border-rose-800/50 dark:bg-black/20">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 rounded-md border-rose-300 text-rose-600 focus:ring-rose-500"
          checked={eraseEverything}
          onChange={(event) => {
            const checked = event.target.checked
            setEraseEverything(checked)
            if (!checked) {
              setEraseConfirmText('')
            }
            if (checked) {
              setScopes(['entries'])
            }
          }}
        />
        <span>
          <span className="block text-sm font-bold text-rose-950 dark:text-rose-50">
            Erase everything on this device
          </span>
          <span className="mt-0.5 block text-xs font-medium text-rose-800/80 dark:text-rose-200/80">
            All logs, cycle start date, and current draft — ignores the date range below.
          </span>
        </span>
      </label>

      <fieldset
        disabled={eraseEverything}
        className={`space-y-4 rounded-2xl border border-gray-200/60 p-4 dark:border-white/10 ${
          eraseEverything ? 'opacity-50' : ''
        }`}
      >
        <legend className="px-1 text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          Date range
        </legend>

        <div className="flex flex-wrap gap-2">
          {[
            { id: '7', label: 'Last 7 days' },
            { id: '30', label: 'Last 30 days' },
            { id: 'all', label: 'All saved' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className="focus-ring rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 dark:border-white/10 dark:bg-black/30 dark:text-gray-200"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-3 rounded-xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
            <span className="text-sm font-bold text-[var(--text-secondary)]">From</span>
            <input
              type="date"
              value={fromDate}
              min={bounds.min}
              max={bounds.max}
              onChange={(event) => setFromDate(event.target.value)}
              className="focus-ring cursor-pointer bg-transparent text-sm font-black"
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
            <span className="text-sm font-bold text-[var(--text-secondary)]">To</span>
            <input
              type="date"
              value={toDate}
              min={bounds.min}
              max={bounds.max}
              onChange={(event) => setToDate(event.target.value)}
              className="focus-ring cursor-pointer bg-transparent text-sm font-black"
            />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            What to remove
          </p>
          {DELETE_SCOPES.map((scope) => (
            <label
              key={scope.id}
              className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
                scopes.includes(scope.id)
                  ? 'border-rose-300/70 bg-rose-50/50 dark:border-rose-800/50 dark:bg-rose-950/20'
                  : 'border-gray-200/60 bg-white/40 dark:border-white/10 dark:bg-black/15'
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                checked={scopes.includes(scope.id)}
                onChange={() => toggleScope(scope.id)}
              />
              <span>
                <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                  {scope.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  {scope.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl bg-gray-50/80 px-3 py-2.5 text-sm font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300">
        {preview.summary}
      </div>

      {eraseEverything ? (
        <div className="space-y-3 rounded-2xl border border-rose-300/60 bg-rose-50/40 p-4 dark:border-rose-900/40 dark:bg-rose-950/15">
          <label htmlFor="erase-confirm" className="block text-sm font-bold text-rose-950 dark:text-rose-100">
            Type <span className="font-mono tracking-widest">DELETE</span> to unlock erase
          </label>
          <input
            id="erase-confirm"
            type="text"
            value={eraseConfirmText}
            onChange={(event) => setEraseConfirmText(event.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="DELETE"
            className={`focus-ring w-full rounded-xl border bg-white px-4 py-3 text-center font-mono text-lg font-black tracking-[0.2em] outline-none dark:bg-black/30 ${
              eraseConfirmOk
                ? 'border-rose-500 text-rose-700 ring-1 ring-rose-400/40 dark:border-rose-500 dark:text-rose-200'
                : 'border-rose-200/80 text-gray-800 dark:border-rose-900/50 dark:text-gray-100'
            }`}
          />
          <p className="text-center text-xs font-medium text-rose-800/85 dark:text-rose-200/80">
            {eraseConfirmOk
              ? 'Confirmed — now hold the button below for 3 seconds.'
              : 'Must match exactly (any letter case is fine).'}
          </p>
        </div>
      ) : null}

      {eraseEverything ? (
        <HoldDeleteButton
          label="Hold 3s — erase everything"
          warning="Warning: this data cannot be recovered."
          disabled={!eraseConfirmOk}
          onConfirm={() => {
            if (eraseConfirmText.trim().toUpperCase() !== 'DELETE') {
              pushToast('Type DELETE to confirm', { tone: 'error' })
              return
            }
            handleEraseAll()
          }}
        />
      ) : (
        <HoldDeleteButton
          label="Hold 3s — delete selected"
          warning="Warning: this data cannot be recovered."
          disabled={rangeDeleteDisabled}
          onConfirm={handleRangeDelete}
        />
      )}
    </div>
  )
}

export default DataManagementPanel
