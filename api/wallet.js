// Wallet goes here and is managed/exported from here. None of this putting it in redux trash.
import { createWallet as createWallet1 } from './createWallet.js'


let wallet

//
// ...
//

export const createWallet = (...args) => {
    wallet = createWallet1(...args)
    return wallet
}

export default wallet
