/**
 * Used to base64 encode `.wasm` module
 */
const readFileSync = require('fs').readFileSync
const pathToFile = __dirname + '/memory-pow.wasm'
const wasmCode = readFileSync(pathToFile)
const encoded = Buffer.from(wasmCode, 'binary').toString('base64')
console.log(encoded)
