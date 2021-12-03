export const CELL_SIZE = 16
export const CELL_SIZE_HALF = CELL_SIZE / 2
export const DOT_SIZE = 4

export const makeNoise = (ctx: AudioContext) => {
  const bufferSize = 1024
  const whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1)
  whiteNoise.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 1000
    }
  }
  whiteNoise.connect(ctx.destination)
  return whiteNoise
}
