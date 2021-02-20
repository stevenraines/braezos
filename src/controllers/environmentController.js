import BaseController from './baseController';

import Chunk from '../classes/chunk.class';
import params from '../../params.config';
export default class extends BaseController {
  constructor(root) {
    super(root);

    this.level = null;

    params.cellSize = params.moveSize;
    params.halfCell = params.cellSize / 2;
  }
  async setup() {
    let playerPosition = this.controllers.PlayerController.player.position;

    this.level = this.getLevelByIndex(playerPosition.d);

    if (playerPosition.x == null) {
      this.store.commit(
        'player/updatePlayerPosition',
        this.level.startingCell.point
      );
    }

    this.store.commit('environment/setParams', params);
  }
  get params() {
    return params;
  }
  getLevelByIndex(levelIndex) {
    let chunk = new Chunk(this.params);
    return chunk.getLevel(levelIndex);
  }
}
