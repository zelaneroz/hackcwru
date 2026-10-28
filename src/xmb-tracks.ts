import './xmb-tracks.css'

const tracks = [
  {
    id: 'software',
    title: 'Software',
    subtitle: 'Ideas, compiled.',
    description: 'Build websites, apps, AI tools, or something entirely new. Turn a problem into software people can use.',
    tags: ['Web & mobile', 'AI & data', 'Developer tools'],
    icon: '<rect x="13" y="18" width="70" height="51" rx="5"/><path d="M13 31h70M24 25h1m7 0h1m7 0h1M37 41l-9 8 9 8m22-16 9 8-9 8M51 39l-6 20M36 69v10m24-10v10M27 79h42"/>',
  },
  {
    id: 'hardware',
    title: 'Hardware',
    subtitle: 'Take it off the screen.',
    description: 'Connect code to the physical world. Experiment with electronics, sensors, robotics, and devices that do something real.',
    tags: ['Electronics', 'Robotics', 'Connected devices'],
    icon: '<rect x="25" y="25" width="46" height="46" rx="4"/><rect x="36" y="36" width="24" height="24" rx="2"/><path d="M34 13v12m14-12v12m14-12v12M34 71v12m14-12v12m14-12v12M13 34h12m-12 14h12m-12 14h12M71 34h12m-12 14h12m-12 14h12"/>',
  },
  {
    id: 'special',
    title: 'Special',
    subtitle: 'Leave the obvious behind.',
    description: 'Bring the unexpected: a playful experiment, a surprising mashup, or an idea that refuses to fit neatly into a category.',
    tags: ['Creative tech', 'Experimental', 'Wildcard'],
    icon: '<path d="M48 14l9 23 25 2-19 16 6 25-21-14-21 14 6-25-19-16 25-2Z"/><path d="M78 13v12m-6-6h12M14 70v10m-5-5h10"/>',
  },
] as const

let instance = 0

/** A horizontal, independently scrolling track selector over the existing world. */
export function mountXmbTracks(host: HTMLElement): { destroy(): void } {
  const prefix = `xmb-tracks-${++instance}`
  const stage = document.createElement('div')
  stage.className = 'xmb-tracks-stage'
  stage.innerHTML = `
    <section class="xmb-tracks" aria-labelledby="${prefix}-title">
      <div class="xmb-atmosphere" aria-hidden="true">
        <svg class="xmb-waves" viewBox="0 0 1400 800" preserveAspectRatio="none" focusable="false">
          <defs><linearGradient id="${prefix}-ribbon" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c3edff" stop-opacity=".03"/><stop offset=".5" stop-color="#e5faff" stop-opacity=".28"/><stop offset="1" stop-color="#8cc9ff" stop-opacity=".02"/></linearGradient></defs>
          <path d="M-150 410C180 650 400 210 770 330S1120 480 1550 210L1550 270C1120 540 1010 430 770 386S170 720-150 465Z" fill="url(#${prefix}-ribbon)"/>
          <path d="M-150 425C210 630 420 230 770 345S1190 450 1550 225" fill="none" stroke="#d2f4ff" stroke-width="2" opacity=".34"/>
          <path d="M-150 477C200 650 480 300 800 410S1230 390 1550 330" fill="none" stroke="#c4e8ff" stroke-width="32" opacity=".08"/>
          <path d="M-150 491C220 645 490 309 800 424S1240 395 1550 342" fill="none" stroke="#c9eeff" stroke-width="1.5" opacity=".22"/>
          ${Array.from({ length: 32 }, (_, i) => `<circle cx="${(i * 173 + 37) % 1400}" cy="${(i * 113 + 53) % 800}" r="${i % 4 === 0 ? 1.5 : .8}" fill="#e2f5ff" opacity="${i % 3 === 0 ? .45 : .2}"/>`).join('')}
        </svg>
      </div>

      <header class="xmb-header">
        <div><p class="xmb-eyebrow">HACKCWRU / 2027</p><h2 id="${prefix}-title">Tracks</h2></div>
        <span class="xmb-count" aria-hidden="true">01 <span>/ 03</span></span>
      </header>

      <div class="xmb-track-rail" role="tablist" aria-label="Choose a hackathon track" aria-orientation="horizontal">
        ${tracks.map((track, index) => `
          <button class="xmb-track-tab" type="button" id="${prefix}-${track.id}" role="tab" aria-selected="${index === 0}" aria-controls="${prefix}-panel" tabindex="${index === 0 ? 0 : -1}" data-track-index="${index}">
            <span class="xmb-track-icon" aria-hidden="true"><svg viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">${track.icon}</svg></span>
            <span class="xmb-track-name">${track.title}</span>
          </button>`).join('')}
      </div>

      <article class="xmb-track-detail" id="${prefix}-panel" role="tabpanel" aria-labelledby="${prefix}-software" tabindex="0" aria-live="polite" aria-atomic="true">
        <p class="xmb-track-subtitle"></p>
        <h3 class="xmb-track-title"></h3>
        <p class="xmb-track-description"></p>
        <ul class="xmb-track-tags" aria-label="Project ideas"></ul>
      </article>

      <footer class="xmb-footer">
        <span class="xmb-navigation-hint">Swipe or use <span aria-hidden="true">← →</span><span class="xmb-sr-only">the left and right arrow keys</span></span>
        <div class="xmb-navigation-buttons">
          <button class="xmb-step" type="button" data-step="-1" aria-label="Previous track"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button>
          <button class="xmb-step" type="button" data-step="1" aria-label="Next track"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button>
        </div>
      </footer>
    </section>
  `
  host.append(stage)

  const rail = stage.querySelector<HTMLElement>('.xmb-track-rail')!
  const tabs = Array.from(stage.querySelectorAll<HTMLButtonElement>('.xmb-track-tab'))
  const panel = stage.querySelector<HTMLElement>('.xmb-track-detail')!
  const subtitle = stage.querySelector<HTMLElement>('.xmb-track-subtitle')!
  const title = stage.querySelector<HTMLElement>('.xmb-track-title')!
  const description = stage.querySelector<HTMLElement>('.xmb-track-description')!
  const tags = stage.querySelector<HTMLElement>('.xmb-track-tags')!
  const count = stage.querySelector<HTMLElement>('.xmb-count')!
  const previous = stage.querySelector<HTMLButtonElement>('[data-step="-1"]')!
  const next = stage.querySelector<HTMLButtonElement>('[data-step="1"]')!
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const events = new AbortController()
  const { signal } = events
  let active = 0
  let offsets: number[] = []
  let pendingIndex: number | null = null
  let scrollFrame = 0
  let resizeFrame = 0
  let wheelDelta = 0
  let wheelLockUntil = 0
  let destroyed = false

  function showTrack(index: number) {
    active = index
    const track = tracks[index]!
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index))
      tab.tabIndex = i === index ? 0 : -1
    })
    panel.setAttribute('aria-labelledby', tabs[index]!.id)
    subtitle.textContent = track.subtitle
    title.textContent = track.title
    description.textContent = track.description
    tags.replaceChildren(...track.tags.map((tag) => {
      const item = document.createElement('li')
      item.textContent = tag
      return item
    }))
    count.innerHTML = `${String(index + 1).padStart(2, '0')} <span>/ 03</span>`
    previous.disabled = index === 0
    next.disabled = index === tracks.length - 1
    panel.scrollTop = 0
  }

  function align(index: number, smooth = true) {
    pendingIndex = index
    rail.scrollTo({ left: offsets[index] ?? 0, behavior: smooth && !motion.matches ? 'smooth' : 'auto' })
  }

  function select(index: number, focus = false) {
    index = Math.max(0, Math.min(tracks.length - 1, index))
    if (index !== active) showTrack(index)
    if (focus) tabs[index]!.focus({ preventScroll: true })
    align(index)
  }

  function measure() {
    resizeFrame = 0
    if (destroyed) return
    offsets = tabs.map((tab) => Math.max(0, tab.offsetLeft + tab.offsetWidth / 2 - rail.clientWidth / 2))
    align(active, false)
  }

  function onScroll() {
    if (scrollFrame) return
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0
      if (destroyed || !offsets.length) return
      if (pendingIndex !== null) {
        if (Math.abs(rail.scrollLeft - offsets[pendingIndex]!) > 2) return
        pendingIndex = null
      }
      const nearest = offsets.reduce((best, offset, index) => Math.abs(offset - rail.scrollLeft) < Math.abs(offsets[best]! - rail.scrollLeft) ? index : best, 0)
      if (nearest !== active) showTrack(nearest)
    })
  }

  rail.addEventListener('scroll', onScroll, { passive: true, signal })
  rail.addEventListener('pointerdown', () => { pendingIndex = null }, { passive: true, signal })
  rail.addEventListener('wheel', (event) => {
    if (event.ctrlKey) return
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) { pendingIndex = null; return }
    if (!event.deltaY) return
    const now = performance.now()
    if (now < wheelLockUntil) { event.preventDefault(); return }
    const direction = Math.sign(event.deltaY)
    // At either end, let ordinary vertical scrolling continue through the page.
    if ((active === 0 && direction < 0) || (active === tracks.length - 1 && direction > 0)) return
    event.preventDefault()
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rail.clientWidth : 1
    if (Math.sign(wheelDelta) !== direction) wheelDelta = 0
    wheelDelta += event.deltaY * unit
    if (Math.abs(wheelDelta) < 32) return
    wheelDelta = 0
    wheelLockUntil = now + 340
    select(active + direction)
  }, { passive: false, signal })

  rail.addEventListener('keydown', (event) => {
    const index = event.key === 'ArrowRight' ? active + 1
      : event.key === 'ArrowLeft' ? active - 1
      : event.key === 'Home' ? 0
      : event.key === 'End' ? tracks.length - 1
      : null
    if (index === null) return
    event.preventDefault()
    select(index, true)
  }, { signal })

  stage.addEventListener('click', (event) => {
    const target = event.target as Element
    const tab = target.closest<HTMLButtonElement>('[data-track-index]')
    if (tab) { select(Number(tab.dataset.trackIndex), true); return }
    const step = target.closest<HTMLButtonElement>('[data-step]')
    if (step && !step.disabled) select(active + Number(step.dataset.step))
  }, { signal })

  const resize = new ResizeObserver(() => {
    if (!resizeFrame && !destroyed) resizeFrame = window.requestAnimationFrame(measure)
  })
  resize.observe(rail)
  const refreshMotion = () => align(active, false)
  motion.addEventListener('change', refreshMotion)
  showTrack(0)
  measure()

  return {
    destroy() {
      destroyed = true
      events.abort()
      resize.disconnect()
      motion.removeEventListener('change', refreshMotion)
      window.cancelAnimationFrame(scrollFrame)
      window.cancelAnimationFrame(resizeFrame)
      stage.remove()
    },
  }
}
