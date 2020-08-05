import Base58 from '../../../deps/Base58.js'
import nacl from '../../../deps/nacl-fast.js'
import utils from '../../../deps/utils.js'


const signTradeBotTransaction = (unsignedTxn, keyPair, isCancelTrade) => {

    if (!unsignedTxn) {
        throw new Error('Unsigned Transaction Bytes not defined')
    }

    if (!keyPair) {
        throw new Error('keyPair not defined')
    }

    const txnBuffer = Base58.decode(unsignedTxn)

    if (keyPair.privateKey.length === undefined) {
        let privateKey

        const _rawKey = Object.keys(keyPair.privateKey).map(function (key) { return keyPair.privateKey[key]; });
        const rawKey = new Uint8Array(_rawKey)

        if (isCancelTrade === true) {
            const keys = nacl.sign.keyPair.fromSeed(rawKey)
            privateKey = keys.secretKey
        } else {
            privateKey = rawKey
        }

        const signature = nacl.sign.detached(txnBuffer, privateKey)

        const signedBytes = utils.appendBuffer(txnBuffer, signature)

        return signedBytes
    } else {

        const signature = nacl.sign.detached(txnBuffer, keyPair.privateKey)

        const signedBytes = utils.appendBuffer(txnBuffer, signature)

        return signedBytes
    }
}

export default signTradeBotTransaction
