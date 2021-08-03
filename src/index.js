import PhraseWallet from '../api/PhraseWallet'
import { decryptStoredWallet as decryptWallet } from '../api/decryptStoredWallet'
import { createWallet } from '../api/createWallet'
import { generateSaveWalletData } from '../api/storeWallet'
import { signTransaction } from '../api/signTransaction'
import { transactionTypes } from '../api/transactions/transactions'

const Qortal = {
  PhraseWallet,
  decryptWallet,
  createWallet,
  generateSaveWalletData,
  signTransaction,
  transactionTypes,
}
export default Qortal
