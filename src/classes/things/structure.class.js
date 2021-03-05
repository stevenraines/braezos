import ThingCollection from '../thingCollection.class';
//import { EventBus } from '../../eventbus.js';
import Point from '../helpers/point.class';
import STRUCTURE_ELEMENTS from '../../enums/structureElements';
export default class Structure extends ThingCollection {
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

    if (!configShape) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          this.shape.push({
            offset: new Point({ x: x, y: y, d: 0 }),
            type: STRUCTURE_ELEMENTS.WALL,
          });
        }
      }
    }
  }

  register() {
    if (this.position.d == window.GameEngine.Environment.level.levelIndex)
      this.applyStructure();
  }
}
