import { Sha256 } from 'asmcrypto.js'
import mempow from './memory-pow/memory-pow-base64.js'

function asciiToBinary(str) {
  if (typeof atob === 'function') {
    // this works in the browser
    return atob(str)
  } else {
    // this works in node
    return new Buffer(str, 'base64').toString('binary')
  }
}

function decode(encoded) {
  var binaryString = asciiToBinary(encoded)
  var bytes = new Uint8Array(binaryString.length)
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}


addEventListener('message', e => {
  computePow(e.data.bytes, e.data.difficulty)
    .then((nonce) => {
      postMessage(nonce)
    })
    .catch(err => {
      postMessage(err.message)
    })
})

const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const heap = new Uint8Array(memory.buffer)

const sbrk = function (size, heap) {
  let brk = 512 * 1024 // stack top
  let old = brk
  brk += size

  if (brk > heap.length)
    throw new Error('heap exhausted')

  return old
}

/**
 *
 * @param bytes
 * @param difficulty
 * @return {Promise<*>} - nonce
 */
const computePow = async (bytes, difficulty) => {
  let _computePow

  await WebAssembly.instantiate(decode(mempow), { env: { memory } })
    .then((wasmModule) => {
      // powInstance = wasmModule.instance
      _computePow = wasmModule.instance.exports.compute2
    })
    .catch(err => console.error(err))

  const _bytesArray = Object.keys(bytes).map(key => bytes[key])
  const bytesArray = new Uint8Array(_bytesArray)
  const bytesHash = new Sha256().process(bytesArray).finish().result

  const hashPtr = sbrk(32, heap)
  const hashAry = new Uint8Array(memory.buffer, hashPtr, 32)
  hashAry.set(bytesHash)

  const workBufferLength = 8 * 1024 * 1024
  const workBufferPtr = sbrk(workBufferLength, heap)

  return _computePow(hashPtr, workBufferPtr, workBufferLength, difficulty)
}