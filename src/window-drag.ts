type WindowDragOptions = {
  element: HTMLElement
  handle: HTMLElement
  bounds: HTMLElement
  label: string
}

let frontLayer = 0

/** Keep the original layout while moving a pane within its containing area. */
export function enableWindowDrag({ element, handle, bounds, label }: WindowDragOptions): { destroy(): void } {
  const events = new AbortController()
  const { signal } = events
  const previous = {
    transform: element.style.transform,
    zIndex: element.style.zIndex,
    tabIndex: handle.getAttribute('tabindex'),
    role: handle.getAttribute('role'),
    label: handle.getAttribute('aria-label'),
    description: handle.getAttribute('aria-roledescription'),
    shortcuts: handle.getAttribute('aria-keyshortcuts'),
  }
  let x = 0
  let y = 0
  let destroyed = false
  let drag: { pointerId: number; gripX: number; gripY: number } | undefined

  element.classList.add('is-draggable')
  handle.classList.add('retro-window-drag-handle')
  handle.tabIndex = 0
  handle.setAttribute('role', 'group')
  handle.setAttribute('aria-roledescription', 'window drag handle')
  handle.setAttribute('aria-label', `Move ${label}. Use arrow keys to move, Shift for larger steps, or Home to reset.`)
  handle.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Home')

  function moveTo(nextX: number, nextY: number) {
    const area = bounds.getBoundingClientRect()
    const pane = element.getBoundingClientRect()
    const baseLeft = pane.left - x
    const baseTop = pane.top - y
    const minX = area.left - baseLeft
    const minY = area.top - baseTop
    const maxX = Math.max(minX, area.right - pane.width - baseLeft)
    const maxY = Math.max(minY, area.bottom - pane.height - baseTop)
    x = Math.min(maxX, Math.max(minX, nextX))
    y = Math.min(maxY, Math.max(minY, nextY))
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  function bringToFront() {
    element.style.zIndex = String(++frontLayer)
  }

  function finishDrag() {
    const pointerId = drag?.pointerId
    drag = undefined
    element.classList.remove('is-dragging')
    if (pointerId !== undefined && handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId)
  }

  handle.addEventListener('pointerdown', event => {
    if (drag || !event.isPrimary || event.button !== 0) return
    if ((event.target as Element).closest('a, button, input, select, textarea, [contenteditable="true"]')) return
    event.preventDefault()
    handle.focus({ preventScroll: true })
    bringToFront()
    const pane = element.getBoundingClientRect()
    drag = { pointerId: event.pointerId, gripX: event.clientX - pane.left, gripY: event.clientY - pane.top }
    element.classList.add('is-dragging')
    handle.setPointerCapture(event.pointerId)
  }, { signal })

  handle.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointerId) return
    const pane = element.getBoundingClientRect()
    // Fresh viewport coordinates also account for page scrolling during a drag.
    moveTo(event.clientX - drag.gripX - (pane.left - x), event.clientY - drag.gripY - (pane.top - y))
  }, { signal })

  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
    handle.addEventListener(type, event => {
      if (event.pointerId === drag?.pointerId) finishDrag()
    }, { signal })
  }

  handle.addEventListener('keydown', event => {
    if (event.target !== handle || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    const step = event.shiftKey ? 32 : 8
    const destination = event.key === 'ArrowLeft' ? [x - step, y]
      : event.key === 'ArrowRight' ? [x + step, y]
      : event.key === 'ArrowUp' ? [x, y - step]
      : event.key === 'ArrowDown' ? [x, y + step]
      : event.key === 'Home' ? [0, 0] : null
    if (!destination) return
    event.preventDefault()
    finishDrag()
    bringToFront()
    moveTo(destination[0]!, destination[1]!)
  }, { signal })

  function fitWithinBounds() {
    if (destroyed) return
    // End an active gesture before a responsive reflow changes its geometry.
    finishDrag()
    moveTo(x, y)
  }

  const observer = new ResizeObserver(fitWithinBounds)
  observer.observe(bounds)
  observer.observe(element)
  window.addEventListener('resize', fitWithinBounds, { signal })

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      finishDrag()
      events.abort()
      observer.disconnect()
      element.classList.remove('is-draggable')
      handle.classList.remove('retro-window-drag-handle')
      element.style.transform = previous.transform
      element.style.zIndex = previous.zIndex
      for (const [attribute, value] of [
        ['tabindex', previous.tabIndex], ['role', previous.role], ['aria-label', previous.label],
        ['aria-roledescription', previous.description], ['aria-keyshortcuts', previous.shortcuts],
      ]) {
        if (value === null) handle.removeAttribute(attribute!)
        else handle.setAttribute(attribute!, value!)
      }
    },
  }
}
