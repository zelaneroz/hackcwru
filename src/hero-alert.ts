import './hero-alert.css'

export type HeroAlertOptions = { registrationUrl: string }

const EVENT_START = Date.parse('2027-01-23T09:00:00-05:00')
const warningIcon = `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M9 1h2v2h2v4h2v4h2v4h2v4H1v-4h2v-4h2V7h2V3h2Z" fill="#111"/><path d="M9 4h2v3h2v4h2v4h2v2H3v-2h2v-4h2V7h2Z" fill="#ffdf32"/><path d="M9 7h2v6H9zm0 7h2v2H9Z" fill="#111"/></svg>`
const calendarIcon = `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M2 3h16v15H2Z" fill="#505050"/><path d="M3 4h14v13H3Z" fill="#ffffed"/><path d="M3 4h14v4H3Z" fill="#000080"/><path d="M5 1h2v5H5zm8 0h2v5h-2Z" fill="#fff"/><path d="M5 10h2v2H5zm4 0h2v2H9zm4 0h2v2h-2zm-8 4h2v2H5zm4 0h2v2H9Z" fill="#464646"/></svg>`

/** A modeless foreground window; never changes the world's layout or artwork. */
export function mountHeroAlert(host: HTMLElement, options: HeroAlertOptions): { destroy(): void } {
  const stage = document.createElement('div')
  stage.className = 'hero-alert-stage'
  stage.innerHTML = `
    <img class="hero-alert-computer" src="/hero-computer.png" width="1536" height="1024" alt="" aria-hidden="true" draggable="false" decoding="async">
    <div class="hero-alert-position">
      <div class="hero-alert-shadow" aria-hidden="true"></div>
      <div class="hero-alert-float">
        <section class="hero-alert-window" id="hero-alert-window" role="dialog" aria-modal="false" aria-labelledby="hero-alert-heading">
          <header class="hero-alert-titlebar">
            <span class="hero-alert-warning">${warningIcon}</span>
            <span class="hero-alert-title" title="c:\\system\\hackcwru_2027.exe">
              <span class="hero-alert-title-path">c:\\system\\hackcwru_2027.exe</span>
            </span>
            <button class="hero-alert-close hero-alert-bevel" type="button" aria-label="Close system clock alert"><span aria-hidden="true">×</span></button>
          </header>

          <div class="hero-alert-body">
            <h1 id="hero-alert-heading">HackCWRU 2027!</h1>
            <div class="hero-alert-calendar">${calendarIcon}<span>Jan 23-25, 2027</span></div>

            <div class="hero-alert-countdown" role="timer" aria-live="off" aria-label="Time until HackCWRU 2027">
              ${['DAYS', 'HRS', 'MIN', 'SEC'].map((label) => `<div class="hero-alert-unit"><span class="hero-alert-digits" data-clock-unit>00</span><span class="hero-alert-unit-label">${label}</span></div>`).join('')}
            </div>

            <div class="hero-alert-actions">
              <a class="hero-alert-button hero-alert-register hero-alert-bevel" target="_blank" rel="noopener noreferrer">Register</a>
            </div>

            <nav class="hero-alert-links-row" aria-label="Hero sections">
              <a class="hero-alert-tracks" href="#tracks" data-hero-section="tracks">Tracks &amp; Prizes</a>
              <a class="hero-alert-tracks" href="#schedule" data-hero-section="schedule">Schedule</a>
            </nav>
          </div>
        </section>
      </div>
    </div>
    <button class="hero-alert-restore hero-alert-bevel" type="button" aria-controls="hero-alert-window" aria-label="Restore HackCWRU 2027 window" hidden>${warningIcon}<span>HackCWRU '27</span><span aria-hidden="true">↗</span></button>
  `

  const position = stage.querySelector<HTMLElement>('.hero-alert-position')!
  const closeButton = stage.querySelector<HTMLButtonElement>('.hero-alert-close')!
  const restoreButton = stage.querySelector<HTMLButtonElement>('.hero-alert-restore')!
  const countdown = stage.querySelector<HTMLElement>('.hero-alert-countdown')!
  const digits = Array.from(stage.querySelectorAll<HTMLElement>('[data-clock-unit]'))
  stage.querySelector<HTMLAnchorElement>('.hero-alert-register')!.href = options.registrationUrl

  const marker = host.querySelector<HTMLElement>(':scope > .section-marker')
  const markerNextSibling = marker?.nextSibling ?? null
  marker?.remove()
  host.append(stage)

  const events = new AbortController()
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let interval: number | undefined
  let closed = false
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

  function startClock() {
    stopClock()
    if (updateClock() > 0) interval = window.setInterval(updateClock, 1000)
  }

  function close() {
    closed = true
    stopClock()
    position.hidden = true
    restoreButton.hidden = false
    restoreButton.focus({ preventScroll: true })
  }

  closeButton.addEventListener('click', close, { signal: events.signal })
  restoreButton.addEventListener('click', () => {
    closed = false
    restoreButton.hidden = true
    position.hidden = false
    startClock()
    closeButton.focus({ preventScroll: true })
  }, { signal: events.signal })

  stage.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !closed) {
      event.preventDefault()
      close()
    }
  }, { signal: events.signal })

  stage.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[data-hero-section]')
    if (!anchor) return
    const target = document.getElementById(anchor.dataset.heroSection!)
    if (!target) return
    event.preventDefault()
    if (window.location.hash !== anchor.hash) window.history.pushState(null, '', anchor.hash)
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: motionPreference.matches ? 'auto' : 'smooth', block: 'start' })
  }, { signal: events.signal })

  function refreshClock() {
    if (!closed && !destroyed && !document.hidden) updateClock()
  }
  window.addEventListener('pageshow', refreshClock, { signal: events.signal })
  document.addEventListener('visibilitychange', refreshClock, { signal: events.signal })
  startClock()

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      stopClock()
      events.abort()
      stage.remove()
      if (marker) host.insertBefore(marker, markerNextSibling?.parentNode === host ? markerNextSibling : host.firstChild)
    },
  }
}
