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
    if (!this.position) {
      this.isNew = true;
      this.position = this.world.getStartPosition();
    } else {
      this.isNew = false;
    }
    this.save();
  }

  sendMessage(type, data) {
    if (this.__socket) return this.__socket.emit(type, data);
    console.warn('Socket does not exist');
  }

  move(request) {
    super.move(request);
    this.sendMessage(
      `message`,
      `player moved to ${JSON.stringify(request.position)}`
    );
  }
};
