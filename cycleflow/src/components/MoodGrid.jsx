const MOOD_COLORS = [
  { name: 'Low - Soft Lilac', value: '#dcd3f6', icon: '😞' },
  { name: 'Low-Mid - Misty Periwinkle', value: '#c8d7f3', icon: '😕' },
  { name: 'Mid - Cool Mint', value: '#c6eadf', icon: '😐' },
  { name: 'Mid-High - Seafoam', value: '#aee3d4', icon: '🙂' },
  { name: 'High - Calm Teal', value: '#86d4c6', icon: '😁' },
]

function MoodGrid({ selectedColor, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-2xl bg-gray-50/50 dark:bg-black/20 p-2 sm:p-3 shadow-inner ring-1 ring-gray-900/5 dark:ring-white/10">
        {MOOD_COLORS.map((mood) => {
          const isSelected = selectedColor === mood.value
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onSelect(mood.value)}
              className={`group relative flex h-14 sm:h-16 flex-1 items-center justify-center rounded-xl transition-all active:scale-95 ${
                isSelected ? 'ring-2 ring-gray-900 ring-offset-2 dark:ring-gray-100 dark:ring-offset-gray-900 shadow-md scale-105' : 'hover:scale-105 hover:shadow-sm opacity-90 hover:opacity-100'
              }`}
              style={{ backgroundColor: mood.value }}
              aria-label={mood.name}
              title={mood.name}
              aria-pressed={isSelected}
            >
              <span className={`text-xl sm:text-2xl drop-shadow-sm transition-opacity ${isSelected ? 'opacity-90' : 'opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-75'}`}>
                {mood.icon}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MoodGrid
