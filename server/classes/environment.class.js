const Base = require('./base.class');
module.exports = class Environment extends Base {
  constructor(config, world) {
    super(config, world);
  }
  act() {
    this.world.__engine.lock();
    console.log(`Environment Acting: Turn ${this.world.turns}`);
    this.world.turns += 1;
    setTimeout(
      function() {
        this.world.__engine.unlock();
      }.bind(this),
      this.world.turnDurationMS || 5000
    );
  }
};
