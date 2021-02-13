const BaseController = require('./baseController');

module.exports = class extends BaseController {
  get places() {
    return this.$store.state.places;
  }
  place(id) {
    return this.$generatePlace(this.$store.state.places.cells[id]);
  }
  $generatePlace(placeData) {
    placeData.special = 'special stuff';
    return placeData;
  }
};
