function FogSlider({ value, onChange }) {
  const percent = Math.round((Number(value) || 0) * 100)

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Brain fog</h2>
        <span className="text-xs font-medium text-gray-600">{percent}%</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">0 = clear, 100 = very foggy</p>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={percent}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
        aria-label="Brain fog slider"
      />
    </section>
  )
}

export default FogSlider
