/*
Copyright 2017-2018 @ irontiga and vbcs (original developer)
*/
'use strict';
import Base58 from './deps/Base58.js'
// import RIPEMD160 from './deps/ripemd160.js' // THIS IS THE OLD BROKEN VERSION FROM QORA
// import RIPEMD160 from 'ripemd160' // in publicKeyToAddress
// import { Buffer } from 'buffer' // in publicKeyToAddress
// import { SHA256, SHA512 } from "asmcrypto.js/asmcrypto.all.js"
// import { Sha256, Sha512 } from "asmcrypto.js/dist_es5/entry-export_all.js"
import { Sha256, Sha512 } from 'asmcrypto.js'
import nacl from './deps/nacl-fast.js'
import utils from './deps/utils.js'
// import { ADDRESS_VERSION } from './constants.js'

import { generateSaveWalletData } from './storeWallet.js'

import publicKeyToAddress from './wallet/publicKeyToAddress.js'
// // Just for a quick debug
// window.utils = utils
// window.RIPEMD160 = RIPEMD160

export default class PhraseWallet {
    constructor (seed, walletVersion) {
        // walletVersion 1 = Original Java wallet version with double sha etc.
        // walletVersion 2 = "new" Qora ui seed generation
        this._walletVersion = walletVersion || 2
        this.seed = seed

        // Probably put getters/setters to validate...
        this.savedSeedData = {}
        this.hasBeenSaved = false
    }
    /*
    seed is a byte array
    */
    set seed (seed) {
        this._byteSeed = seed
        this._base58Seed = Base58.encode(seed)
        // console.log(this._base58Seed)

        this._addresses = []

        this.genAddress(0)
    }

    getAddress (nonce) {
        return this._addresses[nonce]
    }

    get addresses () {
        return this._addresses
    }

    get addressIDs () {
        // only return IDs
        return this._addresses.map(addr => {
            return addr.address
        })
    }

    get seed () {
        return this._byteSeed
    }

    addressExists (nonce) {
        return this._addresses[nonce] != undefined
    }

    // // Some string, and amount of times to sha256 it
    // _repeatSHA256 (passphrase, hashes) {
    //     let hash = passphrase
    //     for (let i = 0; i < hashes; i++) {
    //         hash = new Sha256().process(hash).finish().result
    //     }
    //     return hash
    // }

    _genAddressSeed (seed) {
        let newSeed = new Sha512().process(seed).finish().result
        newSeed = new Sha512().process(utils.appendBuffer(newSeed, seed)).finish().result
        return newSeed
    }

    genAddress (nonce) {
        // Check if nonce index is available in array
        if (nonce >= this._addresses.length) {
            this._addresses.length = nonce + 1
        }
        // Don't regenerate the address if it's already generated
        if (this.addressExists(nonce)) {
            return this.addresses[nonce]
        }

        const nonceBytes = utils.int32ToBytes(nonce)

        let addrSeed = new Uint8Array()
        // console.log("Initial seed ", addrSeed)
        addrSeed = utils.appendBuffer(addrSeed, nonceBytes)
        // console.log("Seed after nonceBytes ", addrSeed)
        addrSeed = utils.appendBuffer(addrSeed, this._byteSeed)
        // console.log("Seed after nonce and seed ", addrSeed)
        addrSeed = utils.appendBuffer(addrSeed, nonceBytes)
        // console.log("Appended seed ", addrSeed)
        // console.log(this._walletVersion)
        // Questionable advantage to sha256d...sha256(sha256(x) + x) does not increase collisions the way sha256d does. Really nitpicky though. Note that this seed is computed from the original seed (which went through (bcrypt) so it's generation does not need to be computationally expenise
        if (this._walletVersion == 1) {
            // addrSeed = new SHA256.digest(SHA256.digest(addrSeed))
            // addrSeed = Sha256.bytes(Sha256.bytes(addrSeed))
            addrSeed = new Sha256().process(
                new Sha256()
                    .process(addrSeed)
                    .finish()
                    .result
                ).finish().result

            // Forget wallet seed, use _byteSeed as address seed
            addrSeed = this._byteSeed
            // console.log('wallet 1')
        // } else if (this._walletVersion == 2) {
        //     addrSeed = new Sha512().process(
        //         new Sha512()
        //             .process(addrSeed)
        //             .finish()
        //             .result
        //     ).finish().result//.slice(0, 32)
        //     console.log('wallet2')
        } else {
            // addrSeed = new SHA256.digest(utils.appendBuffer(SHA256.digest(addrSeed), addrSeed))
            // Why not use sha512?
            // addrSeed = Sha512.bytes(utils.appendBuffer(Sha512.bytes(addrSeed), addrSeed)).slice(0, 32)
            // addrSeed = new Sha512().process(utils.stringtoUTF8Array(addrSeed)).finish().result
            // Sha512.bytes(utils.appendBuffer(Sha512.bytes(addrSeed), addrSeed)).slice(0, 32)
            addrSeed = this._genAddressSeed(addrSeed).slice(0, 32)
        }

        // console.log(addrSeed)
        const addrKeyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(addrSeed))

        // const publicKeyHash = new RIPEMD160().digest(Sha256.bytes(addrKeyPair.publicKey));
        // const publicKeyHash = new RIPEMD160().digest(new Sha256().process(addrKeyPair.publicKey).finish().result)
        // const publicKeySha256 = new Sha256().process(addrKeyPair.publicKey).finish().result
        // console.log(publicKeySha256.buffer)
        // const publicKeyHashHex = new RIPEMD160().update(Buffer.from(publicKeySha256)).digest('hex')
        // const publicKeyHash = utils.hexToBytes(publicKeyHashHex)

        // let address = new Uint8Array()

        // address = utils.appendBuffer(address, [ADDRESS_VERSION])
        // address = utils.appendBuffer(address, publicKeyHash)

        // // const checkSum = Sha256.bytes(Sha256.bytes(address))
        // const checkSum = this._repeatSHA256(address, 2)

        // address = utils.appendBuffer(address, checkSum.subarray(0, 4))
        // // Turn it into a string
        // address = Base58.encode(address)

        const address = publicKeyToAddress(addrKeyPair.publicKey)
        const qoraAddress = publicKeyToAddress(addrKeyPair.publicKey, true)

        this._addresses[nonce] = {
            address,
            qoraAddress,
            keyPair: {
                publicKey: addrKeyPair.publicKey,
                privateKey: addrKeyPair.secretKey
            },
            base58PublicKey: Base58.encode(addrKeyPair.publicKey),
            seed: addrSeed,
            nonce: nonce
        }
        return this._addresses[nonce]
    }

    // password, kdfThreads, statusUpdateFn
    generateSaveWalletData (...args) {
        // return generateSaveWalletData(this, ...args)
        return generateSaveWalletData(this, ...args)
    }
}
