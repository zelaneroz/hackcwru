# HackCWRU 2027

A TypeScript, CSS, and Vite website with a white background, a typographic HackCWRU 2027 homepage, pill navigation, three Purble Place track buildings, retro calendars, a Messages-style FAQ, and a sponsor music player.

## Start here

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The page sections are `#main`, `#info`, `#tracks`, `#schedule`, `#faq`, and `#sponsors`.

## Where to make common changes

| Change | Edit here | Find this |
| --- | --- | --- |
| Track titles, descriptions, prizes, and building images | [src/tracks-data.ts](src/tracks-data.ts) | `hackTracks` |
| Apply / Tally destination | [src/main.ts](src/main.ts) | `registrationUrl` |
| Main-page event name and year | [src/main.ts](src/main.ts) | `heroContent` |
| Homepage layout, colors, and fonts | [src/site.css](src/site.css) | `.hero-title`, `--brand-blue`, `--brand-green`, `@font-face` |
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
| Sponsors | `src/sponsors-data.ts`, `src/sponsors-player.ts` | `src/sponsors-player.css` |
| Top navigation | `src/floating-nav.ts` | `src/floating-nav.css` |
| Pixel cursor | `src/pixel-cursor.ts`, `public/pixel-cursor.svg` | `src/pixel-cursor.css` |
| About artwork | `infoContent` in `src/main.ts` | `src/info.css` |
| Page layout and supplied fonts | `src/main.ts`, local fonts in `public/fonts/` | `src/site.css` |
| Retro component defaults | Local fonts in `public/fonts/` | `src/retro.css` |

For sponsors, add or edit `id`, `name`, `image`, and an optional `url` in `src/sponsors-data.ts`. Store artwork under `public/sponsors/`. The player derives its album list and counts from the data; `placeholder.svg` is also its image-error fallback.

For FAQ updates, edit `faqContent.items`, keeping IDs unique. Answers are plain text; blank lines separate paragraphs.

## Background and page structure

[src/main.ts](src/main.ts) creates all six white sections, renders the homepage and About artwork, mounts the components, and handles hot-reload cleanup. When adding a component, mount it here and call its `destroy()` function in the disposal handler. [src/site.css](src/site.css) defines the shared layout and reserves room for the top navigation.

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

Before publishing, check the changed content locally: the Apply link, all navigation destinations, calendar headings and agenda entries, and all three track selections. Check a narrow mobile viewport and keyboard navigation, and confirm that longer content remains reachable by scrolling.
