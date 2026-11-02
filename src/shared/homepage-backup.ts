import { mountFloatingNav } from '../elements/floating-nav'
import { mountTracksPlayer } from '../elements/tracks-player'
import { mountScheduleCalendars } from '../elements/schedule-calendars'
import { mountFAQ } from '../elements/faq'
import { mountSponsorsGrid } from '../elements/sponsors-grid'
import { mountTeamFooter } from '../elements/team-footer'
import { mountAsciiSkyline } from '../elements/ascii-skyline'
import { mountPixelCursor } from '../elements/pixel-cursor'
import { registrationUrl, siteContent, siteTitle } from '../data/site-data'
import '../elements/info.css'
import './homepage-backup.css'

const sections = [
  { id: 'main', name: siteTitle },
  { id: 'info', name: `About ${siteContent.eventName}` },
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
    <h1 class="hero-title" aria-label="${siteTitle}">
      <span class="hero-bracket" aria-hidden="true">&lt;</span>
      <span class="hero-title-text" aria-hidden="true">
        <span>${siteContent.eventName}</span>
        <span>${siteContent.eventYear}</span>
      </span>
      <span class="hero-bracket" aria-hidden="true">/&gt;</span>
    </h1>
  </div>
`

const infoContent = `
  <div class="info-webcore">
    <figure class="info-webcore-art"></figure>
    <p class="info-webcore-copy">${siteContent.aboutCopy}</p>
  </div>
`

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <main class="world-scroll-container" aria-label="${siteTitle}">
    ${sections.map((section) => `
      <section id="${section.id}" class="world-section" data-world-section aria-label="${section.name}" tabindex="-1">
        ${section.id === 'main' ? heroContent : ''}
        ${section.id === 'info' ? infoContent : ''}
      </section>`).join('')}
  </main>
`

const teamFooter = mountTeamFooter(app)
const skyline = mountAsciiSkyline(app.querySelector<HTMLElement>('.info-webcore-art')!)
const navigation = mountFloatingNav(app, {
  world: app,
  registrationUrl,
})
const trackSelector = mountTracksPlayer(app.querySelector<HTMLElement>('#tracks')!)
const calendars = mountScheduleCalendars(app.querySelector<HTMLElement>('#schedule')!)
const faq = mountFAQ(app.querySelector<HTMLElement>('#faq')!)
const sponsorsGrid = mountSponsorsGrid(app.querySelector<HTMLElement>('#sponsors')!)
const pixelCursor = mountPixelCursor()
if (import.meta.hot) import.meta.hot.dispose(() => {
  pixelCursor.destroy()
  skyline.destroy()
  teamFooter.destroy()
  sponsorsGrid.destroy()
  faq.destroy()
  calendars.destroy()
  trackSelector.destroy()
  navigation.destroy()
})
