import { mountFloatingNav } from '../elements/floating-nav'
import { mountTracksPlayer } from '../elements/tracks-player'
import { mountScheduleCalendars } from '../elements/schedule-calendars'
import { mountFAQ } from '../elements/faq'
import { mountSponsorsGrid } from '../elements/sponsors-grid'
import { mountTeamFooter } from '../elements/team-footer'
import { mountAsciiSkyline } from '../elements/ascii-skyline'
import { mountPixelCursor } from '../elements/pixel-cursor'
import { mountScrollHero } from '../elements/scroll-hero'
import { mountBlissMotion } from '../elements/bliss-motion'
import { registrationUrl, siteContent, siteTitle } from '../data/site-data'
import '../elements/info.css'
import './site.css'
import '../elements/bliss-chapter.css'
import '../elements/tracks-bliss-transition.css'

const sections = [
  { id: 'main', name: siteTitle },
  { id: 'info', name: `About ${siteContent.eventName}` },
  { id: 'tracks', name: 'Hackathon tracks and prizes' },
  { id: 'schedule', name: 'Event schedule' },
  { id: 'faq', name: 'Frequently asked questions' },
  { id: 'sponsors', name: 'Our sponsors' },
] as const

const infoContent = `
  <div class="info-webcore">
    <figure class="info-webcore-art"></figure>
    <p class="info-webcore-copy">${siteContent.aboutCopy}</p>
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
  <main class="world-scroll-container" aria-label="${siteTitle}">
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
