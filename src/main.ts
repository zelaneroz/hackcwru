import { mountFloatingNav } from './floating-nav'
import { mountTracksPlayer } from './tracks-player'
import { mountScheduleCalendars } from './schedule-calendars'
import { mountFAQ } from './faq'
import { mountSponsorsGrid } from './sponsors-grid'
import { mountTeamFooter } from './team-footer'
import { mountAsciiSkyline } from './ascii-skyline'
import { mountPixelCursor } from './pixel-cursor'
import { mountScrollHero } from './scroll-hero'
import { mountBlissMotion } from './bliss-motion'
import './info.css'
import './site.css'
import './bliss-chapter.css'
import './tracks-bliss-transition.css'

const sections = [
  { id: 'main', name: 'HackCWRU 2027' },
  { id: 'info', name: 'About HackCWRU' },
  { id: 'tracks', name: 'Hackathon tracks and prizes' },
  { id: 'schedule', name: 'Event schedule' },
  { id: 'faq', name: 'Frequently asked questions' },
  { id: 'sponsors', name: 'Our sponsors' },
] as const

const infoContent = `
  <div class="info-webcore">
    <figure class="info-webcore-art"></figure>
    <p class="info-webcore-copy">HackCWRU brings together student innovators to Case Western Reserve University for Cleveland’s biggest hackathon. Over an action-packed 36 hours, hackers of all backgrounds and experience levels assemble to design and build groundbreaking projects.</p>
  </div>
`

const app = document.querySelector<HTMLDivElement>('#app')!

function renderSection(section: (typeof sections)[number]) {
  return `
    <section id="${section.id}" class="world-section" data-world-section aria-label="${section.name}" tabindex="-1">
      ${section.id === 'info' ? infoContent : ''}
    </section>`
}

app.innerHTML = `
  <main class="world-scroll-container" aria-label="HackCWRU 2027">
    ${sections.slice(0, 3).map(renderSection).join('')}
    <div class="bliss-chapter">
      <div class="bliss-chapter-backdrop" aria-hidden="true">
        <span class="bliss-chapter-clouds"></span>
        <span class="bliss-chapter-grass"></span>
        <span class="bliss-chapter-wash"></span>
      </div>
      <div class="bliss-chapter-content">
        ${sections.slice(3).map(renderSection).join('')}
      </div>
    </div>
  </main>
`

const teamFooter = mountTeamFooter(app)
const skyline = mountAsciiSkyline(app.querySelector<HTMLElement>('.info-webcore-art')!)
const registrationUrl = 'https://tally.so/r/WJJjpe'
const scrollHero = mountScrollHero(app.querySelector<HTMLElement>('#main')!, { registrationUrl })
const navigation = mountFloatingNav(app, {
  world: app,
  registrationUrl,
})
const trackSelector = mountTracksPlayer(app.querySelector<HTMLElement>('#tracks')!)
const calendars = mountScheduleCalendars(app.querySelector<HTMLElement>('#schedule')!)
const faq = mountFAQ(app.querySelector<HTMLElement>('#faq')!)
const sponsorsGrid = mountSponsorsGrid(app.querySelector<HTMLElement>('#sponsors')!)
const blissMotion = mountBlissMotion(app.querySelector<HTMLElement>('.bliss-chapter')!)
const pixelCursor = mountPixelCursor()
if (import.meta.hot) import.meta.hot.dispose(() => {
  pixelCursor.destroy()
  blissMotion.destroy()
  scrollHero.destroy()
  skyline.destroy()
  teamFooter.destroy()
  sponsorsGrid.destroy()
  faq.destroy()
  calendars.destroy()
  trackSelector.destroy()
  navigation.destroy()
})
