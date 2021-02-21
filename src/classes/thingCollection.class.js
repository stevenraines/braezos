// base class for all entities in the system. Contains ONLY system related info
import Thing from './thing.class';
import _ from 'lodash';

const ThingCollection = class extends Thing {
  constructor(config, storeName) {
    super(config, storeName);
  }

  exists() {
    if (this.constructor.filter({ id: this.id }, this.storeName).length > 0)
      return true;

    return false;
  }

  add() {
    if (!this.exists()) {
      this.store.commit(`${this.storeName}/add`, this);
    } else {
      this.engine.log(
        `Entity ${this.id} exists in collection ${this.storeName}`
      );
    }
  }
  remove() {
    if (this.exists()) {
      this.store.commit(`${this.storeName}/remove`, this);
    } else {
      this.engine.log(
        `Entity ${this.id} does not exist in collection ${this.storeName}`
      );
    }
  }
  update() {
    this.store.commit(`${this.storeName}/update`, this);
  }

  static filter(conditions, storeName) {
    return _.filter(
      window.GameEngine.$store.state[storeName].collection,
      conditions
    );
  }
};

export default ThingCollection;
