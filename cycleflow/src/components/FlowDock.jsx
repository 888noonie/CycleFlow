import { useEffect, useState } from 'react'
import { useSectionCollapse } from '../hooks/useSectionCollapse'
import { NAV_LINKS, jumpToSection } from '../utils/navigation'
import { readFlowDockOpen, writeFlowDockOpen } from '../utils/dockPreferences'

function FlowBarGlyph() {
  return (
    <span className="flow-bar-glyph" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  )
}

function FlowDock({ flowBarEnabled, onFlowBarChange }) {
  const [open, setOpen] = useState(() => readFlowDockOpen())
  const { setSectionOpen } = useSectionCollapse()

  useEffect(() => {
    writeFlowDockOpen(open)
  }, [open])

  const jump = (sectionId) => {
    jumpToSection(sectionId, setSectionOpen)
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          className="flow-dock-backdrop"
          aria-label="Close FlowDock"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`flow-dock ${open ? 'flow-dock--open' : 'flow-dock--collapsed'}`}
        aria-label="FlowDock navigation"
      >
        <button
          type="button"
          className="flow-dock-tab focus-ring"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Collapse FlowDock' : 'Open FlowDock'}
          title={open ? 'Hide FlowDock' : 'Show FlowDock'}
        >
          <span aria-hidden className="flow-dock-tab-icon">
            {open ? '‹' : '›'}
          </span>
        </button>

        {open ? (
          <div className="flow-dock-panel">
            <p className="flow-dock-title">FlowDock</p>
            <nav className="flow-dock-nav">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.sectionId}
                  type="button"
                  onClick={() => jump(link.sectionId)}
                  className="flow-dock-link focus-ring"
                >
                  <span aria-hidden>{link.short}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>

            <div className="flow-dock-divider" />

            <button
              type="button"
              onClick={() => onFlowBarChange(!flowBarEnabled)}
              className={`flow-dock-flowbar-toggle focus-ring ${
                flowBarEnabled ? 'flow-dock-flowbar-toggle--on' : ''
              }`}
              aria-pressed={flowBarEnabled}
            >
              <FlowBarGlyph />
              <span className="min-w-0 text-left">
                <span className="block text-sm font-bold">FlowBar</span>
                <span className="block text-[11px] font-medium opacity-80">
                  {flowBarEnabled ? 'On — tap to hide' : 'Off — tap to show'}
                </span>
              </span>
            </button>
          </div>
        ) : null}
      </aside>
    </>
  )
}

export default FlowDock
