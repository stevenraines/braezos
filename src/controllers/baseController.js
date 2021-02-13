const BaseController = class {
  constructor(store) {
    this.$store = store;
  }
  get store() {
    return this.$store;
  }
};

module.exports = BaseController;
