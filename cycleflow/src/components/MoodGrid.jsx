const MOOD_COLORS = [
  { name: 'Burnt Orange', value: '#b76537' },
  { name: 'Amber', value: '#d39a47' },
  { name: 'Sage Green', value: '#8cae7e' },
  { name: 'Sky Blue', value: '#6da8d6' },
  { name: 'Deep Teal', value: '#2d8a8a' },
]

function MoodGrid({ selectedColor, onSelect }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-900">Mood color scale</h2>
      <p className="mt-1 text-xs text-gray-500">Pick the closest match.</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        {MOOD_COLORS.map((mood) => {
          const isSelected = selectedColor === mood.value
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onSelect(mood.value)}
              className={`h-11 flex-1 rounded-lg border-2 transition ${
                isSelected ? 'border-gray-900' : 'border-transparent'
              }`}
              style={{ backgroundColor: mood.value }}
              aria-label={mood.name}
              title={mood.name}
              aria-pressed={isSelected}
            />
          )
        })}
      </div>
    </section>
  )
}

export default MoodGrid
