import './tracks-player.css'
import { hackTracks } from './tracks-data'

const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h3v2h3v2h3v2h3v2h3v4h-3v2h-3v2h-3v2H9v2H6Z"/></svg>'
const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h5v18H5zm9 0h5v18h-5Z"/></svg>'
const previousIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h3v18H2zM19 3h3v18h-3v-2h-3v-2h-3v-2h-3v-2H7v-2h3V9h3V7h3V5h3Z"/></svg>'
const nextIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3h3v18h-3zM2 3h3v2h3v2h3v2h3v2h3v2h-3v2h-3v2H8v2H5v2H2Z"/></svg>'
const noteIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3h11v13h-2v3h-6v-2h-2v-3h2v-2h5V7h-5v12h-2v3H5v-2H3v-3h2v-2h5Z"/><path class="tracks-player-note-slash" d="M2 2h4v2h2v2h2v2h2v2h2v2h2v2h2v2h2v2h2v4h-4v-2h-2v-2h-2v-2h-2v-2h-2v-2H8v-2H6V8H4V6H2Z"/></svg>'
let instance = 0

function formatTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

/** Track information, artwork, and the soundtrack share one selection. */
export function mountTracksPlayer(host: HTMLElement): { destroy(): void } {
  const prefix = `tracks-player-${++instance}`
  const stage = document.createElement('div')
  stage.className = 'tracks-player-stage'
  stage.innerHTML = `
    <section class="tracks-player" aria-labelledby="${prefix}-title">
      <div class="tracks-player-console">
        <h2 class="tracks-player-title" id="${prefix}-title">tracks</h2>
        <div class="tracks-player-art"><img width="320" height="320" decoding="async"></div>
        <div class="tracks-player-progress"><input type="range" min="0" max="1000" value="0" step="1" aria-label="Music playback position"></div>
        <div class="tracks-player-clock" aria-hidden="true"><span data-elapsed>0:00</span><span data-duration>0:00</span></div>
        <div class="tracks-player-controls" role="group" aria-label="Music controls">
          <button type="button" data-action="previous" aria-label="Previous track">${previousIcon}</button>
          <button type="button" data-action="play" aria-label="Play music" aria-pressed="false">${playIcon}</button>
          <button type="button" data-action="next" aria-label="Next track">${nextIcon}</button>
        </div>
        <button class="tracks-player-sound" type="button" aria-label="Turn sound on" aria-pressed="false">${noteIcon}<span>sound off</span></button>
      </div>
      <div class="tracks-player-content">
        <div class="tracks-player-list" role="tablist" aria-label="Hackathon tracks" aria-orientation="vertical"></div>
        <article class="tracks-player-detail" id="${prefix}-panel" role="tabpanel" tabindex="0">
          <div class="tracks-player-descriptions"></div>
          <div class="tracks-player-prizes"><h3>Prizes</h3><dl></dl></div>
        </article>
        <p class="tracks-player-status" role="status" hidden></p>
      </div>
    </section>
  `
  host.append(stage)

  const list = stage.querySelector<HTMLElement>('.tracks-player-list')!
  const panel = stage.querySelector<HTMLElement>('.tracks-player-detail')!
  const art = stage.querySelector<HTMLImageElement>('.tracks-player-art img')!
  const descriptions = stage.querySelector<HTMLElement>('.tracks-player-descriptions')!
  const prizeGroup = stage.querySelector<HTMLElement>('.tracks-player-prizes')!
  const prizes = prizeGroup.querySelector('dl')!
  const seek = stage.querySelector<HTMLInputElement>('input[type="range"]')!
  const elapsed = stage.querySelector<HTMLElement>('[data-elapsed]')!
  const duration = stage.querySelector<HTMLElement>('[data-duration]')!
  const play = stage.querySelector<HTMLButtonElement>('[data-action="play"]')!
  const sound = stage.querySelector<HTMLButtonElement>('.tracks-player-sound')!
  const soundLabel = sound.querySelector('span')!
  const status = stage.querySelector<HTMLElement>('.tracks-player-status')!
  const audio = document.createElement('audio')
  audio.preload = 'metadata'
  audio.volume = .35
  audio.hidden = true
  stage.append(audio)

  const events = new AbortController()
  const { signal } = events
  let active = -1
  let wantsToPlay = false
  let playAttempt = 0
  let destroyed = false

  const tabs = hackTracks.map((track, index) => {
    const tab = document.createElement('button')
    tab.type = 'button'
    tab.className = 'tracks-player-row'
    tab.id = `${prefix}-track-${index}`
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-controls', panel.id)
    tab.dataset.trackId = track.id
    const number = document.createElement('span')
    number.className = 'tracks-player-row-number'
    number.textContent = `${index + 1}.`
    const name = document.createElement('span')
    name.className = 'tracks-player-row-name'
    name.textContent = track.title
    const time = document.createElement('span')
    time.className = 'tracks-player-row-duration'
    time.textContent = formatTime(track.audio.duration)
    time.setAttribute('aria-hidden', 'true')
    tab.append(number, name, time)
    tab.addEventListener('click', () => select(index, true), { signal })
    list.append(tab)
    return tab
  })

  function updateControls() {
    const playing = wantsToPlay && !audio.paused
    play.innerHTML = playing ? pauseIcon : playIcon
    play.setAttribute('aria-label', playing ? 'Pause music' : 'Play music')
    play.setAttribute('aria-pressed', String(playing))
    sound.setAttribute('aria-label', playing ? 'Turn sound off' : 'Turn sound on')
    sound.setAttribute('aria-pressed', String(playing))
    soundLabel.textContent = playing ? 'sound on' : 'sound off'
  }

  function pause() {
    wantsToPlay = false
    playAttempt++
    audio.pause()
    updateControls()
  }

  async function start() {
    if (active < 0 || destroyed) return
    wantsToPlay = true
    const attempt = ++playAttempt
    status.hidden = true
    try {
      if (audio.error) audio.load()
      await audio.play()
      if (!destroyed && attempt === playAttempt) updateControls()
    } catch (error) {
      if (destroyed || attempt !== playAttempt) return
      wantsToPlay = false
      updateControls()
      status.textContent = error instanceof DOMException && error.name === 'NotAllowedError'
        ? 'Press play to turn sound on.'
        : 'Music could not play. Press play to try again.'
      status.hidden = false
    }
  }

  function updateProgress() {
    const total = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration : hackTracks[active]?.audio.duration ?? 0
    elapsed.textContent = formatTime(audio.currentTime)
    duration.textContent = formatTime(total)
    seek.value = String(total ? Math.round(audio.currentTime / total * 1000) : 0)
    seek.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} of ${formatTime(total)}`)
    seek.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0
  }

  function select(index: number, startMusic = false, focus = false) {
    if (!hackTracks.length || destroyed) return
    const destination = (index + hackTracks.length) % hackTracks.length
    const track = hackTracks[destination]!
    if (destination !== active) {
      pause()
      active = destination
      audio.src = track.audio.src
      audio.load()
      status.hidden = true
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === active))
        tab.tabIndex = i === active ? 0 : -1
      })
      panel.setAttribute('aria-labelledby', tabs[active]!.id)
      art.src = track.image.src
      art.alt = track.image.alt
      descriptions.replaceChildren(...track.bullets.map(text => {
        const paragraph = document.createElement('p')
        paragraph.className = 'tracks-player-description'
        paragraph.textContent = text
        return paragraph
      }))
      prizeGroup.hidden = track.prizes.length === 0
      prizes.replaceChildren(...track.prizes.flatMap(prize => {
        const award = document.createElement('dt')
        award.textContent = prize.award
        const details = document.createElement('dd')
        details.textContent = prize.details
        return [award, details]
      }))
      updateProgress()
    }
    if (focus) tabs[active]!.focus({ preventScroll: true })
    if (startMusic) void start()
  }

  stage.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-action], .tracks-player-sound')
    if (!button) return
    const action = button.dataset.action
    if (action === 'previous') select(active - 1, true)
    else if (action === 'next') select(active + 1, true)
    else if (wantsToPlay) pause()
    else void start()
  }, { signal })

  list.addEventListener('keydown', event => {
    const destination = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? active + 1
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? active - 1
      : event.key === 'Home' ? 0
      : event.key === 'End' ? hackTracks.length - 1 : null
    if (destination === null) return
    event.preventDefault()
    select(destination, true, true)
  }, { signal })

  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Number(seek.value) / 1000 * audio.duration
      updateProgress()
    }
  }, { signal })
  audio.addEventListener('playing', updateControls, { signal })
  audio.addEventListener('pause', updateControls, { signal })
  audio.addEventListener('loadedmetadata', updateProgress, { signal })
  audio.addEventListener('durationchange', updateProgress, { signal })
  audio.addEventListener('timeupdate', updateProgress, { signal })
  audio.addEventListener('ended', () => {
    if (wantsToPlay && !document.hidden) select(active + 1, true)
  }, { signal })
  audio.addEventListener('error', () => {
    pause()
    status.textContent = 'Music is unavailable. You can still explore every track.'
    status.hidden = false
  }, { signal })
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause() }, { signal })
  const observer = new IntersectionObserver(([entry]) => {
    if (entry && !entry.isIntersecting) pause()
  })
  observer.observe(host)

  if (hackTracks.length) select(0)
  else {
    descriptions.textContent = 'Tracks coming soon.'
    prizeGroup.hidden = true
    stage.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = true })
    seek.disabled = true
    art.hidden = true
  }

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      pause()
      events.abort()
      observer.disconnect()
      audio.removeAttribute('src')
      audio.load()
      stage.remove()
    },
  }
}
