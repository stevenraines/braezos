const Base = require('./base.class');
const Point = require('./helpers/point.class');
const Item = require('./things/item.class');

module.exports = class Thing extends Base {
  constructor(config, storeName) {
    super(config, storeName);

    this.position = this.config.position
      ? new Point(this.config.position)
      : null; // the position of the thing in the world. Null if possessed by another.

    console.log('Thing This. Config', this.config);
    this.name = this.config.name ? this.config.name : this.id; // the name of the thing. Defaults to ID.
    this.hp = this.config.hp ? this.config.hp : 1; // number of HP the thing has.
    this.itemCount = 0;
  }

  getAdjacentCell(vector) {
    const adjacentPosition = new Point({
      x: vector.x + this.position.x,
      y: vector.y + this.position.y,
      d: vector.d + this.position.d,
    });

    let cell = this.engine.Environment.level.getCellByPosition(
      adjacentPosition
    );

    return cell;
  }

  get inventory() {
    let ownedItems = Item.filter({ owner: this.id }, 'item');
    this.itemCount = ownedItems.length;
    return ownedItems;
  }

  setPosition(position) {
    this.position = new Point(position);
    this.saveState();
  }
};
