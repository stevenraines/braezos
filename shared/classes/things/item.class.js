const Thing = require('../thing.class');

module.exports = class Item extends Thing {
  constructor(config, world) {
    super(config, world);
    this.owner = this.config.owner ? this.config.owner : null;
  }
  /*
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
*/
};
