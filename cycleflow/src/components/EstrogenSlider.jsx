function EstrogenSlider({ value, onChange }) {
  const percent = Math.round(value * 100)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Estrogen balance</h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">0 = fatigue, 100 = clarity</p>
        </div>
        <span className="rounded-xl bg-teal-100 px-3 py-1 font-mono text-sm font-bold text-teal-900 dark:bg-teal-900/50 dark:text-teal-200 shadow-sm ring-1 ring-teal-200/50 dark:ring-teal-700/50">
          {percent}% clarity
        </span>
      </div>

      <div className="relative mt-2 flex items-center gap-4 rounded-2xl bg-gray-50/50 dark:bg-black/20 p-4 shadow-inner ring-1 ring-gray-900/5 dark:ring-white/10">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Fatigue</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={percent}
          onChange={(event) => onChange(Number(event.target.value) / 100)}
          className="flex-1 transition-all"
          aria-label="Estrogen clarity slider"
        />
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Clarity</span>
      </div>
    </section>
  )
}

export default EstrogenSlider
