### Installation

`yarn add qortal-crypto`

### Usage
`import Qortal from 'qortal-crypto'`

<hr>

Since `kdf` function was reworked (not using default store workers anymore), we need to use `worker-plugin` package in our webpack project.


`yarn add worker-plugin`

Webpack config example: 

```
const WorkerPlugin = require('worker-plugin')
//..
configureWebpack: {
  plugins: [
    new WorkerPlugin(), // example from https://stackoverflow.com/a/60789889/1981247
  ]
},
```
