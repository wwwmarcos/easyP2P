#!/usr/bin/env node

const vorpal = require('vorpal')()
const easyP2P = require('../../')
const p2p = easyP2P({networkId: 'peixe'})

vorpal
  .command('open <port>', 'Open new p2p server')
  .alias('o')
  .action((args, next) => {
    const {port} = args

    p2p.startServer({
      port,
      onConnection: (peer) => {
        vorpal.log('new peer connection')
        peer.write({message: 'welcome'})
      },
      messageHandler: (peer, message) => {
        vorpal.log('new message from peer', message)
      }
    })

    next()
  })

vorpal
  .command('connect <host> <port>', 'Connect to peer')
  .alias('cn')
  .action((args, next) => {
    const {
      port,
      host
    } = args

    p2p.connectToPeer({
      port,
      host,
      messageHandler: (peer, message) => {
        vorpal.log('new message from peer', message)
      },
      onConnection: (connection) => {
        vorpal.log('conected on new peer')
      }
    })

    next()
  })

vorpal
  .command('message <data>', 'new message')
  .alias('m')
  .action((args, next) => {
    p2p.broadcast(args.data)
    next()
  })

vorpal
  .command('list', 'list peers')
  .alias('l')
  .action((args, next) => {
    p2p.getPeers().forEach(peer => vorpal.log(peer.pxpPeer.socket._host))
    next()
  })

vorpal
  .command('discover', 'discover peers')
  .alias('d')
  .action((args, next) => {
    p2p.discoverPeers()
    next()
  })

vorpal
  .delimiter('hi →')
  .show()
