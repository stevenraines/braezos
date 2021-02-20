import BaseController from './baseController';
//import MOVE_VECTORS from '../enums/moveVectors';
export default class extends BaseController {
  get player() {
    let player = this.store.state.player;
    return player;
  }

  async setup() {}

  async movePlayer(vector) {
    let cell = this.getPlayerAdjacentCell(vector);

    if (!cell || !this.isCellTraverable(cell)) return;
    await this.store.dispatch('player/movePlayer', {
      location: null,
      position: cell.point,
    });
  }

  getPlayerAdjacentCell(vector) {
    let newPosition = {
      x: vector.x + this.store.state.player.position.x,
      y: vector.y + this.store.state.player.position.y,
      d: vector.z + this.store.state.player.position.d,
    };

    let cell = this.controllers.EnvironmentController.level.getCellByPosition(
      newPosition
    );

    return cell;
  }

  isCellTraverable(cell) {
    if (cell.terrainType.name == 'ocean') return false;
    return true;
  }
}
