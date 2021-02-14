//const BaseController = require('./baseController');
import BaseController from './baseController';
import { Delaunay } from 'd3-delaunay';
export default class extends BaseController {
  constructor(root) {
    super(root);
    this.delaunay = null;
    this.voronoi = null;
  }
  async setup() {
    await this.store.dispatch('places/init');
    this.$initVornoi();
  }

  get places() {
    return this.store.state.places;
  }

  place(id) {
    return this.$generatePlace(this.places.cells[id]);
  }

  isPositionInPlace(placeId, position) {
    return this.voronoi.contains(placeId, position[0], position[1]);
  }

  getPlaceByPosition(position) {
    for (let cell in this.places.cells) {
      if (this.isPositionInPlace(this.places.cells[cell].id, position)) {
        return this.places.cells[cell];
      }
    }

    return null;
  }

  normalizePosition(position) {
    const gridSize = this.controllers.EnvironmentController.params.moveSize;

    let newX = Math.floor(position[0] / gridSize) * gridSize;
    let newY = Math.floor(position[1] / gridSize) * gridSize;
    position = [
      newX < 0 ? -1 : (1 * gridSize) / 2 + newX,
      newY < 0 ? -1 : (1 * gridSize) / 2 + newY,
    ];

    return position;
  }
  $generatePlace(placeData) {
    placeData.special = 'special stuff';
    return placeData;
  }
  $initVornoi() {
    if (!this.delaunay) this.delaunay = Delaunay.from(this.places.points);

    if (!this.voronoi)
      this.voronoi = this.delaunay.voronoi([
        0,
        0,
        this.controllers.EnvironmentController.params.width,
        this.controllers.EnvironmentController.params.height,
      ]);
  }
}
