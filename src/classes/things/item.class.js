import ThingCollection from '../thingCollection.class';

export default class Item extends ThingCollection {
  constructor(config, storeName) {
    console.log('item', config);
    super(config, storeName);
    this.owner = this.config.owner ? this.config.owner : null;
  }

  take(entity) {
    this.owner = entity.id;
    this.position = null;
    this.save();
    entity.itemCount += 1;
  }

  drop(entity) {
    this.owner = null;
    this.position = entity.position;
    this.save();
    entity.itemCount -= 1;
  }
}
