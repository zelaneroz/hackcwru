import './sponsors-grid.css'
import { sponsors as defaultSponsors, type Sponsor } from './sponsors-data'

let instance = 0

/** A borderless logo grid; all images and sizes come from the sponsor data. */
export function mountSponsorsGrid(host: HTMLElement, sponsors: readonly Sponsor[] = defaultSponsors): { destroy(): void } {
  const stage = document.createElement('div')
  stage.className = 'sponsors-grid-stage'
  const heading = document.createElement('h2')
  heading.className = 'sponsors-grid-title'
  heading.id = `sponsors-grid-${++instance}-title`
  heading.textContent = 'thanks to our sponsors!'
  const grid = document.createElement('ul')
  grid.className = 'sponsors-grid'
  grid.setAttribute('aria-labelledby', heading.id)
  const events = new AbortController()

  for (const sponsor of sponsors) {
    const item = document.createElement('li')
    item.className = 'sponsor-grid-item'
    item.dataset.size = sponsor.size
    item.dataset.sponsorId = sponsor.id
    const logoFrame = document.createElement(sponsor.url ? 'a' : 'div')
    logoFrame.className = sponsor.url ? 'sponsor-logo-link' : 'sponsor-logo-frame'
    if (sponsor.url) {
      logoFrame.setAttribute('href', sponsor.url)
      logoFrame.setAttribute('target', '_blank')
      logoFrame.setAttribute('rel', 'noopener noreferrer')
      logoFrame.setAttribute('aria-label', `Visit ${sponsor.name} (opens in a new tab)`)
    }

    const image = document.createElement('img')
    image.className = 'sponsor-logo'
    image.alt = sponsor.name
    image.loading = 'lazy'
    image.decoding = 'async'
    image.draggable = false
    const fallback = document.createElement('p')
    fallback.className = 'sponsor-logo-fallback'
    fallback.textContent = sponsor.name
    fallback.hidden = true
    image.addEventListener('error', () => {
      image.hidden = true
      fallback.hidden = false
    }, { once: true, signal: events.signal })
    image.src = sponsor.image
    logoFrame.append(image, fallback)
    item.append(logoFrame)
    grid.append(item)
  }

  if (!sponsors.length) {
    const empty = document.createElement('li')
    empty.className = 'sponsors-grid-empty'
    empty.textContent = 'More sponsors coming soon.'
    grid.append(empty)
  }
  stage.append(heading, grid)
  host.append(stage)

  return { destroy() { events.abort(); stage.remove() } }
}
