//const BaseController = require('./baseController');
import BaseController from './baseController';
//import _ from 'lodash';
import TerrainGenerator from '../classes/terrainGenerator';
import MathHelper from '../helpers/math';

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
  loopThroughBox(range, fn) {
    for (
      let x = range[0];
      x <= range[2];
      x += this.controllers.EnvironmentController.params.cellSize
    ) {
      for (
        let y = range[1];
        y <= range[3];
        y += this.controllers.EnvironmentController.params.cellSize
      ) {
        fn(x, y);
      }
    }
  }

  get visibleTerrain() {
    let viewArea = this.controllers.PlayerController.viewArea;

    let terrain = {
      mapCenter: this.store.state.places.terrain.mapCenter,
      territories: Array(this.store.state.places.terrain.territories.length),
      startingTerrainIndex: this.store.state.places.terrain
        .startingTerrainIndex,
      peaks: this.store.state.places.terrain.peaks,
    };

    for (let territoryIndex in this.store.state.places.terrain.territories) {
      if (terrain.territories[territoryIndex] == null) {
        terrain.territories[territoryIndex] = this.$generatePlace(
          this.store.state.places.terrain.territories[territoryIndex]
        );
        terrain.territories[territoryIndex].cells = [];
      }
    }

    let that = this;
    let halfGridSize = this.controllers.EnvironmentController.params.halfCell;
    this.loopThroughBox(viewArea, function(x, y) {
      let playerDistanceToCell = MathHelper.calculate2DDistance(
        { x: x, y: y },
        {
          x: that.controllers.PlayerController.player.position[0],
          y: that.controllers.PlayerController.player.position[1],
        }
      );

      if (
        playerDistanceToCell >
        that.controllers.PlayerController.player.viewDistance *
          that.controllers.EnvironmentController.params.cellSize +
          halfGridSize
      )
        return;

      let cellTerritory = that.getTerritoryByPosition([x, y]);

      terrain.territories[cellTerritory.id].cells.push(
        that.getWorldCellPosition([x + halfGridSize, y + halfGridSize])
      );
    });

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
        npos[0] / this.controllers.EnvironmentController.params.cellSize
      ),
      Math.floor(
        npos[1] / this.controllers.EnvironmentController.params.cellSize
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
    const gridSize = this.controllers.EnvironmentController.params.cellSize;

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

    if (
      this.controllers.PlayerController.player.location &&
      territory.id == this.controllers.PlayerController.player.location.id
    ) {
      this.$getTerritoryBoundingBox(territory);
    }

    return territory;
  }
  $getTerritoryBoundingBox(territory) {
    let minX = 99999;
    let minY = 99999;
    let maxX = 0;
    let maxY = 0;

    for (let polygonIndex in territory.polygons) {
      let polygon = this.normalizePosition(territory.polygons[polygonIndex]);

      if (polygon[0] < minX) minX = polygon[0];
      if (polygon[1] < minY) minY = polygon[1];
      if (polygon[0] > maxX) maxX = polygon[0];
      if (polygon[1] > maxY) maxY = polygon[1];
    }

    territory.bounds = [minX, minY, maxX, maxY];
  }
}
