import Point from './point.class';
import MathHelper from '../helpers/math';

const Cell = class {
  constructor(coordinates, level) {
    this.point = new Point(coordinates);
    this.cellSize = level.cellSize;
    this.territoryIndex = null;
    this.terrainType = { name: 'none', color: 'black' };
    this.worldPosition = this.$getWorldPosition();
  }

  get data() {
    return {
      point: this.point,
      cellSize: this.cellSize,
      territoryIndex: this.territoryIndex,
      terrainType: this.terrainType,
      worldPosition: this.worldPosition,
    };
  }
  get position() {
    return this.point;
  }

  // returns if the cell is visible from the selected position?
  visibleFrom(position, sightDistance) {
    // is it close enough?
    let distance = MathHelper.calculate2DDistance(this.point, position);

    if (distance > sightDistance) return false;
    // is anything blocking it?

    return true;
  }

  $getWorldPosition() {
    let halfCell = this.cellSize / 2;
    return {
      x: this.point.x * this.cellSize + halfCell,
      y: this.point.y * this.cellSize + halfCell,
      d: this.point.d,
    };
  }
};

export default Cell;
