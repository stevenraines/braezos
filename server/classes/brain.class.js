const Base = require('./base.class');

module.exports = class Brain extends Base {
  constructor() {
    super();
    this.actionStack = []; // the stack of available options, ordered by priority.
    this.path = []; // the current path the brain is following
  }

  // if concious, on the actor's turn, the brain should acquire new information and update it's action stack
  observe() {
    return;
  }

  // after observing, the brain should pick the top action from the action stack that meets all acceptable criteria
  resolve() {
    return;
  }
};
