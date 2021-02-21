import BaseController from './baseController';

import Chunk from '../classes/places/chunk.class';
import params from '../../params.config';
import Player from '../classes/things/actors/player.class';
import Item from '../classes/things/item.class';

export default class extends BaseController {
  constructor(root) {
    super(root);

    this.player = null;
    this.level = null;

    params.cellSize = params.moveSize;
    params.halfCell = params.cellSize / 2;
  }

  async setup() {
    this.player = new Player();
    this.level = this.getLevelByIndex(this.player.position.d);
    if (this.player.position.x == null) {
      this.player.setPosition(this.level.startingCell.position);
    }

    this.store.commit('environment/setParams', params);

    // add default items next to the player
    new Item({
      name: 'Dagger',
      position: this.level.startingCell.position,
    });
  }

  get params() {
    return params;
  }
  getLevelByIndex(levelIndex) {
    let chunk = new Chunk(this.params, this.controllers);
    return chunk.getLevel(levelIndex);
  }
}
