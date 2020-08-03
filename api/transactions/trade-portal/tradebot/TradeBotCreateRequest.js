/**
 * CrossChain - TradeBot Create Request (Sell Action)
 * 
 * These are special types of transactions (JSON ENCODED)
 */

export default class TradeBotCreateRequest {
    constructor() {
        // ...
    }

    createTransaction(txnReq) {

        this.creatorPublicKey(txnReq.creatorPublicKey)

        this.qortAmount(txnReq.qortAmount)

        this.fundingQortAmount(txnReq.fundingQortAmount)

        this.bitcoinAmount(txnReq.bitcoinAmount)

        this.tradeTimeout(txnReq.tradeTimeout)

        this.receivingAddress(txnReq.receivingAddress)

        return this.txnRequest()
    }

    creatorPublicKey(creatorPublicKey) {

        this._creatorPublicKey = creatorPublicKey

    }

    qortAmount(qortAmount) {
        this._qortAmount = qortAmount
    }


    fundingQortAmount(fundingQortAmount) {

        this._fundingQortAmount = fundingQortAmount
    }

    bitcoinAmount(bitcoinAmount) {

        this._bitcoinAmount = bitcoinAmount
    }

    tradeTimeout(tradeTimeout) {

        this._tradeTimeout = tradeTimeout
    }

    receivingAddress(receivingAddress) {

        this._receivingAddress = receivingAddress
    }

    txnRequest() {

        return {
            creatorPublicKey: this._creatorPublicKey,
            qortAmount: this._qortAmount,
            fundingQortAmount: this._fundingQortAmount,
            bitcoinAmount: this._bitcoinAmount,
            tradeTimeout: this._tradeTimeout,
            receivingAddress: this._receivingAddress
        }
    }
}
