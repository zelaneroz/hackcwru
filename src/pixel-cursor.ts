import './pixel-cursor.css'

export interface PixelCursorOptions {
  assetUrl?: string
  initialTarget?: string | HTMLElement
}

let destroyActiveCursor: (() => void) | undefined

/** Mount the shared pixel cursor; call destroy() to restore the native cursor. */
export function mountPixelCursor(options: PixelCursorOptions = {}) {
  destroyActiveCursor?.()

  const cursor = document.createElement('div')
  cursor.className = 'pixel-cursor'
  cursor.setAttribute('aria-hidden', 'true')

  const image = document.createElement('img')
  image.alt = ''
  image.draggable = false
  cursor.append(image)
  document.body.append(cursor)

  let loaded = false
  let destroyed = false
  let moved = false
  let point: { x: number; y: number } | undefined

  const position = () => {
    if (!point) return
    // The arrow's tip is (4, 2) in the asset's 58 × 80 viewBox.
    cursor.style.left = `${point.x - image.clientWidth * 4 / 58}px`
    cursor.style.top = `${point.y - image.clientHeight * 2 / 80}px`
  }

  const syncInitialTarget = () => {
    if (destroyed || !loaded) return
    if (!moved && options.initialTarget) {
      const target = typeof options.initialTarget === 'string'
        ? document.querySelector<HTMLElement>(options.initialTarget)
        : options.initialTarget
      if (target) {
        const rect = target.getBoundingClientRect()
        point = { x: rect.left + rect.width * .88, y: rect.top + rect.height * .73 }
        cursor.classList.add('is-visible')
      }
    }
    position()
  }

  const hide = () => {
    cursor.classList.remove('is-visible', 'is-pressed')
  }
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      hide()
      return
    }
    moved = true
    point = { x: event.clientX, y: event.clientY }
    if (loaded) {
      position()
      cursor.classList.add('is-visible')
    }
  }
  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'touch') hide()
    else if (loaded) cursor.classList.add('is-pressed')
  }
  const onUp = () => cursor.classList.remove('is-pressed')
  const onKey = () => hide()
  const onLoad = () => {
    if (destroyed || loaded) return
    loaded = true
    document.documentElement.classList.add('pixel-cursor-enabled')
    syncInitialTarget()
    if (moved && point) cursor.classList.add('is-visible')
  }

  const destroy = () => {
    if (destroyed) return
    destroyed = true
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    window.removeEventListener('blur', hide)
    window.removeEventListener('resize', syncInitialTarget)
    document.documentElement.removeEventListener('pointerleave', hide)
    document.removeEventListener('keydown', onKey)
    image.removeEventListener('load', onLoad)
    image.removeEventListener('error', destroy)
    document.documentElement.classList.remove('pixel-cursor-enabled')
    cursor.remove()
    if (destroyActiveCursor === destroy) destroyActiveCursor = undefined
  }

  destroyActiveCursor = destroy
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onUp, { passive: true })
  window.addEventListener('blur', hide)
  window.addEventListener('resize', syncInitialTarget)
  document.documentElement.addEventListener('pointerleave', hide)
  document.addEventListener('keydown', onKey)
  image.addEventListener('load', onLoad)
  image.addEventListener('error', destroy)
  image.src = options.assetUrl ?? '/pixel-cursor.svg'
  void document.fonts.ready.then(syncInitialTarget)

  return { destroy }
}
