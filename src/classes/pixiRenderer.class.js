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

    this.params.tileSize = tileSize;
    this.params.width = this.params.drawRadius * 2 * this.params.tileSize;
    this.params.height = this.params.drawRadius * 2 * this.params.tileSize;

    this.app = new PIXI.Application(this.params);
    el.appendChild(this.app.view);
  }

  // render the visible portion of the world
  renderWorld(player, tiles) {
    if (!this.el) return;

    let topLeftPosition = tiles[0][0];

    let xOffset = player.position.x - topLeftPosition.x - player.viewRadius;
    let yOffset = player.position.y - topLeftPosition.y - player.viewRadius;
    let currentPositionData = null;
    let mapTiles = new PIXI.Container();

    console.log(
      tiles[0][0],
      xOffset,
      yOffset,
      player.position.x,
      topLeftPosition.x
    );

    for (var row = 0; row < player.viewRadius * 2; row++) {
      for (var column = 0; column < player.viewRadius * 2; column++) {
        let position = tiles[row + yOffset][column + xOffset];

        let cellColor = `0x${position.biome.r.toString(
          16
        )}${position.biome.g.toString(16)}${position.biome.b.toString(16)}`;
        let lineStyle = null;

        let isCenterCell =
          position.x == player.position.x && position.y == player.position.y;
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
