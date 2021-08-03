import config from '../default.crypto.config'
import utils from './deps/utils'
import { Sha512 } from 'asmcrypto.js'

const combineKeyParts = (keyParts) => {
  const data = utils.stringtoUTF8Array(config.staticSalt + keyParts.reduce((a, c) => a + c))
  return new Sha512().process(data).finish().result
}

export const kdf = async (key, salt) => {
  let workers = []
  const promises = []

  for (let i = 0; i < config.kdfThreads; i++) {
    promises[i] = new Promise((res) => {
      workers[i] = new Worker('./kdfWorker.js', { type: 'module' })
      workers[i].postMessage({ seed: key, salt: salt, nonce: i })

      workers[i].onmessage = e => {
        workers[i].terminate()
        res(e.data)
      }
    })
  }
  const keyParts = await Promise.all(promises)
  workers = null
  return combineKeyParts(keyParts)
}
