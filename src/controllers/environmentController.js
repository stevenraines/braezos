import BaseController from './baseController';
import Chunk from '../classes/chunk.class';
import params from '../../params.config';
export default class extends BaseController {
  constructor(root) {
    super(root);

    params.cellSize = params.moveSize;
    params.halfCell = params.cellSize / 2;
  }
  setup() {
    this.store.commit('environment/setParams', params);
  }
  get params() {
    return params;
  }
  getLevel(levelIndex) {
    let chunk = new Chunk(this.params);
    let level = chunk.getLevel(levelIndex);
    return level;
  }
}
