import BaseController from './baseController';
import MOVE_VECTORS from '../enums/moveVectors';
export default class extends BaseController {
  get player() {
    return this.store.state.player;
  }

  async setup() {
    if (!this.store.state.player.location) {
      await this.movePlayerToTerritory(
        this.store.state.places.terrain.startingTerrainIndex
      );
    }

    let item1 = {
      id: 1,
      name: 'Dagger',
      cell: this.getPlayerAdjacentCell(MOVE_VECTORS.E),
    };
    let item2 = {
      id: 2,
      name: 'Shield',
      cell: this.getPlayerAdjacentCell(MOVE_VECTORS.E),
    };

    this.controllers.ItemsController.addItem(item1);
    this.controllers.ItemsController.addItem(item2);
    console.log(
      this.controllers.ItemsController.getItemsInCells([
        this.getPlayerAdjacentCell(MOVE_VECTORS.E),
        this.getPlayerAdjacentCell(MOVE_VECTORS.W),
      ])
    );
  }

  get currentLocation() {
    return this.store.state.player.location;
  }

  isPlaceTraversable(place) {
    if (place.terrainType.name == 'ocean') {
      return false;
    }
    return true;
  }

  async movePlayer(vector) {
    let fullVector = vector.map(
      x => x * this.store.state.environment.params.moveSize
    );

    let newPosition = [
      this.store.state.player.position[0],
      this.store.state.player.position[1],
    ];

    newPosition[0] += fullVector[0];
    newPosition[1] += fullVector[1];

    newPosition = this.controllers.PlaceController.normalizePosition(
      newPosition
    );

    let newLocation = this.controllers.PlaceController.getTerritoryByPosition(
      newPosition
    );

    if (this.isPlaceTraversable(newLocation)) {
      await this.store.dispatch('player/movePlayer', {
        location: newLocation,
        position: newPosition,
      });
    }
  }

  getPlayerAdjacentCell(moveVector) {
    return [
      this.playerWorldCell[0] + moveVector[0],
      this.playerWorldCell[1] + moveVector[1],
    ];
  }

  get playerWorldCell() {
    let playerWorldCell = this.controllers.PlaceController.getWorldCellPosition(
      this.store.state.player.position
    );

    return playerWorldCell;
  }

  get viewArea() {
    let playerPos = this.store.state.player.position;
    let playerViewDistance =
      this.store.state.player.viewDistance *
      this.controllers.EnvironmentController.params.cellSize;

    let minX = playerPos[0] - playerViewDistance;
    let minY = playerPos[1] - playerViewDistance;
    let maxX = playerPos[0] + playerViewDistance;
    let maxY = playerPos[1] + playerViewDistance;

    let minPos = this.controllers.PlaceController.normalizePosition([
      minX,
      minY,
    ]);
    let maxPos = this.controllers.PlaceController.normalizePosition([
      maxX,
      maxY,
    ]);

    return [minPos[0], minPos[1], maxPos[0], maxPos[1]];
  }

  async movePlayerToTerritory(id) {
    let location = this.controllers.PlaceController.territory(id);

    this.movePlayerToTerritoryByLocation(location);
  }

  async movePlayerToTerritoryByLocation(location) {
    await this.store.dispatch('player/movePlayer', {
      location: location,
      position: this.controllers.PlaceController.normalizePosition(
        location.point
      ),
    });
  }
}
