import './floating-nav.css'

type FloatingNavOptions = {
  world: HTMLElement
  registrationUrl: string
}

/** Primary links stay available while visitors explore the page. */
export function mountFloatingNav(host: HTMLElement, options: FloatingNavOptions): { destroy(): void } {
  const nav = document.createElement('nav')
  nav.className = 'floating-nav'
  nav.setAttribute('aria-label', 'Primary navigation')
  nav.innerHTML = `
    <div class="floating-nav-items">
      <a class="floating-nav-link" href="#info" data-nav-section="info"><span>About</span></a>
      <a class="floating-nav-link" href="#tracks" data-nav-section="tracks"><span>Tracks &amp; Prizes</span></a>
      <a class="floating-nav-link floating-nav-register" target="_blank" rel="noopener noreferrer" aria-label="Apply (opens in a new tab)"><span>Apply</span></a>
      <a class="floating-nav-link" href="#faq" data-nav-section="faq"><span>FAQs</span></a>
      <a class="floating-nav-link" href="#sponsors" data-nav-section="sponsors"><span>Sponsors</span></a>
    </div>
  `
  const register = nav.querySelector<HTMLAnchorElement>('.floating-nav-register')!
  register.href = options.registrationUrl
  const sectionLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-nav-section]'))
  const events = new AbortController()
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

  function updateActiveSection(active: string) {
    for (const link of sectionLinks) {
      const current = link.dataset.navSection === active
      if (current) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    }
  }

  nav.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-nav-section]')
    if (!link) return
    const target = document.getElementById(link.dataset.navSection!)
    if (!target) return
    event.preventDefault()
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash)
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: motionPreference.matches ? 'auto' : 'smooth', block: 'start' })
  }, { signal: events.signal })

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) updateActiveSection(entry.target.id)
    }
  }, { rootMargin: '-20% 0px -55% 0px' })
  for (const section of options.world.querySelectorAll('[data-world-section]')) observer.observe(section)
  host.append(nav)

  return {
    destroy() {
      events.abort()
      observer.disconnect()
      nav.remove()
    },
  }
}
