import Thing from '../thing.class';

export default class Actor extends Thing {
  constructor(config) {
    super(config);
  }

  async move(vector) {
    let cell = this.getAdjacentCell(vector);

    if (!cell || !cell.isCellTraverable(this)) return;
    this.position = cell.position;
    this.saveState();
  }
}
