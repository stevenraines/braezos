import Peer from 'peerjs';
//import EventBus from '../eventbus';
import _ from 'lodash';
export default class Networking {
  constructor() {
    this.peer = null;

    this.connections = [];

    this.conn = null;
    this.lastPeerId = null;
    this.status = null;
    this.isHost = false;
  }

  setStatus(status) {
    // console.log('status', status);
    this.status = status;
  }

  startHosting(serverId) {
    serverId = 'alphabetsoup';
    //  console.log('startHosting: ' + serverId);

    this.isHost = true;
    this._initializePeer(true, serverId);
  }

  endHosting() {}

  joinHost(serverToken) {
    // console.log('joinHost: ' + serverToken);
    this._initializePeer();
    this._initializeClient(serverToken);
  }

  broadcast(msg) {
    for (
      let connectionIndex = 0;
      connectionIndex < this.connections.length;
      connectionIndex++
    ) {
      this.connections[connectionIndex].send(msg);
    }
  }

  send(msg, conn) {
    if (!conn) return this.broadcast(msg);
    conn.send(msg);
    console.log('sent: ' + msg + ' to ' + conn.id);
  }

  /**** START OF PEER CLASS IMPLEMENTATION ****/

  _peerOpen() {
    // console.log('_peerOpen');
    // console.log('ID: ' + this.peer.id);
  }

  _getConnection(conn) {
    let connIndex = _.indexOf(this.connections, { id: conn.id });

    if (connIndex == -1) return null;
    return this.connections[connIndex];
  }

  _peerServerConnection(conn) {
    // console.log('_peerServerConnection');

    if (!this._getConnection(conn)) {
      conn.on('data', this._connServerData.bind(this));
      this.connections.push(conn);
    }

    // console.log('Connected to: ' + this.conn.peer);
    // console.log('Server Id: ' + this.peer.id);
  }

  _peerClientConnection() {
    // console.log('_peerClientConnection');
    if (this.peer.id === null) {
      console.log('Received null id from peer open');
      this.peer.id = this.lastPeerId;
    } else {
      this.lastPeerId = this.peer.id;
    }
    // console.log('Client Id: ' + this.peer.id);
  }

  _peerDisconnected() {
    // console.log('_peerDisconnected');

    // Workaround for peer.reconnect deleting previous id
    this.peer.id = this.lastPeerId;
    this.peer._lastServerId = this.lastPeerId;
    this.reconnect();
  }
  _peerClose() {
    // console.log('_peerClose');
    // console.log('Connection destroyed');
  }

  _peerError(err) {
    console.log('_peerError');
    console.log(err);
  }

  _initializePeer(isHost, serverId) {
    // Create own peer object with connection to shared PeerJS server
    // console.log('_initializePeer');

    this.peer = null;
    this.lastPeerId = null;

    this.peer = new Peer(serverId, {
      debug: 2,
    });

    // USED ON CLIENT & SERVER
    this.peer.on('open', this._peerOpen.bind(this));

    if (this.isHost) {
      //console.log('setting up connection handler for server');
      this.peer.on('connection', this._peerServerConnection.bind(this));
    } else {
      // console.log('setting up connection handler for client');
      this.peer.on('connection', this._peerClientConnection.bind(this));
    }

    this.peer.on('disconnected', this._peerDisconnected.bind(this));
    this.peer.on('close', this._peerClose.bind(this));
    this.peer.on('error', this._peerError.bind(this));
  }

  _connOpen(conn) {
    //console.log('_connOpen', conn);
    //console.log('Connected to: ' + conn.peer);

    if (this.isHost) {
      conn.on('data', this._connServerData.bind(this));
      conn.on('close', this._connClose.bind(this));

      conn.send('ACK', conn);

      if (!this._getConnection(conn)) {
        this.connections.push(conn);
      }
    } else {
      //  this.conn.on('data', this._connClientData.bind(this));
    }
  }
  _connClose() {
    //console.log('_connClose', conn);
    //console.log('Connection Closed');
  }

  _connServerData(data) {
    console.log('Server Received Data', data);

    // EventBus.$emit({ data: data });
  }

  _connClientData(data) {
    console.log('Client received Data', data);
  }

  _initializeClient(serverToken) {
    // console.log('_initializeClient', serverToken);

    //TODO: something better than guessing the seconds.
    setTimeout(
      function() {
        let conn = this.peer.connect(serverToken.trim());

        //  console.log('conn', this.conn);
        conn.on('open', this._connOpen.bind(this));

        conn.on('data', this._connClientData.bind(this));

        conn.send('ACK from Server', conn);
        if (!this._getConnection(conn)) this.connections.push(conn);
      }.bind(this),
      2000
    );
  }

  confirmConnection() {}
}
