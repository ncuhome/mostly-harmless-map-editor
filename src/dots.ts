import type { Level } from './levels'
import { CELL_SIZE, DOT_SIZE } from './utils'

export const addDots = (levelLeft: Level, levelRight: Level) => {
  const dots = []
  const leftBase = {
    x: levelLeft.pos.x + CELL_SIZE,
    y: levelLeft.pos.y + CELL_SIZE
  }
  const rightBase = {
    x: levelRight.pos.x + CELL_SIZE,
    y: levelRight.pos.y + CELL_SIZE
  }

  for (let y = 0; y < levelLeft.size.h; y++) {
    for (let x = 0; x < levelLeft.size.w; x++) {
      dots.push(add([
        circle(1),
        color(),
        pos(vec2(leftBase.x + x * CELL_SIZE, leftBase.y + y * CELL_SIZE)),
        opacity(0.5),
        area({ width: DOT_SIZE, height: DOT_SIZE }),
        // @ts-ignore
        origin('center'),
        'dot'
      ]))
    }
  }
  for (let y = 0; y < levelRight.size.h; y++) {
    for (let x = 0; x < levelRight.size.w; x++) {
      dots.push(add([
        circle(1),
        color(),
        pos(vec2(rightBase.x + x * CELL_SIZE, rightBase.y + y * CELL_SIZE)),
        opacity(0.5),
        area({ width: DOT_SIZE, height: DOT_SIZE }),
        // @ts-ignore
        origin('center'),
        'dot'
      ]))
    }
  }
  return dots
}
