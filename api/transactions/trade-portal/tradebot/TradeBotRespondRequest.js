/**
 * CrossChain - TradeBot Respond Request (Buy Action)
 * 
 * These are special types of transactions (JSON ENCODED)
 */

export default class TradeBotRespondRequest {
    constructor() {
        // ...
    }

    createTransaction(txnReq) {

        this.atAddress(txnReq.atAddress)

        this.xprv58(txnReq.xprv58)

        this.receivingAddress(txnReq.receivingAddress)

        return this.txnRequest()
    }

    atAddress(atAddress) {

        this._atAddress = atAddress
    }

    xprv58(xprv58) {
        this._xprv58 = xprv58
    }

    receivingAddress(receivingAddress) {

        this._receivingAddress = receivingAddress
    }

    txnRequest() {

        return {
            atAddress: this._atAddress,
            xprv58: this._xprv58,
            receivingAddress: this._receivingAddress
        }
    }
}
