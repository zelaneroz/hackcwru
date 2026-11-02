import './scroll-hero.css'
import { getIntroProgress, getIntroState, getMonitorZoomTarget } from './scroll-hero-state'

let instance = 0

/** A reversible scroll sequence: sleeping desktop, screen zoom, boot, then title screen. */
export function mountScrollHero(host: HTMLElement, options: { registrationUrl: string }): { destroy(): void } {
  const prefix = `scroll-hero-${++instance}`
  host.setAttribute('data-scroll-intro', '')
  const hero = document.createElement('div')
  hero.className = 'scroll-hero'
  hero.innerHTML = `
    <div class="scroll-hero-viewport">
      <div class="intro-room" aria-hidden="true"><div class="intro-parallax-glow"></div></div>
      <div class="intro-zoom">
        <div class="intro-set">
          <img class="intro-scene-image" src="/hero/pixel-laptop.png" width="1536" height="1024" fetchpriority="high" decoding="async" draggable="false" alt="Simplified pixel art of a blue laptop on a desk, with dark window blinds and two blocky hands at the keyboard.">
          <div class="intro-monitor-screen" aria-hidden="true"></div>
        </div>
      </div>
      <div class="intro-sleep-ui">
        <div class="intro-scroll-cue"><span>Scroll to wake the laptop</span><span aria-hidden="true">↓</span></div>
      </div>
      <div class="intro-loader" aria-hidden="true">
        <div class="intro-loader-center">
          <svg class="intro-boot-mark" viewBox="0 0 160 110" fill="none" stroke-width="12" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
            <path stroke="#f78127" d="M50 22 14 55"/>
            <path stroke="#0b64c6" d="m14 55 36 33"/>
            <path stroke="#83a251" d="M94 18 70 92"/>
            <path stroke="#f3d35b" d="m114 22 34 33-34 33"/>
          </svg>
          <p class="intro-loader-kicker">welcome to</p>
          <div class="intro-loader-title">HackCWRU<span class="intro-loader-year">2027</span></div>
          <div class="intro-loader-meter"><div class="intro-loader-fill"></div></div>
          <p class="intro-loader-copy">Loading your next big idea...</p>
        </div>
      </div>
      <section class="intro-poster" aria-labelledby="${prefix}-title" aria-hidden="true" inert>
        <div class="intro-poster-haze" aria-hidden="true"></div>
        <div class="intro-poster-topline"><span>Case Western Reserve University<br>Cleveland, Ohio</span></div>
        <img class="intro-poster-city" src="/hero/retro-city.svg" width="1600" height="400" alt="" aria-hidden="true" draggable="false">
        <h1 class="intro-poster-title" id="${prefix}-title"><span class="intro-poster-word">HackCWRU</span><span class="intro-poster-year">2027</span></h1>
        <p class="intro-poster-tagline">Jan 25–27, 2027</p>
        <div class="intro-poster-actions"><a class="intro-start" target="_blank" rel="noopener noreferrer" aria-label="Apply to HackCWRU (opens in a new tab)">[ APPLY ]</a></div>
      </section>
    </div>
  `
  host.append(hero)
  hero.querySelector<HTMLAnchorElement>('.intro-start')!.href = options.registrationUrl

  const viewport = hero.querySelector<HTMLElement>('.scroll-hero-viewport')!
  const zoom = hero.querySelector<HTMLElement>('.intro-zoom')!
  const screen = hero.querySelector<HTMLElement>('.intro-monitor-screen')!
  const scene = hero.querySelector<HTMLImageElement>('.intro-scene-image')!
  const sleep = hero.querySelector<HTMLElement>('.intro-sleep-ui')!
  const glow = hero.querySelector<HTMLElement>('.intro-parallax-glow')!
  const loader = hero.querySelector<HTMLElement>('.intro-loader')!
  const fill = hero.querySelector<HTMLElement>('.intro-loader-fill')!
  const poster = hero.querySelector<HTMLElement>('.intro-poster')!
  const city = hero.querySelector<HTMLElement>('.intro-poster-city')!
  const events = new AbortController()
  const { signal } = events
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let destroyed = false
  let dirty = true
  let frame: number | undefined
  let target = { originX: 0, originY: 0, x: 0, y: 0, scale: 1 }

  function measure() {
    const previous = zoom.style.transform
    zoom.style.transform = 'none'
    const area = viewport.getBoundingClientRect()
    const monitor = screen.getBoundingClientRect()
    if (monitor.width && monitor.height) {
      target = getMonitorZoomTarget({ width: area.width, height: area.height }, {
        left: monitor.left - area.left, top: monitor.top - area.top,
        width: monitor.width, height: monitor.height,
      })
    }
    zoom.style.transform = previous
    dirty = false
  }

  function render() {
    frame = undefined
    if (destroyed) return
    if (dirty) measure()
    const area = hero.getBoundingClientRect()
    const stage = viewport.getBoundingClientRect()
    const state = getIntroState(getIntroProgress(area.top, area.height, stage.height), reducedMotion.matches)
    const scale = 1 + (target.scale - 1) * state.zoom
    zoom.style.transformOrigin = `${target.originX}px ${target.originY}px`
    zoom.style.transform = `translate3d(${target.x * state.zoom}px, ${target.y * state.zoom}px, 0) scale(${scale})`
    zoom.style.opacity = String(state.scene)
    zoom.setAttribute('aria-hidden', String(state.scene < .1))
    sleep.style.opacity = String(state.sleep)
    sleep.style.transform = `translate3d(0, ${-state.zoom * 36}px, 0)`
    sleep.setAttribute('aria-hidden', String(state.sleep < .1))
    glow.style.transform = `translate3d(0, ${-state.zoom * 70}px, 0)`
    loader.style.opacity = String(state.loader)
    fill.style.width = `${state.loading * 100}%`
    poster.style.opacity = String(state.poster)
    poster.style.transform = `scale(${1.06 - state.poster * .06})`
    city.style.transform = `translate3d(0, ${(1 - state.poster) * 60}px, 0)`
    poster.inert = !state.ready
    poster.setAttribute('aria-hidden', String(!state.ready))
    poster.style.pointerEvents = state.ready ? 'auto' : 'none'
    const inView = area.bottom > 0 && area.top < stage.height
    hero.style.setProperty('--intro-screen-play-state', inView && state.scene > .02 && !document.hidden ? 'running' : 'paused')
    document.documentElement.classList.toggle('intro-running', inView && !state.ready && !reducedMotion.matches)
    hero.dataset.phase = state.phase
  }

  function requestRender() {
    if (!destroyed && frame === undefined) frame = window.requestAnimationFrame(render)
  }

  function invalidate() { dirty = true; requestRender() }
  window.addEventListener('scroll', requestRender, { passive: true, signal })
  window.addEventListener('resize', invalidate, { signal })
  window.addEventListener('pageshow', invalidate, { signal })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hero.style.setProperty('--intro-screen-play-state', 'paused')
    else requestRender()
  }, { signal })
  reducedMotion.addEventListener('change', invalidate, { signal })
  scene.addEventListener('load', invalidate, { signal })
  const observer = new ResizeObserver(invalidate)
  observer.observe(viewport)
  observer.observe(screen)
  void document.fonts.ready.then(() => { if (!destroyed) invalidate() })
  render()

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      events.abort()
      observer.disconnect()
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      document.documentElement.classList.remove('intro-running')
      host.removeAttribute('data-scroll-intro')
      hero.remove()
    },
  }
}
