import Thing from '../thing.class';
import Item from './item.class';
import { EventBus } from '../../eventbus.js';
export default class Actor extends Thing {
  constructor(config) {
    super(config);
  }

  async move(vector) {
    let cell = this.getAdjacentCell(vector);

    if (!cell || !cell.isCellTraverable(this)) return;
    this.currentCell = cell;
    this.position = cell.position;
    this.saveState();
  }

  async drop(itemToDrop) {
    let item = new Item();
    item.load(itemToDrop.id);
    item.drop(this);
    EventBus.$emit('RenderLevel');
  }
  async pickup(itemToPickup) {
    let items = [itemToPickup];
    if (!itemToPickup) {
      items = Item.getThingsInCell(this, 'item');
    }

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      let item = new Item();
      item.load(items[itemIndex].id);
      item.take(this);
      this.save();
    }
    EventBus.$emit('RenderLevel');
  }
}
