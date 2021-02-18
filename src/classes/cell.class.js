import Point from './point.class';

const Cell = class {
  constructor(coordinates, level) {
    this.point = new Point(coordinates);
    this.cellSize = level.cellSize;
    this.territoryIndex = null;
    this.terrainType = { name: 'none', color: 'black' };
    this.worldPosition = this.$getWorldPosition();
  }

  get position() {
    return this.point;
  }

  renderCell(svg) {
    svg
      .append('rect')
      .attr('x', this.worldPosition.x)
      .attr('y', this.worldPosition.y)
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', this.terrainType.color)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 0.1)
      .attr('stroke', 'blue');
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
