// layout.add("txType: " + TransactionType.REWARD_SHARE.valueString, TransformationType.INT);
// layout.add("timestamp", TransformationType.TIMESTAMP);
// layout.add("transaction's groupID", TransformationType.INT);
// layout.add("reference", TransformationType.SIGNATURE);
// layout.add("minter's public key", TransformationType.PUBLIC_KEY);
// layout.add("recipient account's address", TransformationType.ADDRESS);
// layout.add("reward-share public key", TransformationType.PUBLIC_KEY);
// layout.add("recipient's percentage share of block rewards", TransformationType.AMOUNT);
// layout.add("fee", TransformationType.AMOUNT);
// layout.add("signature", TransformationType.SIGNATURE);

import publicKeyToAddress from '../wallet/publicKeyToAddress.js'

"use strict";
import TransactionBase from "./TransactionBase.js"
import { QORT_DECIMALS } from "../constants.js"
import nacl from '../deps/nacl-fast.js'
import ed2curve from '../deps/ed2curve.js'
import { Sha256 } from 'asmcrypto.js'

export default class RewardShareTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 38
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

    render (html) {
        return html`
            Would you like to create a reward share transaction, sharing <strong>${this._percentageShare}%</strong> of your minting rewards with <strong>${this.constructor.Base58.encode(this._recipient)}</strong>? 
            If yes, you will need to save the key below in order to mint. It can be supplied to any node in order to allow it to mint on your behalf.
            <div style="background:#eee; padding:8px; margin:8px 0; border-radius:2px;">
                <span>${this._base58RewardShareSeed}</span>
            </div>
            On pressing confirm, the rewardshare will be created, but you will still need to supply the above key to a node in order to mint with the account.
        `
    }

    set recipientPublicKey (recipientPublicKey) {
        this._base58RecipientPublicKey = recipientPublicKey instanceof Uint8Array ? this.constructor.Base58.encode(recipientPublicKey) : recipientPublicKey
        this._recipientPublicKey = this.constructor.Base58.decode(this._base58RecipientPublicKey)
        // console.log(this._recipientPublicKey)
        // console.log(publicKeyToAddress)
        this.recipient = publicKeyToAddress(this._recipientPublicKey)
        // this._rewardSharePublicKey = this.rewardShareKey
        // console.log(recipientPublicKey, this._keyPair)
        this.fee = (recipientPublicKey === this.constructor.Base58.encode(this._keyPair.publicKey) ? 0 : 0.001)

        // Reward share pub key
        const convertedKeypair = ed2curve.convertKeyPair({
            publicKey: this._keyPair.publicKey,
            secretKey: this._keyPair.privateKey
        })
        // console.log(convertedKeypair)
        const sharedSecret = nacl.box.before(this._recipientPublicKey, convertedKeypair.secretKey)
        this._rewardShareSeed = new Sha256().process(sharedSecret).finish().result
        this._base58RewardShareSeed = this.constructor.Base58.encode(this._rewardShareSeed)

        this._rewardShareKeyPair = nacl.sign.keyPair.fromSeed(this._rewardShareSeed)
        // console.log(this._rewardShareKeyPair)
    }

    set recipient(recipient) { // Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
    }

    set percentageShare (share) {
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
