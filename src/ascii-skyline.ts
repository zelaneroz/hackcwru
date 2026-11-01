import { renderSkylineFrame } from './skyline-art'

/** Live text artwork with no animation work while the illustration is hidden. */
export function mountAsciiSkyline(host: HTMLElement): { destroy(): void } {
  const art = document.createElement('div')
  art.className = 'skyline-art'
  art.setAttribute('role', 'img')
  art.setAttribute('aria-label', 'ASCII illustration of the Cleveland skyline, with gently moving clouds, twinkling windows, and water.')
  const text = document.createElement('pre')
  text.className = 'skyline-ascii'
  text.setAttribute('aria-hidden', 'true')
  art.append(text)
  host.append(art)

  const events = new AbortController()
  const { signal } = events
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let lastText = ''
  let visible = false
  let pageActive = true
  let destroyed = false
  let timer: number | undefined

  function render() {
    const next = renderSkylineFrame(frame)
    if (next !== lastText) text.textContent = next
    lastText = next
  }

  function canAnimate() {
    return !destroyed && visible && pageActive && !document.hidden && !reducedMotion.matches
  }

  function cancel() {
    if (timer !== undefined) window.clearTimeout(timer)
    timer = undefined
  }

  function syncAnimation() {
    if (destroyed) return
    if (reducedMotion.matches) {
      frame = 0
      render()
    }
    if (!canAnimate()) { cancel(); return }
    if (timer !== undefined) return
    timer = window.setTimeout(() => {
      timer = undefined
      if (!canAnimate()) return
      frame++
      render()
      syncAnimation()
    }, 150)
  }

  render()
  const observer = new IntersectionObserver(([entry]) => {
    if (destroyed) return
    visible = entry?.isIntersecting ?? false
    syncAnimation()
  })
  observer.observe(art)
  reducedMotion.addEventListener('change', syncAnimation, { signal })
  document.addEventListener('visibilitychange', syncAnimation, { signal })
  window.addEventListener('pagehide', () => { pageActive = false; syncAnimation() }, { signal })
  window.addEventListener('pageshow', () => { pageActive = true; syncAnimation() }, { signal })

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      cancel()
      events.abort()
      observer.disconnect()
      art.remove()
    },
  }
}
