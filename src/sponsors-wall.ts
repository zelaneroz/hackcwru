import './sponsors-wall.css'
import { createRetroWindow } from './retro-window'
import { enableWindowDrag } from './window-drag'
import { sponsors as defaultSponsors, type Sponsor } from './sponsors-data'

let instance = 0

/** One reusable window pane per sponsor; all logos and sizes come from the data. */
export function mountSponsorsWall(host: HTMLElement, sponsors: readonly Sponsor[] = defaultSponsors): { destroy(): void } {
  const stage = document.createElement('div')
  stage.className = 'sponsors-wall-stage'
  const heading = document.createElement('h2')
  heading.className = 'sponsors-wall-title'
  heading.id = `sponsors-wall-${++instance}-title`
  heading.textContent = 'thanks to our sponsors!'
  const wall = document.createElement('ul')
  wall.className = 'sponsors-wall'
  wall.setAttribute('aria-labelledby', heading.id)
  const events = new AbortController()

  for (const sponsor of sponsors) {
    const item = document.createElement('li')
    item.className = 'sponsor-window'
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
    item.append(createRetroWindow({ content: logoFrame, size: sponsor.size }))
    wall.append(item)
  }

  if (!sponsors.length) {
    const empty = document.createElement('li')
    empty.className = 'sponsors-wall-empty'
    empty.textContent = 'More sponsors coming soon.'
    wall.append(empty)
  }
  stage.append(heading, wall)
  host.append(stage)
  const dragging = Array.from(wall.querySelectorAll<HTMLElement>('.sponsor-window')).map((element, index) =>
    enableWindowDrag({
      element,
      handle: element.querySelector<HTMLElement>('.retro-window-titlebar')!,
      bounds: wall,
      label: `${sponsors[index]!.name} window`,
    }),
  )

  return { destroy() { dragging.forEach(pane => pane.destroy()); events.abort(); stage.remove() } }
}
