import Base from './base.class';
import Chunk from '../classes/places/chunk.class';
import * as ROT from 'rot-js';
import { EventBus } from '../eventbus.js';
export default class Environment extends Base {
  constructor(config) {
    super(config);
    this.saveState();
    this._engine = null;
    this._scheduler = null;
    let currentLevel = 0;
    this.level = this.getLevelByIndex(currentLevel);

    this.setupEvents();
    EventBus.$emit('EnvironmentSetupComplete');
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

  registerActor(actor) {
    this._scheduler.add(actor, true);
    this._engine = new ROT.Engine(this._scheduler);
    this._engine.start();
  }

  getLevelByIndex(levelIndex) {
    let chunk = new Chunk(this.config);
    return chunk.getLevel(levelIndex);
  }
}
