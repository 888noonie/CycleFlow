import { useCallback, useEffect, useRef, useState } from 'react'

const HOLD_MS = 3000

function HoldDeleteButton({
  label = 'Hold to delete',
  warning = 'This data cannot be recovered.',
  disabled = false,
  onConfirm,
  holdMs = HOLD_MS,
}) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const frameRef = useRef(null)
  const startRef = useRef(0)

  const cancelHold = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    setHolding(false)
    setProgress(0)
  }, [])

  const startHold = useCallback(() => {
    if (disabled) return
    setHolding(true)
    startRef.current = performance.now()

    const tick = (now) => {
      const elapsed = now - startRef.current
      const nextProgress = Math.min(100, (elapsed / holdMs) * 100)
      setProgress(nextProgress)

      if (nextProgress >= 100) {
        cancelHold()
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate([20, 40, 20])
        }
        onConfirm?.()
        return
      }
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [cancelHold, disabled, holdMs, onConfirm])

  useEffect(() => () => cancelHold(), [cancelHold])

  const secondsLeft = Math.max(1, Math.ceil(((100 - progress) / 100) * (holdMs / 1000)))

  let labelText = label
  if (holding) {
    labelText = progress >= 100 ? 'Deleting…' : `Keep holding… ${secondsLeft}s`
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        aria-describedby="hold-delete-warning"
        className={`hold-delete-btn focus-ring ${disabled ? 'opacity-45 cursor-not-allowed' : ''} ${
          holding ? 'hold-delete-btn--active' : ''
        }`}
        onPointerDown={(event) => {
          event.preventDefault()
          startHold()
        }}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span
          className="hold-delete-progress"
          style={{ transform: `scaleX(${progress / 100})` }}
          aria-hidden
        />
        <span className="relative z-[1] font-black uppercase tracking-[0.14em]">{labelText}</span>
      </button>
      <p
        id="hold-delete-warning"
        className="text-center text-[11px] font-semibold leading-relaxed text-rose-700/90 dark:text-rose-300/90"
      >
        {warning}
      </p>
    </div>
  )
}

export default HoldDeleteButton
