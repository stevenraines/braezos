const BaseController = require('./baseController');

module.exports = class extends BaseController {
  get player() {
    console.log(this.$store);
    return this.$store.state.player;
  }
};
