import './hero-imac.css'

export type ImacHeroOptions = { registrationUrl: string }

const EVENT_START = Date.parse('2027-01-22T09:00:00-05:00')

/** Live Mac OS interface inside a photographic iMac; no landscape changes. */
export function mountImacHero(host: HTMLElement, options: ImacHeroOptions): { destroy(): void } {
  const stage = document.createElement('div')
  stage.className = 'imac-hero-stage'
  stage.innerHTML = `
    <div class="imac-hero-frame">
      <img class="imac-hero-hardware" src="/imac-g3-cutout.png" width="1254" height="1254" alt="" aria-hidden="true" fetchpriority="high" decoding="async" draggable="false">
      <section class="imac-hero-screen" aria-labelledby="imac-hero-title">
        <div class="imac-hero-menu" aria-hidden="true">
          <span class="imac-hero-menu-app"><svg viewBox="0 0 16 16" focusable="false"><path d="M1 1h14v14H1Z" fill="#ced9ed" stroke="#20252b"/><path d="M8 1v14M4 5v2m7-2v2M4 10q4 3 8-1" fill="none" stroke="#20252b" stroke-width="1"/></svg>HackCWRU</span>
          <span>Welcome</span>
        </div>
        <div class="imac-hero-content">
          <h1 id="imac-hero-title">HackCWRU 2027</h1>
          <p class="imac-hero-date">Jan 22–24</p>
          <div class="imac-hero-countdown" role="timer" aria-live="off" aria-label="Time until HackCWRU 2027">
            ${['DAYS', 'HRS', 'MIN', 'SEC'].map((unit) => `<div class="imac-hero-unit"><span class="imac-hero-digits" data-imac-clock>00</span><span class="imac-hero-unit-label">${unit}</span></div>`).join('')}
          </div>
          <a class="imac-hero-register" target="_blank" rel="noopener noreferrer">Register</a>
        </div>
      </section>
    </div>
  `
  const register = stage.querySelector<HTMLAnchorElement>('.imac-hero-register')!
  register.href = options.registrationUrl
  const countdown = stage.querySelector<HTMLElement>('.imac-hero-countdown')!
  const digits = Array.from(stage.querySelectorAll<HTMLElement>('[data-imac-clock]'))
  const marker = host.querySelector<HTMLElement>(':scope > .section-marker')
  const nextSibling = marker?.nextSibling ?? null
  marker?.remove()
  host.append(stage)

  const events = new AbortController()
  let interval: number | undefined
  let destroyed = false

  function stopClock() {
    if (interval !== undefined) window.clearInterval(interval)
    interval = undefined
  }

  function updateClock() {
    const remaining = Math.max(0, Math.ceil((EVENT_START - Date.now()) / 1000))
    const values = [
      Math.floor(remaining / 86400),
      Math.floor(remaining / 3600) % 24,
      Math.floor(remaining / 60) % 60,
      remaining % 60,
    ]
    values.forEach((value, index) => { digits[index]!.textContent = String(value).padStart(2, '0') })
    countdown.setAttribute('aria-label', `${values[0]} days, ${values[1]} hours, ${values[2]} minutes, ${values[3]} seconds until HackCWRU 2027`)
    if (remaining === 0) stopClock()
    return remaining
  }

  function refreshClock() {
    if (!destroyed && !document.hidden) updateClock()
  }
  window.addEventListener('pageshow', refreshClock, { signal: events.signal })
  document.addEventListener('visibilitychange', refreshClock, { signal: events.signal })
  if (updateClock() > 0) interval = window.setInterval(updateClock, 1000)

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      stopClock()
      events.abort()
      stage.remove()
      if (marker) host.insertBefore(marker, nextSibling?.parentNode === host ? nextSibling : host.firstChild)
    },
  }
}
