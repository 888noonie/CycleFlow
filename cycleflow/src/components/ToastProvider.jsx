import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from '../context/ToastContext'

let toastId = 0

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (message, { tone = 'success', duration = 2800 } = {}) => {
      const id = ++toastId
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--flow-bar-offset,0px)+1rem+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ring-1 backdrop-blur-md animate-[toast-in_0.28s_ease-out] ${
              toast.tone === 'error'
                ? 'bg-rose-950/90 text-rose-50 ring-rose-400/30'
                : toast.tone === 'info'
                  ? 'bg-slate-900/90 text-white ring-white/15'
                  : 'bg-teal-950/90 text-teal-50 ring-teal-400/35'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
