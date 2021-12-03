/* eslint-disable brace-style */
import { Vec2 } from 'kaboom'

const TILE_SET_LEFT = {
  lt: {
    key: 'q',
    val: () => [
      sprite('q'),
      area(),
      layer('bg')
    ]
  },
  t: {
    key: 'w',
    val: () => [
      sprite('w'),
      area(),
      layer('bg')
    ]
  },
  rt: {
    key: 'e',
    val: () => [
      sprite('e'),
      area(),
      layer('bg')
    ]
  },
  lb: {
    key: 'z',
    val: () => [
      sprite('z'),
      area(),
      layer('bg')
    ]
  },
  rb: {
    key: 'c',
    val: () => [
      sprite('c'),
      area(),
      layer('bg')
    ]
  },
  b: {
    key: 'x',
    val: () => [
      sprite('x'),
      area(),
      layer('bg')
    ]
  },
  l: {
    key: 'a',
    val: () => [
      sprite('a'),
      area(),
      layer('bg')
    ]
  },
  r: {
    key: 'd',
    val: () => [
      sprite('d'),
      area(),
      layer('bg')
    ]
  },
  c: {
    key: 's',
    val: () => [
      sprite('s'),
      area(),
      layer('bg')
    ]
  }
}
const TILE_SET_RIGHT = {
  lt: {
    key: 'u',
    val: () => [
      sprite('u'),
      area(),
      layer('bg')
    ]
  },
  t: {
    key: 'i',
    val: () => [
      sprite('i'),
      area(),
      layer('bg')
    ]
  },
  rt: {
    key: 'o',
    val: () => [
      sprite('o'),
      area(),
      layer('bg')
    ]
  },
  lb: {
    key: 'm',
    val: () => [
      sprite('m'),
      area(),
      layer('bg')
    ]
  },
  rb: {
    key: '.',
    val: () => [
      sprite('.'),
      area(),
      layer('bg')
    ]
  },
  b: {
    key: ',',
    val: () => [
      sprite(','),
      area(),
      layer('bg')
    ]
  },
  l: {
    key: 'j',
    val: () => [
      sprite('j'),
      area(),
      layer('bg')
    ]
  },
  r: {
    key: 'l',
    val: () => [
      sprite('l'),
      area(),
      layer('bg')
    ]
  },
  c: {
    key: 'k',
    val: () => [
      sprite('k'),
      area(),
      layer('bg')
    ]
  }
}

type Tile = {
  key: string,
  val: any
}

type TileSet = {
  lt: Tile
  t: Tile
  rt: Tile
  c: Tile
  lb: Tile
  b: Tile
  rb: Tile
  l: Tile
  r: Tile
}

const makeTiles = (tileSet: TileSet) => {
  const tiles: any = {}
  for (const tile of Object.values(tileSet)) {
    tiles[tile.key] = tile.val
  }
  return tiles
}
const makeLevelGrid = (width: number, height: number, conf: TileSet) => {
  const { lt, t, rt, c, lb, b, rb, l, r } = conf
  const grid: string[] = []
  for (let y = 0; y < height; y++) {
    const row: string[] = []
    for (let x = 0; x < width; x++) {
      // top
      if (y === 0) {
        // left-top
        if (x === 0) {
          row.push(lt.key)
        }
        // right-top
        else if (x === width - 1) {
          row.push(rt.key)
        }
        // top
        else {
          row.push(t.key)
        }
      }
      // bottom
      else if (y === height - 1) {
        // left-bottom
        if (x === 0) {
          row.push(lb.key)
        }
        // right-bottom
        else if (x === width - 1) {
          row.push(rb.key)
        }
        // bottom
        else {
          row.push(b.key)
        }
      }
      // left
      else if (x === 0) {
        row.push(l.key)
      }
      // right
      else if (x === width - 1) {
        row.push(r.key)
      }
      // center
      else {
        row.push(c.key)
      }
    }
    grid.push(row.join(''))
  }
  return grid
}

const makeLevel = (w: number, h: number, side: 'left' | 'right', tileSet: TileSet) => {
  w = w + 1
  h = h + 1
  const LEVEL_WIDTH = 16 * w
  const LEVEL_HEIGHT = 16 * h
  const CENTER = width() / 2
  const rest = (CENTER - LEVEL_WIDTH) / 2
  const x = side === 'left' ? rest : CENTER + rest
  const pos = vec2(x, height() / 2 - LEVEL_HEIGHT / 2)
  const grid = makeLevelGrid(w, h, tileSet)
  const tiles = makeTiles(tileSet)
  const l = addLevel(grid, {
    width: 16,
    height: 16,
    pos,
    ...tiles
  });
  (l as any).pos = pos;
  (l as any).size = {
    w: w - 1,
    h: h - 1
  }
  return l as typeof l & { pos: Vec2, size: { w: number, h: number } }
}

export const makeLevelLeft = (w: number, h: number) => {
  return makeLevel(w, h, 'left', TILE_SET_LEFT)
}

export const makeLevelRight = (w: number, h: number) => {
  return makeLevel(w, h, 'right', TILE_SET_RIGHT)
}

export type Level = ReturnType<typeof makeLevel>
