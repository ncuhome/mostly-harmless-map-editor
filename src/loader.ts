export const loadSprites = () => {
  loadSpriteAtlas("/tilemap.png", {
    q: {
      "x": 0,
      "y": 0,
      "width": 16,
      "height": 16,
    },
    w: {
      x: 16,
      y: 0,
      width: 16,
      height: 16
    },
    e: {
      x: 32,
      y: 0,
      width: 16,
      height: 16
    },
    a: {
      x: 0,
      y: 16,
      width: 16,
      height: 16
    },
    s: {
      x: 16,
      y: 16,
      width: 16,
      height: 16
    },
    d: {
      x: 32,
      y: 16,
      width: 16,
      height: 16
    },
    z: {
      x: 0,
      y: 32,
      width: 16,
      height: 16
    }, 
    x: {
      x: 16,
      y: 32,
      width: 16,
      height: 16
    }, 
    c: {
      x: 32,
      y: 32,
      width: 16,
      height: 16
    },
  
    // level2
    u: {
      x: 0,
      y: 48,
      width: 16,
      height: 16
    }, 
    i: {
      x: 16,
      y: 48,
      width: 16,
      height: 16
    }, 
    o: {
      x: 32,
      y: 48,
      width: 16,
      height: 16
    },
    j: {
      x: 0,
      y: 64,
      width: 16,
      height: 16
    }, 
    k: {
      x: 16,
      y: 64,
      width: 16,
      height: 16
    }, 
    l: {
      x: 32,
      y: 64,
      width: 16,
      height: 16
    },
    m: {
      x: 0,
      y: 80,
      width: 16,
      height: 16
    }, 
    ',': {
      x: 16,
      y: 80,
      width: 16,
      height: 16
    }, 
    '.': {
      x: 32,
      y: 80,
      width: 16,
      height: 16
    },
    player: {
      x: 384,
      y: 240,
      width: 16,
      height: 16
    },
    player2: {
      x: 384,
      y: 0,
      width: 16,
      height: 16
    }
  })
}