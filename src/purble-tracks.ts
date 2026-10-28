import './purble-tracks.css'
import { hackTracks } from './tracks-data'

let instance = 0

/** All track buildings share the meadow; only the description changes. */
export function mountPurbleTracks(host: HTMLElement): { destroy(): void } {
  const prefix = `purble-tracks-${++instance}`
  const stage = document.createElement('div')
  stage.className = 'purble-tracks-stage'
  stage.innerHTML = `
    <section class="purble-tracks" aria-labelledby="${prefix}-title">
      <header class="purble-tracks-header">
        <h2 id="${prefix}-title">Tracks</h2>
      </header>
      <div class="purble-track-village" role="tablist" aria-label="Hackathon tracks" aria-orientation="horizontal"></div>
      <article class="purble-track-detail" id="${prefix}-panel" role="tabpanel" tabindex="0">
        <div class="purble-track-titlebar"><span aria-hidden="true">▤</span><span class="purble-track-filename"></span><span aria-hidden="true">▧</span></div>
        <div class="purble-track-content">
          <p class="purble-track-number"></p>
          <h3 class="purble-track-title"></h3>
          <ul class="purble-track-bullets"></ul>
          <h4 class="purble-track-prizes-title">Prizes</h4>
          <dl class="purble-track-prizes"></dl>
        </div>
        <footer class="purble-track-status"></footer>
      </article>
    </section>`
  host.append(stage)

  const village = stage.querySelector<HTMLElement>('.purble-track-village')!
  const panel = stage.querySelector<HTMLElement>('.purble-track-detail')!
  const title = stage.querySelector<HTMLElement>('.purble-track-title')!
  const filename = stage.querySelector<HTMLElement>('.purble-track-filename')!
  const number = stage.querySelector<HTMLElement>('.purble-track-number')!
  const bullets = stage.querySelector<HTMLElement>('.purble-track-bullets')!
  const prizes = stage.querySelector<HTMLElement>('.purble-track-prizes')!
  const prizesTitle = stage.querySelector<HTMLElement>('.purble-track-prizes-title')!
  const status = stage.querySelector<HTMLElement>('.purble-track-status')!
  const events = new AbortController()
  let active = 0

  const tabs = hackTracks.map((track, index) => {
    const tab = document.createElement('button')
    tab.type = 'button'
    tab.className = 'purble-track-building'
    tab.id = `${prefix}-track-${index}`
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-controls', panel.id)
    tab.dataset.trackId = track.id
    const artwork = document.createElement('span')
    artwork.className = 'purble-track-house'
    const image = document.createElement('img')
    image.src = track.image.src
    // The visible track title supplies the button's accessible name.
    image.alt = ''
    image.setAttribute('aria-hidden', 'true')
    image.width = 1254
    image.height = 1254
    image.decoding = 'async'
    image.draggable = false
    artwork.append(image)
    const label = document.createElement('span')
    label.className = 'purble-track-sign'
    const indexLabel = document.createElement('span')
    indexLabel.className = 'purble-track-sign-number'
    indexLabel.textContent = String(index + 1).padStart(2, '0')
    indexLabel.setAttribute('aria-hidden', 'true')
    const name = document.createElement('span')
    name.textContent = track.title
    label.append(indexLabel, name)
    tab.append(artwork, label)
    tab.addEventListener('click', () => select(index), { signal: events.signal })
    village.append(tab)
    return tab
  })

  function select(index: number, focus = false) {
    if (!hackTracks.length) return
    active = (index + hackTracks.length) % hackTracks.length
    const track = hackTracks[active]!
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active))
      tab.tabIndex = i === active ? 0 : -1
    })
    panel.setAttribute('aria-labelledby', tabs[active]!.id)
    title.textContent = track.title
    filename.textContent = track.filename
    number.textContent = `TRACK ${String(active + 1).padStart(2, '0')}`
    bullets.replaceChildren(...track.bullets.map(text => {
      const item = document.createElement('li')
      item.textContent = text
      return item
    }))
    prizes.replaceChildren(...track.prizes.flatMap(prize => {
      const award = document.createElement('dt')
      award.textContent = prize.award
      const details = document.createElement('dd')
      details.textContent = prize.details
      return [award, details]
    }))
    prizesTitle.hidden = track.prizes.length === 0
    status.textContent = `${String(active + 1).padStart(2, '0')} / ${String(hackTracks.length).padStart(2, '0')} tracks`
    panel.scrollTop = 0
    if (focus) tabs[active]!.focus({ preventScroll: true })
  }

  village.addEventListener('keydown', event => {
    const index = event.key === 'ArrowRight' ? active + 1
      : event.key === 'ArrowLeft' ? active - 1
      : event.key === 'Home' ? 0
      : event.key === 'End' ? hackTracks.length - 1 : null
    if (index === null) return
    event.preventDefault()
    select(index, true)
  }, { signal: events.signal })

  if (hackTracks.length) select(0)
  else {
    title.textContent = 'Tracks coming soon'
    prizesTitle.hidden = true
  }

  return { destroy() { events.abort(); stage.remove() } }
}
