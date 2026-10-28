import './floating-nav.css'

type FloatingNavOptions = {
  world: HTMLElement
  registrationUrl: string
}

/** Kept outside the scenery so the controls stay attached to the viewport. */
export function mountFloatingNav(host: HTMLElement, options: FloatingNavOptions): { destroy(): void } {
  const nav = document.createElement('nav')
  nav.className = 'floating-nav'
  nav.setAttribute('aria-label', 'Primary navigation')
  nav.innerHTML = `
    <div class="floating-nav-title" aria-hidden="true">HACKCWRU / MENU</div>
    <div class="floating-nav-items">
      <a class="floating-nav-link floating-nav-register" target="_blank" rel="noopener noreferrer" aria-label="Register (opens in a new tab)"><span>Register</span><span class="floating-nav-external" aria-hidden="true">↗</span></a>
      <a class="floating-nav-link" href="#info" data-nav-section="info"><span>About</span></a>
      <a class="floating-nav-link" href="#tracks" data-nav-section="tracks"><span>Tracks</span></a>
      <a class="floating-nav-link" href="#schedule" data-nav-section="schedule"><span>Schedule</span></a>
      <a class="floating-nav-link" href="#sponsors" data-nav-section="sponsors"><span>Sponsors</span></a>
    </div>
  `
  const register = nav.querySelector<HTMLAnchorElement>('.floating-nav-register')!
  register.href = options.registrationUrl
  const sectionLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-nav-section]'))
  const events = new AbortController()
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

  function updateActiveSection() {
    const active = options.world.dataset.activeSection
    register.classList.toggle('is-highlighted', active === 'main')
    for (const link of sectionLinks) {
      const current = link.dataset.navSection === active
      link.classList.toggle('is-highlighted', current)
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

  const observer = new MutationObserver(updateActiveSection)
  observer.observe(options.world, { attributes: true, attributeFilter: ['data-active-section'] })
  host.append(nav)
  updateActiveSection()

  return {
    destroy() {
      events.abort()
      observer.disconnect()
      nav.remove()
    },
  }
}
