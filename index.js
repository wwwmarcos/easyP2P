const wrtc = require('wrtc')
const Exchange = require('peer-exchange')
const net = require('net')

const NETWORK_ID = 'p2p'

const p2p = new Exchange(NETWORK_ID, { wrtc: wrtc })
const peers = []

function getPeers () {
  return peers
}

function startServer ({port, messageHandler, onConnection}) {
  net
    .createServer(socket => p2p.accept(socket, (err, connection) => {
      if (err) throw err
      onConnection({connection})
      initConnection({connection, messageHandler})
    }))
    .listen(port)
}

function connectToPeer ({host, port, messageHandler}) {
  const socket = net.connect(port, host, () => p2p.connect(socket, (err, connection) => {
    if (err) throw err
    initConnection({connection, messageHandler})
  }))
}

function discoverPeers () {
  p2p.getNewPeer()
}

function initConnection ({connection, messageHandler}) {
  getPeers().push(connection)
  connection.on('data', data => {
    const message = JSON.parse(data.toString('utf8'))
    messageHandler(connection, message)
  })
}

function broadcast (message) {
  getPeers().forEach(peer => peer.write(JSON.stringify(message)))
}

module.exports = {
  startServer,
  connectToPeer,
  discoverPeers,
  getPeers,
  broadcast
}
