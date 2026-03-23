const EMOJI_OPTIONS = [
  { emoji: '🧠', label: 'Headache' },
  { emoji: '🪓', label: 'Migraine' },
  { emoji: '💦', label: 'Night sweats' },
  { emoji: '⚡️', label: 'Back pain' },
  { emoji: '🌫️', label: 'Low mood' },
  { emoji: '🥺', label: 'Anxiety' },
  { emoji: '🤬', label: 'Anger' },
  { emoji: '🫩', label: 'Brain fog' },
  { emoji: '👽', label: 'Sleep paralysis' },
  { emoji: '💀', label: 'Sleep++' },
  { emoji: '🥤', label: 'Thirst' },
  { emoji: '🍩', label: 'Food++' },
  { emoji: '🎨', label: 'Crazy dream' },
  { emoji: '🏆', label: 'Back in the game' },
  { emoji: '🤹🏼', label: 'Chaotic' },
  { emoji: '⚰️', label: 'Kill me now' },
  { emoji: '🪩', label: 'Feeling fab' },
  { emoji: '🧘🏼‍♀️', label: 'Calm' },
  { emoji: '🛼', label: 'Energetic' },
  { emoji: '🫥', label: 'Normal / meh' },
  { emoji: '⏰', label: 'Late start' },
  { emoji: '💡', label: 'Extra amfexa' },
]

function EmojiPicker({ selectedEmojis, onAdd, onRemove }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Symptoms</h2>
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          Tap to track. Tap active tags to remove.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200/50 bg-gray-50/50 dark:border-white/10 dark:bg-black/20 p-3 shadow-inner">
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedEmojis.length === 0 ? (
            <span className="px-2 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500">No symptoms today</span>
          ) : (
            selectedEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                type="button"
                onClick={() => onRemove(index)}
                className="flex items-center gap-1 rounded-full bg-teal-100/80 px-3 py-1.5 text-lg shadow-sm transition-transform active:scale-95 dark:bg-teal-900/50 dark:text-teal-100 border border-teal-200/50 dark:border-teal-700/50"
                title="Remove this tag"
              >
                {emoji}
                <span className="text-[10px] opacity-60">✕</span>
              </button>
            ))
          )}
        </div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">Timeline view: {selectedEmojis.join('') || '....'}</p>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
        {EMOJI_OPTIONS.map((option) => (
          <button
            key={option.emoji}
            type="button"
            onClick={() => onAdd(option.emoji)}
            className="group flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:bg-gray-50 active:scale-95 dark:bg-gray-800 dark:ring-white/10 dark:hover:bg-gray-700"
            title={option.label}
            aria-label={option.label}
          >
            <span role="img" aria-label={option.label} className="text-2xl sm:text-3xl transition-transform group-active:scale-110">
              {option.emoji}
            </span>
          </button>
        ))}
      </div>

      <details className="group rounded-2xl bg-gray-50/50 p-3 ring-1 ring-gray-900/5 dark:bg-white/5 dark:ring-white/10 transition-all">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
          Legend
          <span className="text-xs transition-transform group-open:rotate-180">▼</span>
        </summary>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          {EMOJI_OPTIONS.map((option) => (
            <li key={`${option.emoji}-legend`} className="flex items-center gap-2">
              <span className="text-sm bg-white dark:bg-gray-800 rounded-md px-1.5 py-0.5 shadow-sm">{option.emoji}</span>
              <span className="truncate">{option.label}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export default EmojiPicker
