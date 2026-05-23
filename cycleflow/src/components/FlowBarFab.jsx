function FlowBarFab({ onShow, hasUnsavedChanges }) {
  return (
    <button
      type="button"
      onClick={onShow}
      className="flow-bar-fab focus-ring"
      aria-label="Show FlowBar"
      title="Show FlowBar"
    >
      <span aria-hidden className="text-xl">
        📅
      </span>
      {hasUnsavedChanges ? (
        <span className="flow-bar-fab-dot" aria-label="Unsaved changes" />
      ) : null}
    </button>
  )
}

export default FlowBarFab
