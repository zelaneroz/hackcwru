# HackCWRU 2027

A TypeScript, CSS, and Vite website with a continuous mosaic landscape, an iMac hero, three Purble Place track buildings, retro calendars, a Messages-style FAQ, and a sponsor music player.

## Start here

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The page sections are `#main`, `#info`, `#tracks`, `#schedule`, `#faq`, `#sponsors`, and `#end-banner`.

## Where to make common changes

| Change | Edit here | Find this |
| --- | --- | --- |
| Track titles, descriptions, prizes, and building images | [src/tracks-data.ts](src/tracks-data.ts) | `hackTracks` |
| Register / Tally destination | [src/main.ts](src/main.ts) | `registrationUrl` |
| Main-page event name and visible dates | [src/hero-imac.ts](src/hero-imac.ts) | `HackCWRU 2027`, `imac-hero-date` |
| Countdown target date and time | [src/hero-imac.ts](src/hero-imac.ts) | `EVENT_START` |
| Calendar dates, weekdays, and agenda entries | [src/schedule-calendars.ts](src/schedule-calendars.ts) | `days`, `renderDay` |
| FAQ questions and answers | [src/faq-data.ts](src/faq-data.ts) | `faqContent` |
| Sponsor names, logos, and website links | [src/sponsors-data.ts](src/sponsors-data.ts) | `sponsors` |
| Browser title and search description | [index.html](index.html) | `<title>`, `name="description"` |
| About-page artwork and alternative text | [src/main.ts](src/main.ts) | `infoContent` |

## Edit tracks and prizes

[src/tracks-data.ts](src/tracks-data.ts) is the source of truth for the track content and images. The entries currently appear in this order:

1. Software — schoolhouse.
2. Hardware — cake factory.
3. Special Track — purple eye shop.

Each entry has this structure:

```ts
{
  id: 'software',
  filename: 'software.txt',
  title: 'Software',
  image: {
    src: '/schoolhouse.png',
    alt: 'Purble Place schoolhouse with a golden bell',
  },
  bullets: [
    'First description paragraph.',
    'Second description paragraph.',
  ],
  prizes: [
    { award: 'Best Software Project', details: 'Prize details here' },
  ],
}
```

- Keep each `id` unique. Array order controls building order.
- `filename` is the name shown in the description window's title bar.
- `bullets` currently requires exactly two strings, as defined by `HackTrack`.
- `prizes` can contain any number of awards; an empty array hides the Prizes heading.
- Put images in `public/`. For example, `public/schoolhouse.png` is referenced as `/schoolhouse.png`, without `public/` in the URL.
- The image is decorative in the selector; the visible track title supplies its accessible name. Keep the image metadata descriptive when replacing artwork.

[src/purble-tracks.ts](src/purble-tracks.ts) renders the data and handles selection. [src/purble-tracks.css](src/purble-tracks.css) controls the layout: buildings use the left 5/7 and the description uses the right 2/7 on desktop, with a stacked layout on smaller screens. The village uses three staggered grid placements, with the cake factory in front. Review the `.purble-track-building:nth-child(...)` rules if you add, remove, or reposition buildings.

## Change the Register / Tally link

In [src/main.ts](src/main.ts), search for:

```ts
const registrationUrl = 'https://tally.so/r/WJJjpe'
```

Replace that URL once. It is passed to both the iMac hero and floating navigation, so both Register buttons use the same destination. Both currently open in a new tab. Their link behavior lives in `src/hero-imac.ts` and `src/floating-nav.ts`.

## Change the main-page dates and countdown

All hero content lives in [src/hero-imac.ts](src/hero-imac.ts). Update these separately:

1. **Visible event name:** the `<h1>` containing `HackCWRU 2027`.
2. **Visible date range:** `<p class="imac-hero-date">Jan 22–24</p>`.
3. **Countdown target:** the `EVENT_START` constant near the top of the file.

The current countdown target is:

```ts
const EVENT_START = Date.parse('2027-01-22T09:00:00-05:00')
```

This means January 22, 2027 at 9:00 a.m. Eastern Standard Time. Preserve an explicit timezone offset when changing the timestamp so visitors in different timezones count down to the same instant. Use the offset appropriate to the new event date; January's `-05:00` should not be copied blindly to a date during daylight saving time.

**Changing the visible dates does not change the countdown, and changing the countdown does not change the visible dates.** The timer recalculates from the current timestamp every second and stops at zero.

If the event year changes, also update both countdown `aria-label` strings in this file, plus the title and description in `index.html`. Search the rest of the project for the old year to catch FAQ copy and the legacy `tracks.html` redirect title.

Hero size, screen positioning, fonts, and button styling live in [src/hero-imac.css](src/hero-imac.css).

## Change calendar dates and agenda

Open [src/schedule-calendars.ts](src/schedule-calendars.ts). Calendar dates are separate from the hero countdown and must be updated manually.

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
| Sponsors | `src/sponsors-data.ts`, `src/sponsors-player.ts` | `src/sponsors-player.css` |
| Floating navigation | `src/floating-nav.ts` | `src/floating-nav.css` |
| Pixel cursor | `src/pixel-cursor.ts`, `public/pixel-cursor.svg` | `src/pixel-cursor.css` |
| Swaying grass and red kite | `src/world-background-mosaic.ts` | `src/world-background-mosaic.css` |
| Lake floaters and rubber duck | `src/world-background-mosaic.ts` | `src/world-background-mosaic.css` |
| About artwork | `infoContent` in `src/main.ts` | `src/info.css` |
| Shared fonts and retro defaults | Local fonts in `public/fonts/` | `src/retro.css` |

For sponsors, add or edit `id`, `name`, `image`, and an optional `url` in `src/sponsors-data.ts`. Store artwork under `public/sponsors/`. The player derives its album list and counts from the data; `placeholder.svg` is also its image-error fallback.

For FAQ updates, edit `faqContent.items`, keeping IDs unique. Answers are plain text; blank lines separate paragraphs.

## Background and page structure

[src/main.ts](src/main.ts) creates all seven sections, defines the continuous SVG landscape, mounts the components, and handles hot-reload cleanup. When adding a component, mount it here and call its `destroy()` function in the existing disposal handler.

The active background files are:

- [src/world-background-mosaic.css](src/world-background-mosaic.css) — mosaic seams, cloud movement, grazing/swaying animations, the kite's flight path, and scene styles.
- [src/world-background-mosaic.ts](src/world-background-mosaic.ts) — scenery rasterization, cows, grass tufts, red kite markup, and scroll/parallax behavior.

Desktop mosaic tiles are currently 12px and mobile tiles are 8px. To change their size, update both `--mosaic-tile` in the CSS and `const tile` in the TypeScript so the grid and raster sampling match.

`src/world-background.css` and `src/world-background.ts` are preserved originals. Make future background changes in the **mosaic copies**. The shared SVG scenery itself is still defined in `src/main.ts`.

See [ASSETS.md](ASSETS.md) for asset provenance and generation notes. Keep the font license files with their fonts. Reference images in `public/fonts/` are design inspiration rather than live UI assets.

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

Before publishing, check the changed content locally: both Register links, the visible date range and countdown, all calendar headings and agenda entries, and all three track selections. Check a narrow mobile viewport and keyboard navigation, and confirm that longer content remains reachable by scrolling.
