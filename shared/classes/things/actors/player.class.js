const Actor = require('../actor.class');

//import { EventBus } from '../../../eventbus.js';
module.exports = class Player extends Actor {
  constructor(config, world) {
    super(config, world);
    this.__socket = null;
    this.keyQueue = null;
    this.viewRadius = 8;
  }

  async initialize() {
    await super.initialize();
    if (!this.position) this.position = this.world.getStartPosition();
  }

  sendMessage(type, data) {
    if (this.__socket) return this.__socket.emit(type, data);
    console.warning('Socket does not exist');
  }

  move(request) {
    super.move(request);
    this.sendMessage(
      `message`,
      `player moved to ${JSON.stringify(request.position)}`
    );
  }

  /*
  handleEvent(e) {
    // process user input 

    // if we are on a text area, do nothing.
    if (e.srcElement.tagName == 'TEXTAREA' || e.srcElement.tagName == 'INPUT') {
      return;
    }

    // if this isn't a valid command key, do nothing
    if (!Input.validActionKey(e.key)) return;

    if (e.type == 'keydown') {
      if (!this.keyQueue) this.keyQueue = [];
      this.keyQueue.push(e.key);
      window.addEventListener('keyup', this);
    }

    if (e.type == 'keyup') {
      window.removeEventListener('keyup', this);
      window.removeEventListener('keydown', this);

      Input.handleKeys(this.keyQueue, e);
      this.keyQueue = null;

      // this needs to wait until we are done doing whatever actioon we are doing so you
      // can't move around while in a dialog
      window.GameEngine.EventManager.unlock();
    }
  }

  */
  static getUsersPlayer() {
    let players = Actor.filter({ name: 'player1' }, 'actor');
    if (players.length == 1) {
      let player = new Player(players[0]);
      player.save();

      return player;
    }

    return null;
  }
};
