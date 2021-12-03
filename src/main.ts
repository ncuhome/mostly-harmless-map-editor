import kaboom, { GameObj, Rect, Vec2 } from 'kaboom'
import { animate } from 'popmotion'
import { makeLevelLeft, makeLevelRight } from './levels'
import { loadSprites } from './loader'

const k = kaboom({
  scale: 4,
  background: [0, 0, 0],
})

loadSprites()

const CELL_SIZE = 16
const CELL_SIZE_HALF = CELL_SIZE / 2

const levelLeft = makeLevelLeft(5, 5)

const levelRight = makeLevelRight(5, 5)

const playerLeft = add([
  sprite("playerLeftDown"),
  pos(levelLeft.pos.x + CELL_SIZE, levelLeft.pos.y + CELL_SIZE),
  area({ height: CELL_SIZE, width: CELL_SIZE }),
  solid(),
  k.origin('center'),
  {
    moving: false,
    baseX: levelLeft.pos.x + CELL_SIZE,
    baseY: levelLeft.pos.y + CELL_SIZE,
  },
])

const playerRight = add([
  sprite("player2"),
  pos(levelRight.pos.x + CELL_SIZE, levelRight.pos.y + CELL_SIZE),
  area({ height: CELL_SIZE, width: CELL_SIZE }),
  solid(),
  k.origin('center'),
  {
    moving: false,
    baseX: levelRight.pos.x + CELL_SIZE,
    baseY: levelRight.pos.y + CELL_SIZE,
  },
])

const checkMove = (p: typeof playerLeft, pt: Vec2) => {
  if (p.moving) return false
  const OFFSET = CELL_SIZE

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

const moveTo = (p: typeof playerLeft, dir: Vec2) => {
  if (!checkMove(p, vec2(p.pos.x + dir.x * 6, p.pos.y + dir.y * 6))) {
    return
  }
  cancelers.forEach(c => c.stop())
  p.move(dir.x * 60, dir.y * 60)
}

onKeyDown(['w', 'up'], () => {
  moveTo(playerLeft, vec2(0, -1))
  moveTo(playerRight, vec2(0, -1))
})

onKeyDown(['s', 'down'], () => {
  const down = vec2(0, 1)
  moveTo(playerLeft, down)
  moveTo(playerRight, down)
})

onKeyDown(['a', 'left'], () => {
  moveTo(playerLeft, vec2(-1, 0))
  moveTo(playerRight, vec2(-1, 0))
})

onKeyDown(['d', 'right'], () => {
  moveTo(playerLeft, vec2(1, 0))
  moveTo(playerRight, vec2(1, 0))
})

const cancelers: ({
  stop: () => void
})[] = []

const animateToPos = (from: Vec2, to: Vec2) => {
  cancelers.push(
    animate({
      from: from.x,
      to: to.x,
      onUpdate: x => {
        from.x = x
      }
    }),
    animate({
      from: from.y,
      to: to.y,
      onUpdate: y => {
        from.y = y
      }
    })
  )
}



onKeyRelease(['w', 'up', 's', 'down', 'a', 'left', 'd', 'right'], () => {
  k.every('dot', dot => {
    if (dot.pos.dist(playerLeft.pos) < CELL_SIZE * 0.8) {
      animateToPos(playerLeft.pos, dot.pos.clone())
    }
    if (dot.pos.dist(playerRight.pos) < CELL_SIZE * 0.8) {
      animateToPos(playerRight.pos, dot.pos.clone())
    }
  })
})

const DOT_SIZE = 4

for (let y = 0; y < levelLeft.size.h; y++) {
  for (let x = 0; x < levelLeft.size.w; x++) {
    add([
      circle(1),
      color(),
      pos(vec2(playerLeft.baseX + x * CELL_SIZE, playerLeft.baseY + y * CELL_SIZE)),
      opacity(0.5),
      area({ width: DOT_SIZE, height: DOT_SIZE }),
      k.origin('center'),
      'dot',
    ])
  }
}

for (let y = 0; y < levelRight.size.h; y++) {
  for (let x = 0; x < levelRight.size.w; x++) {
    add([
      circle(1),
      color(),
      pos(vec2(playerRight.baseX + x * CELL_SIZE, playerRight.baseY + y * CELL_SIZE)),
      opacity(0.5),
      area({ width: DOT_SIZE, height: DOT_SIZE }),
      k.origin('center'),
      'dot',
    ])
  }
}

const TOOLS = ['yellowDoor', 'redDoor', 'box']

const addTools = (tools: string[]) => {
  const cLen = tools.length / 2 | 0
  tools.forEach((tool, i) => {
    add([
      sprite(tool),
      pos(width() / 2 - (cLen - i) * 24, height() - CELL_SIZE),
      k.origin('center'),
      area({ height: CELL_SIZE, width: CELL_SIZE }),
      {
        name: tool,
      },
      'tool'
    ])
  })
}

addTools(TOOLS)

onHover('dot', (dot) => {
  if (holdingObj) {
    animate({
      from: dot.opacity,
      to: 1.0,
      onUpdate: v => {
        dot.opacity = v
      },
    })
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
    if (pos.dist(tile.pos) < CELL_SIZE_HALF) {
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
        k.pos(vec2(pos.x + CELL_SIZE_HALF, pos.y + CELL_SIZE_HALF)),
        {
          name: tile.name,
        }
      ])
      k.cursor('default')
    }
  })
  k.every('dot', (dot) => {
    if (replaced) return
    if (pos.dist(dot.pos) < CELL_SIZE_HALF) {
      if (holdingObj) {
        add([
          sprite(holdingObj.name),
          area({
            width: CELL_SIZE * 0.8,
            height: CELL_SIZE * 0.8
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
    if (pos.dist(tool.pos) < CELL_SIZE_HALF) {
      if (holdingObj) {
        holdingObj.destroy()
      }
      holdingObj = add([
        sprite(tool.name),
        k.pos(vec2(pos.x + CELL_SIZE_HALF, pos.y + CELL_SIZE_HALF)),
        opacity(0),
        area(),
        scale(0),
        {
          name: tool.name,
        }
      ])
      animate({
        from: 0,
        to: 1,
        duration: 300,
        onUpdate: v => {
          holdingObj!.opacity = v
          holdingObj!.scale = v
        }
      })
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

  if (holdingObj) {

  }
})
