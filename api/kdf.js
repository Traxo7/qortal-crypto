import config from '../default.crypto.config'
import utils from './deps/utils'
import { Sha512 } from 'asmcrypto.js'

const combineKeyParts = (keyParts) => {
  const data = utils.stringtoUTF8Array(config.staticSalt + keyParts.reduce((a, c) => a + c))
  return new Sha512().process(data).finish().result
}


let workers = []
if (!window.kdfWorkers) {
  const kdfWorkerPath = (window && window.kdfWorkerPath) || './kdfWorker.js'
  for (let i = 0; i < config.kdfThreads; i++) {
    workers[i] = new Worker(kdfWorkerPath, { type: 'module' })
  }
} else {
  workers = window.kdfWorkers
}

export const kdf = async (key, salt) => {
  if (window.kdfWorkers) {
    workers = window.kdfWorkers
  }
  const promises = []
  let _salt
  if (salt) {
    _salt = JSON.parse(JSON.stringify(salt))
  } else {
    _salt = void 0
  }

  for (let i = 0; i < config.kdfThreads; i++) {
    promises[i] = new Promise((res) => {
      workers[i].onmessage = e => res(e.data)
      workers[i].postMessage({ seed: key, salt: _salt, nonce: i })
    })
  }
  const keyParts = await Promise.all(promises)
  return combineKeyParts(keyParts)
}
