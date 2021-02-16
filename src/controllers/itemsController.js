import BaseController from './baseController';
import _ from 'lodash';
export default class extends BaseController {
  constructor(root) {
    super(root);
  }
  setup() {}
  addItem(item) {
    this.store.commit('items/addItem', item);
  }

  getItemsInCell(cell) {
    let itemsInCell = _.filter(this.store.state.items.items, function(o) {
      return o.cell[0] == cell[0] && o.cell[1] == cell[1];
    });
    return itemsInCell;
  }

  getItemsInCells(cells) {
    let cellList = [];

    for (let cell in cells) {
      let items = this.getItemsInCell(cells[cell]);
      if (items.length > 0)
        cellList.push({
          cell: cells[cell],
          items: items,
        });
    }

    return cellList;
  }
}
