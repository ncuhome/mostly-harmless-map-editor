import kaboom, { GameObj, Rect, Vec2 } from 'kaboom'
import { makeLevelLeft, makeLevelRight } from './levels'
import { loadSprites } from './loader'

const k = kaboom({
  scale: 4,
  background: [0, 0, 0],
})

loadSprites()

const levelLeft = makeLevelLeft(5, 5)

const levelRight = makeLevelRight(5, 5)

const playerLeft = add([
  sprite("playerLeftDown"),
  pos(levelLeft.pos.x + 16, levelLeft.pos.y + 16),
  area({ height: 16, width: 16 }),
  solid(),
  k.origin('center'),
  {
    moving: false,
    baseX: levelLeft.pos.x + 16,
    baseY: levelLeft.pos.y + 16,
  },
])

playerLeft.play('idle')

const playerRight = add([
  sprite("player2"),
  pos(levelRight.pos.x + 16, levelRight.pos.y + 16),
  area({ height: 16, width: 16 }),
  solid(),
  k.origin('center'),
  {
    moving: false,
    baseX: levelRight.pos.x + 16,
    baseY: levelRight.pos.y + 16,
  },
])

const checkMove = (p: typeof playerLeft, pt: Vec2) => {
  if (p.moving) return false
  const OFFSET = 16

  const left = p === playerLeft
  const level = left ? levelLeft : levelRight
  const levelPos = left ? levelLeft.pos : levelRight.pos
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
  if (!checkMove(p, vec2(p.pos.x + dir.x * 6, p.pos.y + dir.y * 6))) {
    return
  }
  p.move(dir.x * 60, dir.y * 60)
}

// const playAnim = (p: typeof playerLeft, dir: Vec2) => {
//   const isX = dir.x > 0 || dir.x < 0
//   if (isX) {
//   }
// }

onKeyDown(['w', 'up'], () => {
  animateTo(playerLeft, vec2(0, -1))
  animateTo(playerRight, vec2(0, -1))
})

onKeyDown(['s', 'down'], () => {
  const down = vec2(0, 1)
  animateTo(playerLeft, down)
  animateTo(playerRight, down)
})

onKeyDown(['a', 'left'], () => {
  animateTo(playerLeft, vec2(-1, 0))
  animateTo(playerRight, vec2(-1, 0))
})

onKeyDown(['d', 'right'], () => {
  animateTo(playerLeft, vec2(1, 0))
  animateTo(playerRight, vec2(1, 0))
})

// onKeyRelease(['w', 'up', 's', 'down', 'a', 'left', 'd', 'right'], () => {
//   playerLeft.play('idle')
// })


for (let y = 0; y < levelLeft.size.h; y++) {
  for (let x = 0; x < levelLeft.size.w; x++) {
    add([
      circle(1),
      color(),
      pos(vec2(playerLeft.baseX + x * 16, playerLeft.baseY + y * 16)),
      opacity(0.5),
      area({ width: 12, height: 12 }),
      'dot',
    ])
  }
}

for (let y = 0; y < levelRight.size.h; y++) {
  for (let x = 0; x < levelRight.size.w; x++) {
    add([
      circle(1),
      color(),
      pos(vec2(playerRight.baseX + x * 16, playerRight.baseY + y * 16)),
      opacity(0.5),
      area({ width: 12, height: 12 }),
      'dot',
    ])
  }
}


add([
  sprite('yellowDoor'),
  pos(width() / 2 + 12, height() - 16),
  k.origin('center'),
  area({ height: 16, width: 16 }),
  {
    name: 'yellowDoor',
  },
  'tool'
])


add([
  sprite('redDoor'),
  pos(width() / 2 - 12, height() - 16),
  k.origin('center'),
  area(),
  {
    name: 'redDoor',
  },
  'tool'
])

add([
  sprite('box'),
  pos(width() / 2 - 32, height() - 16),
  k.origin('center'),
  area(),
  {
    name: 'box',
  },
  'tool'
])


onHover('dot', (dot) => {
  if (holdingObj) {
    dot.opacity = 1.0
  }
})

onHover('tool', (tool) => {
  k.cursor('pointer')
  tool.scale = 1
})


let holdingObj: GameObj<any> | undefined = undefined

onMousePress((pos) => {
  let replaced = false
  k.every('tile', (tile) => {
    if (pos.dist(tile.pos) < 8) {
      replaced = true
      add([
        circle(1),
        color(),
        k.pos(tile.pos),
        opacity(0.5),
        area({ width: 12, height: 12 }),
        'dot',
      ])
      tile.destroy()
      holdingObj = add([
        sprite(tile.name),
        k.pos(vec2(pos.x + 8, pos.y + 8)),
        {
          name: tile.name,
        }
      ])
      k.cursor('default')
    }
  })
  k.every('dot', (dot) => {
    if (replaced) return
    if (pos.dist(dot.pos) < 8) {
      if (holdingObj) {
        add([
          sprite(holdingObj.name),
          area({
            width: 16 * 0.8,
            height: 16 * 0.8
          }),
          solid(),
          k.pos(dot.pos),
          k.origin('center'),
          {
            name: holdingObj.name,
          },
          'tile'
        ])
        dot.destroy()
        holdingObj.destroy()
        holdingObj = undefined
        k.cursor('default')
      }
    }
  })
  k.every('tool', (tool) => {
    if (pos.dist(tool.pos) < 8) {
      if (holdingObj) {
        holdingObj.destroy()
      }
      holdingObj = add([
        sprite(tool.name),
        k.pos(vec2(pos.x + 8, pos.y + 8)),
        {
          name: tool.name,
        }
      ])
    }
  })
})

onMouseMove((pos) => {
  if (holdingObj) {
    holdingObj.pos = vec2(pos.x, pos.y)
  }
})

onUpdate(() => {
  every('tool', (tool) => {
    tool.scale = 0.9
  })

  every('dot', dot => {
    dot.opacity = 0.5
  })

  k.cursor('default')
})
