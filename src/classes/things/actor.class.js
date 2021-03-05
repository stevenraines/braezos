import Item from './item.class';
import ThingCollection from '../thingCollection.class';
import { EventBus } from '../../eventbus.js';
import MOVE_VECTORS from '../../enums/moveVectors';
import Brain from '../brain.class';

export default class Actor extends ThingCollection {
  constructor(config, storeName) {
    super(config, storeName);
    this.viewDistance = 10;
  }

  async move(vector) {
    let destinationCell = this.getAdjacentCell(vector);

    if (!destinationCell || !destinationCell.isCellTraverable(this)) return;

    if (this.currentCell) this.currentCell.occupied = false;
    this.currentCell = destinationCell;
    this.position = destinationCell.position;
    this.save();

    EventBus.$emit('RenderLevel');
  }

  async drop(itemToDrop) {
    let item = new Item();
    item.load(itemToDrop.id);
    item.drop(this);
    console.log('render on drop');
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
      await this.save();
    }

    EventBus.$emit('RenderLevel');
  }

  preAct() {
    // EventBus.$emit('LogToPlayerConsole', `${this.name}'s turn`);
    //   console.log(`${this.name}'s turn`);
  }

  act() {
    window.GameEngine.EventManager.lock();

    this.preAct();

    let brain = new Brain(this);

    brain.observe();
    brain.resolve();
    window.GameEngine.EventManager.unlock();
  }

  randomMove() {
    if (this.lastMove == MOVE_VECTORS.W) {
      this.move(MOVE_VECTORS.E);
      this.lastMove = MOVE_VECTORS.E;
    } else {
      this.move(MOVE_VECTORS.W);
      this.lastMove = MOVE_VECTORS.W;
    }
  }

  load(id) {
    super.load(id);
  }

  register() {
    console.log(`registering ${this.name}`, this);
    window.GameEngine.EventManager.registerActor(this);
  }
}
