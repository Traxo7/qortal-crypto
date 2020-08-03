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

        this.receiveAddress(txnReq.receiveAddress)

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

    receiveAddress(receiveAddress) {

        this._receiveAddress = receiveAddress
    }

    txnRequest() {

        return {
            creatorPublicKey: this._creatorPublicKey,
            qortAmount: this._qortAmount,
            fundingQortAmount: this._fundingQortAmount,
            bitcoinAmount: this._bitcoinAmount,
            tradeTimeout: this._tradeTimeout,
            receiveAddress: this._receiveAddress
        }
    }
}
