import Base58 from '../../api/deps/Base58'

const generateChatReference = () => {
  const _reference = new Uint8Array(64)
  window.crypto.getRandomValues(_reference)
  return Base58.encode(_reference)
}

export default generateChatReference
