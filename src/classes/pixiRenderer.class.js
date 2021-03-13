import * as PIXI from 'pixi.js';
import Biomes from './places/biomes.class';
//import _ from 'lodash';
export default class PIXIRenderer {
  constructor(el, params) {
    if (!el) return;
    this.el = el;
    this.params = params || {
      antialias: false,
      transparent: false,
      resolution: 32,
    }; // default: 800 // default: 600 // default: false // default: false // default: 1});

    this.lineWeightConstant = 0.000975;

    this.params.tileSize = this.el.clientWidth / this.params.resolution;
    this.params.width = this.el.clientWidth / this.params.resolution;
    this.params.height = this.el.clientHeight / this.params.resolution;

    this.biomes = new Biomes();

    this.app = new PIXI.Application(this.params);
    el.appendChild(this.app.view);
  }

  // render the visible portion of the world
  renderWorld(x, y, d, world) {
    if (!this.el) return;
    let startX = x - Math.floor(this.params.width / 2);
    let startY = y - Math.floor(this.params.height / 2);

    let currentPositionData = null;
    let mapTiles = new PIXI.Container();

    for (var yTileIndex = 0; yTileIndex < this.params.height; yTileIndex++) {
      for (var xTileIndex = 0; xTileIndex < this.params.width; xTileIndex++) {
        let position = world.getWorldPosition(
          startX + xTileIndex,
          startY + yTileIndex,
          d
        );

        let cellColor = `0x${position.biome.r.toString(
          16
        )}${position.biome.g.toString(16)}${position.biome.b.toString(16)}`;
        let lineStyle = null;

        let isCenterCell = position.x == x && position.y == y;

        if (isCenterCell) {
          currentPositionData = position;
          cellColor = '0x000000';
        }

        mapTiles.addChild(
          this.renderTile(
            xTileIndex,
            yTileIndex,
            cellColor,
            lineStyle,
            mapTiles
          )
        );
      }
    }

    while (this.app.stage.children[0]) {
      this.app.stage.removeChild(this.app.stage.children[0]);
    }
    this.app.stage.addChild(mapTiles);

    return currentPositionData;
  }

  renderTile(localX, localY, cellColor, lineStyle) {
    var graphics = new PIXI.Graphics();

    if (!lineStyle)
      lineStyle = {
        weight: this.lineWeightConstant * this.params.resolution,
        color: 0x000000,
      };
    graphics.beginFill(cellColor);
    graphics.lineStyle(lineStyle.weight, lineStyle.color);

    // draw a rectangle
    graphics.drawRect(localX, localY, 1, 1);
    graphics.endFill();
    return graphics;
  }
}
