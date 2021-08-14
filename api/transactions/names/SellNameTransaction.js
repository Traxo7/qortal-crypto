'use strict'
import TransactionBase from '../TransactionBase.js'
import { QORT_DECIMALS } from '../../constants'

export default class SellNameTransaction extends TransactionBase {
  constructor() {
    super()
    this.type = 5
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

  get params() {
    const params = super.params
    params.push(
      this._nameLength,
      this._nameBytes,
      this._amountBytes,
      this._feeBytes,
    )
    return params
  }
}
