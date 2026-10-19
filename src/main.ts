import './style.css'
import { mountPixelCursor } from './pixel-cursor'
import { mountTracksPrizes } from './tracks'

const arrow = `<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9h11M9 4l5 5-5 5" stroke="currentColor" stroke-width="2"/></svg>`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="site-main">
  <section class="scene" id="top" aria-label="HackCWRU 2026" tabindex="-1">
    <div class="scene-art" aria-hidden="true">
      <picture>
        <source media="(max-aspect-ratio: 4/5)" srcset="/scene-mobile.png">
        <img class="landscape" src="/scene-desktop.png" alt="" fetchpriority="high">
      </picture>
      <div class="screen-text"><div class="screen-text-scroll"><span>HACKCWRU OS v.2026</span><span>&gt; hello, world_</span><span>[ OK ] loading ideas</span><span>[ OK ] coffee ready</span><span>&gt; build_the_future();</span><span>&gt; hello, world_</span><span>[ OK ] loading ideas</span></div></div>
    </div>

    <div class="hero-stage">
      <div class="window-ground-shadow" aria-hidden="true"></div>
      <div class="floating-window">
        <section class="win-window hero-window" aria-label="Welcome to HackCWRU 2026">
          <div class="titlebar">
            <span class="titlebar-name">HackCWRU '26</span>
            <button class="window-control close-hero" aria-label="Close welcome window"><span aria-hidden="true">×</span></button>
          </div>
          <div class="hero-body">
            <h1><span>Welcome to</span> <span>HackCWRU 2026!</span></h1>
            <p>Are you ready to build the future?</p>
            <div class="hero-actions">
              <button class="retro-button register-button" data-open="register">Register</button>
              <button class="retro-button schedule-button" data-open="schedule">Schedule</button>
            </div>
            <a class="tracks-link" href="#tracks">Tracks &amp; Prizes <span aria-hidden="true">↓</span></a>
          </div>
        </section>
      </div>
    </div>

    <button class="computer-hotspot" data-open="terminal" aria-label="Open the computer terminal"><span class="computer-hint">&gt; hello, world_</span></button>
    <button class="restore-button retro-button" hidden>HackCWRU '26 <span aria-hidden="true">↗</span></button>
    <div class="crt-overlay" aria-hidden="true"></div>
    <div class="grain-overlay" aria-hidden="true"></div>
    <a class="scroll-cue" href="#tracks">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
  </section>

  <section class="tracks-section" id="tracks" aria-labelledby="tracks-title" tabindex="-1">
    <div class="tracks-main">
      <header class="tracks-heading">
        <p class="tracks-directory">C:\\HACKCWRU\\TRACKS</p>
        <h2 id="tracks-title">Tracks &amp; Prizes</h2>
        <p class="tracks-intro">Pick a file. Find your next big idea.</p>
      </header>
      <div id="tracks-component"></div>
      <p class="tracks-sample-note">Sample tracks and prizes. Final details to be announced.</p>
    </div>
    <footer class="tracks-page-footer"><a href="#top">↑ Back to desktop</a><span>HackCWRU 2026</span></footer>
  </section>
  </main>
  <div class="dialog-layer" hidden></div>
`

const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector)!
const siteMain = $<HTMLElement>('.site-main')
const hero = $<HTMLElement>('.hero-stage')
const layer = $<HTMLDivElement>('.dialog-layer')
const restore = $<HTMLButtonElement>('.restore-button')
let lastFocus: HTMLElement | null = null
let sessionInterest: { name: string; email: string } | null = null

const dialogs: Record<string, { title: string; content: string; className?: string }> = {
  register: {
    title: 'Register — HackCWRU 2026',
    content: `<h2>Your next adventure starts here.</h2>
      <p>Save your interest while official registration gets ready.</p>
      <form id="register-form">
        <label for="register-name">Your name</label>
        <input id="register-name" name="name" placeholder="Ada Lovelace" autocomplete="name" required maxlength="80">
        <label for="register-email">Email address</label>
        <input id="register-email" name="email" type="email" placeholder="you@youruniversity.edu" autocomplete="email" required maxlength="254">
        <button class="retro-button register-button" type="submit">Count me in ${arrow}</button>
      </form>
      <p class="footnote">Your interest is saved on this device. This isn't an official event registration.</p>`,
  },
  schedule: {
    title: 'Schedule — HackCWRU 2026',
    content: `<h2>Eat. Sleep (a little). Build.</h2>
      <p>The official schedule is loading. Here's a preview of what's ahead.</p>
      <ol class="schedule-list">
        <li><span>01</span><div><h3>Hello, world.</h3><p>Meet your people. Find your team. Get inspired.</p></div></li>
        <li><span>02</span><div><h3>Make it happen.</h3><p>Ideas, workshops, and late-night breakthroughs.</p></div></li>
        <li><span>03</span><div><h3>Show your work.</h3><p>Demo what you built and celebrate together.</p></div></li>
      </ol>
      <p class="footnote">Exact dates and times will appear here when announced.</p>
      <button class="retro-button" data-close>Back to building ${arrow}</button>`,
  },
  terminal: {
    title: 'C:\\HACKCWRU\\terminal.exe',
    className: 'terminal-dialog',
    content: `<div class="terminal-output" aria-live="polite"><p>HackCWRU OS [Version 20.26]<br>(c) Curious people, everywhere.</p><p>Initializing imagination... OK<br>Loading the future........ READY</p><p>Type <strong>help</strong> to see available commands.</p></div>
      <form id="terminal-form"><label for="terminal-input">C:\\HACKCWRU&gt;</label><input id="terminal-input" autocomplete="off" spellcheck="false" aria-label="Terminal command"></form>`,
  },
}

function closeDialog() {
  if (layer.hidden) return
  layer.hidden = true
  layer.innerHTML = ''
  siteMain.inert = false
  document.documentElement.classList.remove('dialog-open')
  lastFocus?.focus({ preventScroll: true })
}

function openDialog(kind: string) {
  const dialog = dialogs[kind]
  if (!dialog) return
  if (layer.hidden) lastFocus = document.activeElement as HTMLElement
  siteMain.inert = true
  document.documentElement.classList.add('dialog-open')
  layer.innerHTML = `
    <section class="win-window popup-window ${dialog.className ?? ''}" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div class="titlebar"><span class="titlebar-name" id="dialog-title">${dialog.title}</span><button class="window-control" data-close aria-label="Close dialog"><span aria-hidden="true">×</span></button></div>
      <div class="popup-body">${dialog.content}</div>
    </section>`
  layer.hidden = false
  ;(layer.querySelector<HTMLInputElement>('input') ?? layer.querySelector<HTMLButtonElement>('[data-close]'))?.focus({ preventScroll: true })

  if (kind === 'register') {
    try {
      const saved = sessionInterest ?? JSON.parse(localStorage.getItem('hackcwru-interest') ?? 'null')
      if (saved?.email) {
        $<HTMLInputElement>('#register-email').value = saved.email
        $<HTMLInputElement>('#register-name').value = saved.name ?? ''
      }
    } catch { /* Storage may be unavailable in private browsing. */ }

    $<HTMLFormElement>('#register-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      if (!form.reportValidity()) return
      const values = new FormData(form)
      sessionInterest = { name: String(values.get('name') ?? ''), email: String(values.get('email') ?? '') }
      let persisted = false
      try {
        localStorage.setItem('hackcwru-interest', JSON.stringify(sessionInterest))
        persisted = true
      } catch { /* Keep the values in this session when storage is blocked. */ }
      const confirmation = persisted
        ? 'Your interest is saved on this device. Check back for official registration.'
        : 'Your browser could not save your interest permanently. It will stay in this session until you reload.'
      $('.popup-body').innerHTML = `<div class="success-mark" aria-hidden="true">✓</div><h2>Your curiosity is noted.</h2><p>${confirmation}</p><button class="retro-button register-button" data-close>See you in the future ${arrow}</button>`
      layer.querySelector<HTMLButtonElement>('[data-close]')?.focus()
    })
  }

  if (kind === 'terminal') {
    $<HTMLFormElement>('#terminal-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const input = $<HTMLInputElement>('#terminal-input')
      const command = input.value.trim().toLowerCase()
      const output = $('.terminal-output')
      const prompt = document.createElement('p')
      prompt.textContent = `C:\\HACKCWRU> ${input.value}`
      output.append(prompt)
      input.value = ''
      if (command === 'clear') { output.innerHTML = ''; return }
      if (command === 'register' || command === 'schedule') { openDialog(command); return }
      const responses: Record<string, string> = {
        help: 'help      Show commands\nabout     About HackCWRU\nregister  Save your interest\nschedule  View the program\nhello     Say hello\nhack      Find your next idea\nclear     Clear the terminal',
        about: 'HackCWRU 2026\nCase Western Reserve University, Cleveland, Ohio.\nYour curiosity belongs here.',
        hello: 'Hello, world! Hello, future hacker. : )',
        hack: 'Initiating brilliant idea...\n[████████████████████] 100%\nGo build something great.',
      }
      const response = document.createElement('p')
      response.textContent = responses[command] ?? (command ? `Command not found: ${command}. Type help to explore.` : '')
      output.append(response)
      output.scrollTop = output.scrollHeight
    })
  }
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const opener = target.closest<HTMLElement>('[data-open]')
  if (opener) { openDialog(opener.dataset.open!); return }
  if (target.closest('[data-close]') || target === layer) closeDialog()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDialog()
  if (event.key === 'Tab' && !layer.hidden) {
    const controls = [...layer.querySelectorAll<HTMLElement>('button, input, [href], [tabindex="0"]')]
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
})

$('.close-hero').addEventListener('click', () => {
  hero.classList.add('hero-hidden')
  hero.inert = true
  restore.hidden = false
  restore.focus({ preventScroll: true })
})
restore.addEventListener('click', () => {
  hero.classList.remove('hero-hidden')
  hero.inert = false
  restore.hidden = true
  $('.register-button').focus({ preventScroll: true })
})

// Keep terminal text and its click area aligned with the rendered background,
// including the cropping needed to cover wide and portrait viewports.
const sceneImage = $<HTMLImageElement>('.landscape')
const sceneArt = $<HTMLElement>('.scene-art')
const scene = $<HTMLElement>('.scene')
function positionSceneDetails() {
  if (!sceneImage.naturalWidth) return
  const bounds = sceneArt.getBoundingClientRect()
  const scale = Math.max(bounds.width / sceneImage.naturalWidth, bounds.height / sceneImage.naturalHeight)
  const width = sceneImage.naturalWidth * scale
  const height = sceneImage.naturalHeight * scale
  const portrait = window.matchMedia('(max-aspect-ratio: 4/5)').matches
  scene.style.setProperty('--art-width', `${width}px`)
  scene.style.setProperty('--art-height', `${height}px`)
  scene.style.setProperty('--art-left', '0px')
  scene.style.setProperty('--art-top', `${portrait ? bounds.height - height : (bounds.height - height) / 2}px`)
}
sceneImage.addEventListener('load', positionSceneDetails)
new ResizeObserver(positionSceneDetails).observe(sceneArt)
positionSceneDetails()

const tracks = mountTracksPrizes($<HTMLElement>('#tracks-component'))
const pixelCursor = mountPixelCursor({ initialTarget: window.location.hash === '#tracks' ? '.track-file' : '.register-button' })
if (import.meta.hot) import.meta.hot.dispose(() => {
  tracks.destroy()
  pixelCursor.destroy()
  document.documentElement.classList.remove('dialog-open')
})
