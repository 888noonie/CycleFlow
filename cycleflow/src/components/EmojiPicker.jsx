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
    <section>
      <h2 className="text-base font-semibold text-gray-900">Symptom tracker - your emojis</h2>
      <p className="mt-1 text-xs text-gray-500">
        Tap to add tags. Tap a selected tag below to remove it.
      </p>

      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedEmojis.length === 0 ? (
            <span className="px-2 py-1 text-xs text-gray-500">No symptoms logged yet</span>
          ) : (
            selectedEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-base"
                title="Remove this tag"
              >
                {emoji}
              </button>
            ))
          )}
        </div>
        <p className="text-[11px] text-gray-500">Daily line: {selectedEmojis.join('') || '....'}</p>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2">
        {EMOJI_OPTIONS.map((option) => (
          <button
            key={option.emoji}
            type="button"
            onClick={() => onAdd(option.emoji)}
            className="flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-2xl transition hover:border-gray-300"
            title={option.label}
            aria-label={option.label}
          >
            <span role="img" aria-label={option.label}>
              {option.emoji}
            </span>
          </button>
        ))}
      </div>

      <details className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
        <summary className="cursor-pointer text-xs font-semibold text-gray-700">Legend</summary>
        <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-600">
          {EMOJI_OPTIONS.map((option) => (
            <li key={`${option.emoji}-legend`}>
              {option.emoji} = {option.label}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export default EmojiPicker
