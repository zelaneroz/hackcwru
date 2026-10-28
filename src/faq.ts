import './faq.css'
import { faqContent, type FAQContent } from './faq-data'

let nextInstance = 0

/** Native, keyboard-accessible disclosures; all editable copy lives in faq-data.ts. */
export function mountFAQ(container: HTMLElement, content: FAQContent = faqContent) {
  const events = new AbortController()
  const prefix = `faq-messages-${++nextInstance}`
  const stage = document.createElement('div')
  stage.className = 'faq-messages-stage'
  stage.innerHTML = `
    <section class="faq-messages-window" aria-labelledby="${prefix}-title">
      <header class="faq-messages-titlebar">
        <div class="faq-traffic-lights" aria-hidden="true"><span></span><span></span><span></span></div>
        <h2 class="faq-window-title" id="${prefix}-title">
          <svg class="faq-imessage-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <defs><linearGradient id="${prefix}-imessage" x2="0" y2="1"><stop stop-color="#88e95c"/><stop offset="1" stop-color="#24b440"/></linearGradient></defs>
            <rect x="1" y="1" width="30" height="30" rx="7" fill="url(#${prefix}-imessage)" stroke="#269d3d" stroke-width=".7"/>
            <path d="M26 14.5c0 5-4.5 8.5-10 8.5-1.1 0-2.2-.1-3.2-.4L7 25l1.7-4.6A7.8 7.8 0 0 1 6 14.5C6 9.8 10.5 6 16 6s10 3.8 10 8.5Z" fill="#fff"/>
          </svg>
          <span></span><span aria-hidden="true"></span><span class="faq-title"></span>
        </h2>
        <span class="faq-titlebar-balance" aria-hidden="true"></span>
      </header>
      <div class="faq-list" aria-label="Frequently asked questions"></div>
    </section>`
  container.append(stage)

  stage.querySelector('.faq-title')!.textContent = content.title

  const list = stage.querySelector<HTMLElement>('.faq-list')!
  const disclosures: HTMLDetailsElement[] = []

  content.items.forEach((item, index) => {
    const details = document.createElement('details')
    details.className = 'faq-item'
    details.dataset.faqId = item.id
    details.setAttribute('name', prefix)
    details.open = index === 0

    const summary = document.createElement('summary')
    summary.className = 'faq-summary'
    const question = document.createElement('span')
    question.className = 'faq-question'
    question.textContent = item.question
    const indicator = document.createElement('span')
    indicator.className = 'faq-indicator'
    indicator.setAttribute('aria-hidden', 'true')
    summary.append(question, indicator)

    const answer = document.createElement('div')
    answer.className = 'faq-answer'
    item.answer.trim().split(/\n\s*\n/).forEach(text => {
      const paragraph = document.createElement('p')
      paragraph.textContent = text
      answer.append(paragraph)
    })

    // Leave toggling and expanded-state announcements to the native disclosure.
    // Closing the other rows here also supports browsers without details grouping.
    summary.addEventListener('click', () => {
      if (!details.open) disclosures.forEach(other => { if (other !== details) other.open = false })
    }, { signal: events.signal })

    details.append(summary, answer)
    disclosures.push(details)
    list.append(details)
  })

  return { destroy() { events.abort(); stage.remove() } }
}
