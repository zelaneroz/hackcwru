# HackCWRU 2027

A TypeScript, CSS, and Vite website with a homepage that scrolls from a sleeping pixel-art laptop to a blue game poster, pill navigation, a green track music player, retro calendars, a Messages-style FAQ, a sponsor logo grid, and a team footer with member details.

## Start here

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The main-page sections are `#main`, `#info`, `#tracks`, `#schedule`, `#faq`, and `#sponsors`. The team footer follows the main element at `#team`.

The previous white title-and-trinkets homepage is preserved at [/homepage-backup.html](homepage-backup.html), in both development and production builds. Its entry point is [src/homepage-backup.ts](src/homepage-backup.ts), with the copied styles in [src/homepage-backup.css](src/homepage-backup.css). The backup keeps the other sections and their shared components available.

## Where to make common changes

| Change | Edit here | Find this |
| --- | --- | --- |
| Track titles, descriptions, prizes, music, and pixel artwork | [src/tracks-data.ts](src/tracks-data.ts) | `hackTracks` |
| Apply / Tally destination | [src/main.ts](src/main.ts) | `registrationUrl` |
| Homepage event name, loading text, date, venue, and Apply button | [src/scroll-hero.ts](src/scroll-hero.ts) | `mountScrollHero`, `intro-loader-title`, `intro-poster-title` |
| Homepage phase timing and screen zoom | [src/scroll-hero-state.ts](src/scroll-hero-state.ts) | `getIntroState`, `getMonitorZoomTarget` |
| Homepage layout, colors, and screen alignment | [src/scroll-hero.css](src/scroll-hero.css) | `.scroll-hero`, `.intro-monitor-screen`, `.intro-poster` |
| Shared page colors and font declarations | [src/site.css](src/site.css) | `--brand-blue`, `--brand-green`, `@font-face` |
| Previous white homepage | [src/homepage-backup.ts](src/homepage-backup.ts), [src/homepage-backup.css](src/homepage-backup.css) | `heroContent`, `.hero-title` |
| Calendar dates, weekdays, and agenda entries | [src/schedule-calendars.ts](src/schedule-calendars.ts) | `days`, `renderDay` |
| FAQ questions and answers | [src/faq-data.ts](src/faq-data.ts) | `faqContent` |
| Sponsor names, logos, logo sizes, and website links | [src/sponsors-data.ts](src/sponsors-data.ts) | `sponsors` |
| Team members, portraits, profiles, and organization contacts | [src/team-data.ts](src/team-data.ts) | `teamMembers`, `teamContact` |
| Browser title and search description | [index.html](index.html) | `<title>`, `name="description"` |
| About skyline artwork | [src/skyline-art.ts](src/skyline-art.ts) | `renderSkylineFrame` |
| About animation and accessible label | [src/ascii-skyline.ts](src/ascii-skyline.ts) | `mountAsciiSkyline` |
| About paragraph | [src/main.ts](src/main.ts) | `infoContent` |

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

The section's sparse top and bottom pixel transitions use distinct, non-repeating artwork in `public/tracks/pixel-edge.svg` and `public/tracks/pixel-edge-bottom.svg`. Their height is set by `--tracks-edge-height` in the Tracks stylesheet, with a smaller edge on mobile.

## Change the Apply / Tally link

In [src/main.ts](src/main.ts), search for:

```ts
const registrationUrl = 'https://tally.so/r/WJJjpe'
```

This URL supplies both the top navigation's Apply button and the homepage poster's single primary Apply button; both open the Tally registration form in a new tab. Navigation labels, destinations, and section tracking live in [src/floating-nav.ts](src/floating-nav.ts); pill styling and mobile wrapping live in [src/floating-nav.css](src/floating-nav.css). The backup entry has its own `registrationUrl` constant.

## Edit the homepage scroll sequence

[src/scroll-hero.ts](src/scroll-hero.ts) mounts three stages: a simplified dark-blue pixel-art laptop, a zoom into its screen followed by a black XP-inspired HackCWRU 2027 loading screen, and a blue retro game poster. The poster contains the event title, the date `Jan 25–27, 2027`, a two-line venue block reading `Case Western Reserve University` and `Cleveland, Ohio`, and one primary Apply button opening the registration form in a new tab. Text, screen contents, controls, and poster typography are HTML/CSS rather than baked into the scene image.

[src/scroll-hero-state.ts](src/scroll-hero-state.ts) contains the pure progress, phase, and zoom calculations. [src/scroll-hero.css](src/scroll-hero.css) controls the sticky viewport, screen overlay alignment, loader, poster, and mobile layouts. The standard sequence spans `500svh`. The artwork fills at least the viewport width without stretching, with framing that keeps the laptop display visible on portrait and ultrawide screens. With reduced motion enabled, the page shows the final poster directly in `100svh` without the zoom or loading sequence.

Edit the loader title, poster title, visible date, and venue in `src/scroll-hero.ts` when changing the homepage content. Update the title and description in `index.html` and search for the old year elsewhere. The homepage reuses the supplied fonts: Helvetica Now Display, Computer Says No, and Architype Fodor. Shared font declarations and the white backgrounds used by the other sections remain in [src/site.css](src/site.css); the poster's `#0b64c6` blue background, cream title with navy extrusion, and type treatment are in the hero stylesheet.

The opening raster image is `public/hero/pixel-laptop.png` (1536 × 1024), generated with the built-in imagegen tool. It uses a dark-blue palette, chunky hands and blinds, a minimal keyboard, and a blank screen for the live overlay. Its full prompt is recorded in [design/pixel-laptop-prompt.md](design/pixel-laptop-prompt.md). The image uses pixelated rendering and a square screen overlay; its CSS geometry is top `15.4%`, left `26.1%`, width `47.8%`, and height `41.2%`.

The previous `public/hero/monitor-desk.png` and [design/monitor-desk-prompt.md](design/monitor-desk-prompt.md) remain as historical scene assets. The poster's pixel skyline is the code-native `public/hero/retro-city.svg`. See [ASSETS.md](ASSETS.md) for reference and generation provenance.

### Preview or restore the previous homepage

Open [/homepage-backup.html](homepage-backup.html) to review the preserved white title-and-trinkets homepage. Its `heroContent` remains in `src/homepage-backup.ts`, and its `.hero*` rules remain in `src/homepage-backup.css`.

To restore only that homepage while retaining the current About, Tracks, Schedule, FAQ, Sponsors, and team components:

1. Copy `heroContent` and the `section.id === 'main'` rendering branch from `src/homepage-backup.ts` into `src/main.ts`.
2. Remove the `mountScrollHero` import, its mount call, and its cleanup call from `src/main.ts`.
3. Restore the `.hero*` styles and their responsive overrides from `src/homepage-backup.css` into `src/site.css`. Keep the current shared styles and component mounts rather than replacing the complete entry or stylesheet with the snapshot.
4. Run `npm run build` and check both homepage routes and the section links.

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
| Sponsors | `src/sponsors-data.ts`, `src/sponsors-grid.ts` | `src/sponsors-grid.css` |
| Team footer and member popup | `src/team-data.ts`, `src/team-footer.ts` | `src/team-footer.css` |
| Top navigation | `src/floating-nav.ts` | `src/floating-nav.css` |
| Pixel cursor | `src/pixel-cursor.ts`, `public/pixel-cursor.svg` | `src/pixel-cursor.css` |
| About ASCII skyline | `src/skyline-art.ts`, `src/ascii-skyline.ts` | `src/info.css` |
| Homepage scroll sequence | `src/scroll-hero.ts`, `src/scroll-hero-state.ts` | `src/scroll-hero.css` |
| Previous white homepage | `src/homepage-backup.ts` | `src/homepage-backup.css` |
| Page layout and supplied fonts | `src/main.ts`, local fonts in `public/fonts/` | `src/site.css` |
| Retro component defaults | Local fonts in `public/fonts/` | `src/retro.css` |

For FAQ updates, edit `faqContent.items`, keeping IDs unique. Answers are plain text; blank lines separate paragraphs.

### Edit the About skyline

[src/skyline-art.ts](src/skyline-art.ts) contains the pure `renderSkylineFrame(frame)` generator. Each frame is an 86-column, 42-row ASCII illustration; the clouds, window lights, and water change between frames while the buildings stay fixed.

[src/ascii-skyline.ts](src/ascii-skyline.ts) mounts the artwork and advances frames every 150 ms only while it is visible, the page is active, and reduced motion is off. Clouds move every 3–4 frames, and building characters change every 2 frames with staggered timing. Reduced motion displays a still frame. This file also defines the artwork's accessible label.

[src/info.css](src/info.css) sizes the blue `#0b64c6` artwork responsively using a Courier New monospace grid. The existing About paragraph remains in `infoContent` in `src/main.ts`. The original `public/pixel-art.png` is preserved but is no longer displayed.

### Edit sponsors and logo sizes

[src/sponsors-data.ts](src/sponsors-data.ts) supplies every logo in the grid. Each entry requires a unique `id`, a `name`, an `image` URL, and a `size` of `'small'`, `'medium'`, or `'large'`; `url` is optional. Size controls the logo dimensions, not a sponsorship tier. Store images under `public/sponsors/` and use `/sponsors/...` URLs.

| Current entry | Image | Size |
| --- | --- | --- |
| TekSafari | `/sponsors/teksafari.png` | `large` |
| CWRU Veale Institute for Entrepreneurship | `/sponsors/placeholder.svg` | `medium` |
| Placeholder 1 | `/sponsors/placeholder.svg` | `small` |

Replace the placeholder image URLs when logo assets are available. Optional website links open in a new tab. If an image cannot load, its sponsor name appears as text.

[src/sponsors-grid.ts](src/sponsors-grid.ts) renders the heading and one logo per entry. [src/sponsors-grid.css](src/sponsors-grid.css) controls the responsive layout and logo footprints. The grid has a transparent background and no borders, letting the shared landscape show around each logo. Both the active page and the homepage backup use this shared sponsor component.

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

[src/main.ts](src/main.ts) creates all six main sections, mounts `mountScrollHero` for `#main` and the About skyline, mounts the other components and team footer, and handles hot-reload cleanup. The footer follows the main element; its dialog is attached to the document body. Both are removed by the footer component’s `destroy()` handler during cleanup. When adding a component, mount it here and call its `destroy()` function in the disposal handler. [src/site.css](src/site.css) defines the shared layout and reserves room for the top navigation.

The previous iMac hero and countdown (`src/hero-imac.ts`, `src/hero-imac.css`) and landscape files (`src/world-background*`) are preserved but are not imported or mounted by the active page. The new homepage's scroll animation is confined to `src/scroll-hero*`; the other sections retain their current backgrounds and behavior. The white title-and-trinkets version is separately preserved in the backup route.

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

The generated site is written to `dist/`; edit source files rather than generated output. `vite.config.ts` builds `index.html`, `tracks.html`, and `homepage-backup.html`. The Tracks HTML preserves the old address by redirecting visitors to `/#tracks`.

Before publishing, check the intro forward and backward, laptop-screen alignment, reduced-motion behavior, both Apply links, the homepage date and venue, and the backup route. Also check all navigation destinations, calendar headings and agenda entries, all three track selections, and team-card popup opening and dismissal. Check a narrow mobile viewport and keyboard navigation, and confirm that longer content remains reachable by scrolling.

The current environment could not provide browser preview because the native computer-use pipe was unavailable. Production builds and pure scroll-state/component checks provide code validation; rendered desktop/mobile appearance and playback through the intro still require browser review.
