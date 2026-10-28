import './sponsors-player.css'
import { sponsors as defaultSponsors, type Sponsor } from './sponsors-data'

const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 4 12 8-12 8Z"/></svg>'
const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zm8 0h4v16h-4Z"/></svg>'
const previousIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h2v14H5zm14 0L8 12l11 7Z"/></svg>'
const nextIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 5h2v14h-2zM5 5l11 7-11 7Z"/></svg>'
let instance = 0

/** Resizable sponsor library. Add organizations in sponsors-data.ts, not here. */
export function mountSponsorsPlayer(host: HTMLElement, sponsors: readonly Sponsor[] = defaultSponsors): { destroy(): void } {
  const prefix = `sponsors-player-${++instance}`
  const stage = document.createElement('div')
  stage.className = 'sponsors-player-stage'
  stage.innerHTML = `
    <section class="sponsors-player" aria-labelledby="${prefix}-title">
      <header class="sponsors-player-titlebar">
        <span class="sponsors-player-music-mark" aria-hidden="true">♫</span>
        <h2 id="${prefix}-title">HackCWRU <span>— Sponsors</span></h2>
        <span class="sponsors-player-total"></span>
      </header>
      <div class="sponsors-player-toolbar">
        <div class="sponsors-player-views" role="group" aria-label="Sponsor display">
          <button type="button" data-sponsor-view="albums" aria-pressed="true">Albums</button>
          <button type="button" data-sponsor-view="list" aria-pressed="false">List</button>
        </div>
        <label class="sponsors-player-search"><span class="sponsors-player-sr-only">Search sponsors</span><input type="search" placeholder="Search sponsors" autocomplete="off" spellcheck="false"></label>
      </div>
      <ul class="sponsors-player-gallery" aria-label="Sponsor albums"></ul>
      <footer class="sponsors-player-transport">
        <div class="sponsors-player-now">
          <img class="sponsors-player-now-cover" width="64" height="64" alt="">
          <div class="sponsors-player-now-copy"><span>Now featuring</span><strong class="sponsors-player-now-name" aria-live="polite" aria-atomic="true"></strong><a class="sponsors-player-visit" target="_blank" rel="noopener noreferrer" hidden>Visit sponsor ↗</a></div>
        </div>
        <div class="sponsors-player-controls" role="group" aria-label="Browse sponsors">
          <button class="sponsors-player-control" type="button" data-sponsor-action="previous" aria-label="Previous sponsor">${previousIcon}</button>
          <button class="sponsors-player-control sponsors-player-play" type="button" data-sponsor-action="play" aria-label="Play sponsor slideshow" aria-pressed="false">${playIcon}</button>
          <button class="sponsors-player-control" type="button" data-sponsor-action="next" aria-label="Next sponsor">${nextIcon}</button>
        </div>
        <div class="sponsors-player-seek"><span class="sponsors-player-position"></span><input type="range" min="1" max="1" value="1" step="1" aria-label="Sponsor position"></div>
      </footer>
    </section>
  `
  host.append(stage)

  const player = stage.querySelector<HTMLElement>('.sponsors-player')!
  const gallery = stage.querySelector<HTMLUListElement>('.sponsors-player-gallery')!
  const search = stage.querySelector<HTMLInputElement>('input[type="search"]')!
  const total = stage.querySelector<HTMLElement>('.sponsors-player-total')!
  const cover = stage.querySelector<HTMLImageElement>('.sponsors-player-now-cover')!
  const name = stage.querySelector<HTMLElement>('.sponsors-player-now-name')!
  const visit = stage.querySelector<HTMLAnchorElement>('.sponsors-player-visit')!
  const position = stage.querySelector<HTMLElement>('.sponsors-player-position')!
  const seek = stage.querySelector<HTMLInputElement>('input[type="range"]')!
  const play = stage.querySelector<HTMLButtonElement>('[data-sponsor-action="play"]')!
  const previous = stage.querySelector<HTMLButtonElement>('[data-sponsor-action="previous"]')!
  const next = stage.querySelector<HTMLButtonElement>('[data-sponsor-action="next"]')!
  const events = new AbortController()
  const { signal } = events
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let visible = [...sponsors]
  let activeId: string | null = visible[0]?.id ?? null
  let playing = false
  let timer: number | undefined
  let destroyed = false

  function stopSlideshow() {
    playing = false
    if (timer !== undefined) window.clearInterval(timer)
    timer = undefined
    play.innerHTML = playIcon
    play.setAttribute('aria-label', 'Play sponsor slideshow')
    play.setAttribute('aria-pressed', 'false')
  }

  function updateSelection(scroll = false) {
    const index = visible.findIndex((sponsor) => sponsor.id === activeId)
    const sponsor = visible[index]
    const cards = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-sponsor-id]'))
    cards.forEach((card) => card.setAttribute('aria-pressed', String(card.dataset.sponsorId === activeId)))
    name.textContent = sponsor?.name ?? (sponsors.length ? 'No matching sponsors' : 'Sponsors coming soon')
    name.title = sponsor?.name ?? ''
    cover.hidden = !sponsor
    if (sponsor) cover.src = sponsor.image
    else cover.removeAttribute('src')
    visit.hidden = !sponsor?.url
    if (sponsor?.url) visit.href = sponsor.url
    else visit.removeAttribute('href')
    const number = index < 0 ? 0 : index + 1
    position.textContent = `${String(number).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`
    seek.max = String(Math.max(1, visible.length))
    seek.value = String(Math.max(1, number))
    seek.setAttribute('aria-valuetext', sponsor ? `${number} of ${visible.length}: ${sponsor.name}` : 'No sponsors')
    seek.disabled = visible.length < 2
    previous.disabled = visible.length < 2
    next.disabled = visible.length < 2
    play.disabled = visible.length < 2
    if (visible.length < 2) stopSlideshow()

    const card = cards[index]
    if (scroll && card) {
      const top = card.offsetTop
      const bottom = top + card.offsetHeight
      const destination = top < gallery.scrollTop ? top - 12
        : bottom > gallery.scrollTop + gallery.clientHeight ? bottom - gallery.clientHeight + 12
        : null
      if (destination !== null) gallery.scrollTo({ top: destination, behavior: motion.matches ? 'auto' : 'smooth' })
    }
  }

  function renderAlbums() {
    const fragment = document.createDocumentFragment()
    visible.forEach((sponsor, index) => {
      const item = document.createElement('li')
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'sponsor-album'
      button.dataset.sponsorId = sponsor.id
      button.setAttribute('aria-label', `Feature ${sponsor.name}`)
      const sleeve = document.createElement('span')
      sleeve.className = 'sponsor-album-sleeve'
      const image = document.createElement('img')
      image.src = sponsor.image
      image.alt = ''
      image.width = 480
      image.height = 480
      image.loading = 'lazy'
      image.decoding = 'async'
      sleeve.append(image)
      const label = document.createElement('span')
      label.className = 'sponsor-album-name'
      label.textContent = sponsor.name
      const caption = document.createElement('span')
      caption.className = 'sponsor-album-caption'
      caption.textContent = `Sponsor ${String(index + 1).padStart(2, '0')}`
      button.append(sleeve, label, caption)
      item.append(button)
      fragment.append(item)
    })
    if (!visible.length) {
      const empty = document.createElement('li')
      empty.className = 'sponsors-player-empty'
      empty.textContent = sponsors.length ? 'No sponsors match your search.' : 'More good things are on the way.'
      fragment.append(empty)
    }
    gallery.replaceChildren(fragment)
    total.textContent = visible.length === sponsors.length
      ? `${sponsors.length} ${sponsors.length === 1 ? 'sponsor' : 'sponsors'}`
      : `${visible.length} of ${sponsors.length} sponsors`
    updateSelection()
  }

  function select(index: number, focus = false) {
    if (!visible.length) return
    index = (index + visible.length) % visible.length
    activeId = visible[index]!.id
    updateSelection(true)
    if (focus) gallery.querySelectorAll<HTMLButtonElement>('[data-sponsor-id]')[index]?.focus({ preventScroll: true })
  }

  function advance(direction: number) {
    select(Math.max(0, visible.findIndex((sponsor) => sponsor.id === activeId)) + direction)
  }

  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase()
    visible = sponsors.filter((sponsor) => sponsor.name.toLowerCase().includes(query))
    if (!visible.some((sponsor) => sponsor.id === activeId)) activeId = visible[0]?.id ?? null
    gallery.scrollTop = 0
    renderAlbums()
  }, { signal })

  stage.addEventListener('click', (event) => {
    const target = event.target as Element
    const album = target.closest<HTMLButtonElement>('[data-sponsor-id]')
    if (album) {
      activeId = album.dataset.sponsorId!
      updateSelection()
      return
    }
    const view = target.closest<HTMLButtonElement>('[data-sponsor-view]')
    if (view) {
      player.classList.toggle('is-list', view.dataset.sponsorView === 'list')
      stage.querySelectorAll<HTMLButtonElement>('[data-sponsor-view]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button === view))
      })
      return
    }
    const control = target.closest<HTMLButtonElement>('[data-sponsor-action]')
    if (!control || control.disabled) return
    switch (control.dataset.sponsorAction) {
      case 'previous': advance(-1); break
      case 'next': advance(1); break
      case 'play':
        if (playing) { stopSlideshow(); break }
        playing = true
        play.innerHTML = pauseIcon
        play.setAttribute('aria-label', 'Pause sponsor slideshow')
        play.setAttribute('aria-pressed', 'true')
        timer = window.setInterval(() => { if (!document.hidden) advance(1) }, 6000)
        break
    }
  }, { signal })

  gallery.addEventListener('keydown', (event) => {
    const card = (event.target as Element).closest<HTMLButtonElement>('[data-sponsor-id]')
    if (!card) return
    const index = visible.findIndex((sponsor) => sponsor.id === card.dataset.sponsorId)
    const destination = event.key === 'ArrowRight' ? index + 1
      : event.key === 'ArrowLeft' ? index - 1
      : event.key === 'Home' ? 0
      : event.key === 'End' ? visible.length - 1
      : null
    if (destination === null) return
    event.preventDefault()
    select(destination, true)
  }, { signal })

  seek.addEventListener('input', () => select(Number(seek.value) - 1), { signal })
  stage.addEventListener('error', (event) => {
    const image = event.target
    if (image instanceof HTMLImageElement && !image.src.endsWith('/sponsors/placeholder.svg')) image.src = '/sponsors/placeholder.svg'
  }, { capture: true, signal })
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSlideshow() }, { signal })

  const observer = new IntersectionObserver(([entry]) => { if (!entry?.isIntersecting) stopSlideshow() })
  observer.observe(stage)
  renderAlbums()

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      stopSlideshow()
      events.abort()
      observer.disconnect()
      stage.remove()
    },
  }
}
