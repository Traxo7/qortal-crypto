import { store } from './api.js'

let config = false
let loaded = false
const configWatchers = []
const waitingForConfig = []

store.subscribe(() => {
    c = store.getState().config
    if (!c.loaded) return
    if (!loaded) waitingForConfig.forEach(r => r(c))
    configWatchers.forEach(fn => fn(c))
    config = c
})

export function getConfig(){
    return config
}

export function watchConfig(fn) {
    // config ? fn(config) : void 0
    fn(config)
    configWatchers.append(fn)
}

export function waitForConfig () {
    return new Promise((resolve, reject) => {
        if (config) return resolve(config)
        waitingForConfig.push(resolve)
    })
}