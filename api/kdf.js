import config from '../default.crypto.config'
import utils from './deps/utils'
import { Sha512 } from 'asmcrypto.js'

const combineKeyParts = (keyParts) => {
  const data = utils.stringtoUTF8Array(config.staticSalt + keyParts.reduce((a, c) => a + c))
  return new Sha512().process(data).finish().result
}

let workers = []
for (let i = 0; i < config.kdfThreads; i++) {
  workers[i] = new Worker('./kdfWorker.js', { type: 'module' })
}

export const kdf = async (key, salt) => {
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
