import Base58 from './deps/Base58'
import ed2curve from './deps/ed2curve'
import nacl from './deps/nacl-fast'
import { Sha256 } from 'asmcrypto.js'

export const getMintingKey = (Base58PublicKey, keyPair) => {
  const publicKey = Base58.decode(Base58PublicKey)

  // Reward share keys
  const convertedPrivateKey = ed2curve.convertSecretKey(keyPair.privateKey)
  const convertedPublicKey = ed2curve.convertPublicKey(publicKey)
  const sharedSecret = new Uint8Array(32)
  nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)
  const rewardShareSeed = new Sha256().process(sharedSecret).finish().result

  return Base58.encode(rewardShareSeed) // base58RewardShareSeed
}
