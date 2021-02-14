import BaseController from './baseController';
export default class extends BaseController {
  get player() {
    return this.store.state.player;
  }

  async setup() {
    if (!this.store.state.player) {
      let place = this.controllers.PlaceController.place(
        this.store.state.places.startingCellIndex
      );
      this.movePlayerToLocation(place);
    }
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

    let newLocation = this.controllers.PlaceController.getPlaceByPosition(
      newPosition
    );

    if (this.isPlaceTraversable(newLocation)) {
      await this.store.dispatch('player/movePlayer', {
        location: newLocation,
        position: newPosition,
      });
    }
  }

  async movePlayerToPlaceId(id) {
    let location = this.controllers.PlaceController.place(id);
    this.movePlayerToLocation(location);
  }

  async movePlayerToLocation(location) {
    await this.store.dispatch('player/movePlayer', {
      location: location,
      position: this.controllers.PlaceController.normalizePosition(
        location.point
      ),
    });
  }
}