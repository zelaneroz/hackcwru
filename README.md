# HackCWRU 2027

A TypeScript and Vite site with a pixel-laptop opening, a blue event poster, music-backed tracks, an animated landscape behind Schedule/FAQ/Sponsors, and a team footer with member profiles.

## Run and build

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To type-check and build the production site, then preview it:

```sh
npm run build
npm run preview
```

Build output goes to `dist/`; edit the source files, not generated output. For a type-check without building, run `npx tsc --noEmit`.

| Route | Purpose |
| --- | --- |
| `/` | Current homepage and all sections |
| `/homepage-backup.html` | Preserved white title-and-trinkets homepage with shared section components |
| `/tracks.html` | Legacy address that redirects to `/#tracks` |

The section IDs are `#main`, `#info`, `#tracks`, `#schedule`, `#faq`, and `#sponsors`. The `#team` footer follows the main element. All three HTML entry points are registered in [vite.config.ts](vite.config.ts).

## Project layout

```text
src/data/         Editable event, schedule, FAQ, track, sponsor, and team content
src/elements/     UI components and their paired stylesheets
src/shared/       Page entries, shared styles, and pure artwork/scroll helpers
public/           Fonts, images, SVG artwork, and music
```

[src/shared/main.ts](src/shared/main.ts) assembles the current page. Components return `destroy()` handlers for listeners, observers, media, and DOM cleanup. The backup entry is [src/shared/homepage-backup.ts](src/shared/homepage-backup.ts), styled by [src/shared/homepage-backup.css](src/shared/homepage-backup.css).

## Common content edits

| Change | Source | Edit |
| --- | --- | --- |
| Event name/year, homepage date and venue, About paragraph | [src/data/site-data.ts](src/data/site-data.ts) | `siteContent` |
| Apply destination | [src/data/site-data.ts](src/data/site-data.ts) | `registrationUrl` |
| Calendar dates, events, and labels | [src/data/schedule-data.ts](src/data/schedule-data.ts) | `scheduleDays`, `scheduleContent` |
| FAQ questions and answers | [src/data/faq-data.ts](src/data/faq-data.ts) | `faqContent.items` |
| Track descriptions, prizes, art, and music | [src/data/tracks-data.ts](src/data/tracks-data.ts) | `hackTracks` |
| Sponsor logos, sizes, and website links | [src/data/sponsors-data.ts](src/data/sponsors-data.ts) | `sponsors` |
| Team members, bios, photos, and organization links | [src/data/team-data.ts](src/data/team-data.ts) | `teamMembers`, `teamContact` |
| Browser title and search description | [index.html](index.html) | `<title>`, `name="description"` |

`siteContent` contains `eventName`, `eventYear`, `heroDateLabel`, `venueName`, `venueLocation`, and `aboutCopy`. `siteTitle` is derived from the event name and year. `registrationUrl` supplies the navigation and poster Apply links, which open the Tally form in a new tab.

### Change the Apply URL

Open `src/data/site-data.ts` and replace the value of this single export:

```ts
export const registrationUrl = 'https://tally.so/r/WJJjpe'
```

Use the complete destination URL. This updates the current page's navigation and poster button, plus the backup page's navigation; no component files need editing.

### Dates to review

The current sources contain different dates; this reorganization preserves them:

| Location | Current date | Source |
| --- | --- | --- |
| Homepage poster | Jan 25–27, 2027 | `siteContent.heroDateLabel` |
| Calendar | Jan 22–24, 2027 | `scheduleDays`, `scheduleContent` |
| Retained FAQ introduction (currently not displayed) | February 13–15, 2026 | `faqContent.introduction` |

Changing the homepage date does not change the calendar or FAQ. When the event dates are confirmed, update the corresponding records together.

1. Set `siteContent.heroDateLabel` in `src/data/site-data.ts` for the poster. Change `eventYear` there when changing years.
2. In `src/data/schedule-data.ts`, update `scheduleContent.dateRangeLabel`, `monthShort`, `monthName`, and `year`. Update each `scheduleDays` entry's `date` (`YYYY-MM-DD`), `day`, and `weekday` to match.
3. Review date references in `faqContent.items` and the retained `introduction` in `src/data/faq-data.ts`.
4. When changing the event year, update the static `<title>` and metadata in `index.html`, `homepage-backup.html`, and `tracks.html` as applicable.

### Calendar and FAQ

Each `scheduleDays` entry has `date`, `day`, `weekday`, and an `events` array. Keep the machine-readable date, visible day, and weekday consistent. Events have `title`, `detail`, and a `color` of `amber`, `green`, `blue`, or `purple`; optional `time` and `timeZone` override the defaults.

`scheduleContent` holds `title`, `dateRangeLabel`, `monthShort`, `monthName`, `year`, `previewLabel`, `agendaLabel`, `defaultEventTime`, `timeZoneLabel`, and `timeZoneNote`. The current defaults are `TBA` and `EST`.

FAQ answers are plain text. Keep item IDs unique; blank lines separate paragraphs.

### Tracks and sponsors

Each track provides `image`, `audio`, `bullets`, and `prizes`. The current `bullets` type requires one description string. An empty prizes array hides the Prizes heading. `audio.duration` is a fallback in seconds until media metadata loads.

| Track | Artwork | Music |
| --- | --- | --- |
| Software | `/track-art/coffee.svg` | `/tracks/track1.m4a` |
| Hardware | `/track-art/flower.svg` | `/tracks/track2.m4a` |
| Special Track | `/track-art/planet.svg` | `/tracks/track3.m4a` |

Track selection changes the artwork, information, and music. Playback starts silent, begins after interaction, and pauses when the section leaves view or the page becomes inactive.

Sponsors use a responsive, borderless logo grid. Each entry requires `id`, `name`, `image`, and `size` (`small`, `medium`, or `large`); optional `url` makes the logo a link. Size controls the logo footprint, not a sponsorship tier. TekSafari currently uses `/sponsors/teksafari.png`; the other entries use `/sponsors/placeholder.svg`. A failed image displays the sponsor name.

### Team members

The current array contains nine members. Each record has `id`, numeric `order`, `name`, `position`, `description`, and `imagePath`. Smaller order values appear first, from the top left across each row, independently of array positions. Keep IDs unique.

Write longer bios as multiline template strings:

```ts
description: `
First paragraph about the member.

Another paragraph, with as many sentences as needed.
`.trim(),
```

Optional `linkedinUrl`, `websiteUrl`, and `githubUrl` values should be complete `https://` URLs; omit unavailable links. They appear as icons below the position and above the bio. Clicking a card opens the member dialog; Close, Escape, or a backdrop click dismisses it and returns focus to that card.

`imagePath` points to a portrait such as `/team/zelan.png`. Missing images fall back to `/team/placeholder.svg`. `teamContact` controls the organization email, LinkedIn, and Instagram links in the footer.

## Layout, artwork, and motion

UI code and matching CSS live together in `src/elements/`:

| Area | Files |
| --- | --- |
| Laptop opening, loader, and event poster | `scroll-hero.ts`, `scroll-hero.css`; pure calculations in `src/shared/scroll-hero-state.ts` |
| About ASCII skyline | `ascii-skyline.ts`, `info.css`; frame generator in `src/shared/skyline-art.ts` |
| Track music player | `tracks-player.ts`, `tracks-player.css` |
| Calendars | `schedule-calendars.ts`, `schedule-calendars.css` |
| FAQ window | `faq.ts`, `faq.css` |
| Sponsor grid | `sponsors-grid.ts`, `sponsors-grid.css` |
| Team footer and dialog | `team-footer.ts`, `team-footer.css` |
| Navigation and cursor | `floating-nav.ts/css`, `pixel-cursor.ts/css` |
| Shared landscape and pixel transitions | `bliss-motion.ts`, `bliss-chapter.css`, `tracks-bliss-transition.css` |

[src/shared/site.css](src/shared/site.css) and [src/shared/retro.css](src/shared/retro.css) contain shared defaults and font declarations. Local fonts live in `public/fonts/`.

The homepage scroll sequence spans `500svh`: laptop, screen zoom/loading, then the blue event poster. Reduced motion displays the poster directly in `100svh`. Screen-overlay alignment is controlled in `scroll-hero.css`; keep it aligned if replacing the laptop image.

The About illustration is an 86-column, 42-row ASCII grid. Its animation runs only while visible and motion is allowed. Schedule, FAQ, and Sponsors share one sticky landscape; only its cloud and foreground-grass layers move. Their motion pauses offscreen, on an inactive page, and with reduced motion enabled. Pixel edges join Tracks to the landscape and the landscape to the white team footer.

## Assets and URLs

A file at `public/team/zelan.png` is served as `/team/zelan.png`. Use the URL form in data and HTML; do not include `public/`. Paths and filename casing must match, including names such as `khang.PNG`. Fonts use the same rule, with `/fonts/...` URLs.

The retained `public/hero/pixel-laptop.png` and `public/backgrounds/pixel-bliss-clear.png`, `public/backgrounds/pixel-clouds.png`, and `public/backgrounds/pixel-grass.png` were generated with the built-in imagegen tool from the user's visual direction. The laptop contains a blank display for the live HTML screen. The pixel city, track illustrations, and transition edges are code-native SVG artwork.

After visual or content changes, run the build and check a narrow mobile viewport, keyboard navigation, the intro in both scroll directions, media controls, member dialogs, and the backup route.
