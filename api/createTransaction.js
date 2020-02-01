import { transactionTypes as transactions } from './transactions/transactions.js'
import Base58 from './deps/Base58.js'
import { request } from './fetch-request'

// window.Base58 = Base58

export const createTransaction = (type, keyPair, params) => {
    const tx = new transactions[type]()
    tx.keyPair = keyPair
    Object.keys(params).forEach(param => {
        // console.log('Doing ' + param + 'with data ' + params[param])
        tx[param] = params[param]
    })
    // console.log('Got to signing part...')
    const response = tx.signedBytes
    console.log(response)
    return response
}

export const processTransaction = bytes => request('/transactions/process', {
    method: 'POST',
    body: Base58.encode(bytes)
})
