import { Sha256 } from 'asmcrypto.js'
import Base58 from './api/deps/Base58'
import { base58PublicKeyToAddress } from './api/wallet/base58PublicKeyToAddress'
import { validateAddress } from './api/wallet/validateAddress'
import { decryptChatMessage } from './api/transactions/chat/decryptChatMessage';
import { randomBase58Generator } from './api/utils/randomBase58Generator';
import _ from 'lodash';


window.Sha256 = Sha256
window.Base58 = Base58
window._ = _
window.base58PublicKeyToAddress = base58PublicKeyToAddress
window.validateAddress = validateAddress
window.decryptChatMessage = decryptChatMessage
window.randomBase58Generator = randomBase58Generator

export { initApi, store } from './api_deps.js'

export * from './api/deps/deps.js'
export * from './api/api.js'
export * from './api/registerUsername.js'
export { randomBase58Generator } from './api/utils/randomBase58Generator'
export { createWallet } from './api/createWallet.js'

