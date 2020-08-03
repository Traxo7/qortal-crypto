import TradeBotCreateRequest from './transactions/trade-portal/tradebot/TradeBotCreateRequest.js';
import signTradeBotTransaction from './transactions/trade-portal/tradebot/signTradeBotTransaction.js'

import { request } from './fetch-request'


// TradeBotCreateRequest
export const tradeBotCreateRequest = (requestObject) => {
    const txn = new TradeBotCreateRequest().createTransaction(requestObject)

    return request('/crosschain/tradebot/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(txn)
    })
}


// Sign Trade Transactions
export const signTradeBotTxn = (unsignedTxn, keyPair) => {
    return signTradeBotTransaction(unsignedTxn, keyPair)
}
