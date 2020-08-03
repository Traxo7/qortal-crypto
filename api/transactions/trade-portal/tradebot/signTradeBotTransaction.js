import Base58 from '../../../deps/Base58.js'
import nacl from '../../../deps/nacl-fast.js'
import utils from '../../../deps/utils.js'


const signTradeBotTransaction = (unsignedTxn, keyPair) => {

    if (!unsignedTxn) {
        throw new Error('Chat Bytes not defined')
    }

    if (!keyPair) {
        throw new Error('keyPair not defined')
    }

    const txnBuffer = Base58.decode(unsignedTxn)

    const signature = nacl.sign.detached(txnBuffer, keyPair.privateKey)

    const signedBytes = utils.appendBuffer(txnBuffer, signature)

    return signedBytes
}

export default signTradeBotTransaction
