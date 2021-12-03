import kaboom, { GameObj, Rect, Vec2 } from 'kaboom'
import GUI from 'lil-gui'
import { animate } from 'popmotion'

import { addDots } from './dots'
import { makeLevelLeft, makeLevelRight } from './levels'
import { loadSprites } from './loader'
import { CELL_SIZE, CELL_SIZE_HALF, makeNoise } from './utils'

const k = kaboom({
  scale: 4,
  background: [0, 0, 0],
  stretch: true
})

loadSound('bgm', '/loop.wav')

layers([
  'bg',
  'game'
], 'game')

loadSprites()

add([
  shader('glitch')
])

const gui = new GUI({
  title: '设置'
})

const settings = {
  levelLeftSizeWidth: 5,
  levelLeftSizeHeight: 5,

  levelRightSizeWidth: 5,
  levelRightSizeHeight: 5
}

let levelLeft = makeLevelLeft(settings.levelLeftSizeWidth, settings.levelLeftSizeHeight)

let levelRight = makeLevelRight(settings.levelRightSizeHeight, settings.levelRightSizeWidth)

const leftGui = gui.addFolder('左边')

const cleanUp = () => {
  levelLeft.destroy()
  dots.forEach(d => d.destroy())
  every('block', block => block.destroy())
}

leftGui.add(settings, 'levelLeftSizeWidth', 2, 8, 1)
  .name('宽')
  .onChange((v: number) => {
    cleanUp()
    levelLeft = makeLevelLeft(v, settings.levelLeftSizeHeight)
    dots = addDots(levelLeft, levelRight)
  })

leftGui.add(settings, 'levelLeftSizeHeight', 2, 8, 1)
  .name('长')
  .onChange((v: number) => {
    cleanUp()
    levelLeft = makeLevelLeft(settings.levelLeftSizeWidth, v)
    dots = addDots(levelLeft, levelRight)
  })

const rightGui = gui.addFolder('右边')

rightGui.add(settings, 'levelRightSizeWidth', 2, 8, 1)
  .name('宽')
  .onChange((v: number) => {
    cleanUp()
    levelRight = makeLevelRight(v, settings.levelRightSizeHeight)
    dots = addDots(levelLeft, levelRight)
  })

rightGui.add(settings, 'levelRightSizeHeight', 2, 8, 1)
  .name('长')
  .onChange((v: number) => {
    cleanUp()
    levelRight = makeLevelRight(settings.levelRightSizeWidth, v)
    dots = addDots(levelLeft, levelRight)
  })

const playerLeft = add([
  sprite('playerLeftDown'),
  pos(levelLeft.pos.x + CELL_SIZE, levelLeft.pos.y + CELL_SIZE),
  area({ height: CELL_SIZE, width: CELL_SIZE }),
  solid(),
  k.origin('center'),
  'player',
  {
    moving: false
  }
])

const playerRight = add([
  sprite('player2'),
  pos(levelRight.pos.x + CELL_SIZE, levelRight.pos.y + CELL_SIZE),
  area({ height: CELL_SIZE, width: CELL_SIZE }),
  solid(),
  k.origin('center'),
  'player',
  {
    moving: false
  }
])

let dots = addDots(levelLeft, levelRight)

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
        name: tool
      },
      'tool'
    ])
  })
}

addTools(TOOLS)

onHover('dot', (dot) => {
  if (holdingObj) {
    dot.opacity = 1
  }
})

onHover('tool', (tool) => {
  k.cursor('grab')
  tool.scale = 1
})

onHover('player', player => {
  cursor('grab')
  player.scale = 1.1
})

let holdingObj: GameObj<any>

let firstInteracted = false

onMousePress((pos) => {
  if (!firstInteracted) {
    const noise = makeNoise(audioCtx)
    setTimeout(() => {
      noise.disconnect(audioCtx.destination)
      play('bgm', {
        loop: true,
        volume: 0.1
      })
    }, 2000)
    firstInteracted = true
  }
  let displacedBlock = false
  let displacedPlayer = false
  k.every('block', (tile) => {
    if (pos.dist(tile.pos) < CELL_SIZE_HALF) {
      displacedBlock = true
      add([
        circle(1),
        color(),
        k.pos(tile.pos),
        opacity(0.5),
        area({ width: 12, height: 12 }),
        'dot'
      ])
      tile.destroy()
      holdingObj = add([
        sprite(tile.name),
        k.pos(vec2(pos.x + CELL_SIZE_HALF, pos.y + CELL_SIZE_HALF)),
        {
          name: tile.name
        }
      ])
    }
  })

  k.every('dot', (dot) => {
    if (displacedBlock) return
    if (pos.dist(dot.pos) < CELL_SIZE_HALF) {
      if (holdingObj) {
        if (holdingObj === playerLeft || holdingObj === playerRight) {
          holdingObj.pos = dot.pos.clone()
          displacedPlayer = true
        } else {
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
              name: holdingObj.name
            },
            'block'
          ])
          dot.destroy()
          holdingObj.destroy()
        }
        // @ts-ignore
        holdingObj = undefined
      }
    }
  })
  every('player', player => {
    if (displacedPlayer) return
    if (player.pos.dist(pos) < CELL_SIZE_HALF) {
      holdingObj = player
    }
  })
  k.every('tool', (tool) => {
    if (pos.dist(tool.pos) < CELL_SIZE_HALF) {
      if (holdingObj) {
        holdingObj.destroy()
      }
      holdingObj = add([
        sprite(tool.name),
        k.pos(vec2(pos.x, pos.y)),
        opacity(0),
        area(),
        scale(0),
        {
          name: tool.name
        }
      ])
      if (holdingObj) {
        animate({
          from: 0,
          to: 1,
          duration: 300,
          onUpdate: v => {
            holdingObj.opacity = v
            holdingObj.scale = v
          }
        })
      }
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
    tool.scale = 0.8
  })

  every('dot', dot => {
    dot.opacity = 0.5
  })

  every('player', player => {
    player.scale = 1
  })

  cursor('default')
})
