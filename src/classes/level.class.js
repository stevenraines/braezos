import Cell from './cell.class';
import * as d3 from 'd3';

import TerrainGenerator from './terrainGenerator';
import Renderer from './renderer.class';
const Level = class {
  constructor(levelIndex, chunk) {
    this.levelIndex = levelIndex;
    this.cellSize = chunk.cellSize;
    this.cellWidth = chunk.cellWidth;
    this.cellHeight = chunk.cellHeight;
    this.renderWidth = this.cellWidth * this.cellSize;
    this.renderHeight = this.cellHeight * this.cellSize;
    this.terrainParams = chunk.params.terrain;
    this.cells = [];
    this.terrainPoints = 100;
    this.terrain = {};
    this.terrainGenerator = new TerrainGenerator(this.terrainParams);

    this.renderArea = {
      width: this.renderWidth,
      height: this.renderHeight,
    };
    // generate terrain, if above ground
    if (this.levelIndex == 0) this.$generateTerrain(chunk);

    this.$generateCells(chunk);
  }

  $generateTerrain(chunk) {
    this.terrain = this.terrainGenerator.generateTerrain(chunk.seed);
  }

  // generate cells in this level
  $generateCells(chunk) {
    for (let yPos = 0; yPos < chunk.cellHeight; yPos++) {
      for (let xPos = 0; xPos < chunk.cellWidth; xPos++) {
        let cell = new Cell([xPos, yPos, this.levelIndex], this);

        cell.territoryIndex = this.$getCellTerritoryIndex(cell.worldPosition);
        cell.terrainType = this.terrain.territories[
          cell.territoryIndex
        ].terrainType;

        this.cells.push(cell.data);
        cell = null;
      }
    }
  }

  $getCellTerritoryIndex(worldPosition) {
    for (let territoryIndex in this.terrain.territories) {
      if (
        this.terrainGenerator.voronoi.contains(
          this.terrain.territories[territoryIndex].id,
          worldPosition.x,
          worldPosition.y
        )
      ) {
        return parseInt(territoryIndex);
      }
    }
  }

  cellsOnScreen(position, renderArea) {
    let renderAreaWidthInCells = renderArea.width / this.cellSize;
    let renderAreaHeightInCells = renderArea.height / this.cellSize;

    let startX = position.x - renderAreaWidthInCells / 2;
    let startY = position.y - renderAreaHeightInCells / 2;

    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;

    let data = {
      startX: startX,
      startY: startY,
      endX: startX + renderAreaWidthInCells,
      endY: startY + renderAreaHeightInCells,
    };

    if (data.endX >= this.cellWidth) {
      data.endX = this.cellWidth - 1;
      data.startX = this.cellWidth - 1 - renderAreaWidthInCells;
    }

    if (data.endY >= this.cellHeight) {
      data.endY = this.cellHeight - 1;
      data.startY = this.cellHeight - 1 - renderAreaHeightInCells;
    }

    return data;
  }

  renderLevelAsImgSrc(playerPosition, renderArea) {
    let svg = btoa(this.renderLevel(playerPosition, renderArea));
    return `data:image/svg+xml;base64,${svg}`;
  }
  renderLevel(playerPosition, renderArea) {
    let levelSvg = d3
      .create('svg')
      .attr('id', 'map')
      .attr('stroke', '#000000');

    levelSvg.append('g');

    let onscreenCells = this.cellsOnScreen(playerPosition, renderArea);
    let renderer = new Renderer(this.cellSize);
    let cellsToRender = [];

    for (let yPos = onscreenCells.startY; yPos <= onscreenCells.endY; yPos++) {
      for (
        let xPos = onscreenCells.startX;
        xPos <= onscreenCells.endX;
        xPos++
      ) {
        let cellIndex = yPos * this.cellWidth + xPos;
        cellsToRender.push(cellIndex);
      }
    }

    for (let cellIndex = 0; cellIndex < cellsToRender.length; cellIndex++) {
      renderer.renderCell(levelSvg, this.cells[cellsToRender[cellIndex]]);
    }

    renderer.renderPlayer(levelSvg, playerPosition);

    if (renderArea) this.renderArea = renderArea;
    this.scrollToPlace(levelSvg, playerPosition);

    return this.serializeSVG(levelSvg.node());
  }
  serializeSVG(d3Node) {
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(d3Node);

    return source;
  }
  scrollToPlace(svg, position) {
    let width = this.renderArea.width; // drawDistanceCells * 2 * this.cellSize;
    let height = this.renderArea.height; //drawDistanceCells * 2 * this.cellSize;

    let startX = position.x * this.cellSize - width / 2;
    let startY = position.y * this.cellSize - height / 2;

    if (!startX) startX = 0;
    if (!startY) startY = 0;
    let viewBoxSize = `${startX} ${startY} ${width} ${height}`;

    svg.attr('viewBox', viewBoxSize);
  }
};

export default Level;
