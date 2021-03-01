import Base from './base.class';
import Chunk from '../classes/places/chunk.class';
import { EventBus } from '../eventbus.js';
export default class Environment extends Base {
  constructor(config) {
    super(config);
    this.saveState();

    let currentLevel = 0;
    this.level = this.getLevelByIndex(currentLevel);

    /*
    if (this.engine.Player.position.x == null) {
      this.engine.Player.setPosition(this.level.startingCell);
    }

    // add default items next to the player
    new Item({
      name: 'Dagger',
      position: this.level.startingCell.position,
    }).save();
    new Item({
      name: 'Cloak',
      position: this.level.startingCell.position,
    }).save();
    */

    console.log('send done');
    EventBus.$emit('EnvironmentSetupComplete');
  }

  getLevelByIndex(levelIndex) {
    let chunk = new Chunk(this.config);
    return chunk.getLevel(levelIndex);
  }
}
