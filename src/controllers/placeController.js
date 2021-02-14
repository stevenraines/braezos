//const BaseController = require('./baseController');
import BaseController from './baseController';
//import _ from 'lodash';
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

  get visibleTerrain() {
    let terrain = this.store.state.places.terrain;
    for (let territoryIndex in terrain.territories) {
      terrain.territories[territoryIndex] = this.$generatePlace(
        terrain.territories[territoryIndex]
      );
    }
    return terrain;
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

  getWorldCellPosition(position) {
    let npos = this.normalizePosition(position);
    return [
      Math.floor(
        npos[0] / this.controllers.EnvironmentController.params.moveSize
      ),
      Math.floor(
        npos[1] / this.controllers.EnvironmentController.params.moveSize
      ),
    ];
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
    territory.special = 'special stuff';

    if (territory.id == this.controllers.PlayerController.player.location.id) {
      this.$getTerritoryBoundingBox(territory);
    }
    return territory;
  }
  $getTerritoryBoundingBox(territory) {
    let minX = 99999;
    let minY = 99999;
    let maxX = 0;
    let maxY = 0;
    //let gridSize = this.controllers.EnvironmentController.params.moveSize;

    for (let polygonIndex in territory.polygons) {
      let polygon = this.normalizePosition(territory.polygons[polygonIndex]);

      if (polygon[0] < minX) minX = polygon[0];
      if (polygon[1] < minY) minY = polygon[1];
      if (polygon[0] > maxX) maxX = polygon[0];
      if (polygon[1] > maxY) maxY = polygon[1];
    }

    territory.bounds = [minX, minY, maxX, maxY];

    //console.log(territory);
  }
}
