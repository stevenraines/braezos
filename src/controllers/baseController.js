const BaseController = class {
  constructor(root) {
    this.$root = root;
  }
  get root() {
    return this.$root;
  }
  get controllers() {
    return this.root.$data.controllers;
  }
  get store() {
    return this.root.$store;
  }
};

module.exports = BaseController;
