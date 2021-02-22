import ThingCollection from '../thingCollection.class';

export default class Item extends ThingCollection {
  constructor(config) {
    super(config);
    this.owner = config.owner ? config.owner : null;
    this.add();
  }
}
