import Base from '../../server/classes/base.class';
import Chunk from '../classes/places/chunk.class';

import { EventBus } from '../eventbus.js';
export default class Environment extends Base {
  constructor(config) {
    super(config);

    this.turns = this.turn ? this.turns : 0;
    this.name = 'environment';

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
    this.turns += 1;

    try {
      EventBus.$emit('RenderLevel');
    } catch (ex) {
      console.log(ex);
    }
    // EventBus.$emit('RenderLevel');
  }
}
