import Base from './base.class';
import Chunk from '../classes/places/chunk.class';
import Item from '../classes/things/item.class';

export default class Environment extends Base {
  constructor(config) {
    super(config);
    this.saveState();
    this.level = this.getLevelByIndex(this.engine.Player.position.d);

    if (this.engine.Player.position.x == null) {
      this.engine.Player.setPosition(this.level.startingCell.position);
    }

    // add default items next to the player
    new Item({
      name: 'Dagger',
      position: this.level.startingCell.position,
    });
  }

  getLevelByIndex(levelIndex) {
    let chunk = new Chunk(this.config);
    return chunk.getLevel(levelIndex);
  }
}
