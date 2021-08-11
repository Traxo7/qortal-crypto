import PhraseWallet from '../api/PhraseWallet'
import { decryptStoredWallet as decryptWallet } from '../api/decryptStoredWallet'
import { createWallet } from '../api/createWallet'
import { generateSaveWalletData } from '../api/storeWallet'
import { signTransaction } from '../api/signTransaction'
import { transactionTypes } from '../api/transactions/transactions'
import { getMintingKey } from '../api/getMintingKey'
import { base58PublicKeyToAddress } from '../api/wallet/base58PublicKeyToAddress'

const Qortal = {
  PhraseWallet,
  decryptWallet,
  createWallet,
  generateSaveWalletData,
  signTransaction,
  getMintingKey,
  transactionTypes,
  base58PublicKeyToAddress,
}
export default Qortal
