// base class for all entities in the system. Contains ONLY system related info
import Thing from './thing.class';
import _ from 'lodash';

const ThingCollection = class ThingCollection extends Thing {
  constructor(config, storeName) {
    super(config, storeName);
  }

  exists() {
    if (this.constructor.filter({ id: this.id }, this.storeName).length > 0)
      return true;

    return false;
  }

  load(id) {
    let existingThings = this.constructor.filter({ id: id }, this.storeName);

    if (existingThings.length != 1) return;

    let existingThing = existingThings[0];

    for (const [key, value] of Object.entries(existingThing)) {
      this[key] = value;
    }
  }

  save() {
    if (!this.exists()) {
      this.store.commit(`${this.storeName}/add`, this);
    } else {
      this.store.commit(`${this.storeName}/update`, this);
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

  static filter(conditions, storeName) {
    return _.filter(
      window.GameEngine.$store.state[storeName].collection,
      conditions
    );
  }

  static getThingsInCell(cell, thingCollectionName) {
    if (!thingCollectionName) thingCollectionName = this.storeName;

    let thingsInCell = _.filter(
      JSON.parse(
        JSON.stringify(
          window.GameEngine.$store.state[thingCollectionName].collection
        )
      ),
      function(o) {
        if (!o) return false;
        if (!o.position) return false;
        return (
          o.position.x == cell.position.x &&
          o.position.y == cell.position.y &&
          o.position.d == cell.position.d
        );
      }
    );

    return thingsInCell;
  }

  static getThingsInCells(cells, thingCollectionName) {
    let thingsList = [];

    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      let cell = cells[cellIndex];
      thingsList = thingsList.concat(
        this.getThingsInCell(cell, thingCollectionName)
      );
    }

    return thingsList;
  }
};

export default ThingCollection;
