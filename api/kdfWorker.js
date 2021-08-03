// kdf worker
import config from '../default.crypto.config'
import utils from './deps/utils'

import bcrypt from 'bcryptjs'
import { bytes_to_base64 as bytesToBase64, Sha512 } from 'asmcrypto.js'

const getKeyPart = (seed, salt, nonce) => {
  const combinedBytes = utils.appendBuffer(salt, utils.stringtoUTF8Array(config.staticSalt + seed + nonce))
  const sha512Hash = new Sha512().process(combinedBytes).finish().result
  const sha512HashBase64 = bytesToBase64(sha512Hash)
  return bcrypt.hashSync(sha512HashBase64.substring(0, 72), config.staticBcryptSalt)
}

addEventListener('message', e => {
  const keyPart = getKeyPart(e.data.seed, e.data.salt, e.data.nonce)
  postMessage(keyPart)
})
