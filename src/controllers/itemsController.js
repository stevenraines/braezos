import BaseController from './baseController';
import _ from 'lodash';
export default class extends BaseController {
  constructor(root) {
    super(root);
  }
  setup() {}

  getItemsInCell(cell) {
    let itemsInCell = _.filter(
      JSON.parse(JSON.stringify(this.store.state.items.collection)),
      function(o) {
        if (!o) return false;

        return (
          o.position.x == cell.position.x &&
          o.position.y == cell.position.y &&
          o.position.d == cell.position.d
        );
      }
    );
    return itemsInCell;
  }

  getItemsInCells(cells) {
    let itemList = [];

    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      let cell = cells[cellIndex];
      itemList = itemList.concat(this.getItemsInCell(cell));
    }

    return itemList;
  }
}
