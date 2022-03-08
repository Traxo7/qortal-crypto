export const computePow = async (bytes, difficulty) => {
  let worker = new Worker('./computePowWorker.js', { type: 'module' })
  return await new Promise((res, rej) => {
    const obj = { bytes, difficulty }
    worker.postMessage(obj)

    worker.onmessage = e => {
      worker.terminate()
      if (typeof e.data === 'number') {
        res(e.data)
      } else {
        rej(e.data)
      }
    }
  })
}
