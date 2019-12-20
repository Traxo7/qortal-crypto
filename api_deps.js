let store
console.log('hi')
export { store }
export const initApi = (s) => {
    console.log(s)
    store = s
}

console.log(store)
console.log(initApi)
