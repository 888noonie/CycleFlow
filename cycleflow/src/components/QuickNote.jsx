function QuickNote({ value, onChange }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">One word for today</h2>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. foggy, steady, wired"
        maxLength={60}
        className="mt-1 w-full rounded-2xl bg-gray-50/50 dark:bg-black/20 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-inner ring-1 ring-gray-900/5 dark:ring-white/10 outline-none transition focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-500"
      />
    </section>
  )
}

export default QuickNote
