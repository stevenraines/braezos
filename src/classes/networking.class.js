import Peer from 'peerjs';
import { EventBus } from '../eventbus.js';
import _ from 'lodash';
export default class Networking {
  constructor() {
    this.peer = null;

    this.server = null; // client reference to the server we connected to

    this.clients = []; //server reference to connected clients

    this.conn = null;
    this.lastPeerId = null;
    this.status = null;
    this.isHost = false;
  }

  setStatus(status) {
    this.status = status;
  }

  endHosting() {}

  startHosting(serverId) {
    serverId = 'alphabetsoup';
    this.isHost = true;
    this._initializePeer(serverId);
  }
  joinHost(serverToken) {
    this._initializePeer();
    this._initializeClient(serverToken);
  }

  _initializePeer(serverId) {
    // Create own peer object with connection to shared PeerJS server

    this.peer = null;
    this.lastPeerId = null;

    this.peer = new Peer(serverId, {
      debug: 2,
    });

    // USED ON CLIENT & SERVER
    this.peer.on('open', this._peerOpen.bind(this));

    if (this.isHost) {
      this.peer.on('connection', this._peerServerConnection.bind(this));
    } else {
      this.peer.on('connection', this._peerClientConnection.bind(this));
    }
    this.peer.on('disconnected', this._peerDisconnected.bind(this));
    this.peer.on('close', this._peerClose.bind(this));
    this.peer.on('error', this._peerError.bind(this));
  }

  broadcast(msg) {
    for (
      let connectionIndex = 0;
      connectionIndex < this.clients.length;
      connectionIndex++
    ) {
      this.clients[connectionIndex].send(msg);
    }
  }

  send(msg, conn) {
    if (this.isHost && !conn) {
      return this.broadcast(msg);
    }

    if (this.isHost && conn) {
      return conn.send(msg);
    }

    this.server.send(msg);
  }

  /**** START OF PEER CLASS IMPLEMENTATION ****/

  _peerOpen() {}

  _getConnection(conn) {
    let connIndex = _.findIndex(this.clients, function(o) {
      return o.peer == conn.peer;
    });

    if (connIndex == -1) {
      return null;
    }

    return this.clients[connIndex];
  }

  // server receives a connection from a client
  _peerServerConnection(conn) {
    if (!this._getConnection(conn)) {
      this.clients.push(conn);
      this._connOpen(conn);
    }
  }

  _peerClientConnection() {
    /*
    if (this.peer.id === null) {
      this.peer.id = this.lastPeerId;
    } else {
      this.lastPeerId = this.peer.id;
    }
    */
  }

  _peerDisconnected() {
    // Workaround for peer.reconnect deleting previous id
    this.peer.id = this.lastPeerId;
    this.peer._lastServerId = this.lastPeerId;
    this.reconnect();
  }
  _peerClose() {}

  _peerError(err) {
    console.log('_peerError');
    console.log(err);
  }

  _connOpen(conn) {
    if (this.isHost) {
      conn.on('data', this._connServerData);
      conn.on('close', this._connClose.bind(this));

      conn.send('ACK from Server');
    }
  }
  _connClose() {}

  // data received from the client
  _connServerData(data) {
    if (data.event == 'ready') {
      return EventBus.$emit('clientRegister', data.clientId);
    }

    EventBus.$emit('clientData', {
      data: data,
      clientId: this.peer,
    });
    // EventBus.$emit({ data: data });
  }

  _connClientData(data) {
    EventBus.$emit('serverData', { data: data });
  }

  _initializeClient(serverToken) {
    //TODO: something better than guessing the seconds.

    setTimeout(
      function() {
        this.server = this.peer.connect(serverToken.trim());
        this.server.on(
          'open',
          function() {
            this.server.on('data', this._connClientData.bind(this));
            this.server.send({ event: 'ready', clientId: this.server.peer });
          }.bind(this)
        );
      }.bind(this),
      0
    );
  }

  confirmConnection() {}
}
