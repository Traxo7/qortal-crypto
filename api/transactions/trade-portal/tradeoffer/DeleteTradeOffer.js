/**
 * CrossChain - DELETE TradeOffer 
 * 
 * These are special types of transactions (JSON ENCODED)
 */

export default class DeleteTradeOffer {
    constructor() {
        // ...
    }

    createTransaction(txnReq) {

        this.atAddress(txnReq.atAddress)

        this.tradePublicKey(txnReq.tradeKeyPair.publicKey)

        return this.txnRequest()
    }

    atAddress(atAddress) {

        this._atAddress = atAddress
    }

    tradePublicKey(tradePublicKey) {
        this._tradePublicKey = tradePublicKey
    }

    txnRequest() {

        return {
            atAddress: this._atAddress,
            tradePublicKey: this._tradePublicKey
        }
    }
}
