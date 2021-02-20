import Point from './point.class';

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
