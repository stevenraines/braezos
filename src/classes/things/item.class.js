import ThingCollection from '../thingCollection.class';

export default class extends ThingCollection {
  constructor(config) {
    super(config, 'items');
    this.owner = config.owner ? config.owner : null;
    this.add();
  }
}
