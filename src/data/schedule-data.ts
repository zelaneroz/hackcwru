export interface ScheduleEvent {
  title: string
  detail: string
  color: 'amber' | 'green' | 'blue' | 'purple'
  time?: string
  timeZone?: string
}

export interface ScheduleDay {
  date: string
  day: string
  weekday: string
  events: ScheduleEvent[]
}

// Preview calendar labels. These intentionally retain the existing calendar dates.
export const scheduleContent = {
  title: 'Schedule',
  dateRangeLabel: 'JAN 22–24, 2027',
  monthShort: 'JAN',
  monthName: 'January',
  year: '2027',
  previewLabel: 'Preview · times coming soon',
  agendaLabel: 'Preview agenda',
  defaultEventTime: 'TBA',
  timeZoneLabel: 'EST',
  timeZoneNote: 'All times Eastern',
}

// Replace the preview agenda and add event time/timeZone overrides when confirmed.
export const scheduleDays: ScheduleDay[] = [
  {
    date: '2027-01-22', day: '22', weekday: 'Friday',
    events: [
      { title: 'Check-in', detail: 'Pick up your badge. Meet your people.', color: 'amber' },
      { title: 'Opening ceremony', detail: 'A new window of possibility.', color: 'green' },
      { title: 'Team formation', detail: 'Find the people behind your next idea.', color: 'blue' },
      { title: 'Hacking begins', detail: 'Make your first commit.', color: 'purple' },
    ],
  },
  {
    date: '2027-01-23', day: '23', weekday: 'Saturday',
    events: [
      { title: 'Keep building', detail: 'Bring the idea to life.', color: 'green' },
      { title: 'Workshops', detail: 'Learn something new along the way.', color: 'blue' },
      { title: 'Mentor hours', detail: 'Work through the tricky parts.', color: 'purple' },
      { title: 'Project check-in', detail: 'Test, refine, repeat.', color: 'amber' },
    ],
  },
  {
    date: '2027-01-24', day: '24', weekday: 'Sunday',
    events: [
      { title: 'Final submissions', detail: 'Put the finishing touches on.', color: 'amber' },
      { title: 'Project demos', detail: 'Show the world what you made.', color: 'blue' },
      { title: 'Judging', detail: 'Tell the story behind your project.', color: 'purple' },
      { title: 'Closing ceremony', detail: 'Celebrate the weekend together.', color: 'green' },
    ],
  },
]
