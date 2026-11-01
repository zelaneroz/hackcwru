import './retro-window.css'

export type RetroWindowSize = 'small' | 'medium' | 'large'

export type RetroWindowOptions = {
  content: Node
  size?: RetroWindowSize
  title?: string
}

/** Reuse with any DOM content: host.append(createRetroWindow({ content: logo, size: 'small' })). */
export function createRetroWindow(options: RetroWindowOptions): HTMLElement {
  const window = document.createElement('div')
  window.className = 'retro-window'
  window.dataset.size = options.size ?? 'medium'

  const titlebar = document.createElement('div')
  titlebar.className = 'retro-window-titlebar'

  const title = document.createElement('span')
  title.className = 'retro-window-title'
  title.textContent = options.title ?? ''

  const controls = document.createElement('div')
  controls.className = 'retro-window-controls'
  controls.setAttribute('aria-hidden', 'true')
  for (const [name, symbol] of [['minimize', '−'], ['maximize', '□'], ['close', '×']] as const) {
    const control = document.createElement('span')
    control.className = `retro-window-${name}`
    control.textContent = symbol
    controls.append(control)
  }

  const content = document.createElement('div')
  content.className = 'retro-window-content'
  content.append(options.content)

  titlebar.append(title, controls)
  window.append(titlebar, content)
  return window
}
