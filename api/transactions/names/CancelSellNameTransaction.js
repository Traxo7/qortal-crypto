'use strict'
import TransactionBase from '../TransactionBase.js'

export default class CancelSellNameTransaction extends TransactionBase {
  constructor() {
    super()
    this.type = 6
    this.fee = 0.001
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
      this._feeBytes,
    )
    return params
  }
}
