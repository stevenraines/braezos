//const Item = require('./item.class');
const Thing = require('../thing.class');
//const MOVE_VECTORS = require('../../enums/moveVectors');
//const Brain = require('../brain.class');
module.exports = class Actor extends Thing {
  constructor(config, world) {
    super(config, world);
    this.viewDistance = 8;
  }
};
