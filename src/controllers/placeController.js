//const BaseController = require('./baseController');
import BaseController from './baseController';
import _ from 'lodash';
import TerrainGenerator from '../classes/terrainGenerator';

export default class extends BaseController {
  constructor(root) {
    super(root);
    this.terrainGenerator = null;
    this.delaunay = null;
    this.voronoi = null;
  }
  async setup(seed) {
    this.terrainGenerator = new TerrainGenerator(
      this.controllers.EnvironmentController.params.terrain
    );
    let terrain = this.terrainGenerator.generateTerrain(
      this.controllers.EnvironmentController.params.terrain.seed || seed
    );

    this.store.commit('places/updateTerrain', terrain);
  }

  get terrain() {
    return this.store.state.places.terrain;
  }
  get territories() {
    return this.store.state.places.terrain.territories;
  }

  territoriesInView() {
    let territories = _.filter(this.store.state.places.terrain.territories, {
      id: this.store.state.player.location.id,
    });
    console.log(territories);
  }

  territory(territoryIndex) {
    return this.$generatePlace(
      this.store.state.places.terrain.territories[territoryIndex]
    );
  }

  isPositionInTerritory(territoryIndex, position) {
    return this.terrainGenerator.voronoi.contains(
      territoryIndex,
      position[0],
      position[1]
    );
  }

  getTerritoryByPosition(position) {
    for (let territoryIndex in this.terrain.territories) {
      if (
        this.isPositionInTerritory(
          this.terrain.territories[territoryIndex].id,
          position
        )
      ) {
        return this.terrain.territories[territoryIndex];
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
  $generatePlace(territory) {
    console.log(territory);
    this.$getTerritoryBoundingBox(territory);
    territory.special = 'special stuff';
    return territory;
  }
  $getTerritoryBoundingBox(territory) {
    console.log(territory);
  }
}
