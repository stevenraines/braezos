import * as d3 from 'd3';
import _ from 'lodash';

import Renderer from '../renderer.class';
import Cell from './cell.class';
import TerrainGenerator from '../terrainGenerator.class';

const Level = class {
  constructor(levelIndex, chunk) {
    this.levelIndex = levelIndex;
    this.controllers = chunk.controllers;
    this.cellSize = chunk.cellSize;
    this.cellWidth = chunk.cellWidth;
    this.cellHeight = chunk.cellHeight;
    this.renderWidth = this.cellWidth * this.cellSize;
    this.renderHeight = this.cellHeight * this.cellSize;
    this.terrainParams = chunk.params.terrain;
    this.cells = [];
    this.terrainPoints = 100;
    this.terrain = {};
    this.startingCell = null;
    this.terrainGenerator = new TerrainGenerator(this.terrainParams);

    this.setRenderArea({
      width: this.renderWidth,
      height: this.renderHeight,
    });

    // generate terrain, if above ground
    if (this.levelIndex == 0) this.$generateTerrain(chunk);

    this.$generateCells(chunk);
  }

  setRenderArea(renderArea) {
    if (renderArea.width % this.cellSize == 0) {
      renderArea.width += this.cellSize;
    }
    if (renderArea.height % this.cellSize == 0) {
      renderArea.height += this.cellSize;
    }

    this.renderArea = renderArea;
  }

  $generateTerrain(chunk) {
    this.terrain = this.terrainGenerator.generateTerrain(chunk.seed);
  }

  // generate cells in this level
  $generateCells(chunk) {
    for (let yPos = 0; yPos < chunk.cellHeight; yPos++) {
      for (let xPos = 0; xPos < chunk.cellWidth; xPos++) {
        let cell = new Cell({ x: xPos, y: yPos, d: this.levelIndex }, this);

        cell.territoryIndex = this.$getCellTerritoryIndex(cell.worldPosition);
        cell.terrainType = this.terrain.territories[
          cell.territoryIndex
        ].terrainType;

        if (
          !this.startingCell &&
          this.terrain.startingTerrainIndex == cell.territoryIndex
        ) {
          this.startingCell = cell;
        }

        this.cells.push(cell);
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

  renderLevelAsImgSrc(player, renderArea) {
    let svg = btoa(this.renderLevel(player, renderArea));
    return `data:image/svg+xml;base64,${svg}`;
  }
  renderLevel(player, renderArea) {
    let renderer = new Renderer(this.cellSize);
    let levelSvg = d3.create('svg').attr('id', 'map');

    renderer.renderBackground(levelSvg, this.renderWidth, this.renderHeight);

    levelSvg.append('g');

    let onscreenCells = this.cellsOnScreen(player.position, renderArea);

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

    let cellList = [];
    for (let cellIndex = 0; cellIndex < cellsToRender.length; cellIndex++) {
      let cell = this.cells[cellsToRender[cellIndex]];
      cellList.push(cell);
      renderer.renderCell(levelSvg, cell, player);
    }

    renderer.renderCellItems(
      levelSvg,
      this.controllers.ItemsController.getItemsInCells(cellList)
    );

    // render the player's icoon on screen
    renderer.renderPlayer(levelSvg, player);

    // render what the player can see.

    if (renderArea) this.setRenderArea(renderArea);
    this.scrollToPlace(levelSvg, player.position);

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

    let startX = position.x * this.cellSize - width / 2 + this.cellSize / 2;
    let startY = position.y * this.cellSize - height / 2 + this.cellSize / 2;

    if (startX + width > this.renderWidth)
      startX = this.renderWidth - width + this.cellSize / 2;
    if (startY + height > this.renderWidth)
      startY = this.renderHeight - height + this.cellSize / 2;

    if (!startX || startX < 0) startX = 0;
    if (!startY || startY < 0) startY = 0;

    let viewBoxSize = `${startX} ${startY} ${width} ${height}`;

    this.viewBox = {
      startX: startX,
      startY: startY,
      width: width,
      height: height,
    };

    svg.attr('viewBox', viewBoxSize);
  }

  getCellByPosition(cellPosition) {
    let cells = _.filter(this.cells, function(cell) {
      if (!cell.position) return false;
      return (
        cell.position.x == cellPosition.x && cell.position.y == cellPosition.y
      );
    });

    if (cells.length == 1) return cells[0];
    return null;
  }

  getCellByWorldPosition(worldPosition) {
    let cellPosition = this.getCellPositionByWorldPosition(worldPosition);
    let cells = _.filter(this.cells, function(cell) {
      if (!cell.position) return false;
      return (
        cell.position.x == cellPosition.x && cell.position.y == cellPosition.y
      );
    });

    if (cells.length == 1) return cells[0];
    return null;
  }

  getCellPositionByWorldPosition(worldPosition) {
    let cellCoordinates = {
      x: Math.floor(worldPosition.x / this.cellSize),
      y: Math.floor(worldPosition.y / this.cellSize),
    };
    return cellCoordinates;
  }
};

export default Level;
