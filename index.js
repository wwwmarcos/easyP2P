const defaultWrtc = require('wrtc')
const Exchange = require('peer-exchange')
const net = require('net')
const uuid = require('uuid/v4')

const EasyP2P = ({networkId = uuid(), wrtc = defaultWrtc} = {}) => {
  const p2p = new Exchange(networkId, {wrtc})
  const peers = []

  const startServer = ({port, onConnection, messageHandler}) => {
    net.createServer(socket => p2p.accept(socket, (err, connection) => {
      if (err) throw err
      onConnection(connection)
      initConnection({connection, messageHandler})
    })).listen(port)
  }

  const connectToPeer = ({host, port, onConnection, messageHandler}) => {
    const socket = net.connect(port, host, () => p2p.connect(socket, (err, connection) => {
      if (err) throw err
      if (onConnection) onConnection(connection)
      initConnection({connection, messageHandler})
    }))
  }

  const discoverPeers = () => {
    p2p.getNewPeer((err) => {
      if (err) throw err
    })
  }

  const initConnection = ({connection, messageHandler}) => {
    peers.push(connection)
    initMessageHandler({connection, messageHandler})
    initErrorHandler(connection)
  }

  const initMessageHandler = ({connection, messageHandler}) => {
    connection.on('data', data => {
      const message = JSON.parse(data.toString('utf8'))
      messageHandler(connection, message)
    })
  }

  const initErrorHandler = (connection) => {
    connection.on('error', error => console.log(`❗  ${error}`))
  }

  const getPeers = () => {
    return peers
  }

  const broadcast = (message) => {
    peers.forEach(peer => peer.write(JSON.stringify(message)))
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
