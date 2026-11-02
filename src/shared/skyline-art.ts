export const SKYLINE_COLUMNS = 86
export const SKYLINE_ROWS = 42

type WindowCell = { x: number; y: number; seed: number }

/** Fixed-width skyline; only the sky, window lights, and river change between frames. */
export function renderSkylineFrame(frame: number): string {
  const tick = Number.isFinite(frame) ? Math.max(0, Math.floor(frame)) : 0
  const grid = Array.from({ length: SKYLINE_ROWS }, () => Array<string>(SKYLINE_COLUMNS).fill(' '))
  const windows: WindowCell[] = []

  const put = (x: number, y: number, character: string) => {
    if (x >= 0 && x < SKYLINE_COLUMNS && y >= 0 && y < SKYLINE_ROWS) grid[y]![x] = character
  }
  const write = (x: number, y: number, text: string) => {
    for (let i = 0; i < text.length; i++) put(x + i, y, text[i]!)
  }
  const horizontal = (x1: number, x2: number, y: number, character = '_') => {
    for (let x = x1; x <= x2; x++) put(x, y, character)
  }
  const vertical = (x: number, y1: number, y2: number, character = '|') => {
    for (let y = y1; y <= y2; y++) put(x, y, character)
  }
  const facade = (left: number, right: number, top: number, bottom: number, spacing = 3) => {
    vertical(left, top, bottom)
    vertical(right, top, bottom)
    horizontal(left + 1, right - 1, top)
    for (let x = left + spacing; x < right; x += spacing) vertical(x, top + 1, bottom)
    for (let y = top + 2; y < bottom; y += 2) {
      for (let x = left + 1; x < right; x++) {
        if (grid[y]![x] !== '|') windows.push({ x, y, seed: x * 17 + y * 29 })
      }
    }
  }

  // Low waterfront blocks and a peaked roof to the west.
  facade(3, 12, 24, 33)
  write(3, 23, '__________')
  write(18, 15, '/\\')
  write(17, 16, '/  \\')
  write(16, 17, '/ /\\ \\')
  write(15, 18, '/_/__\\_\\')
  facade(15, 23, 19, 33, 4)
  vertical(19, 20, 33)

  // The broad faceted crown and close-set lattice of 200 Public Square.
  write(29, 14, '______')
  write(27, 15, ' /_|_|_|\\')
  write(26, 16, ' /_|_|_|_|\\')
  write(25, 17, ' /_|_|_|_|_|\\')
  facade(25, 38, 18, 33)
  for (let y = 20; y <= 32; y += 4) horizontal(26, 37, y, '-')

  // Terminal Tower: a narrow shaft and a sequence of Gothic setbacks.
  put(45, 9, '|')
  write(44, 10, '_+_')
  write(43, 11, '/ | \\')
  write(43, 12, '| + |')
  write(42, 13, '/_|_|_\\')
  write(42, 14, '|  |  |')
  write(41, 15, '/__|_|__\\')
  facade(41, 49, 16, 33, 4)
  vertical(45, 17, 33)
  write(43, 18, '|+|+|')

  // Key Tower: the tallest antenna, stepped crown, and strong vertical ribs.
  put(59, 7, '|')
  put(59, 8, '|')
  write(58, 9, '_+_')
  write(57, 10, '/ | \\')
  write(57, 11, '| | |')
  write(56, 12, '/_|_|_\\')
  write(56, 13, '| | | |')
  write(54, 14, '__|_|_|_|__')
  facade(53, 65, 15, 33)
  vertical(59, 16, 33, '#')

  // The lower roofline and a small clock tower complete the east bank.
  write(70, 23, '_____')
  write(68, 24, '/_______\\')
  facade(67, 77, 25, 33, 5)
  put(82, 21, '|')
  write(81, 22, '/\\')
  write(80, 23, '/__\\')
  write(80, 24, '|++|')
  write(80, 25, '|[]|')
  write(79, 26, '_|__|_')
  facade(79, 85, 27, 33, 3)

  // Sparse, asynchronous lights make the facades flicker without moving.
  for (const cell of windows) {
    if (grid[cell.y]![cell.x] !== ' ') continue
    const lightPhase = Math.floor((tick + cell.seed % 3) / 2)
    const lit = (cell.seed + lightPhase * 7) % 19
    put(cell.x, cell.y, lit < 3 ? '#' : lit < 11 ? ':' : '.')
  }

  horizontal(0, 85, 34, '-')
  // A low arched bridge sits in front of the western buildings.
  write(0, 31, '_______________________')
  write(0, 32, '=======================')
  write(0, 33, '|  /---\\  |  /---\\  |')
  write(0, 34, '|_/     \\_|_/     \\_|')
  write(0, 35, '|         |         |')

  const cloud = (initialX: number, top: number, speed: number) => {
    const x = (initialX + Math.floor(tick / speed)) % (SKYLINE_COLUMNS + 18) - 9
    write(x + 3, top, '.--.')
    write(x, top + 1, '._(    )_.')
    write(x + 1, top + 2, '--------')
  }
  cloud(16, 1, 3)
  cloud(67, 3, 4)

  const waterPhase = Math.floor(tick / 3)
  for (let y = 37; y <= 40; y++) {
    for (let x = 1; x < SKYLINE_COLUMNS - 1; x++) {
      const position = (x + waterPhase + y * 11) % 29
      if (position < 4) put(x, y, '~')
      else if (position === 10 || position === 11) put(x, y, '-')
      else if (position === 19) put(x, y, '.')
    }
  }

  return grid.map(row => row.join('')).join('\n')
}
