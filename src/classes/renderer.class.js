const Renderer = class {
  constructor(cellSize) {
    this.cellSize = cellSize;
  }

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
  renderPlayer(svg, playerPosition) {
    this.renderAscii(svg, '@', playerPosition);
  }

  renderAscii(
    svg,
    character,
    position,
    strokeColor,
    fillColor,
    cssClass,
    opacity
  ) {
    let worldPosition = this.getWorldPositionFromWorldCellPosition(position);
    let g = svg.append('g');
    let text = g.append('text');
    text
      .attr('x', worldPosition.x)
      .attr('y', worldPosition.y)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('opacity', opacity || 1)
      .attr('class', cssClass || '')
      .attr('stroke', strokeColor || 'black')
      .attr('fill', fillColor || strokeColor || '')
      .text(character);
  }
  getWorldPositionFromWorldCellPosition(position) {
    return {
      x: position.x * this.cellSize + this.cellSize,
      y: position.y * this.cellSize + this.cellSize,
    };
  }
};

export default Renderer;
