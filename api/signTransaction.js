import Base58 from '../api/deps/Base58'
import { transactionTypes } from './transactions/transactions'

export const signTransaction = (txType, txParams, lastReference, keyPair) => {
  let tx = new transactionTypes[txType]()
  tx.keyPair = keyPair
  tx.lastReference = lastReference

  Object.keys(txParams).forEach(param => tx[param] = txParams[param])
  return Base58.encode(tx.signedBytes)
}
