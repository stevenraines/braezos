const ThingCollection = require('../thingCollection.class');
//import { EventBus } from '../../eventbus.js';
const Point = require('../helpers/point.class');
const STRUCTURE_ELEMENTS = require('../../enums/structureElements');

module.exports = class Structure extends ThingCollection {
  constructor(config, storeName) {
    super(config, storeName);
    this.shape = [];
    this.generateStructure();
  }

  // applies the structure to the surrounding cells
  applyStructure() {
    for (
      let structureCellIndex = 0;
      structureCellIndex < this.shape.length;
      structureCellIndex++
    ) {
      let worldCell = window.GameEngine.Environment.level.getCellByPosition(
        new Point(this.position).applyVector(
          this.shape[structureCellIndex].offset
        )
      );
      worldCell.structure = this.shape[structureCellIndex];
    }
  }

  generateStructure(configShape) {
    let width = 3;
    let height = 3;

    // default is rectangle 3x3

    let doorCellPosition = new Point({
      x: width - 1,
      y: Math.floor(height / 2),
      d: this.position.d,
    });

    if (!configShape) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let type = STRUCTURE_ELEMENTS.WALL;

          if (doorCellPosition.x == x && doorCellPosition.y == y) {
            type = STRUCTURE_ELEMENTS.PORTAL;
          }
          this.shape.push({
            offset: new Point({ x: x, y: y, d: 0 }),
            type: type,
          });
        }
      }
    }
  }

  register() {
    if (this.position.d == window.GameEngine.Environment.level.levelIndex)
      this.applyStructure();
  }
};
