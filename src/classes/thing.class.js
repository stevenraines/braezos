import Base from './base.class';
import Point from './helpers/point.class';

export default class extends Base {
  constructor(config, storeName) {
    super(config, storeName);
    this.position = this.config.position
      ? new Point(this.config.position)
      : null; // the position of the thing in the world. Null if possessed by another.
    this.name = this.config.name ? this.config.name : this.id; // the name of the thing. Defaults to ID.
    this.hp = this.config.hp ? this.config.hp : 1; // number of HP the thing has.
  }

  getAdjacentCell(vector) {
    const adjacentPosition = new Point({
      x: vector.x + this.position.x,
      y: vector.y + this.position.y,
      d: vector.z + this.position.d,
    });

    let cell = this.engine.controllers.EnvironmentController.level.getCellByPosition(
      adjacentPosition
    );

    return cell;
  }

  setPosition(position) {
    this.position = new Point(position);

    this.saveState();
  }
}
