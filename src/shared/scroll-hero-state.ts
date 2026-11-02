const clamp = (value: number) => Math.min(1, Math.max(0, value))
const fade = (start: number, end: number, progress: number) => {
  const value = clamp((progress - start) / (end - start))
  return value * value * (3 - 2 * value)
}

export function getIntroProgress(top: number, height: number, viewportHeight: number) {
  const travel = Math.max(1, height - viewportHeight)
  return clamp(-top / travel)
}

export function getIntroState(progress: number, reducedMotion = false) {
  const p = reducedMotion ? 1 : clamp(progress)
  const poster = fade(.7, .86, p)
  return {
    progress: p,
    zoom: fade(.06, .46, p),
    scene: 1 - fade(.48, .54, p),
    sleep: 1 - fade(.02, .14, p),
    loader: fade(.44, .5, p) * (1 - fade(.7, .8, p)),
    loading: clamp((p - .48) / .23),
    poster,
    ready: p >= .86,
    phase: p < .08 ? 'sleep' : p < .48 ? 'zoom' : p < .8 ? 'loading' : 'ready',
  } as const
}

export function getMonitorZoomTarget(viewport: { width: number; height: number }, screen: { left: number; top: number; width: number; height: number }) {
  const originX = screen.left + screen.width / 2
  const originY = screen.top + screen.height / 2
  return {
    originX,
    originY,
    x: viewport.width / 2 - originX,
    y: viewport.height / 2 - originY,
    scale: Math.max(viewport.width / Math.max(1, screen.width), viewport.height / Math.max(1, screen.height)) * 1.06,
  }
}
