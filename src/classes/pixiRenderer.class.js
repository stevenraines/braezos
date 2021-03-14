import * as PIXI from 'pixi.js';
export default class PIXIRenderer {
  constructor(el, params) {
    if (!el) return;
    this.el = el;
    this.params = params || {
      antialias: false,
      transparent: false,
    }; // default: 800 // default: 600 // default: false // default: false // default: 1});

    let tileSize = Math.floor(el.clientWidth / (this.params.drawRadius * 2));

    console.log(tileSize);

    this.params.tileSize = tileSize;
    this.params.width = this.params.drawRadius * 2 * this.params.tileSize;
    this.params.height = this.params.drawRadius * 2 * this.params.tileSize;

    this.app = new PIXI.Application(this.params);
    el.appendChild(this.app.view);
  }

  // render the visible portion of the world
  renderWorld(x, y, d, tiles) {
    if (!this.el) return;

    let currentPositionData = null;
    let mapTiles = new PIXI.Container();

    for (var row = 0; row < tiles.length; row++) {
      for (var column = 0; column < tiles[row].length; column++) {
        let position = tiles[row][column];

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
          this.renderTile(column, row, cellColor, lineStyle, mapTiles)
        );
      }
    }
    /*
    while (this.app.stage.children[0]) {
      this.app.stage.removeChild(this.app.stage.children[0]);
    }
  
  */ this.app.stage.addChild(
      mapTiles
    );

    console.log(currentPositionData);

    return currentPositionData;
  }

  renderTile(localX, localY, cellColor, lineStyle) {
    var graphics = new PIXI.Graphics();

    if (!lineStyle)
      lineStyle = {
        weight: 1,
        color: 0x000000,
      };
    graphics.beginFill(cellColor);
    graphics.lineStyle(lineStyle.weight, lineStyle.color);

    // draw a rectangle
    graphics.drawRect(
      localX * this.params.tileSize,
      localY * this.params.tileSize,
      this.params.tileSize,
      this.params.tileSize
    );

    graphics.endFill();
    return graphics;
  }
}
