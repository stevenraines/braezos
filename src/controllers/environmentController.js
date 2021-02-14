import BaseController from './baseController';
import params from '../../params.config';
export default class extends BaseController {
  constructor(root) {
    super(root);
  }
  setup() {
    this.store.commit('environment/setParams', params);
  }
  get params() {
    return params;
  }
}
