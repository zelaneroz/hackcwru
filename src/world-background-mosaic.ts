type TerrainLayer = {
  element: HTMLElement | SVGElement
  speed: number
  anchor: number
}

/** Rasterize only the scenery, at one sample per mosaic tile. Each original
 * SVG remains the fallback until its canvas is ready. UI stays full resolution.
 * Separate cloud canvases retain movement without repainting the whole world.
 */
function mountMosaicScenery(container: HTMLElement): { destroy(): void } {
  const definitions = container.parentElement?.querySelector('.world-definitions defs')
  const planes = Array.from(container.querySelectorAll<SVGSVGElement>('.world-plane > svg'))
  const serializer = new XMLSerializer()
  const definitionsMarkup = definitions ? serializer.serializeToString(definitions) : ''
  const canvases = new Set<HTMLCanvasElement>()
  const pendingImages = new Set<HTMLImageElement>()
  let generation = 0
  let destroyed = false
  let resizeTimer = 0
  let lastSize = ''

  const herd = document.createElement('div')
  herd.className = 'mosaic-herd'
  herd.setAttribute('aria-hidden', 'true')
  const cow = `<svg viewBox="0 0 64 44" focusable="false" aria-hidden="true" shape-rendering="crispEdges">
    <path fill="#264d24" opacity=".3" d="M6 39h50v4H6z"/>
    <g class="mosaic-cow-body">
      <path fill="#413f38" d="M11 25h6v15h-5zm26 0h6v15h-5z"/>
      <path fill="#e9e6cd" d="M18 28h5v11h-5zm27-3h5v14h-5z"/>
      <path fill="#f5f1dc" d="M8 10h38v4h6v16H8z"/>
      <path fill="#363d39" d="M12 10h12v5h5v9H17v-5h-5zm24 8h10v10H34v-5h2z"/>
      <path fill="#c6c9ad" d="M8 28h39v4H8z"/>
      <path fill="#45473b" d="M4 12h4v18H4v5H1v-7h3z"/>
      <g class="mosaic-cow-head">
        <path fill="#d4cba3" d="M46 10V5h3v7h8V7h3v9H46z"/>
        <path fill="#363d39" d="M44 12h15v7h4v13h-5v4H47V24h-3z"/>
        <path fill="#f7f2d9" d="M51 14h4v13h-4z"/>
        <path fill="#d9a59a" d="M48 29h13v7H48z"/>
        <path fill="#272c26" d="M49 19h2v2h-2zm9 0h2v2h-2zm-7 13h2v2h-2zm6 0h2v2h-2z"/>
      </g>
    </g>
  </svg>`
  herd.innerHTML = [0, 1, 2, 3].map((index) =>
    `<span class="mosaic-cow mosaic-cow--${index + 1}">${cow}</span>`,
  ).join('')
  container.querySelector('#main')?.append(herd)
  container.classList.add('world-mosaic')

  function rasterize() {
    if (destroyed) return
    const bounds = container.getBoundingClientRect()
    const tile = window.innerWidth < 600 ? 8 : 12
    const width = Math.max(1, Math.ceil(bounds.width / tile))
    const height = Math.max(1, Math.ceil(bounds.height / tile))
    const size = `${width}:${height}`
    if (size === lastSize) return
    lastSize = size
    const revision = ++generation

    for (const svg of planes) {
      const parent = svg.parentElement!
      const cloudGroups = parent.classList.contains('clouds')
        ? Array.from(svg.querySelectorAll(':scope > g')) : []
      const artworks: Element[] = cloudGroups.length ? cloudGroups : [svg]
      const replacements: HTMLCanvasElement[] = []
      let completed = 0
      let failed = false
      artworks.forEach((artwork, index) => {
        const image = new Image()
        pendingImages.add(image)
        const markup = artwork === svg ? svg.innerHTML : serializer.serializeToString(artwork)
        const source = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 1600 7000" preserveAspectRatio="none">${definitionsMarkup}${markup}</svg>`
        image.onload = () => {
          pendingImages.delete(image)
          if (destroyed || revision !== generation) return
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          canvas.className = 'mosaic-plane-texture'
          canvas.setAttribute('aria-hidden', 'true')
          if (cloudGroups.length) canvas.classList.add(index ? 'mosaic-cloud-near' : 'mosaic-cloud-far')
          const context = canvas.getContext('2d')
          if (!context) { failed = true; return }
          context.drawImage(image, 0, 0, width, height)
          replacements[index] = canvas
          completed++
          if (completed !== artworks.length || failed) return
          for (const old of Array.from(parent.querySelectorAll<HTMLCanvasElement>('.mosaic-plane-texture'))) {
            old.remove()
            canvases.delete(old)
          }
          for (const replacement of replacements) {
            parent.append(replacement)
            canvases.add(replacement)
          }
          svg.classList.add('mosaic-source-ready')
        }
        image.onerror = () => { pendingImages.delete(image); failed = true }
        // Data URLs avoid object-URL lifetime races during resize and HMR.
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
      })
    }
  }

  function refreshMosaic() {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(rasterize, 160)
  }
  const observer = new ResizeObserver(refreshMosaic)
  observer.observe(container)
  window.addEventListener('resize', refreshMosaic, { passive: true })
  rasterize()

  return {
    destroy() {
      destroyed = true
      generation++
      window.clearTimeout(resizeTimer)
      observer.disconnect()
      window.removeEventListener('resize', refreshMosaic)
      for (const image of pendingImages) { image.onload = null; image.onerror = null; image.src = '' }
      pendingImages.clear()
      for (const canvas of canvases) canvas.remove()
      canvases.clear()
      for (const svg of planes) svg.classList.remove('mosaic-source-ready')
      herd.remove()
      container.classList.remove('world-mosaic')
    },
  }
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
  const mosaic = mountMosaicScenery(container)
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
      mosaic.destroy()
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
