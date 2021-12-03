import kaboom, { Rect, Vec2 } from 'kaboom'
import { animate } from 'popmotion'
import { makeLevelLeft, makeLevelRight } from './levels'
import { loadSprites } from './loader'

const k = kaboom({
  scale: 4,
  background: [0, 0, 0],
})

loadSprites()

const LEFT_MOVE_COUNT = 5
const LEFT_LEVEL_HEIGHT = 16 * (LEFT_MOVE_COUNT + 2)
const LEFT_LEVEL_HEIGHT_HALF = LEFT_LEVEL_HEIGHT / 2
const LEFT_CENTER_X = width() / 2 - LEFT_LEVEL_HEIGHT_HALF
const POS_LEFT = vec2(LEFT_CENTER_X - LEFT_LEVEL_HEIGHT_HALF - 20, height() / 2 - LEFT_LEVEL_HEIGHT_HALF)

const RIGHT_MOVE_COUNT = 3
const RIGHT_LEVEL_HEIGHT = 16 * (RIGHT_MOVE_COUNT + 2)
const RIGHT_LEVEL_HEIGHT_HALF = RIGHT_LEVEL_HEIGHT / 2
const RIGHT_CENTER_X = width() / 2 - RIGHT_LEVEL_HEIGHT_HALF
const POS_RIGHT = vec2(RIGHT_CENTER_X + RIGHT_LEVEL_HEIGHT_HALF + 20, height() / 2 - RIGHT_LEVEL_HEIGHT_HALF)


const levelLeft = makeLevelLeft(POS_LEFT)

const levelRight = makeLevelRight(POS_RIGHT)

const playerLeft = add([
  sprite("player"),
  pos(POS_LEFT.x + 16, POS_LEFT.y + 16),
  area({ height: 16, width: 16 }),
  k.origin('center'),
  {
    moving: false
  },
])

const playerRight = add([
  sprite("player2"),
  pos(POS_RIGHT.x + 16, POS_RIGHT.y + 16),
  area({ height: 16, width: 16 }),
  k.origin('center'),
  {
    moving: false
  },
])

const checkMove = (p: typeof playerLeft, pt: Vec2) => {
  if (p.moving) return false
  const OFFSET = 16

  const left = p === playerLeft
  const level = left ? levelLeft : levelRight
  const levelPos = left ? POS_LEFT : POS_RIGHT
  const a = area({
    width: level.width() - OFFSET,
    height: level.height() - OFFSET,
    offset: vec2(levelPos.x + OFFSET / 2, levelPos.y + OFFSET / 2)
  })
  if (import.meta.env.DEV) {
    const { width = 0, height = 0, offset } = a.area
      drawRect({
        width,
        height,
        fill: false,
        outline: k.outline(1, k.color().color).outline,
        pos: offset
      })
  }
  return testRectPoint(a.worldArea() as Rect, pt)
}

const animateTo = (p: typeof playerLeft, dir: Vec2) => {
  // const isX = dir.x > 0 || dir.x < 0
  // const from = isX ? p.pos.x : p.pos.y
  // const to = from + (isX ? dir.x : dir.y) * 16
  if (!checkMove(p, vec2(p.pos.x + dir.x * 6, p.pos.y + dir.y * 6))) return
  p.move(dir.x * 60, dir.y * 60)
  // animate({
  //   from,
  //   to,
  //   onUpdate: (v) => {
  //     if (isX) {
  //       p.pos.x = v
  //     } else {
  //       p.pos.y = v
  //     }
  //   },
  //   onPlay: () => {
  //     p.moving = true
  //   },
  //   onComplete: () => {
  //     p.moving = false
  //   }
  // })
}

onKeyDown('w', () => {
  animateTo(playerLeft, vec2(0, -1))
  animateTo(playerRight, vec2(0, -1))
})

onKeyDown('s', () => {
  animateTo(playerLeft, vec2(0, 1))
  animateTo(playerRight, vec2(0, 1))
})

onKeyDown('a', () => {
  animateTo(playerLeft, vec2(-1, 0))
  animateTo(playerRight, vec2(-1, 0))
})

onKeyDown('d', () => {
  animateTo(playerLeft, vec2(1, 0))
  animateTo(playerRight, vec2(1, 0))
})