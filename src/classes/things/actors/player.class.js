import Actor from '../actor.class';

export default class Player extends Actor {
  constructor(config) {
    super(config);

    this.loadState();
  }

  setPosition(cell) {
    this.currentCell = cell;
    super.setPosition(cell.position);
  }
}
