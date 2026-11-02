/** Decorative landscape motion runs only while visitors can see it. */
export function mountBlissMotion(host: HTMLElement): { destroy(): void } {
  const events = new AbortController()
  const { signal } = events
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let visible = false
  let pageActive = true
  let destroyed = false

  function syncMotion() {
    if (destroyed) return
    host.dataset.motion = visible && pageActive && !document.hidden && !reducedMotion.matches
      ? 'active'
      : 'paused'
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    syncMotion()
  })
  observer.observe(host)
  reducedMotion.addEventListener('change', syncMotion, { signal })
  document.addEventListener('visibilitychange', syncMotion, { signal })
  window.addEventListener('pagehide', () => { pageActive = false; syncMotion() }, { signal })
  window.addEventListener('pageshow', () => { pageActive = true; syncMotion() }, { signal })
  syncMotion()

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      events.abort()
      observer.disconnect()
      delete host.dataset.motion
    },
  }
}
