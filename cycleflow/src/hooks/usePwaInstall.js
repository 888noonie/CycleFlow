import { useCallback, useEffect, useMemo, useState } from 'react'

function detectPlatform() {
  if (typeof navigator === 'undefined') {
    return 'desktop'
  }
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'ios'
  }
  if (/Android/.test(ua)) {
    return 'android'
  }
  return 'desktop'
}

function detectStandalone() {
  if (typeof window === 'undefined') {
    return false
  }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(detectStandalone)
  const platform = useMemo(() => detectPlatform(), [])

  useEffect(() => {
    const onInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const onInstalled = () => {
      setDeferredPrompt(null)
      setIsStandalone(true)
    }

    const onDisplayMode = () => {
      setIsStandalone(detectStandalone())
    }

    window.addEventListener('beforeinstallprompt', onInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', onDisplayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', onDisplayMode)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return { ok: false, reason: 'unavailable' }
    }
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (choice.outcome === 'accepted') {
      setIsStandalone(true)
      return { ok: true }
    }
    return { ok: false, reason: 'dismissed' }
  }, [deferredPrompt])

  return {
    platform,
    isStandalone,
    canPromptInstall: Boolean(deferredPrompt),
    promptInstall,
  }
}
