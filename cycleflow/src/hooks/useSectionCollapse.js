import { useContext } from 'react'
import { SectionCollapseContext } from '../context/SectionCollapseContext'

export function useSectionCollapse() {
  const context = useContext(SectionCollapseContext)
  if (!context) {
    throw new Error('useSectionCollapse must be used within SectionCollapseProvider')
  }
  return context
}
