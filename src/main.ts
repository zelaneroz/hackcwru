import './world-background.css'
import { mountWorldBackground } from './world-background'
import { mountHeroAlert } from './hero-alert'

// One coordinate system, one landscape. Each 1,000 vertical units occupies one
// viewport; none of the artwork is attached to a section boundary.
const sections = [
  { id: 'main', name: 'Hill crest' },
  { id: 'info', name: 'Upper meadow' },
  { id: 'tracks', name: 'Lower meadow' },
  { id: 'schedule', name: 'Sandy shoreline' },
  { id: 'faq', name: 'Shallow water' },
  { id: 'sponsors', name: 'Blue water' },
  { id: 'end-banner', name: 'Sunlit cove' },
] as const

// Seeded decoration stays put through reloads, resizes, and hot updates.
let seed = 2026
function random(min: number, max: number) {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return min + (seed / 4294967296) * (max - min)
}
const n = (value: number) => value.toFixed(1)

function plane(name: string, artwork: string, speed = 0, anchor = 0) {
  return `<div class="world-plane ${name}" data-parallax-speed="${speed}" data-parallax-anchor="${anchor}">
    <svg viewBox="0 0 1600 7000" preserveAspectRatio="none" focusable="false">${artwork}</svg>
  </div>`
}

const hillEdge = 'M-160 780 C130 775 300 487 635 506 C996 523 1150 787 1760 632'
const sandEdge = 'M-160 3490 C90 3290 316 3480 525 3570 C789 3690 1000 3482 1250 3608 C1450 3710 1580 3875 1760 3770'
const waterEdge = 'M-160 3960 C100 3660 300 3820 570 3938 C824 4050 1033 3824 1275 3950 C1510 4075 1600 4260 1760 4130'
const closeShape = 'L1760 7200 H-160 Z'

const grassBlades = Array.from({ length: 88 }, () => {
  const x = random(0, 140), y = random(0, 170)
  const height = random(2, 9), lean = random(-4, 4)
  return `<path d="M${n(x)} ${n(y)}q${n(lean)} -${n(height * .6)} ${n(lean * .75)} -${n(height)}" stroke="${random(0, 1) > .48 ? '#e3ef88' : '#1b520d'}" stroke-width="${n(random(.5, 1.1))}" opacity="${n(random(.12, .35))}"/>`
}).join('')

const meadowDetails = Array.from({ length: 185 }, () => {
  const y = random(1940, 3330), x = random(-20, 1620)
  const scale = random(.45, 1.2) * (y / 2800)
  const flower = random(0, 1) > .58
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})">
    <path d="M0 4Q-4 -9 -8 -13M0 4Q1 -11 6 -18M0 4Q4 -5 11 -6" fill="none" stroke="#306c16" stroke-width="1.4"/>
    ${flower ? `<path d="M0 2q-2 -13 1 -24" fill="none" stroke="#456e20"/><use href="#world-daisy" x="-5" y="-27" width="12" height="12"/>` : '<path d="M-3 1Q-8 -5 -13 -6M1 2Q7 -16 13 -19" fill="none" stroke="#b3d455" stroke-width="1.2"/>'}
  </g>`
}).join('')

const shorelineGrass = Array.from({ length: 110 }, (_, index) => {
  // Sample the very same cubic curves as sandEdge. The roots follow the bank
  // rather than tracing an unrelated wave across the sand and meadow.
  const curves = [
    [[-160, 3490], [90, 3290], [316, 3480], [525, 3570]],
    [[525, 3570], [789, 3690], [1000, 3482], [1250, 3608]],
    [[1250, 3608], [1450, 3710], [1580, 3875], [1760, 3770]],
  ]
  const position = index / 109 * 3
  const segment = Math.min(2, Math.floor(position))
  const t = position - segment, u = 1 - t
  const points = curves[segment]!
  const coordinate = (axis: number) => u ** 3 * points[0]![axis]! +
    3 * u ** 2 * t * points[1]![axis]! + 3 * u * t ** 2 * points[2]![axis]! +
    t ** 3 * points[3]![axis]!
  const x = coordinate(0), y = coordinate(1) - random(0, 8)
  const h = random(7, 23)
  return `<path d="M${n(x)} ${n(y)}q-5 -${n(h * .8)} -${n(random(2, 13))} -${n(h)}q13 ${n(h * .35)} 14 ${n(h * .8)}q2 -${n(h)} 10 -${n(h * 1.1)}q-3 ${n(h)} -5 ${n(h * 1.3)}Z" fill="${index % 3 === 0 ? '#99bc41' : '#649c28'}" opacity=".65"/>`
}).join('')

const waterRipples = Array.from({ length: 138 }, () => {
  const x = random(-120, 1640), y = random(3780, 7160), width = random(20, 180)
  return `<path d="M${n(x)} ${n(y)}q${n(width * .25)} -${n(random(3, 10))} ${n(width * .5)} 0t${n(width * .5)} 0" fill="none" stroke="${random(0, 1) > .3 ? '#c6f9f0' : '#087fb8'}" stroke-width="${n(random(.8, 2.6))}" opacity="${n(random(.12, .42))}"/>`
}).join('')

const pebbles = Array.from({ length: 65 }, () => {
  const x = random(-40, 1640), y = random(6540, 7170), radius = random(2, 13)
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(random(-35, 35))})">
    <ellipse cy="${n(radius * .45)}" rx="${n(radius * 1.2)}" ry="${n(radius * .48)}" fill="#567b64" opacity=".18"/>
    <ellipse rx="${n(radius)}" ry="${n(radius * .62)}" fill="url(#world-pebble)"/>
    <path d="M-${n(radius * .6)} -1q${n(radius * .6)} -${n(radius * .65)} ${n(radius * 1.1)} -1" fill="none" stroke="#e9e4b6" opacity=".55"/>
  </g>`
}).join('')

const definitions = `<svg class="world-definitions" aria-hidden="true" width="0" height="0" focusable="false">
  <defs>
    <linearGradient id="world-sky" x2=".2" y2="1"><stop stop-color="#166dcc"/><stop offset=".42" stop-color="#2e94e6"/><stop offset=".78" stop-color="#85d1f7"/><stop offset="1" stop-color="#c8eaf5"/></linearGradient>
    <radialGradient id="world-sun"><stop stop-color="#fffde0" stop-opacity=".85"/><stop offset=".18" stop-color="#fffee9" stop-opacity=".38"/><stop offset="1" stop-color="#fffbd5" stop-opacity="0"/></radialGradient>
    <linearGradient id="world-cloud" x2=".12" y2="1"><stop offset=".1" stop-color="#fffef6"/><stop offset=".57" stop-color="#fff"/><stop offset=".82" stop-color="#e8f2f5"/><stop offset="1" stop-color="#b8d8ed"/></linearGradient>
    <linearGradient id="world-grass" gradientUnits="userSpaceOnUse" x1="900" y1="500" x2="300" y2="3700"><stop stop-color="#83c52e"/><stop offset=".16" stop-color="#5ea920"/><stop offset=".42" stop-color="#3b8c18"/><stop offset=".75" stop-color="#6eaf2a"/><stop offset="1" stop-color="#a3bd45"/></linearGradient>
    <linearGradient id="world-crest" x1=".5" y1="0" x2=".3" y2="1"><stop stop-color="#a7d648"/><stop offset=".18" stop-color="#65b824"/><stop offset=".64" stop-color="#3d8b18"/><stop offset="1" stop-color="#357c15" stop-opacity="0"/></linearGradient>
    <linearGradient id="world-ridge" x1=".45" y1="0" x2=".6" y2="1"><stop stop-color="#98c94a"/><stop offset=".12" stop-color="#70b52a"/><stop offset=".5" stop-color="#4b961b"/><stop offset="1" stop-color="#3a841b" stop-opacity="0"/></linearGradient>
    <linearGradient id="world-near-ridge" x1=".7" y1="0" x2=".4" y2="1"><stop stop-color="#9bca40"/><stop offset=".19" stop-color="#70b52d"/><stop offset=".7" stop-color="#43891b"/><stop offset="1" stop-color="#57951f" stop-opacity="0"/></linearGradient>
    <radialGradient id="world-meadow-light" cx=".82" cy=".35" r=".75"><stop stop-color="#d6e681" stop-opacity=".38"/><stop offset="1" stop-color="#afdc47" stop-opacity="0"/></radialGradient>
    <linearGradient id="world-sand" x1=".35" y1="0" x2=".6" y2="1"><stop stop-color="#c0b56c"/><stop offset=".11" stop-color="#e6cfa3"/><stop offset=".3" stop-color="#f0dcb0"/><stop offset=".63" stop-color="#d4b475"/><stop offset="1" stop-color="#c2b77c"/></linearGradient>
    <linearGradient id="world-water" gradientUnits="userSpaceOnUse" x1="600" y1="3800" x2="900" y2="7100"><stop stop-color="#92dcd2"/><stop offset=".11" stop-color="#2ccede"/><stop offset=".27" stop-color="#00aede"/><stop offset=".46" stop-color="#0099dd"/><stop offset=".6" stop-color="#078dca"/><stop offset=".76" stop-color="#22c2d4"/><stop offset=".91" stop-color="#90d9cc"/><stop offset="1" stop-color="#d0dbb4"/></linearGradient>
    <radialGradient id="world-water-light" cx=".78" cy=".32" r=".65"><stop stop-color="#bffaff" stop-opacity=".6"/><stop offset=".4" stop-color="#00d2ff" stop-opacity=".22"/><stop offset="1" stop-color="#007cc4" stop-opacity="0"/></radialGradient>
    <linearGradient id="world-reflection" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e7ffff" stop-opacity="0"/><stop offset=".48" stop-color="#e7ffff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="world-bed" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#d3deae" stop-opacity="0"/><stop offset=".46" stop-color="#cdd7a2" stop-opacity=".32"/><stop offset="1" stop-color="#eee0ae" stop-opacity=".9"/></linearGradient>
    <linearGradient id="world-pebble" x1="0" y1="0" x2=".65" y2="1"><stop stop-color="#c5c6a5"/><stop offset=".5" stop-color="#a3ac91"/><stop offset="1" stop-color="#6c917e"/></linearGradient>
    <pattern id="world-grass-texture" width="140" height="170" patternUnits="userSpaceOnUse">${grassBlades}</pattern>
    <pattern id="world-sand-texture" width="77" height="91" patternUnits="userSpaceOnUse"><path d="M4 17h2m35 13h1m22 37h2M13 75h1m40-69h1M28 50h1m-8-8h2m49 41h1" stroke="#8e8757" opacity=".25"/><path d="M8 43h2m40 18h2M23 8h3m43 33h2M19 87h2" stroke="#fff6d7" opacity=".7"/></pattern>
    <pattern id="world-caustic-pattern" width="340" height="290" patternUnits="userSpaceOnUse"><g fill="none" stroke="#b2ffec" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-31 27C17-3 43 17 65 54S114 89 133 58S186 9 217 34S260 64 288 34S341-4 372 28M-22 164C26 130 47 162 78 151S118 112 148 132S179 184 213 161S257 121 288 144S331 181 365 151M-26 270C19 240 51 269 80 252S118 209 151 231S189 274 223 248S269 213 300 238S340 268 367 244" stroke-width="2.2"/>
      <path d="M64 54C31 89 44 119 78 151M133 58C164 82 174 104 148 132M217 34C235 80 203 111 213 161M288 34C315 76 260 107 288 144M78 151C103 183 55 211 80 252M148 132C110 168 128 201 151 231M213 161C245 185 204 219 223 248M288 144C265 174 271 205 300 238" stroke-width="1.5"/>
    </g></pattern>
    <pattern id="world-small-ripples" width="280" height="115" patternUnits="userSpaceOnUse"><g fill="none" stroke="#d9ffff" stroke-width="1.2" opacity=".45"><path d="M-10 27q28-5 50 0t49 0m32 29q19-4 40 0t37 0m25-38q18-3 34 0t35 0M24 96q24-5 51 0t46 0m55-7q32-6 62 0t53 0"/></g></pattern>
    <linearGradient id="world-grass-fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff"/><stop offset=".88" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="world-bed-fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".2" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="world-grass-mask" maskUnits="userSpaceOnUse" x="-160" y="2680" width="1920" height="1020"><path d="M-160 2680H1760V3700H-160Z" fill="url(#world-grass-fade)"/></mask>
    <mask id="world-bed-mask" maskUnits="userSpaceOnUse" x="-160" y="6390" width="1920" height="860"><path d="M-160 6390H1760V7250H-160Z" fill="url(#world-bed-fade)"/></mask>
    <clipPath id="world-meadow-clip"><path d="${hillEdge}${closeShape}"/></clipPath>
    <clipPath id="world-lake-clip"><path d="${waterEdge}${closeShape}"/></clipPath>
    <clipPath id="world-sand-clip"><path d="${sandEdge}${closeShape}"/></clipPath>
    <symbol id="world-cloud-shape" viewBox="0 0 420 150">
      <path d="M27 119C4 116 3 92 27 80C17 50 60 29 87 45C92 13 144-1 174 29C194 0 248 7 262 40C300 19 346 40 346 69C389 61 415 82 409 104C401 136 51 141 27 119Z" fill="url(#world-cloud)"/>
      <path d="M35 101C27 87 39 68 61 70C48 43 95 35 114 52C112 23 153 17 175 44C192 19 236 27 241 53C278 37 308 53 307 76C333 63 364 77 366 91" fill="#fff" opacity=".38"/>
      <path d="M36 119C133 133 281 136 390 111" fill="none" stroke="#effaff" stroke-width="5" opacity=".6"/>
    </symbol>
    <symbol id="world-daisy" viewBox="0 0 12 12"><g fill="#fffce3"><ellipse cx="6" cy="3" rx="1.8" ry="2.7"/><ellipse cx="6" cy="9" rx="1.8" ry="2.7"/><ellipse cx="3" cy="6" rx="2.7" ry="1.8"/><ellipse cx="9" cy="6" rx="2.7" ry="1.8"/></g><circle cx="6" cy="6" r="1.8" fill="#e7be30"/></symbol>
  </defs>
</svg>`

const sky = plane('far-sky', `
  <path d="M-160-350H1760V1580H-160Z" fill="url(#world-sky)"/>
  <ellipse cx="1370" cy="125" rx="700" ry="640" fill="url(#world-sun)"/>
`, .12)

const clouds = plane('clouds', `
  <g class="cloud-drift cloud-drift--far" opacity=".88">
    <use href="#world-cloud-shape" x="665" y="135" width="320" height="115"/>
    <use href="#world-cloud-shape" x="1320" y="310" width="180" height="68"/>
    <use href="#world-cloud-shape" x="-95" y="390" width="260" height="92"/>
  </g>
  <g class="cloud-drift">
    <use href="#world-cloud-shape" x="100" y="170" width="460" height="164"/>
    <use href="#world-cloud-shape" x="1120" y="58" width="600" height="210"/>
    <use href="#world-cloud-shape" x="910" y="445" width="240" height="86" opacity=".8"/>
  </g>
`, .2)

const hills = plane('mid-hills', `
  <path d="M-160 760C200 490 380 840 750 680S1430 440 1760 650V1500H-160Z" fill="#6ca92b"/>
  <path d="${hillEdge}${closeShape}" fill="url(#world-grass)"/>
  <path d="${hillEdge}L1760 1450C1220 1190 940 1460 530 1220S40 1390-160 1310Z" fill="url(#world-crest)"/>
  <path d="M-160 1470C230 1130 555 1250 867 1470S1440 1610 1760 1390V2110H-160Z" fill="url(#world-ridge)"/>
  <path d="M-160 2040C220 2280 527 1830 920 1850S1450 2160 1760 1970V2740H-160Z" fill="url(#world-ridge)" opacity=".85"/>
  <g clip-path="url(#world-meadow-clip)">
    <path d="M-160 480H1760V3800H-160Z" fill="url(#world-grass-texture)" opacity=".55"/>
    <ellipse cx="1170" cy="1930" rx="1300" ry="1700" fill="url(#world-meadow-light)"/>
    <path d="M1520 1160C730 1570 1620 1940 900 2320S620 2880 300 3240" fill="none" stroke="#ccdc6e" stroke-width="48" opacity=".065"/>
  </g>
`, .025, .5)

const foreground = plane('near-grass-slope', `
  <path d="M-160 2610C220 2230 480 2450 810 2500S1430 2260 1760 2460V3520H-160Z" fill="url(#world-near-ridge)"/>
  <path d="M-160 3150C160 3260 330 2860 700 2900S1230 3230 1760 2950V3860H-160Z" fill="url(#world-ridge)" opacity=".9"/>
  <path d="M-160 2680H1760V3700H-160Z" fill="url(#world-grass-texture)" opacity=".46" mask="url(#world-grass-mask)"/>
  ${meadowDetails}
`, .065, 2.5)

// The bank, wet sand, foam and water share a plane, so parallax never pulls
// the waterline apart. Only their details float on independent depth planes.
const shoreline = plane('shoreline-sand', `
  <path d="${sandEdge}${closeShape}" fill="url(#world-sand)"/>
  <path d="${sandEdge}" fill="none" stroke="#91ad3e" stroke-width="26" opacity=".52"/>
  <g clip-path="url(#world-sand-clip)">
    <path d="M-160 3250H1760V7200H-160Z" fill="url(#world-sand-texture)"/>
    <path d="${waterEdge}" transform="translate(0 -31)" fill="none" stroke="#a5bba0" stroke-width="52" opacity=".45"/>
    <path d="${waterEdge}" transform="translate(0 -64)" fill="none" stroke="#fff3ce" stroke-width="3" opacity=".5"/>
  </g>
  ${shorelineGrass}
  <g class="lake-surface">
    <path d="${waterEdge}${closeShape}" fill="url(#world-water)"/>
    <g clip-path="url(#world-lake-clip)">
      <path d="M-160 3750H1760V7200H-160Z" fill="url(#world-water-light)"/>
      <path d="M1140 3820C350 4220 1540 4480 870 4780S1200 5150 770 5490S1120 5890 800 6470" fill="none" stroke="url(#world-reflection)" stroke-width="390"/>
      <path d="M-160 3800H1760V7200H-160Z" fill="url(#world-small-ripples)" opacity=".65"/>
      ${waterRipples}
    </g>
    <path class="shore-foam" d="${waterEdge}" fill="none" stroke="#e8fff1" stroke-width="9" opacity=".7"/>
    <path d="${waterEdge}" transform="translate(0 14)" fill="none" stroke="#e8fff1" stroke-width="2" opacity=".55"/>
    <path d="${waterEdge}" transform="translate(0 38)" fill="none" stroke="#d0f7e7" stroke-width="3" opacity=".3"/>
  </g>
`, .018, 3.6)

const lakebed = plane('sunlit-lakebed', `
  <path d="M-160 6030C220 6290 450 6140 810 6250S1400 6300 1760 6080V7250H-160Z" fill="url(#world-bed)"/>
  <path d="M-160 6390H1760V7250H-160Z" fill="url(#world-sand-texture)" opacity=".35" mask="url(#world-bed-mask)"/>
  ${pebbles}
  <path d="M-80 6950q160-46 330-10t350 0t390-10t390 0t350 10" fill="none" stroke="#f6f9d7" stroke-width="3" opacity=".35"/>
`, -.025, 6)

const caustics = plane('water-caustics', `
  <g clip-path="url(#world-lake-clip)">
    <g class="caustic-drift"><path d="M-300 3630H1900V7450H-300Z" fill="url(#world-caustic-pattern)" opacity=".24"/></g>
    <g class="caustic-drift caustic-drift--echo"><path d="M-300 3630H1900V7450H-300Z" fill="url(#world-caustic-pattern)" opacity=".1"/></g>
  </g>
`, .018, 3.6)

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  ${definitions}
  <main class="world-scroll-container" aria-label="A continuous journey from hill crest to sunlit lake">
    <div class="world-art" aria-hidden="true">${sky}${clouds}${hills}${foreground}${shoreline}${lakebed}${caustics}</div>
    ${sections.map((section, index) => `
      <section id="${section.id}" class="world-section" data-world-section aria-label="${section.name}" tabindex="-1">
        <h1 class="section-marker">
          <svg class="marker-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill="#a8d8fa" d="M1 1h14v14H1z"/><path fill="#fffbd5" d="M10 3h3v3h-3z"/><path fill="#5eaa22" d="m1 11 5-5 4 4 2-2 3 4v3H1z"/><path fill="#387b17" d="m1 13 5-4 6 6H1z"/></svg>
          <span>[ SECTION: ${section.id.toUpperCase()} ]</span>
          <span class="marker-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        </h1>
      </section>`).join('')}
  </main>
  <div class="world-grain" aria-hidden="true"></div>
  <div class="world-crt" aria-hidden="true"></div>
`

const world = mountWorldBackground(app.querySelector<HTMLElement>('.world-scroll-container')!)
const hero = mountHeroAlert(app.querySelector<HTMLElement>('#main')!, {
  registrationUrl: 'https://tally.so/r/WJJjpe',
})
if (import.meta.hot) import.meta.hot.dispose(() => {
  hero.destroy()
  world.destroy()
})
