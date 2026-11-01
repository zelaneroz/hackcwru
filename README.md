# HackCWRU 2027

A TypeScript, CSS, and Vite website with a white HackCWRU 2027 homepage, pill navigation, a green track music player, retro calendars, a Messages-style FAQ, a sponsor wall of reusable retro window panes, and a team footer with member details.

## Start here

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The main-page sections are `#main`, `#info`, `#tracks`, `#schedule`, `#faq`, and `#sponsors`. The team footer follows the main element at `#team`.

## Where to make common changes

| Change | Edit here | Find this |
| --- | --- | --- |
| Track titles, descriptions, prizes, music, and pixel artwork | [src/tracks-data.ts](src/tracks-data.ts) | `hackTracks` |
| Apply / Tally destination | [src/main.ts](src/main.ts) | `registrationUrl` |
| Main-page event name and year | [src/main.ts](src/main.ts) | `heroContent` |
| Homepage layout, colors, and fonts | [src/site.css](src/site.css) | `.hero-title`, `--brand-blue`, `--brand-green`, `@font-face` |
| Calendar dates, weekdays, and agenda entries | [src/schedule-calendars.ts](src/schedule-calendars.ts) | `days`, `renderDay` |
| FAQ questions and answers | [src/faq-data.ts](src/faq-data.ts) | `faqContent` |
| Sponsor names, logos, pane sizes, and website links | [src/sponsors-data.ts](src/sponsors-data.ts) | `sponsors` |
| Team members, portraits, profiles, and organization contacts | [src/team-data.ts](src/team-data.ts) | `teamMembers`, `teamContact` |
| Browser title and search description | [index.html](index.html) | `<title>`, `name="description"` |
| About-page artwork and alternative text | [src/main.ts](src/main.ts) | `infoContent` |

## Edit tracks and prizes

[src/tracks-data.ts](src/tracks-data.ts) supplies the track content, pixel artwork, and music. The entries appear in this order:

| Track | Artwork | Music |
| --- | --- | --- |
| Software | `public/track-art/coffee.svg` | `public/tracks/track1.m4a` |
| Hardware | `public/track-art/flower.svg` | `public/tracks/track2.m4a` |
| Special Track | `public/track-art/planet.svg` | `public/tracks/track3.m4a` |

Each entry has this structure:

```ts
{
  id: 'software',
  filename: 'software.txt',
  title: 'Software',
  image: {
    src: '/track-art/coffee.svg',
    alt: 'Pixel art of a steaming coffee mug',
  },
  audio: { src: '/tracks/track1.m4a', duration: 31.704 },
  bullets: ['Description paragraph.'],
  prizes: [
    { award: 'Best Software Project', details: 'Prize details here' },
  ],
}
```

- Keep each `id` unique. Array order controls playlist order.
- `filename` is retained for compatibility with the previous track component.
- `bullets` currently requires exactly one string (`[string]`) as defined by `HackTrack`.
- `prizes` can contain any number of awards; an empty array hides the Prizes heading.
- Asset URLs omit `public/`. Keep the image alternative text descriptive when replacing artwork.
- `audio.duration` is a fallback in seconds; the player uses the media's actual duration once metadata loads.

[src/tracks-player.ts](src/tracks-player.ts) handles selection, artwork, descriptions, prizes, playback, seeking, and keyboard navigation. Selecting a track starts its music; the player starts silent and pauses when the section leaves view or the browser tab becomes hidden. The previous/next buttons also change the selected hackathon track.

[src/tracks-player.css](src/tracks-player.css) controls the green background, two-column layout, mobile stacking, and pixel controls. The title uses the local Architype Fodor font; other text uses Computer Says No. Artwork lives in `public/track-art/`.

## Change the Apply / Tally link

In [src/main.ts](src/main.ts), search for:

```ts
const registrationUrl = 'https://tally.so/r/WJJjpe'
```

This URL supplies the top navigation's Apply button, which opens in a new tab. Navigation labels, destinations, and section tracking live in [src/floating-nav.ts](src/floating-nav.ts); pill styling and mobile wrapping live in [src/floating-nav.css](src/floating-nav.css).

## Change the homepage title and fonts

Edit `heroContent` in [src/main.ts](src/main.ts) to change the visible event name and year. Keep the heading's `aria-label` in sync. Update the title and description in `index.html` and search for the old year elsewhere when changing the event year.

[src/site.css](src/site.css) controls the title layout and white page backgrounds. It loads local fonts from `public/fonts/`: Helvetica Now Display Bold for the title and Computer Says No for navigation. The brand colors are white, black, blue `#0b64c6`, and green `#83a251`; the title brackets use green.

## Change calendar dates and agenda

Open [src/schedule-calendars.ts](src/schedule-calendars.ts). Calendar dates and agenda content must be updated manually.

At the top, each entry in `days` contains:

```ts
{
  date: '2027-01-22', // Machine-readable YYYY-MM-DD date
  day: '22',          // Large day number
  weekday: 'Friday',  // Visible weekday
  events: [
    { title: 'Check-in', detail: 'Pick up your badge.', color: 'amber' },
  ],
}
```

Update `date`, `day`, and `weekday` together for each day. Edit the `events` arrays to change agenda titles, descriptions, order, or number of entries. Existing event colors are `amber`, `green`, `blue`, and `purple`.

The month and year also appear in the rendered markup. Search this file for all of the following when changing the weekend:

- `JAN 22–24, 2027` — section heading.
- `Open January` — calendar restore-button labels.
- `<span>JAN</span>` — month badge inside each calendar.
- ``January ${day.day}, 2027`` — full visible date in `renderDay`.

Event times are currently hardcoded as `TBA` and `EST` inside `renderDay`; the footer says `All times Eastern`. To give each event a different time, add a time field to every agenda entry and render that field in place of `TBA`. Update timezone labels if needed, along with `Preview · times coming soon` and the agenda's `Preview agenda` accessible label when publishing a final schedule.

[src/schedule-calendars.css](src/schedule-calendars.css) controls calendar appearance and responsive layout.

## Other content and design changes

| Area | Content / behavior | Styles |
| --- | --- | --- |
| FAQ | `src/faq-data.ts`, `src/faq.ts` | `src/faq.css` |
| Sponsors | `src/sponsors-data.ts`, `src/sponsors-wall.ts` | `src/sponsors-wall.css` |
| Team footer and member popup | `src/team-data.ts`, `src/team-footer.ts` | `src/team-footer.css` |
| Reusable retro window pane | `src/retro-window.ts` | `src/retro-window.css` |
| Top navigation | `src/floating-nav.ts` | `src/floating-nav.css` |
| Pixel cursor | `src/pixel-cursor.ts`, `public/pixel-cursor.svg` | `src/pixel-cursor.css` |
| About artwork | `infoContent` in `src/main.ts` | `src/info.css` |
| Page layout and supplied fonts | `src/main.ts`, local fonts in `public/fonts/` | `src/site.css` |
| Retro component defaults | Local fonts in `public/fonts/` | `src/retro.css` |

For FAQ updates, edit `faqContent.items`, keeping IDs unique. Answers are plain text; blank lines separate paragraphs.

### Edit sponsors and pane sizes

[src/sponsors-data.ts](src/sponsors-data.ts) supplies every pane in the wall. Each entry requires a unique `id`, a `name`, an `image` URL, and a `size` of `'small'`, `'medium'`, or `'large'`; `url` is optional. Size controls the pane and logo dimensions, not a sponsorship tier. Store images under `public/sponsors/` and use `/sponsors/...` URLs.

| Current entry | Image | Size |
| --- | --- | --- |
| TekSafari | `/sponsors/teksafari.png` | `large` |
| CWRU Veale Institute for Entrepreneurship | `/sponsors/placeholder.svg` | `medium` |
| Placeholder 1 | `/sponsors/placeholder.svg` | `small` |

Replace the placeholder image URLs when logo assets are available. Optional website links open in a new tab. If an image cannot load, its sponsor name appears as text.

[src/sponsors-wall.ts](src/sponsors-wall.ts) renders the heading and one pane per entry. [src/sponsors-wall.css](src/sponsors-wall.css) controls the staggered layout, responsive wrapping, and logo footprints.

Drag a pane by its title bar with a mouse or touch. With the title bar focused, use arrow keys to move it, Shift plus an arrow for larger steps, and Home to reset its position. Movement stays within the sponsor wall; positions are kept in memory and reset when the page reloads.

### Reuse the retro window pane

`createRetroWindow` in [src/retro-window.ts](src/retro-window.ts) accepts any DOM `Node` as `content`, an optional title, and an optional size (default `'medium'`). Append its returned element wherever the pane is needed:

```ts
import { createRetroWindow } from './retro-window'

const content = document.createElement('p')
content.textContent = 'Your content here.'
const pane = createRetroWindow({ content, title: 'Example', size: 'medium' })
host.append(pane)

pane.style.setProperty('--retro-window-bar-color', '#17006b')
pane.style.setProperty('--retro-window-surface', '#fff')
pane.style.setProperty('--retro-window-content-padding', '16px')
```

The shared styles are in [src/retro-window.css](src/retro-window.css). The minimize, maximize, and close marks are decorative; they are not interactive buttons.

To add the same dragging behavior elsewhere, use `enableWindowDrag` from [src/window-drag.ts](src/window-drag.ts):

```ts
import { enableWindowDrag } from './window-drag'

const dragging = enableWindowDrag({
  element: pane,
  handle: pane.querySelector<HTMLElement>('.retro-window-titlebar')!,
  bounds: host,
  label: 'Example window',
})
```

The `bounds` element defines the movement area. Call `dragging.destroy()` when removing the pane to release its event handlers.

### Edit team members and contacts

[src/team-data.ts](src/team-data.ts) supplies the eight `teamMembers` and the organization-level `teamContact` links. Each member follows this type:

```ts
interface TeamMember {
  id: string
  order: number
  name: string
  position: string
  description: string
  imagePath: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
}
```

Each member requires a numeric `order` (currently 1–8). Smaller values appear first, starting at the top left and continuing across each row before the next row. These numbers control display order independently of array positions.

The current cards use the labels `first name` and `position`, with the exact description `lorem ipsum dolor sit amet`. Replace those values with member details and keep IDs unique. `imagePath` is a public URL such as `/team/Blessing.png`, without `public/`.

The first six cards use the supplied portraits `Blessing.png`, `khang.PNG`, `ninjin.png`, `saniha.png`, `zelan.png`, and `zijin.png` in `public/team/`. The final two use `/team/placeholder.svg`; replace those paths when their photos are available. A failed portrait also falls back to this placeholder.

Optional `linkedinUrl`, `githubUrl`, and `websiteUrl` values should be full `https://` URLs. Omit unavailable links; supplied profile links appear in the member popup and open in a new tab.

`teamContact` controls the footer's organization links:

```ts
{
  email: 'hackcwruteam@case.edu',
  linkedinUrl: 'https://www.linkedin.com/company/hackcwru',
  instagramUrl: 'https://www.instagram.com/hack_cwru/',
}
```

[src/team-footer.ts](src/team-footer.ts) renders the `#team` footer outside the main element and opens a native dialog when a member card is selected. Close the popup with its Close button, Escape, or the backdrop; focus returns to the selected card. [src/team-footer.css](src/team-footer.css) controls the card grid, social links, and popup layout.

## Background and page structure

[src/main.ts](src/main.ts) creates all six main sections, renders the homepage and About artwork, mounts the components and team footer, and handles hot-reload cleanup. The footer follows the main element; its dialog is attached to the document body. Both are removed by the footer component’s `destroy()` handler during cleanup. When adding a component, mount it here and call its `destroy()` function in the disposal handler. [src/site.css](src/site.css) defines the shared layout and reserves room for the top navigation.

The previous iMac hero and countdown (`src/hero-imac.ts`, `src/hero-imac.css`) and landscape files (`src/world-background*`) are preserved but are not imported or mounted by the active page. Scenery, parallax, and background overlays are disabled.

See [ASSETS.md](ASSETS.md) for asset provenance and generation notes. Keep the font license files with their fonts.

## Check and publish changes

For a TypeScript-only check:

```sh
npx tsc --noEmit
```

To create and preview a production build:

```sh
npm run build
npm run preview
```

The generated site is written to `dist/`; edit source files rather than generated output. `vite.config.ts` builds `index.html` and `tracks.html`. The latter preserves the old address by redirecting visitors to `/#tracks`.

Before publishing, check the changed content locally: the Apply link, all navigation destinations, calendar headings and agenda entries, all three track selections, and team-card popup opening and dismissal. Check a narrow mobile viewport and keyboard navigation, and confirm that longer content remains reachable by scrolling.
