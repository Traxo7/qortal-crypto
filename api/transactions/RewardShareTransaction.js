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
import { html } from 'lit-element'

export default class RewardShareTransaction extends TransactionBase {
    constructor() {
        super()
        this.type = 38
        // this.fee = 1
        this.tests.push(
            () => {
                if (!(this._registrantPublicKey instanceof Uint8Array && this._registrantPublicKey.length == 32)) {
                    return "Invalid registrant " + Base58.encode(this._registrantPublicKey)
                }
                return true
            }
        )
    }

    render() {
        return html`
            Would you like to create a reward share transaction, sharing ${this._percentageShare}% of your minting rewards with ${this.recipient}? 
            If yes, you will need to save the key below in order to mint. It can be supplied to any node in order to allow it to mint on your behalf.
            <div>
                <span>${this._base58RewardShareSeed}</span>
            <div>
            On pressing confirm, the rewardshare will be created, but you will still need to supply the above key to a node in order to mint with the account.
        `
    }

    set recipientPublicKey (recipientPublicKey) {
        this._base58RecipientPublicKey = recipientPublicKey instanceof Uint8Array ? this.constructor.Base58.encode(recipient) : recipientPublicKey
        // this._rewardSharePublicKey = this.rewardShareKey
        
        console.log(this._keyPair)
        this.fee = recipientPublicKey === this._keyPair.publicKey ? 0.001 : 0

        // Reward share pub key
        const convertedKeypair = ed2curve.convertKeyPair(this._keyPair)
        const sharedSecret = nacl.box.before(this._recipientPublicKey, convertedKeypair.privateKey)
        this._rewardShareSeed = new Sha256().process(sharedSecret).finish().result
        this._base58RewardShareSeed = Base58.encode(this._rewardShareSeed)

        this._rewardShareKeyPair = nacl.sign.keyPair.fromSeed(this._rewardShareSeed)
        console.log(this._rewardShareKeyPair)

        this.recipient = publicKeyToAddress(recipientPublicKey)
    }

    set recipient(recipient) { // Always Base58 encoded. Accepts Uint8Array or Base58 string.
        this._recipient = recipient instanceof Uint8Array ? recipient : this.constructor.Base58.decode(recipient)
    }

    set percentageShare (share) {
        this._percentageShare = share
        this._percentageShareBytes = this.constructor.utils.int64ToBytes(this._percentageShare)
    }

    get params() {
        const params = super.params;
        params.push(
            this._recipient,
            this._rewardShareKeypair.publicKey,
            this._percentageShare,
            this._feeBytes
        )
        return params;
    }
}