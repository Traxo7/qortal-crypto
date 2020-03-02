
import { kdf } from './kdf.js'
import PhraseWallet from './PhraseWallet.js'
import Base58 from './deps/Base58.js'
import { decryptStoredWallet } from './decryptStoredWallet.js'

export const createWallet = async (sourceType, source, statusUpdateFn) => {
    let version, seed
    // console.log(sourceType)
    switch (sourceType) {
        case 'phrase':
            version = 2
            seed = await kdf(source, void 0, statusUpdateFn)
            break
        case 'seed':
            // console.log(source)
            version = 1
            seed = Base58.decode(source)
            break
        // case 'v1seed':
        //     version = 1
        //     seed = Base58.decode(source)
        //     break
        case 'storedWallet':
        case 'backedUpSeed':
            seed = await decryptStoredWallet(source.password, source.wallet, statusUpdateFn)
            break
        default:
            throw 'sourceType ' + sourceType + ' not recognized'
    }
    // console.log('making wallet')
    const wallet = new PhraseWallet(seed, version)
    // console.log('returning wallet')
    return wallet
}
