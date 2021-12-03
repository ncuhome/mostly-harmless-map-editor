import { Vec2 } from "kaboom"

type Tile = {
  key: string,
  val: any
}

type GridOpt = {
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

const makeLevelGrid = (width: number, height: number, conf: GridOpt) => {
  const { lt, t, rt, c, lb, b, rb, l, r } = conf
  const grid: string[] = []
  const tiles: any = {}
  for (const tile of Object.values(conf)) {
    tiles[tile.key] = tile.val
  }
  for (let y = 0; y < height; y++) {
    let row: string[] = []
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
  return {
    grid,
    tiles
  }
}

export const makeLevelLeft = (w: number, h: number) => {
  w = w + 1
  h = h + 1
  const LEFT_LEVEL_WIDTH = 16 * w
  const LEFT_LEVEL_HEIGHT = 16 * h

  const pos = vec2(width() / 2 - LEFT_LEVEL_WIDTH - 20, height() / 2 - LEFT_LEVEL_HEIGHT / 2)

  const { grid, tiles } = makeLevelGrid(w, h, {
    lt: {
      key: 'q',
      val: () => [
        sprite("q"),
        area(),
      ]
    },
    t: {
      key: 'w',
      val: () => [
        sprite("w"),
        area(),
      ]
    },
    rt: {
      key: 'e',
      val: () => [
        sprite("e"),
        area(),
      ]
    },
    lb: {
      key: 'z',
      val: () => [
        sprite("z"),
        area(),
      ]
    },
    rb: {
      key: 'c',
      val: () => [
        sprite("c"),
        area(),
      ]
    },
    b: {
      key: 'x',
      val: () => [
        sprite("x"),
        area(),
      ]
    },
    l: {
      key: 'a',
      val: () => [
        sprite("a"),
        area(),
      ]
    },
    r: {
      key: 'd',
      val: () => [
        sprite("d"),
        area(),
      ]
    },
    c: {
      key: 's',
      val: () => [
        sprite("s"),
        area(),
      ]
    },
  })
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

export const makeLevelRight = (w: number, h: number) => {
  const RIGHT_LEVEL_HEIGHT = 16 * h

  const pos = vec2(width() / 2 + 20, height() / 2 - RIGHT_LEVEL_HEIGHT / 2)
  const { grid, tiles } = makeLevelGrid(w, h, {
    lt: {
      key: 'u',
      val: () => [
        sprite("u"),
        area(),
      ]
    },
    t: {
      key: 'i',
      val: () => [
        sprite("i"),
        area(),
      ]
    },
    rt: {
      key: 'o',
      val: () => [
        sprite("o"),
        area(),
      ]
    },
    lb: {
      key: 'm',
      val: () => [
        sprite("m"),
        area(),
      ]
    },
    rb: {
      key: '.',
      val: () => [
        sprite("."),
        area(),
      ]
    },
    b: {
      key: ',',
      val: () => [
        sprite(","),
        area(),
      ]
    },
    l: {
      key: 'j',
      val: () => [
        sprite("j"),
        area(),
      ]
    },
    r: {
      key: 'l',
      val: () => [
        sprite("l"),
        area(),
      ]
    },
    c: {
      key: 'k',
      val: () => [
        sprite("k"),
        area(),
      ]
    },
  })
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