import { transactionTypes as transactions } from './transactions/transactions.js'
import Base58 from './deps/Base58.js'
import { request } from './fetch-request'

export const createTransaction = (type, keyPair, params) => {
    const tx = new transactions[type]()
    Object.keys(params).forEach(param => {
        tx[param] = params[param]
    })
    tx.keyPair = keyPair
    return tx.signedBytes
}

export const processTransaction = bytes => request('transactions/process', {
    method: 'POST',
    data: Base58.encode(bytes)
})
