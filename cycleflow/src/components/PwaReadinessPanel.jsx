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
    <section className="smooth-card space-y-4 rounded-[2rem] p-6 shadow-xl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Install and readiness</h2>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-snug">
          This is a web app install (PWA), no App Store registration required.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-inner ring-1 ${
          isOnline 
          ? 'bg-green-50/50 ring-green-900/5 dark:bg-green-900/10 dark:ring-green-500/20' 
          : 'bg-red-50/50 ring-red-900/5 dark:bg-red-900/10 dark:ring-red-500/20'
        }`}>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Network</span>
          <span className={`text-sm font-bold ${isOnline ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <div className={`rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-inner ring-1 ${
          hasServiceWorker 
          ? 'bg-blue-50/50 ring-blue-900/5 dark:bg-blue-900/10 dark:ring-blue-500/20' 
          : 'bg-orange-50/50 ring-orange-900/5 dark:bg-orange-900/10 dark:ring-orange-500/20'
        }`}>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">PWA CACHE</span>
          <span className={`text-sm font-bold text-center leading-tight ${hasServiceWorker ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>
            {hasServiceWorker ? 'READY' : 'WAITING'}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">How to install</h3>
        <ol className="space-y-3">
          {[
            'Open deployed URL in iPhone Safari.',
            'Tap Share, then Add to Home Screen.',
            'Launch from home icon and save a test entry.',
            'Turn on Airplane Mode to confirm offline access.'
          ].map((step, idx) => (
            <li key={idx} className="flex gap-4 items-start">
              <span className="flex-none w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default PwaReadinessPanel
