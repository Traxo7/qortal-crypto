import RIPEMD160 from 'ripemd160'
import BROKEN_RIPEMD160 from '../deps/broken-ripemd160.js' // THIS IS THE OLD BROKEN VERSION FROM QORA
import { Sha256 } from 'asmcrypto.js'

import utils from '../deps/utils.js'
import Base58 from '../deps/Base58.js'
import { Buffer } from 'buffer'

import { ADDRESS_VERSION } from '../constants.js'

// Some string, and amount of times to sha256 it
const repeatSHA256 = (passphrase, hashes) => {
    let hash = passphrase
    for (let i = 0; i < hashes; i++) {
        hash = new Sha256().process(hash).finish().result
    }
    return hash
}

const publicKeyToAddress = (publicKey, qora = false) => {
    const publicKeySha256 = new Sha256().process(publicKey).finish().result
    const publicKeyHashHex = qora ? new BROKEN_RIPEMD160().digest(publicKeySha256) : new RIPEMD160().update(Buffer.from(publicKeySha256)).digest('hex')
    // const publicKeyHashHex = new RIPEMD160().update(Buffer.from(publicKeySha256)).digest('hex')
    const publicKeyHash = qora ? publicKeyHashHex : utils.hexToBytes(publicKeyHashHex)
    let address = new Uint8Array()
    
    address = utils.appendBuffer(address, [ADDRESS_VERSION])
    address = utils.appendBuffer(address, publicKeyHash)

    // const checkSum = Sha256.bytes(Sha256.bytes(address))
    const checkSum = repeatSHA256(address, 2)
    address = utils.appendBuffer(address, checkSum.subarray(0, 4))
    // Turn it into a string
    address = Base58.encode(address)
    console.log(address)
    return address
}

export default publicKeyToAddress
