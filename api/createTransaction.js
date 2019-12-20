import { transactionTypes } from './transactions/transactions.js'

// Should already be confirmed so no need for requestTransaction
// import { requestTransaction } from '../transactionRequest.js'
import { processTransaction } from './processTransaction.js'

export const createTransaction = (type, keyPair, params) => {
    console.log(type, keyPair, params)
    const tx = new transactionTypes[type]()
    Object.keys(params).forEach(param => {
        tx[param] = params[param]
    })
    tx.keyPair = keyPair
    return tx // Then request confirmation, then sign, then process
    // return requestTransaction(tx)
    //     .then(response => {
    //         console.log(response)
    //         if (!response.success) {
    //             return {
    //                 success: false,
    //                 reason: response.reason
    //             }
    //         }
    //         console.log(tx)
    //         const signedBytes = tx.signedBytes
    //         return processTransaction(signedBytes)
    //     })
}


