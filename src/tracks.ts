import './tracks.css'
import { hackTracks, type HackTrack } from './tracks-data'

let nextInstanceId = 0

/** Mount a self-contained desk trinket picker and CRT track preview. */
export function mountTracksPrizes(container: HTMLElement, tracks: HackTrack[] = hackTracks) {
  if (!tracks.length) throw new Error('Tracks & Prizes needs at least one track.')
  const events = new AbortController()
  const { signal } = events
  const prefix = `tracks-${++nextInstanceId}`
  container.innerHTML = `
    <section class="tracks-component" aria-label="Tracks and prizes">
      <div class="track-files" role="tablist" aria-label="Choose a track" aria-orientation="horizontal"></div>
      <div class="track-preview-area" id="${prefix}-preview" role="tabpanel" tabindex="0">
        <div class="track-monitor">
          <img class="monitor-hardware" src="/desk-monitor-v3.png" alt="" aria-hidden="true" loading="lazy" decoding="async" width="1429" height="1100">
          <div class="monitor-cabinet">
            <div class="track-screen">
        <section class="track-window" aria-label="Track preview window">
          <div class="track-titlebar">
            <div class="track-window-name"><img src="/text-document.svg" alt="" width="20" height="25"><span class="track-window-title"></span></div>
            <div class="track-controls">
              <button class="track-control" data-action="minimize" aria-label="Minimize preview" aria-pressed="false"><span class="control-minimize" aria-hidden="true"></span></button>
              <button class="track-control" data-action="maximize" aria-label="Maximize preview" aria-pressed="false"><span class="control-maximize" aria-hidden="true"></span></button>
              <button class="track-control" data-action="close" aria-label="Close preview"><span class="control-close" aria-hidden="true">×</span></button>
            </div>
          </div>
          <div class="track-window-body">
            <nav class="track-menubar" aria-label="Preview actions">
              <details class="track-menu"><summary><u>F</u>ile</summary><div class="track-menu-items"><button data-action="open">Open selected file</button><button data-action="save">Save as .txt</button><div class="track-menu-divider"></div><a href="#top">Back to desktop</a></div></details>
              <details class="track-menu"><summary><u>E</u>dit</summary><div class="track-menu-items"><button data-action="copy">Copy track details</button><div class="track-menu-divider"></div><button data-action="previous">Previous track</button><button data-action="next">Next track</button></div></details>
              <details class="track-menu"><summary><u>V</u>iew</summary><div class="track-menu-items"><button data-action="text-size" aria-pressed="false">Larger text <span class="menu-check" aria-hidden="true">✓</span></button><button data-action="maximize">Maximize preview</button></div></details>
              <details class="track-menu"><summary><u>H</u>elp</summary><div class="track-menu-items"><button data-action="about">About Tracks</button></div></details>
            </nav>
            <div class="track-content-well"><article class="track-document" tabindex="0" aria-label="Track details and prizes"><div class="track-document-content"><h2 class="track-heading"></h2><ul class="track-bullets"></ul><section class="track-prizes" aria-label="Sample prizes"><h3>PRIZES <span>SAMPLE</span></h3><div class="track-prize-list"></div></section></div></article></div>
            <footer class="track-status"><span class="track-status-file"></span><span class="track-status-count"></span><span class="track-status-encoding">UTF-8</span><i class="track-resize-grip" aria-hidden="true"></i></footer>
          </div>
        </section>
        <div class="track-empty" hidden><img src="/text-document.svg" alt="" width="58" height="73"><h2>Preview closed.</h2><p>There's another big idea in these files.</p><button class="track-small-button" data-action="open">Open selected file</button></div>
              <div class="tracks-scanlines" aria-hidden="true"></div>
              <div class="tracks-grain" aria-hidden="true"></div>
            </div>
            <div class="monitor-chin"><span class="monitor-brand">HackCWRU</span><div class="monitor-power-area"><span class="monitor-led" aria-hidden="true"></span><button class="monitor-power" data-action="power" aria-label="Turn off monitor" aria-pressed="true"><span aria-hidden="true">⏻</span></button></div></div>
          </div>
          <div class="monitor-neck" aria-hidden="true"></div>
          <div class="monitor-base" aria-hidden="true"></div>
        </div>
      </div>
      <p class="track-announcement" role="status" aria-live="polite"></p>
    </section>`

  const $ = <T extends HTMLElement = HTMLElement>(selector: string) => container.querySelector<T>(selector)!
  const root = $('.tracks-component')
  const files = $('.track-files')
  const preview = $('.track-window')
  const panel = $('.track-preview-area')
  const monitor = $('.track-monitor')
  const screen = $('.track-screen')
  const power = $<HTMLButtonElement>('.monitor-power')
  const body = $('.track-window-body')
  const empty = $('.track-empty')
  const announcement = $('.track-announcement')
  const menus = [...container.querySelectorAll<HTMLDetailsElement>('.track-menu')]
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let flicker: Animation | undefined
  let active = -1
  let poweredOff = false
  let minimized = false
  let expanded = false
  let largeText = false

  const fileButtons = tracks.map((track, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'track-file track-trinket'
    const prop = ['fishbowl', 'console', 'basketball'][index % 3]!
    button.dataset.prop = prop
    button.id = `${prefix}-${track.id}`
    button.setAttribute('role', 'tab')
    button.setAttribute('aria-controls', `${prefix}-preview`)
    const icon = document.createElement('img')
    icon.src = prop === 'basketball' ? '/desk-basketball.png' : `/desk-${prop}-v2.png`
    icon.alt = ''
    icon.width = 240
    icon.height = 240
    icon.loading = 'lazy'
    icon.decoding = 'async'
    icon.draggable = false
    const art = document.createElement('span')
    art.className = 'track-trinket-art'
    art.setAttribute('aria-hidden', 'true')
    art.append(icon)
    const label = document.createElement('span')
    label.className = 'track-file-label'
    label.textContent = track.filename
    button.append(art, label)
    button.addEventListener('click', () => select(index), { signal })
    files.append(button)
    return button
  })

  function closeMenus() { menus.forEach(menu => { menu.open = false }) }

  function syncPower() {
    const isOn = !poweredOff
    monitor.classList.toggle('is-powered-off', !isOn)
    power.setAttribute('aria-pressed', String(isOn))
    power.setAttribute('aria-label', isOn ? 'Turn off monitor' : 'Turn on monitor')
  }

  function restorePreview() {
    poweredOff = false
    preview.hidden = false
    empty.hidden = true
    minimized = false
    body.hidden = false
    root.classList.remove('is-minimized')
    const minimize = $<HTMLButtonElement>('[data-action="minimize"]')
    minimize.setAttribute('aria-label', 'Minimize preview')
    minimize.setAttribute('aria-pressed', 'false')
    syncPower()
  }

  function select(index: number, focus = false) {
    const previous = active
    active = (index + tracks.length) % tracks.length
    const track = tracks[active]!
    restorePreview()
    fileButtons.forEach((button, itemIndex) => {
      button.setAttribute('aria-selected', String(itemIndex === active))
      button.tabIndex = itemIndex === active ? 0 : -1
    })
    panel.setAttribute('aria-labelledby', fileButtons[active]!.id)
    $('.track-window-title').textContent = `Preview - ${track.filename}`
    $('.track-heading').textContent = `TRACK ${active + 1}: ${track.title}`
    const bullets = track.bullets.map(text => {
      const item = document.createElement('li')
      item.textContent = text
      return item
    })
    $('.track-bullets').replaceChildren(...bullets)
    const prizes = track.prizes.map(prize => {
      const row = document.createElement('p')
      const award = document.createElement('strong')
      award.textContent = prize.award
      row.append(award, document.createTextNode(` — ${prize.details}`))
      return row
    })
    $('.track-prize-list').replaceChildren(...prizes)
    $('.track-document').scrollTop = 0
    $('.track-status-file').textContent = track.filename
    $('.track-status-count').textContent = `${active + 1} of ${tracks.length}`
    announcement.textContent = `${track.filename} selected. ${track.title}.`
    closeMenus()
    if (previous !== -1 && previous !== active) {
      flicker?.cancel()
      if (!reducedMotion.matches && typeof screen.animate === 'function') {
        flicker = screen.animate(
          [{ opacity: 1 }, { opacity: 0.78 }, { opacity: 1 }, { opacity: 0.92 }, { opacity: 1 }],
          { duration: 180, easing: 'steps(1, end)' },
        )
      }
    }
    if (focus) fileButtons[active]!.focus({ preventScroll: true })
  }

  function trackText() {
    const track = tracks[active]!
    return `HACKCWRU 2026 — TRACK PREVIEW\nTRACK ${active + 1}: ${track.title}\n\n${track.bullets.map(point => `• ${point}`).join('\n')}\n\nPRIZES (SAMPLE)\n${track.prizes.map(prize => `${prize.award} — ${prize.details}`).join('\n')}`
  }

  async function act(action: string) {
    const menu = menus.find(item => item.open)
    const fromMenu = Boolean(menu?.contains(document.activeElement))
    closeMenus()
    if (fromMenu) menu?.querySelector('summary')?.focus({ preventScroll: true })
    if (action === 'power') {
      if (poweredOff) {
        restorePreview()
        announcement.textContent = 'Monitor turned on.'
      } else {
        poweredOff = true
        flicker?.cancel()
        preview.hidden = true
        empty.hidden = true
        syncPower()
        announcement.textContent = 'Monitor turned off. Press the power button or select a track to turn it on.'
      }
      power.focus({ preventScroll: true })
    } else if (action === 'open') {
      restorePreview()
      announcement.textContent = `${tracks[active]!.filename} opened.`
      fileButtons[active]!.focus({ preventScroll: true })
    } else if (action === 'minimize') {
      minimized = !minimized
      body.hidden = minimized
      root.classList.toggle('is-minimized', minimized)
      const button = $<HTMLButtonElement>('[data-action="minimize"]')
      button.setAttribute('aria-label', minimized ? 'Restore preview' : 'Minimize preview')
      button.setAttribute('aria-pressed', String(minimized))
      announcement.textContent = minimized ? 'Preview minimized. Open a file to restore it.' : 'Preview restored.'
    } else if (action === 'maximize') {
      restorePreview()
      expanded = !expanded
      root.classList.toggle('is-expanded', expanded)
      const button = $<HTMLButtonElement>('.track-controls [data-action="maximize"]')
      button.setAttribute('aria-pressed', String(expanded))
      button.setAttribute('aria-label', expanded ? 'Restore preview size' : 'Maximize preview')
      $('.track-menu [data-action="maximize"]').textContent = expanded ? 'Restore preview size' : 'Maximize preview'
      announcement.textContent = expanded ? 'Preview expanded.' : 'Preview returned to its original size.'
    } else if (action === 'close') {
      flicker?.cancel()
      poweredOff = false
      preview.hidden = true
      empty.hidden = false
      syncPower()
      announcement.textContent = 'Preview closed. Open any track to restore it.'
      empty.querySelector<HTMLButtonElement>('button')!.focus({ preventScroll: true })
    } else if (action === 'next' || action === 'previous') {
      select(active + (action === 'next' ? 1 : -1), true)
    } else if (action === 'text-size') {
      largeText = !largeText
      root.classList.toggle('has-large-text', largeText)
      $('[data-action="text-size"]').setAttribute('aria-pressed', String(largeText))
      announcement.textContent = largeText ? 'Larger text enabled.' : 'Normal text restored.'
    } else if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(trackText())
        if (signal.aborted) return
        announcement.textContent = 'Track details copied to clipboard.'
        $('.track-status-file').textContent = 'Copied to clipboard.'
      } catch {
        if (signal.aborted) return
        announcement.textContent = 'Copy is unavailable. Use File, Save as .txt to keep these details.'
        $('.track-status-file').textContent = 'Use File > Save as .txt'
      }
    } else if (action === 'save') {
      const url = URL.createObjectURL(new Blob([trackText()], { type: 'text/plain;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = tracks[active]!.filename
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      announcement.textContent = `${tracks[active]!.filename} downloaded.`
    } else if (action === 'about') {
      announcement.textContent = 'HackCWRU 2026 Tracks. Choose a desk trinket, or use the arrow keys, to explore three tracks and their sample prizes. File lets you save track details.'
      $('.track-status-file').textContent = 'Choose a trinket to explore a track.'
    }
  }

  container.addEventListener('click', event => {
    const target = event.target
    if (!(target instanceof Element)) return
    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action
    if (action) void act(action)
    else if (target.closest('a[href]')) closeMenus()
  }, { signal })

  files.addEventListener('keydown', event => {
    const directions: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (event.key in directions) {
      event.preventDefault()
      select(active + directions[event.key]!, true)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      select(event.key === 'Home' ? 0 : tracks.length - 1, true)
    }
  }, { signal })

  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false })
  }, { signal }))
  document.addEventListener('click', event => {
    if (event.target instanceof Node && !menus.some(menu => menu.contains(event.target as Node))) closeMenus()
  }, { signal })
  container.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const menu = menus.find(item => item.open)
      closeMenus()
      menu?.querySelector('summary')?.focus({ preventScroll: true })
    }
  }, { signal })

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) flicker?.cancel()
  }, { signal })
  select(Math.min(2, tracks.length - 1))

  return { destroy() { flicker?.cancel(); events.abort(); container.replaceChildren() } }
}
