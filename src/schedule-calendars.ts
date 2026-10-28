import './schedule-calendars.css'

// Preview agenda. Replace the entries and TBA times when the program is final.
const days = [
  {
    date: '2027-01-23', day: '23', weekday: 'Saturday',
    events: [
      { title: 'Check-in', detail: 'Pick up your badge. Meet your people.', color: 'amber' },
      { title: 'Opening ceremony', detail: 'A new window of possibility.', color: 'green' },
      { title: 'Team formation', detail: 'Find the people behind your next idea.', color: 'blue' },
      { title: 'Hacking begins', detail: 'Make your first commit.', color: 'purple' },
    ],
  },
  {
    date: '2027-01-24', day: '24', weekday: 'Sunday',
    events: [
      { title: 'Keep building', detail: 'Bring the idea to life.', color: 'green' },
      { title: 'Workshops', detail: 'Learn something new along the way.', color: 'blue' },
      { title: 'Mentor hours', detail: 'Work through the tricky parts.', color: 'purple' },
      { title: 'Project check-in', detail: 'Test, refine, repeat.', color: 'amber' },
    ],
  },
  {
    date: '2027-01-25', day: '25', weekday: 'Monday',
    events: [
      { title: 'Final submissions', detail: 'Put the finishing touches on.', color: 'amber' },
      { title: 'Project demos', detail: 'Show the world what you made.', color: 'blue' },
      { title: 'Judging', detail: 'Tell the story behind your project.', color: 'purple' },
      { title: 'Closing ceremony', detail: 'Celebrate the weekend together.', color: 'green' },
    ],
  },
] as const

let instance = 0

/** One modeless calendar window per day, independent of the world's geometry. */
export function mountScheduleCalendars(host: HTMLElement): { destroy(): void } {
  const prefix = `schedule-calendars-${++instance}`
  const stage = document.createElement('div')
  stage.className = 'schedule-calendars-stage'
  stage.innerHTML = `
    <header class="schedule-calendars-heading">
      <div><p>JAN 23–25, 2027</p><h2>Schedule</h2></div>
      <span class="schedule-calendars-preview">Preview · times coming soon</span>
    </header>
    <div class="schedule-calendar-restores" aria-label="Reopen calendars" hidden>
      ${days.map((day, index) => `<button type="button" class="mac-calendar-restore" data-restore="${index}" hidden>Open January ${day.day}</button>`).join('')}
    </div>
    <div class="schedule-calendar-windows">
      ${days.map((_, index) => `
        <section class="mac-calendar-window" data-calendar="${index}" aria-labelledby="${prefix}-${index}-heading">
          <header class="mac-calendar-titlebar">
            <div class="mac-calendar-controls">
              <button class="mac-calendar-control mac-calendar-close" type="button" data-calendar-action="close" aria-label="Close calendar ${index + 1}"><span aria-hidden="true"></span></button>
              <button class="mac-calendar-control mac-calendar-minimize" type="button" data-calendar-action="minimize" aria-label="Minimize calendar ${index + 1}" aria-expanded="true" aria-controls="${prefix}-${index}-content"><span aria-hidden="true"></span></button>
              <button class="mac-calendar-control mac-calendar-zoom" type="button" data-calendar-action="zoom" aria-label="Enlarge calendar ${index + 1}" aria-pressed="false"><span aria-hidden="true"></span></button>
            </div>
            <span class="mac-calendar-app-name">iCal</span>
            <span class="mac-calendar-window-number" aria-hidden="true">0${index + 1}</span>
          </header>
          <div class="mac-calendar-content" id="${prefix}-${index}-content">
            <div class="mac-calendar-toolbar">
              <div class="mac-calendar-date-heading">
                <div class="mac-calendar-date-icon" aria-hidden="true"><span>JAN</span><strong class="mac-calendar-day-number"></strong></div>
                <div><h3 id="${prefix}-${index}-heading" class="mac-calendar-weekday"></h3><time class="mac-calendar-full-date"></time></div>
              </div>
            </div>
            <ol class="mac-calendar-agenda" aria-label="Preview agenda" aria-live="polite" aria-atomic="true"></ol>
            <footer class="mac-calendar-footer"><span class="mac-calendar-source"><i aria-hidden="true"></i>HackCWRU</span><span>All times Eastern</span></footer>
          </div>
        </section>`).join('')}
    </div>
  `
  host.append(stage)
  const windows = Array.from(stage.querySelectorAll<HTMLElement>('.mac-calendar-window'))
  const restoreButtons = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-restore]'))
  const restores = stage.querySelector<HTMLElement>('.schedule-calendar-restores')!
  const events = new AbortController()
  let destroyed = false

  function renderDay(calendar: HTMLElement, dayIndex: number) {
    const day = days[dayIndex]!
    calendar.querySelector<HTMLElement>('.mac-calendar-day-number')!.textContent = day.day
    calendar.querySelector<HTMLElement>('.mac-calendar-weekday')!.textContent = day.weekday
    const date = calendar.querySelector<HTMLTimeElement>('.mac-calendar-full-date')!
    date.dateTime = day.date
    date.textContent = `January ${day.day}, 2027`
    calendar.querySelector<HTMLOListElement>('.mac-calendar-agenda')!.innerHTML = day.events.map((event) => `
      <li class="mac-calendar-event mac-calendar-event--${event.color}">
        <div class="mac-calendar-event-copy"><h4>${event.title}</h4><p>${event.detail}</p></div>
        <span class="mac-calendar-event-time"><strong>TBA</strong><span>EST</span></span>
      </li>`).join('')
  }

  windows.forEach((calendar, index) => renderDay(calendar, index))

  stage.addEventListener('click', (event) => {
    const target = event.target as Element
    const restore = target.closest<HTMLButtonElement>('[data-restore]')
    if (restore) {
      const calendar = windows[Number(restore.dataset.restore)]!
      calendar.hidden = false
      restore.hidden = true
      restores.hidden = restoreButtons.every((button) => button.hidden)
      calendar.querySelector<HTMLButtonElement>('.mac-calendar-close')!.focus({ preventScroll: true })
      return
    }

    const calendar = target.closest<HTMLElement>('.mac-calendar-window')
    if (!calendar) return
    const control = target.closest<HTMLButtonElement>('[data-calendar-action]')
    if (!control) return
    const content = calendar.querySelector<HTMLElement>('.mac-calendar-content')!
    const index = Number(calendar.dataset.calendar)

    switch (control.dataset.calendarAction) {
      case 'close':
        calendar.hidden = true
        restores.hidden = false
        restoreButtons[index]!.hidden = false
        restoreButtons[index]!.focus({ preventScroll: true })
        break
      case 'minimize':
        content.hidden = !content.hidden
        control.setAttribute('aria-expanded', String(!content.hidden))
        control.setAttribute('aria-label', `${content.hidden ? 'Restore' : 'Minimize'} calendar ${index + 1}`)
        break
      case 'zoom': {
        const zoomed = calendar.classList.toggle('is-zoomed')
        control.setAttribute('aria-pressed', String(zoomed))
        control.setAttribute('aria-label', `${zoomed ? 'Reduce' : 'Enlarge'} calendar ${index + 1}`)
        content.hidden = false
        const minimize = calendar.querySelector<HTMLButtonElement>('.mac-calendar-minimize')!
        minimize.setAttribute('aria-expanded', 'true')
        minimize.setAttribute('aria-label', `Minimize calendar ${index + 1}`)
        break
      }
    }
  }, { signal: events.signal })

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      events.abort()
      stage.remove()
    },
  }
}
