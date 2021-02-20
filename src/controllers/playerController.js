import BaseController from './baseController';
//import MOVE_VECTORS from '../enums/moveVectors';
export default class extends BaseController {
  get player() {
    let player = this.store.state.player;
    return player;
  }

  async setup() {}

  async movePlayer(vector) {
    if (Array.isArray(vector)) {
      vector = {
        x: vector[0],
        y: vector[1],
        d: vector[2] || 0,
      };
    }

    let newPosition = {
      x: vector.x + this.store.state.player.position.x,
      y: vector.y + this.store.state.player.position.y,
      d: vector.z + this.store.state.player.position.d,
    };

    await this.store.dispatch('player/movePlayer', {
      location: null,
      position: newPosition,
    });
  }

  getPlayerAdjacentCell(moveVector) {
    return [
      this.playerWorldCell.x + moveVector.x,
      this.playerWorldCell.y + moveVector.y,
    ];
  }
}
