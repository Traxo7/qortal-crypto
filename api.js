import Base58 from './api/deps/Base58'
import base58PublicKeyToAddress from './api/wallet/base58PublicKeyToAddress'


window.Base58 = Base58

export { initApi, store } from './api_deps.js'

export * from './api/deps/deps.js'
export * from './api/api.js'

export * from './api/registerUsername.js'

// export * from './api/createTransaction.js'

// NEEED TOOOOO CHAAANNNNGGGEEE THIS ONNNEEEE
export { createWallet } from './api/createWallet.js'

// NEW Crypto functions to export
const CryptoApi = {
    base58PublicKeyToAddress
}

export default CryptoApi
