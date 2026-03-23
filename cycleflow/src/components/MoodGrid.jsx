const MOOD_COLORS = [
  { name: 'Low - Soft Lilac', value: '#dcd3f6' },
  { name: 'Low-Mid - Misty Periwinkle', value: '#c8d7f3' },
  { name: 'Mid - Cool Mint', value: '#c6eadf' },
  { name: 'Mid-High - Seafoam', value: '#aee3d4' },
  { name: 'High - Calm Teal', value: '#86d4c6' },
]

function MoodGrid({ selectedColor, onSelect }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-900">Mood color scale</h2>
      <p className="mt-1 text-xs text-gray-500">Low to High (pastel, calming gradient).</p>
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
