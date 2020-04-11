import publicKeyToAddress from '../wallet/publicKeyToAddress.js'

"use strict";
import TransactionBase from "./TransactionBase.js"
import { QORT_DECIMALS } from "../constants.js"
import nacl from '../deps/nacl-fast.js'
import ed2curve from '../deps/ed2curve.js'
import { Sha256 } from 'asmcrypto.js'

export default class RemoveRewardShareTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 138
        // this.fee = 1
        // this.tests.push(
        //     () => {
        //         if (!(this._registrantPublicKey instanceof Uint8Array && this._registrantPublicKey.length == 32)) {
        //             return "Invalid registrant " + Base58.encode(this._registrantPublicKey)
        //         }
        //         return true
        //     }
        // )
    }

    render(html) {
        return html`
            You are removing a reward share transaction associated with account: <strong>${this.constructor.Base58.encode(this._recipient)}</strong>.
            <div style="background:#eee; padding:8px; margin:8px 0; border-radius:2px;">
                <span>${this._base58RewardShareSeed}</span>
            </div>
            On pressing confirm, the rewardshare will be removed and the above key will become invalid.
        `
    }

    set recipientPublicKey(recipientPublicKey) {
        this._base58RecipientPublicKey = recipientPublicKey instanceof Uint8Array ? this.constructor.Base58.encode(recipientPublicKey) : recipientPublicKey
        this._recipientPublicKey = this.constructor.Base58.decode(this._base58RecipientPublicKey)
        // console.log(this._recipientPublicKey)
        // console.log(publicKeyToAddress)
        this.recipient = publicKeyToAddress(this._recipientPublicKey)
        // this._rewardSharePublicKey = this.rewardShareKey
        // console.log(recipientPublicKey, this._keyPair)
        this.fee = (recipientPublicKey === this.constructor.Base58.encode(this._keyPair.publicKey) ? 0 : 0.001)

        // Reward share keys
        const convertedPrivateKey = ed2curve.convertSecretKey(this._keyPair.privateKey)
        const convertedPublicKey = ed2curve.convertPublicKey(this._recipientPublicKey)
        const sharedSecret = new Uint8Array(32);
        nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey);
        this._rewardShareSeed = new Sha256().process(sharedSecret).finish().result
        this._base58RewardShareSeed = this.constructor.Base58.encode(this._rewardShareSeed)

        this._rewardShareKeyPair = nacl.sign.keyPair.fromSeed(this._rewardShareSeed)
        // console.log(this._rewardShareKeyPair)
    }

    set recipient(recipient) { // Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
    }

    set percentageShare(share) {
        this._percentageShare = share * 1e8
        this._percentageShareBytes = this.constructor.utils.int64ToBytes(this._percentageShare)
    }

    get params() {
        const params = super.params
        // console.log(this)
        // console.log(this._rewardShareKeyPair)
        params.push(
            this._recipient,
            this._rewardShareKeyPair.publicKey,
            this._percentageShareBytes,
            this._feeBytes
        )
        return params;
    }
}
