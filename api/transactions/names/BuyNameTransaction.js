'use strict'
import TransactionBase from '../TransactionBase.js'
import { QORT_DECIMALS } from '../../constants'

export default class BuyNameTransaction extends TransactionBase {
  constructor() {
    super()
    this.type = 7
    this.fee = 0.001
  }


  set amount(amount) {
    this._amount = amount * QORT_DECIMALS
    this._amountBytes = this.constructor.utils.int64ToBytes(this._amount)
  }

  set name(name) {
    this._nameBytes = this.constructor.utils.stringtoUTF8Array(name)
    this._nameLength = this.constructor.utils.int32ToBytes(this._nameBytes.length)
  }

  set seller(seller) { // Always Base58 encoded. Accepts Uint8Array or Base58 string.
    this._Base58Seller = seller instanceof Uint8Array ? seller : this.constructor.Base58.decode(seller)
  }

  set buyerPublicKey(buyerPublicKey) {  // Always Base58 encoded. Accepts Uint8Array or Base58 string.
    this._Base58BuyerPublicKey = buyerPublicKey instanceof Uint8Array ? buyerPublicKey : this.constructor.Base58.decode(buyerPublicKey)
  }

  get params() {
    const params = super.params
    params.push(
      this._Base58Seller,
      this._Base58BuyerPublicKey,
      this._nameLength,
      this._nameBytes,
      this._amountBytes,
      this._feeBytes,
    )
    return params
  }
}
