const Renderer = class Renderer {
  constructor(cellSize) {
    this.cellSize = cellSize;
  }

  renderBackground(svg, width, height) {
    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#000000');
  }

  renderCell(svg, cell, player) {
    if (!cell.visibleFrom(player.position, player.viewDistance)) return;

    svg
      .append('rect')
      .attr('x', cell.worldPosition.x - cell.cellSize)
      .attr('y', cell.worldPosition.y - cell.cellSize)
      .attr('width', cell.cellSize)
      .attr('height', cell.cellSize)
      .attr('fill', cell.terrainType.color)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 0.1)
      .attr('stroke', 'blue');
  }
  renderCellItems(svg, items) {
    if (items.length > 0) {
      svg.append('g');

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        this.renderAscii(svg, 'I', items[itemIndex].position);
      }
    }
  }

  renderPlayer(svg, player) {
    this.renderAscii(svg, '@', player.position);
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
    let worldPosition = this.getCenterCellPositionForRender(position);
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
  // gets the middle
  getCenterCellPositionForRender(position) {
    return {
      x: position.x * this.cellSize + this.cellSize / 2,
      y: position.y * this.cellSize + this.cellSize / 2,
    };
  }
};

export default Renderer;
