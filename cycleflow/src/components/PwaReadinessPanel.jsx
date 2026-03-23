import { useEffect, useState } from 'react'

function PwaReadinessPanel() {
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

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Install and readiness</h2>
      <p className="mt-1 text-xs text-gray-500">
        This is a web app install (PWA), no App Store registration required.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-700">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
          Network: <span className="font-semibold">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
          Service worker:{' '}
          <span className="font-semibold">{hasServiceWorker ? 'Registered' : 'Waiting for first load'}</span>
        </div>
      </div>

      <ol className="mt-3 list-decimal space-y-1 pl-4 text-xs text-gray-700">
        <li>Open deployed URL in iPhone Safari.</li>
        <li>Tap Share, then Add to Home Screen.</li>
        <li>Launch from home icon and save a test entry.</li>
        <li>Turn on Airplane Mode and reopen to confirm offline read access.</li>
      </ol>
    </section>
  )
}

export default PwaReadinessPanel
