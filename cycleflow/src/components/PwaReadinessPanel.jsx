import { useEffect, useState } from 'react'
import { APP_URL } from '../constants'
import { usePwaInstall } from '../hooks/usePwaInstall'
import { useToast } from '../hooks/useToast'

const INSTALL_STEPS = {
  ios: [
    'Open this page in Safari (not Chrome or an in-app browser).',
    'Tap Share (↑) at the bottom of the screen.',
    'Scroll and tap Add to Home Screen.',
    'Tap Add — launch CycleFlow from your home screen.',
    'Tip: use Export → Import if you logged days in Safari before installing.',
  ],
  android: [
    'Open in Chrome (recommended).',
    'Tap Install now below if the button appears.',
    'Or: Chrome menu (⋮) → Install app / Add to Home screen.',
    'Open from your home screen for the full-screen app experience.',
    'Optional: turn on Airplane Mode once to confirm offline access.',
  ],
  desktop: [
    'Use Chrome, Edge, or another Chromium browser.',
    'Click Install now if offered, or the install icon in the address bar.',
    'Pin the window for quick daily logging.',
    'Data stays in this browser profile on this device.',
  ],
}

function PwaReadinessPanel() {
  const { platform, isStandalone, canPromptInstall, promptInstall } = usePwaInstall()
  const { pushToast } = useToast()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [hasServiceWorker, setHasServiceWorker] = useState(false)

  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setHasServiceWorker(Boolean(registration))
      })
    }

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const steps = INSTALL_STEPS[platform] ?? INSTALL_STEPS.desktop

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL)
      pushToast('Install link copied — send to your phone if needed')
    } catch {
      pushToast('Could not copy link', { tone: 'error' })
    }
  }

  const handleInstall = async () => {
    const result = await promptInstall()
    if (result.ok) {
      pushToast('CycleFlow installed')
    } else if (result.reason === 'dismissed') {
      pushToast('Install cancelled', { tone: 'info' })
    }
  }

  return (
    <div className="space-y-4">
      {isStandalone ? (
        <div className="rounded-2xl border border-green-200/70 bg-green-50/80 px-4 py-3 text-sm font-semibold text-green-900 dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-100">
          Installed — you&apos;re using CycleFlow from your home screen or app list.
        </div>
      ) : (
        <div className="rounded-2xl border border-teal-200/70 bg-teal-50/60 px-4 py-3 text-sm font-medium text-teal-950 dark:border-teal-800/40 dark:bg-teal-950/25 dark:text-teal-100">
          Not installed yet — follow the steps below for{' '}
          {platform === 'ios' ? 'iPhone / iPad' : platform === 'android' ? 'Android' : 'this device'}.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {canPromptInstall ? (
          <button type="button" onClick={handleInstall} className="btn-primary px-4 py-2.5 text-xs">
            Install now
          </button>
        ) : null}
        <button
          type="button"
          onClick={copyLink}
          className="focus-ring rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-800 dark:border-white/10 dark:bg-black/30 dark:text-gray-100"
        >
          Copy install link
        </button>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-800 dark:border-white/10 dark:bg-black/30 dark:text-gray-100"
        >
          Open live app
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className={`flex flex-col items-center justify-center rounded-2xl p-4 shadow-inner ring-1 transition-all ${
            isOnline
              ? 'bg-green-50/50 ring-green-900/5 dark:bg-green-900/10 dark:ring-green-500/20'
              : 'bg-red-50/50 ring-red-900/5 dark:bg-red-900/10 dark:ring-red-500/20'
          }`}
        >
          <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Network
          </span>
          <span
            className={`text-sm font-bold ${isOnline ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <div
          className={`flex flex-col items-center justify-center rounded-2xl p-4 shadow-inner ring-1 transition-all ${
            hasServiceWorker
              ? 'bg-blue-50/50 ring-blue-900/5 dark:bg-blue-900/10 dark:ring-blue-500/20'
              : 'bg-orange-50/50 ring-orange-900/5 dark:bg-orange-900/10 dark:ring-orange-500/20'
          }`}
        >
          <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            PWA cache
          </span>
          <span
            className={`text-center text-sm font-bold leading-tight ${hasServiceWorker ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}
          >
            {hasServiceWorker ? 'READY' : 'WAITING'}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          How to install
        </h3>
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-4">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-bold text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                {index + 1}
              </span>
              <p className="pt-0.5 text-sm font-medium text-gray-700 dark:text-gray-300">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default PwaReadinessPanel
