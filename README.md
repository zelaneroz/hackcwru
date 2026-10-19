# HackCWRU 2026

An interactive, scrolling landing page inspired by the supplied 3D Windows 95 scene. The first viewport is the floating dialog landscape; Tracks & Prizes follows directly below on the same page. Built with TypeScript, CSS, and Vite, without runtime dependencies.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The static production site is written to `dist/`. `index.html` contains both sections. The old `tracks.html` address redirects to `/#tracks`.

## Scene and interactions

The composition follows the supplied reference: lush green grass, soft white clouds, a beige CRT computer and floppy disks, one floating beveled dialog, and an oversized pixel cursor. All dialog text and controls are live HTML. Local pixel fonts avoid external font requests. Desktop and portrait scene assets preserve the computer at different viewport sizes.

- Register opens a validated interest form. Values stay in local browser storage; there is no registration service or email delivery. If storage is blocked, values stay in memory for the current session.
- Schedule opens an explicitly labeled program preview. Official dates and times have not been supplied.
- Clicking the CRT computer opens a terminal with `help`, `about`, `register`, `schedule`, `hello`, `hack`, and `clear` commands.
- The close button hides the hero; the restore button brings it back.
- Dialogs cover the viewport and support Escape, keyboard focus trapping, background inert state, scroll locking, and focus restoration.
- Reduced motion stops floating, shadow, dialog, and terminal animations. Touch devices use native input without the oversized cursor.

## Tracks & Prizes

Scroll below the hero or use the Tracks & Prizes link in the main dialog to reach `#tracks`. The white section carries over the local pixel fonts, beveled frames, navy title bars, grain, and the same reusable cursor. Back to desktop scrolls up to `#top`; neither action loads another page.

- Three file tabs switch the title, three bullet points, and prize details. Arrow keys, Home, and End work in the file picker.
- The preview can be minimized, expanded, closed, and reopened by selecting a file.
- File, Edit, and View menus offer text downloads, clipboard copying, track navigation, and larger type.
- Files become a horizontal row on mobile; long documents remain scrollable.
- All tracks and awards are clearly marked as sample content. Edit `src/tracks-data.ts` to replace them with confirmed information.

The component can be mounted in another page:

```ts
import { mountTracksPrizes } from './tracks'

const tracks = mountTracksPrizes(document.querySelector<HTMLElement>('#tracks')!)
// Call tracks.destroy() when unmounting.
```

Pass a `HackTrack[]` as the second argument to supply other tracks. Shared typography and retro color tokens live in `src/retro.css`; component styling lives in `src/tracks.css`. Keep `public/text-document.svg` and the local font files available.

## Reuse the cursor

The standalone, transparent SVG is [`public/pixel-cursor.svg`](public/pixel-cursor.svg). It contains the pixel arrow, black outline, bevel, and extrusion.

To reuse the responsive pointer tracking and press effect, copy `public/pixel-cursor.svg`, `src/pixel-cursor.ts`, and `src/pixel-cursor.css` to another Vite/TypeScript page, then initialize after the page content renders:

```ts
import { mountPixelCursor } from './pixel-cursor'

const cursor = mountPixelCursor({ initialTarget: '.register-button' })
// Call cursor.destroy() when unmounting the page.
```

`initialTarget` is optional; without it, the cursor appears when the mouse moves. Set `assetUrl` if the SVG lives at a different URL. The component imports its own styles, keeps the arrow tip aligned with clicks at every size, and restores the native cursor if the image cannot load. Touch devices retain native input.

For a simple native cursor without the tracking or press effect, use the asset directly:

```css
html, body, button, input, a {
  cursor: url('/pixel-cursor.svg') 4 2, auto;
}
```

## Assets

See [ASSETS.md](ASSETS.md) for saved asset paths, the reference-based built-in image generation prompts, font sources, and licenses.

## Validation

`npm run build` checks TypeScript and creates the production bundle. Source review covers viewport fitting, image cropping, cursor positioning, keyboard focus, and local storage behavior. Live visual browser verification is unavailable because Computer Use permission is disabled.
