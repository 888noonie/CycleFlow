import { useCallback, useMemo, useState } from 'react'
import { SECTION_DEFAULTS } from '../data/sectionDefaults'
import { SectionCollapseContext } from '../context/SectionCollapseContext'

const STORAGE_KEY = 'cycleflow-section-collapse-v1'

function readStoredSections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStoredSections(sections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
}

function SectionCollapseProvider({ children }) {
  const [sections, setSections] = useState(() => readStoredSections())

  const isOpen = useCallback(
    (sectionId) => {
      if (Object.prototype.hasOwnProperty.call(sections, sectionId)) {
        return sections[sectionId]
      }
      return SECTION_DEFAULTS[sectionId] ?? true
    },
    [sections]
  )

  const setSectionOpen = useCallback((sectionId, open) => {
    setSections((prev) => {
      const next = { ...prev, [sectionId]: open }
      writeStoredSections(next)
      return next
    })
  }, [])

  const toggleSection = useCallback(
    (sectionId) => {
      setSectionOpen(sectionId, !isOpen(sectionId))
    },
    [isOpen, setSectionOpen]
  )

  const value = useMemo(
    () => ({ isOpen, setSectionOpen, toggleSection }),
    [isOpen, setSectionOpen, toggleSection]
  )

  return (
    <SectionCollapseContext.Provider value={value}>{children}</SectionCollapseContext.Provider>
  )
}

export default SectionCollapseProvider
