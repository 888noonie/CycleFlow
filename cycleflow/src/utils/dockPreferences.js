const FLOW_DOCK_OPEN_KEY = 'cycleflow-flow-dock-open'
const FLOW_BAR_KEY = 'cycleflow-flow-bar-enabled'
const LEGACY_DOCK_OPEN_KEY = 'cycleflow-side-dock-open'
const LEGACY_FLOW_BAR_KEY = 'cycleflow-sticky-save-enabled'

function readBool(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return raw === '1' || raw === 'true'
  } catch {
    return fallback
  }
}

function writeBool(key, value) {
  localStorage.setItem(key, value ? '1' : '0')
}

export function readFlowDockOpen() {
  const current = readBool(FLOW_DOCK_OPEN_KEY, null)
  if (current !== null) return current
  return readBool(LEGACY_DOCK_OPEN_KEY, false)
}

export function writeFlowDockOpen(open) {
  writeBool(FLOW_DOCK_OPEN_KEY, open)
}

export function readFlowBarEnabled() {
  const current = readBool(FLOW_BAR_KEY, null)
  if (current !== null) return current
  return readBool(LEGACY_FLOW_BAR_KEY, false)
}

export function writeFlowBarEnabled(enabled) {
  writeBool(FLOW_BAR_KEY, enabled)
  document.body.classList.toggle('flow-bar-on', enabled)
}

export function syncFlowBarBodyClass(enabled) {
  document.body.classList.toggle('flow-bar-on', enabled)
}
