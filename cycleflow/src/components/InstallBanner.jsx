import { useState } from 'react'
import { APP_URL, INSTALL_BANNER_KEY } from '../constants'
import { usePwaInstall } from '../hooks/usePwaInstall'
import { useToast } from '../hooks/useToast'

function InstallBanner({ onOpenInstallSection }) {
  const { platform, isStandalone, canPromptInstall, promptInstall } = usePwaInstall()
  const { pushToast } = useToast()
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(INSTALL_BANNER_KEY) === '1'
  )

  if (isStandalone || dismissed) {
    return null
  }

  const dismiss = () => {
    localStorage.setItem(INSTALL_BANNER_KEY, '1')
    setDismissed(true)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL)
      pushToast('Install link copied')
    } catch {
      pushToast('Could not copy link', { tone: 'error' })
    }
  }

  const handleInstall = async () => {
    const result = await promptInstall()
    if (result.ok) {
      pushToast('CycleFlow installed')
      return
    }
    if (result.reason === 'unavailable') {
      onOpenInstallSection?.()
    }
  }

  let message = 'Install CycleFlow for one-tap access from your home screen.'
  if (platform === 'ios') {
    message = 'Install: Safari → Share (↑) → Add to Home Screen.'
  } else if (platform === 'android' && !canPromptInstall) {
    message = 'Install: Chrome menu (⋮) → Install app, or Add to Home screen.'
  }

  return (
    <section className="install-banner rounded-2xl border border-teal-200/70 bg-gradient-to-r from-teal-50/95 to-white/80 px-3.5 py-3 shadow-sm dark:border-teal-800/40 dark:from-teal-950/40 dark:to-black/20">
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none" aria-hidden>
          📲
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-teal-950 dark:text-teal-50">Install CycleFlow</p>
          <p className="mt-0.5 text-xs font-medium leading-relaxed text-teal-900/90 dark:text-teal-100/85">
            {message}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {canPromptInstall ? (
              <button type="button" onClick={handleInstall} className="btn-primary px-3 py-2 text-[11px]">
                Install now
              </button>
            ) : null}
            <button
              type="button"
              onClick={onOpenInstallSection}
              className="focus-ring rounded-xl border border-teal-300/70 bg-white/80 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-teal-900 dark:border-teal-700/50 dark:bg-black/30 dark:text-teal-100"
            >
              Steps
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="focus-ring rounded-xl border border-teal-300/70 bg-white/80 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-teal-900 dark:border-teal-700/50 dark:bg-black/30 dark:text-teal-100"
            >
              Copy link
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="focus-ring shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-teal-700/80 hover:bg-teal-100/80 dark:text-teal-200 dark:hover:bg-white/10"
          aria-label="Dismiss install tip"
        >
          ✕
        </button>
      </div>
    </section>
  )
}

export default InstallBanner
