export const NAV_LINKS = [
  { sectionId: 'pattern-stream', label: 'Graph', short: '📈' },
  { sectionId: 'summary', label: '30 days', short: '🗓️' },
  { sectionId: 'symptoms', label: 'Log', short: '✏️' },
  { sectionId: 'save-preview', label: 'Save Day', short: '📅' },
]

export function scrollToSection(sectionId) {
  const node = document.getElementById(`section-${sectionId}`)
  if (!node) return
  const top = node.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top, behavior: 'smooth' })
}

export function jumpToSection(sectionId, setSectionOpen) {
  setSectionOpen(sectionId, true)
  window.requestAnimationFrame(() => scrollToSection(sectionId))
}
