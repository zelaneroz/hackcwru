type TerrainLayer = {
  element: HTMLElement | SVGElement
  speed: number
  anchor: number
}

type SectionBounds = {
  element: HTMLElement
  top: number
  height: number
}

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value))

/**
 * Scroll the scenery as one world. Layers receive an additional, bounded
 * translation; they never change which section supplies the background.
 * All layout reads are cached until the world or viewport changes size.
 */
export function mountWorldBackground(container: HTMLElement): { destroy(): void } {
  const sectionElements = Array.from(
    container.querySelectorAll<HTMLElement>(':scope > [data-world-section]'),
  )
  const layers: TerrainLayer[] = Array.from(
    container.querySelectorAll<HTMLElement | SVGElement>('[data-parallax-speed]'),
    (element) => ({
      element,
      speed: Number(element.dataset.parallaxSpeed) || 0,
      anchor: Number(element.dataset.parallaxAnchor) || 0,
    }),
  )
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let sections: SectionBounds[] = []
  let containerTop = 0
  let containerHeight = 0
  let viewportHeight = window.innerHeight
  let frame = 0
  let metricsDirty = true
  let destroyed = false
  const previousActiveSection = container.getAttribute('data-active-section')

  function measure() {
    viewportHeight = window.innerHeight
    const containerBounds = container.getBoundingClientRect()
    containerTop = containerBounds.top + window.scrollY
    containerHeight = containerBounds.height
    sections = sectionElements.map((element) => {
      const bounds = element.getBoundingClientRect()
      return {
        element,
        top: bounds.top + window.scrollY - containerTop,
        height: bounds.height,
      }
    })
    metricsDirty = false
  }

  function render() {
    frame = 0
    if (destroyed) return
    if (metricsDirty) measure()

    const scrollY = window.scrollY - containerTop
    const maximumScroll = Math.max(1, containerHeight - viewportHeight)
    const viewportCenter = scrollY + viewportHeight / 2
    const parallaxLimit = viewportHeight * 0.3
    let activeSection = ''
    let nearestDistance = Infinity

    container.style.setProperty('--scroll-y', `${scrollY.toFixed(2)}px`)
    container.style.setProperty('--world-progress', clamp(scrollY / maximumScroll).toFixed(5))

    for (const layer of layers) {
      const translation = motionPreference.matches
        ? 0
        : clamp(
            (scrollY - layer.anchor * viewportHeight) * layer.speed,
            -parallaxLimit,
            parallaxLimit,
          )
      layer.element.style.setProperty('--parallax-y', `${translation.toFixed(2)}px`)
    }

    for (const section of sections) {
      const visibleHeight = Math.max(
        0,
        Math.min(scrollY + viewportHeight, section.top + section.height) -
          Math.max(scrollY, section.top),
      )
      section.element.style.setProperty(
        '--section-progress',
        clamp((scrollY - section.top) / Math.max(1, section.height)).toFixed(5),
      )
      section.element.style.setProperty(
        '--section-visibility',
        clamp(visibleHeight / Math.max(1, Math.min(viewportHeight, section.height))).toFixed(5),
      )
      const distance = Math.abs(viewportCenter - (section.top + section.height / 2))
      if (distance < nearestDistance) {
        nearestDistance = distance
        activeSection = section.element.id
      }
    }

    if (container.dataset.activeSection !== activeSection) {
      container.dataset.activeSection = activeSection
    }
  }

  function schedule() {
    if (!destroyed && !frame) frame = window.requestAnimationFrame(render)
  }

  function refresh() {
    metricsDirty = true
    schedule()
  }

  const resizeObserver = new ResizeObserver(refresh)
  resizeObserver.observe(container)
  sectionElements.forEach((section) => resizeObserver.observe(section))

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', refresh, { passive: true })
  window.addEventListener('pageshow', refresh)
  window.addEventListener('hashchange', schedule)
  motionPreference.addEventListener('change', schedule)
  render()

  return {
    destroy() {
      destroyed = true
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('pageshow', refresh)
      window.removeEventListener('hashchange', schedule)
      motionPreference.removeEventListener('change', schedule)
      container.style.removeProperty('--scroll-y')
      container.style.removeProperty('--world-progress')
      for (const layer of layers) layer.element.style.removeProperty('--parallax-y')
      for (const section of sectionElements) {
        section.style.removeProperty('--section-progress')
        section.style.removeProperty('--section-visibility')
      }
      if (previousActiveSection === null) delete container.dataset.activeSection
      else container.setAttribute('data-active-section', previousActiveSection)
    },
  }
}
