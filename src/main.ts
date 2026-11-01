import { mountFloatingNav } from './floating-nav'
import { mountPurbleTracks } from './purble-tracks'
import { mountScheduleCalendars } from './schedule-calendars'
import { mountFAQ } from './faq'
import { mountSponsorsPlayer } from './sponsors-player'
import { mountPixelCursor } from './pixel-cursor'
import './info.css'
import './site.css'

const sections = [
  { id: 'main', name: 'HackCWRU 2027' },
  { id: 'info', name: 'About HackCWRU' },
  { id: 'tracks', name: 'Hackathon tracks and prizes' },
  { id: 'schedule', name: 'Event schedule' },
  { id: 'faq', name: 'Frequently asked questions' },
  { id: 'sponsors', name: 'Our sponsors' },
] as const

const heroContent = `
  <div class="hero">
    <div class="hero-trinkets" aria-hidden="true">
      <img class="hero-trinket hero-trinket--beeper" src="/trinkets/beeper.png" width="300" height="267" alt="" decoding="async" draggable="false">
      <img class="hero-trinket hero-trinket--texting" src="/trinkets/texting.png" width="338" height="328" alt="" decoding="async" draggable="false">
      <img class="hero-trinket hero-trinket--mac" src="/trinkets/mac.png" width="405" height="303" alt="" decoding="async" draggable="false">
      <img class="hero-trinket hero-trinket--flip-phone" src="/trinkets/flip_phone.png" width="276" height="359" alt="" decoding="async" draggable="false">
    </div>
    <h1 class="hero-title" aria-label="HackCWRU 2027">
      <span class="hero-bracket" aria-hidden="true">&lt;</span>
      <span class="hero-title-text" aria-hidden="true">
        <span>HackCWRU</span>
        <span>2027</span>
      </span>
      <span class="hero-bracket" aria-hidden="true">/&gt;</span>
    </h1>
  </div>
`

const infoContent = `
  <div class="info-webcore">
    <figure class="info-webcore-card">
        <img class="info-webcore-image" src="/fonts/hackcwru%20%281%29.png" width="1920" height="1080" loading="lazy" decoding="async"
          alt="HackCWRU brings together student innovators from across the country to Case Western Reserve University for Cleveland’s biggest hackathon—an unforgettable weekend of creation. Over an action-packed 36 hours, hackers of all experience levels assemble to design, prototype, and build groundbreaking projects. Connect with industry sponsors, collaborate with inspiring peers, and test the limits of what you can invent.">
    </figure>
  </div>
`

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <main class="world-scroll-container" aria-label="HackCWRU 2027">
    ${sections.map((section) => `
      <section id="${section.id}" class="world-section" data-world-section aria-label="${section.name}" tabindex="-1">
        ${section.id === 'main' ? heroContent : ''}
        ${section.id === 'info' ? infoContent : ''}
      </section>`).join('')}
  </main>
`

const worldElement = app.querySelector<HTMLElement>('.world-scroll-container')!
const registrationUrl = 'https://tally.so/r/WJJjpe'
const navigation = mountFloatingNav(app, {
  world: worldElement,
  registrationUrl,
})
const trackSelector = mountPurbleTracks(app.querySelector<HTMLElement>('#tracks')!)
const calendars = mountScheduleCalendars(app.querySelector<HTMLElement>('#schedule')!)
const faq = mountFAQ(app.querySelector<HTMLElement>('#faq')!)
const sponsorsPlayer = mountSponsorsPlayer(app.querySelector<HTMLElement>('#sponsors')!)
const pixelCursor = mountPixelCursor()
if (import.meta.hot) import.meta.hot.dispose(() => {
  pixelCursor.destroy()
  sponsorsPlayer.destroy()
  faq.destroy()
  calendars.destroy()
  trackSelector.destroy()
  navigation.destroy()
})
