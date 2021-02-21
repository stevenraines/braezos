import Thing from '../thing.class';

export default class extends Thing {
  constructor(config) {
    super(config, 'items');
    this.owner = config.owner ? config.owner : null;
  }
}
