function QuickNote({ value, onChange }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-900">One word for today</h2>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. foggy, steady, wired"
        maxLength={60}
        className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none ring-teal-600 transition focus:ring-2"
      />
    </section>
  )
}

export default QuickNote
