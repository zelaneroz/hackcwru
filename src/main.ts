import { mountFloatingNav } from './floating-nav'
import { mountTracksPlayer } from './tracks-player'
import { mountScheduleCalendars } from './schedule-calendars'
import { mountFAQ } from './faq'
import { mountSponsorsWall } from './sponsors-wall'
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
    <figure class="info-webcore-art">
      <img class="info-webcore-image" src="/pixel-art.png" width="960" height="768" loading="lazy" decoding="async" alt="">
    </figure>
    <p class="info-webcore-copy">HackCWRU brings together student innovators to Case Western Reserve University for Cleveland’s biggest hackathon. Over an action-packed 36 hours, hackers of all backgrounds and experience levels assemble to design and build groundbreaking projects.</p>
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
const trackSelector = mountTracksPlayer(app.querySelector<HTMLElement>('#tracks')!)
const calendars = mountScheduleCalendars(app.querySelector<HTMLElement>('#schedule')!)
const faq = mountFAQ(app.querySelector<HTMLElement>('#faq')!)
const sponsorsWall = mountSponsorsWall(app.querySelector<HTMLElement>('#sponsors')!)
const pixelCursor = mountPixelCursor()
if (import.meta.hot) import.meta.hot.dispose(() => {
  pixelCursor.destroy()
  sponsorsWall.destroy()
  faq.destroy()
  calendars.destroy()
  trackSelector.destroy()
  navigation.destroy()
})
