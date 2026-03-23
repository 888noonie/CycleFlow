function EstrogenSlider({ value, onChange }) {
  const percent = Math.round(value * 100)

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Estrogen balance</h2>
        <span className="text-xs font-medium text-gray-600">{percent}% clarity</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">0 = fatigue, 100 = clarity</p>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={percent}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-teal-700"
        aria-label="Estrogen clarity slider"
      />
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>Fatigue</span>
        <span>Clarity</span>
      </div>
    </section>
  )
}

export default EstrogenSlider
