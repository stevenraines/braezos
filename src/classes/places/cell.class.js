import Point from '../helpers/point.class';

const Cell = class Cell {
  constructor(coordinates, level) {
    this.position = new Point(coordinates);
    this.cellSize = level.cellSize;
    this.territoryIndex = null;
    this.terrainType = { name: 'none', color: 'black' };
    this.worldPosition = this.$getWorldPosition();
  }

  get data() {
    return {
      position: this.position,
      cellSize: this.cellSize,
      territoryIndex: this.territoryIndex,
      terrainType: this.terrainType,
      worldPosition: this.worldPosition,
    };
  }

  isCellTraverable(actor) {
    // determine if the rules for the given player allow traversal
    if (!actor) return false;

    if (this.terrainType.name == 'ocean') return false;

    return true;
  }

  // returns if the cell is visible from the selected position?
  visibleFrom(position, sightDistance) {
    // is it close enough?

    let distance = this.position.distanceFromInCells(position) + 0.5;

    if (distance >= sightDistance + 1) return false; // add one so we don't include the cell the player is on.
    // is anything blocking it?

    return true;
  }

  $getWorldPosition() {
    //let halfCell = this.cellSize / 2;
    return {
      x: this.position.x * this.cellSize + this.cellSize,
      y: this.position.y * this.cellSize + this.cellSize,
      d: this.position.d,
    };
  }
};

export default Cell;
