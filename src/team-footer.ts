import './team-footer.css'
import { teamMembers, teamContact, type TeamMember } from './team-data'

const mailIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="currentColor"/><path fill="#fff" d="M9 14h30v22H9z"/><path d="m9 15 15 13 15-13M9 35l10-10m20 10L29 25" fill="none" stroke="#000" stroke-width="3"/></svg>'
const linkedinIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="4" width="40" height="40" rx="3" fill="currentColor"/><circle cx="15" cy="14" r="3" fill="#fff"/><path fill="#fff" d="M12 20h6v18h-6zm10 0h6v3c2-5 11-5 11 4v11h-6V28c0-4-5-4-5 0v10h-6z"/></svg>'
const instagramIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="11" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="35" cy="13" r="2.5" fill="currentColor"/></svg>'
const githubIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.96c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.18 1.77 1.18 1.03 1.77 2.7 1.26 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .96-.31 3.16 1.18a11.05 11.05 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.39-5.26 5.67.42.36.78 1.06.78 2.14v3.19c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>'
const websiteIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></svg>'
let instance = 0

/** The footer and member pop-up both render the same editable team data. */
export function mountTeamFooter(host: HTMLElement, members: readonly TeamMember[] = teamMembers): { destroy(): void } {
  const prefix = `team-footer-${++instance}`
  const events = new AbortController()
  const { signal } = events
  const footer = document.createElement('footer')
  footer.id = 'team'
  footer.className = 'team-footer'
  footer.setAttribute('data-world-section', '')
  footer.setAttribute('tabindex', '-1')
  footer.setAttribute('aria-labelledby', `${prefix}-title`)
  footer.innerHTML = `
    <div class="team-footer-inner">
      <h2 class="team-footer-title" id="${prefix}-title">meet the hackcwru team!</h2>
      <div class="team-footer-layout">
        <ul class="team-grid" aria-label="HackCWRU team"></ul>
        <aside class="team-contact" aria-label="Follow HackCWRU">
          <h3>Follow us on:</h3>
          <ul class="team-social-list"></ul>
        </aside>
      </div>
    </div>
  `

  const dialog = document.createElement('dialog')
  dialog.className = 'team-dialog'
  dialog.id = `${prefix}-dialog`
  dialog.setAttribute('aria-labelledby', `${prefix}-member-name`)
  dialog.setAttribute('aria-describedby', `${prefix}-member-description`)
  dialog.innerHTML = `
    <article class="team-dialog-card">
      <button class="team-dialog-close" type="button" aria-label="Close member details" autofocus>×</button>
      <img class="team-dialog-image" width="400" height="400" alt="">
      <div class="team-dialog-copy">
        <h2 class="team-dialog-name" id="${prefix}-member-name"></h2>
        <p class="team-dialog-position"></p>
        <nav class="team-dialog-links" aria-label="Member profile links" hidden></nav>
        <p class="team-dialog-description" id="${prefix}-member-description"></p>
      </div>
    </article>
  `
  const grid = footer.querySelector<HTMLElement>('.team-grid')!
  const socialList = footer.querySelector<HTMLElement>('.team-social-list')!
  const close = dialog.querySelector<HTMLButtonElement>('.team-dialog-close')!
  const portrait = dialog.querySelector<HTMLImageElement>('.team-dialog-image')!
  const name = dialog.querySelector<HTMLElement>('.team-dialog-name')!
  const position = dialog.querySelector<HTMLElement>('.team-dialog-position')!
  const description = dialog.querySelector<HTMLElement>('.team-dialog-description')!
  const profiles = dialog.querySelector<HTMLElement>('.team-dialog-links')!
  let opener: HTMLButtonElement | undefined
  let previousOverflow: string | undefined

  function imageFallback(image: HTMLImageElement) {
    image.addEventListener('error', () => {
      if (!image.src.endsWith('/team/placeholder.svg')) image.src = '/team/placeholder.svg'
    }, { signal })
  }
  imageFallback(portrait)

  function openMember(member: TeamMember, trigger: HTMLButtonElement) {
    portrait.src = member.imagePath
    portrait.alt = `Portrait of ${member.name}`
    name.textContent = member.name
    position.textContent = member.position
    description.textContent = member.description
    profiles.replaceChildren()
    for (const [label, url, icon] of [
      ['LinkedIn', member.linkedinUrl, linkedinIcon],
      ['Website', member.websiteUrl, websiteIcon],
      ['GitHub', member.githubUrl, githubIcon],
    ] as const) {
      if (!url) continue
      const link = document.createElement('a')
      link.innerHTML = icon
      link.title = label
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', `${member.name}: ${label} (opens in a new tab)`)
      profiles.append(link)
    }
    profiles.hidden = !profiles.children.length
    opener = trigger
    if (!dialog.open) {
      dialog.showModal()
      if (previousOverflow === undefined) previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    close.focus({ preventScroll: true })
  }

  [...members].sort((a, b) => a.order - b.order).forEach((member, index) => {
    const item = document.createElement('li')
    item.className = 'team-member-item'
    const card = document.createElement('button')
    card.className = 'team-member-card'
    card.type = 'button'
    card.dataset.memberId = member.id
    card.setAttribute('aria-haspopup', 'dialog')
    card.setAttribute('aria-controls', dialog.id)
    card.setAttribute('aria-label', `View ${member.name}, ${member.position}, team member ${index + 1}`)
    const image = document.createElement('img')
    image.className = 'team-member-image'
    image.alt = ''
    image.width = 2400
    image.height = 2400
    image.loading = 'lazy'
    image.decoding = 'async'
    image.draggable = false
    imageFallback(image)
    image.src = member.imagePath
    const cardName = document.createElement('span')
    cardName.className = 'team-member-name'
    cardName.textContent = member.name
    const cardPosition = document.createElement('span')
    cardPosition.className = 'team-member-position'
    cardPosition.textContent = member.position
    card.append(image, cardName, cardPosition)
    card.addEventListener('click', () => openMember(member, card), { signal })
    item.append(card)
    grid.append(item)
  })

  for (const social of [
    { label: teamContact.email, href: `mailto:${teamContact.email}`, icon: mailIcon, external: false },
    { label: 'HackCWRU', href: teamContact.linkedinUrl, icon: linkedinIcon, external: true },
    { label: '@hack_cwru', href: teamContact.instagramUrl, icon: instagramIcon, external: true },
  ]) {
    const item = document.createElement('li')
    const link = document.createElement('a')
    link.className = 'team-social-link'
    link.href = social.href
    link.innerHTML = social.icon
    const label = document.createElement('span')
    label.textContent = social.label
    link.append(label)
    if (social.external) {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', `${social.label} on ${social.href.includes('linkedin.com') ? 'LinkedIn' : 'Instagram'} (opens in a new tab)`)
    }
    item.append(link)
    socialList.append(item)
  }

  function restorePage() {
    if (previousOverflow !== undefined) {
      document.body.style.overflow = previousOverflow
      previousOverflow = undefined
    }
    const trigger = opener
    opener = undefined
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
  }

  close.addEventListener('click', () => dialog.close(), { signal })
  dialog.addEventListener('close', () => { if (!dialog.open) restorePage() }, { signal })
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close()
  }, { signal })
  host.append(footer)
  document.body.append(dialog)

  return {
    destroy() {
      if (dialog.open) dialog.close()
      restorePage()
      events.abort()
      dialog.remove()
      footer.remove()
    },
  }
}
