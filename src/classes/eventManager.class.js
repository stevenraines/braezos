import Base from './base.class';
import * as ROT from 'rot-js';
//import { EventBus } from '../eventbus.js';
export default class EventManager extends Base {
  constructor(config) {
    super(config);

    this._engine = null;
    this._scheduler = null;

    this.setupEvents();
  }

  setupEvents() {
    this._scheduler = new ROT.Scheduler.Simple();
    this._engine = new ROT.Engine(this._scheduler);
  }

  lock() {
    this._engine.lock();
  }

  unlock() {
    this._engine.unlock();
  }

  stop() {
    this._engine = new ROT.Engine(this._scheduler);
  }

  start() {
    this._engine.start();
  }

  registerActor(actor, restart) {
    this._scheduler.add(actor, true);
    this._engine = new ROT.Engine(this._scheduler);

    if (restart) {
      this.start();
    }
  }
}
