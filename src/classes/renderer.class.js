const Renderer = class {
  constructor() {}

  renderCell(svg, cell) {
    svg
      .append('rect')
      .attr('x', cell.worldPosition.x)
      .attr('y', cell.worldPosition.y)
      .attr('width', cell.cellSize)
      .attr('height', cell.cellSize)
      .attr('fill', cell.terrainType.color)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 0.1)
      .attr('stroke', 'blue');
  }
};

export default Renderer;
