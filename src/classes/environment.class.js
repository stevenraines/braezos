import Base from './base.class';
import Chunk from '../classes/places/chunk.class';

import { EventBus } from '../eventbus.js';
export default class Environment extends Base {
  constructor(config) {
    super(config);

    this.turns = this.turn ? this.turns : 0;
    this.name = 'environment';
    this.saveState();

    let currentLevel = 0;
    this.level = this.getLevelByIndex(currentLevel);

    EventBus.$emit('EnvironmentSetupComplete');
  }

  getLevelByIndex(levelIndex) {
    let chunk = new Chunk(this.config);
    return chunk.getLevel(levelIndex);
  }

  // perform the per turn actions of the environment. should be first thing registered
  act() {
    console.log(`the environment's turn`);
    this.turns += 1;
    this.saveState();
  }

  register() {
    console.log(`registering ${this.name}`, this);
    window.GameEngine.EventManager.registerActor(this);
  }
}
