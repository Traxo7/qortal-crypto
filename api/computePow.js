export const computePow = async (bytes, difficulty) => {
  const computePowWorkerPath = (window && window.computePowWorkerPath) || './computePowWorker.js'
  let worker = new Worker(computePowWorkerPath, { type: 'module' })
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
