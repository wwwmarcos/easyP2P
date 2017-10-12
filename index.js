const defaultWrtc = require('wrtc')
const Exchange = require('peer-exchange')
const net = require('net')
const uuid = require('uuid/v4')

const EasyP2P = ({networkId = uuid(), wrtc = defaultWrtc} = {}) => {
  const p2p = new Exchange(networkId, {wrtc})
  const peers = []

  const getPeers = () => {
    return peers
  }

  const startServer = ({port, messageHandler, onConnection}) => {
    const server = net.createServer(socket => p2p.accept(socket, (err, connection) => {
      if (err) throw err
      onConnection({connection})
      initConnection({connection, messageHandler})
    }))
    .listen(port)

    return server
  }

  const connectToPeer = ({host, port, messageHandler}) => {
    const socket = net.connect(port, host, () => p2p.connect(socket, (err, connection) => {
      if (err) throw err
      initConnection({connection, messageHandler})
    }))

    return socket
  }

  const discoverPeers = () => {
    p2p.getNewPeer()
  }

  const initConnection = ({connection, messageHandler}) => {
    getPeers().push(connection)
    connection.on('data', data => {
      const message = JSON.parse(data.toString('utf8'))
      messageHandler(connection, message)
    })
  }

  const broadcast = (message) => {
    getPeers().forEach(peer => peer.write(JSON.stringify(message)))
  }

  return {
    startServer,
    connectToPeer,
    discoverPeers,
    getPeers,
    broadcast
  }
}

module.exports = EasyP2P
