import Thing from '../thing.class';

export default class extends Thing {
  constructor(config, storeName) {
    super(config, storeName || 'actors');
  }

  async move(vector) {
    let cell = this.getAdjacentCell(vector);

    if (!cell || !cell.isCellTraverable(this)) return;
    this.position = cell.position;
    this.saveState();
  }
}
