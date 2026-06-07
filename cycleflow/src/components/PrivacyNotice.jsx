function PrivacyNotice() {
  return (
    <p className="mx-auto mt-3 max-w-md text-[10px] leading-relaxed text-[var(--text-secondary)]">
      <strong className="font-bold text-[var(--text-primary)]">Your logs stay on this device.</strong>{' '}
      CycleFlow does not upload symptom, mood, or cycle data. We use{' '}
      <a
        href="https://vercel.com/docs/analytics"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-teal-700 underline decoration-teal-600/30 underline-offset-2 dark:text-teal-400"
      >
        Vercel Analytics
      </a>{' '}
      for anonymous page views only (no cookies, no health data) so we can see if the app is
      helping people.
    </p>
  )
}

export default PrivacyNotice
