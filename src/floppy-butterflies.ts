import './floppy-butterflies.css'

type Point = { x: number; y: number }
type Butterfly = {
  element: HTMLElement
  position: Point
  from: Point
  to: Point
  bend: Point
  started: number
  duration: number
  restingUntil: number
  target?: HTMLElement
  edge: number
  nextDigit: number
}

const random = (min: number, max: number) => min + Math.random() * (max - min)
const windowSelector = '.imac-hero-screen, .info-webcore-card, .purble-track-detail, .mac-calendar-window, .faq-messages-window, .sponsors-player'

/** Two decorative visitors share one animation loop and never intercept input. */
export function mountFloppyButterflies(): { destroy(): void } {
  const layer = document.createElement('div')
  layer.className = 'floppy-butterflies'
  layer.setAttribute('aria-hidden', 'true')
  document.body.append(layer)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const particles: { element: HTMLElement; until: number }[] = []
  let width = window.innerWidth
  let height = window.innerHeight
  let frame = 0
  let previousTime = 0
  let time = 0
  let geometryDirty = true
  let destroyed = false
  const disk = `<svg viewBox="0 0 32 38" focusable="false">
    <path class="floppy-shell" d="M2 1h23l6 6v29H1V1z"/>
    <path fill="#e5f9ff" fill-opacity=".7" stroke="#eaffff" d="M7 1h16v12H7z"/>
    <path fill="#4e6b91" fill-opacity=".8" d="M17 3h4v8h-4z"/>
    <path fill="#efffff" fill-opacity=".68" stroke="#fff" d="M6 20h20v15H6z"/>
    <path stroke="#537d9b" stroke-opacity=".8" d="M9 25h14M9 28h10M9 31h12"/>
    <path fill="#fff" fill-opacity=".7" d="M3 3h2v14H3zM3 34h2v2H3zM27 33h2v2h-2z"/>
  </svg>`

  function safe(point: Point): Point {
    const margin = Math.min(46, width / 4, height / 4)
    return { x: Math.max(margin, Math.min(width - margin, point.x)), y: Math.max(margin, Math.min(height - margin, point.y)) }
  }

  const visitors: Butterfly[] = Array.from({ length: 2 }, (_, index) => {
    const element = document.createElement('span')
    element.className = `floppy-butterfly floppy-butterfly--${index + 1}`
    element.innerHTML = `<span class="floppy-butterfly-shape"><span class="floppy-wing floppy-wing--left">${disk}</span><span class="floppy-wing floppy-wing--right">${disk}</span><span class="floppy-butterfly-body"></span></span>`
    layer.append(element)
    const position = safe({ x: width * (.16 + index * .68), y: height * random(.2, .8) })
    return { element, position, from: position, to: position, bend: position, started: 0, duration: 1, restingUntil: 0, edge: .2, nextDigit: random(200, 900) }
  })

  function perch(target: HTMLElement, edge: number): Point | undefined {
    const bounds = target.getBoundingClientRect()
    if (bounds.width < 40 || bounds.height < 20 || bounds.top < 34 || bounds.top > height - 55 || bounds.right < 40 || bounds.left > width - 40 || target.closest('[hidden]')) return
    return safe({ x: bounds.left + bounds.width * edge, y: bounds.top - 12 })
  }

  function fly(visitor: Butterfly) {
    visitor.target = undefined
    visitor.edge = Math.random() > .5 ? .2 : .8
    let destination: Point | undefined
    if (Math.random() < .7) {
      const windows = Array.from(document.querySelectorAll<HTMLElement>(windowSelector))
        .filter(target => !visitors.some(other => other !== visitor && other.target === target))
        .map(target => ({ target, point: perch(target, visitor.edge) }))
        .filter((entry): entry is { target: HTMLElement; point: Point } => Boolean(entry.point))
      const choice = windows[Math.floor(Math.random() * windows.length)]
      if (choice) { visitor.target = choice.target; destination = choice.point }
    }
    visitor.from = { ...visitor.position }
    visitor.to = destination ?? safe({ x: random(30, width - 30), y: random(45, height - 80) })
    visitor.bend = safe({ x: (visitor.from.x + visitor.to.x) / 2 + random(-160, 160), y: (visitor.from.y + visitor.to.y) / 2 + random(-150, 150) })
    visitor.started = time
    visitor.duration = random(6000, 12500)
    visitor.restingUntil = 0
    visitor.element.classList.remove('is-perched')
  }

  function draw(visitor: Butterfly) {
    visitor.element.style.transform = `translate3d(${visitor.position.x.toFixed(1)}px, ${visitor.position.y.toFixed(1)}px, 0)`
  }

  function clearParticles() {
    particles.forEach(particle => particle.element.remove())
    particles.length = 0
  }

  function tick(timestamp: number) {
    frame = 0
    if (destroyed || document.hidden || motion.matches) return
    time += previousTime ? Math.min(64, timestamp - previousTime) : 0
    previousTime = timestamp
    for (const visitor of visitors) {
      if (geometryDirty) {
        if (visitor.target) {
          const point = perch(visitor.target, visitor.edge)
          if (point) { visitor.to = point; if (visitor.restingUntil) visitor.position = point }
          else fly(visitor)
        }
        visitor.position = safe(visitor.position)
      }
      if (visitor.restingUntil) {
        if (time >= visitor.restingUntil) fly(visitor)
      } else {
        const progress = Math.min(1, (time - visitor.started) / visitor.duration)
        const eased = progress * progress * (3 - 2 * progress)
        const inverse = 1 - eased
        const flutter = Math.sin(progress * Math.PI)
        visitor.position = safe({
          x: inverse ** 2 * visitor.from.x + 2 * inverse * eased * visitor.bend.x + eased ** 2 * visitor.to.x + Math.sin(time / 370) * 9 * flutter,
          y: inverse ** 2 * visitor.from.y + 2 * inverse * eased * visitor.bend.y + eased ** 2 * visitor.to.y + Math.cos(time / 280) * 12 * flutter,
        })
        if (time >= visitor.nextDigit && particles.length < 24) {
          const digit = document.createElement('span')
          digit.className = 'floppy-binary-digit'
          digit.textContent = Math.random() > .5 ? '1' : '0'
          digit.style.left = `${visitor.position.x}px`
          digit.style.top = `${visitor.position.y + 15}px`
          layer.append(digit)
          particles.push({ element: digit, until: time + 1500 })
          visitor.nextDigit = time + random(450, 1000)
        }
        if (progress === 1) {
          if (visitor.target) { visitor.restingUntil = time + random(2400, 4800); visitor.element.classList.add('is-perched') }
          else fly(visitor)
        }
      }
      draw(visitor)
    }
    geometryDirty = false
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i]!.until <= time) { particles[i]!.element.remove(); particles.splice(i, 1) }
    }
    frame = window.requestAnimationFrame(tick)
  }

  function syncMotion() {
    window.cancelAnimationFrame(frame)
    frame = 0
    previousTime = 0
    clearParticles()
    if (destroyed) return
    layer.classList.toggle('is-paused', motion.matches || document.hidden)
    visitors.forEach(visitor => { visitor.position = safe(visitor.position); draw(visitor) })
    if (!motion.matches && !document.hidden) frame = window.requestAnimationFrame(tick)
  }

  function refresh() {
    width = window.innerWidth
    height = window.innerHeight
    geometryDirty = true
    if (motion.matches) syncMotion()
  }

  visitors.forEach(fly)
  window.addEventListener('scroll', refresh, { passive: true })
  window.addEventListener('resize', refresh, { passive: true })
  document.addEventListener('visibilitychange', syncMotion)
  motion.addEventListener('change', syncMotion)
  syncMotion()
  return {
    destroy() {
      destroyed = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', refresh)
      window.removeEventListener('resize', refresh)
      document.removeEventListener('visibilitychange', syncMotion)
      motion.removeEventListener('change', syncMotion)
      clearParticles()
      layer.remove()
    },
  }
}
