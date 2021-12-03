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
    
    // player
    playerLeftDown: {
      x: 384,
      y: 240,
      width: 16,
      height: 48,
      sliceX: 1,
      sliceY: 3,
      anims: {
        idle: {
          from: 0,
          to: 0
        },
        walk: {
          from: 1,
          to: 2,
          loop: true,
          speed: 4
        }
      }
    },
    player2: {
      x: 384,
      y: 0,
      width: 16,
      height: 16
    },
    // door
    redDoor: {
      x: 192,
      y: 176,
      width: 16,
      height: 16
    },
    yellowDoor: {
      x: 224,
      y: 176,
      width: 16,
      height: 16
    },
    // tools
    box: {
      x: 160,
      y: 192,
      width: 16,
      height: 16
    }
  })
}