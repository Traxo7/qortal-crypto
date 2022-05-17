import PhraseWallet from '../api/PhraseWallet'
import { decryptStoredWallet as decryptWallet } from '../api/decryptStoredWallet'
import { createWallet } from '../api/createWallet'
import { generateSaveWalletData } from '../api/storeWallet'
import { signTransaction } from '../api/signTransaction'
import signChat from '../api/transactions/chat/signChat'
import signArbitrary from '../api/transactions/arbitrary/signArbitrary'
import { transactionTypes } from '../api/transactions/transactions'
import { getMintingKey } from '../api/getMintingKey'
import { base58PublicKeyToAddress } from '../api/wallet/base58PublicKeyToAddress'
import { computePow } from '../api/computePow'

import signTradeBotTransaction from '../api/transactions/trade-portal/tradebot/signTradeBotTransaction'
import generateChatReference from '../api/utils/generateChatReference'

import Base58 from '../api/deps/Base58'

const tradeBot = {
  signTradeBotTransaction
}

const Qortal = {
  PhraseWallet,
  decryptWallet,
  createWallet,
  generateSaveWalletData,
  signTransaction,
  getMintingKey,
  transactionTypes,
  base58PublicKeyToAddress,
  tradeBot,
  Base58,
  computePow,
  signChat,
  signArbitrary,
  generateChatReference,
}
export default Qortal
