# easyP2P
Helper to build node p2p applications

Under Construction 🎈
## Install
`npm i easyp2p` or `yarn add easyp2p`

# Usage examples

## Creating new server
```javascript
const easyP2P = require('easyp2p')
const p2p = easyP2P({networkId: 'p2pbrothers'})

p2p.startServer({
  port: 2626,
  onConnection: (peer) => {
    peer.write('welcome')
  },
  messageHandler: (peer, message) => {
    console.log('new message from peer', message)
  }
})
```

## Connect to peer
```javascript
const easyP2P = require('easyp2p')
const p2p = easyP2P({networkId: 'p2pbrothers'})

p2p.connectToPeer({
  port: 2626,
  host: 'localhost',
  messageHandler: (peer, message) => {
    console.log('new message from peer', message)
  }
})
```

## Broadcast message
```javascript
p2p.broadcast({
  lorem: 'ipmsum',
  music: 'hello darkness my old friend'
})
```

## Discover Peers
```javascript
p2p.discoverPeers()
```
see [examples](/examples) for more   


### Build with
- [peer-exchange](https://github.com/mappum/peer-exchange)
- [uuid](https://github.com/kelektiv/node-uuid)
- wrtc
- :heart:
