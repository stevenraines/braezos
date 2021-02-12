//const _ = require("lodash");
const axios = require('axios');
const renderer = require('../renderers/d3');

//const _ = require('lodash');

const PlaceManager = {
  encounters: [],
  renderer: renderer,
  init: async function() {
    await this.getMap();
    if (!this.encounters) {
      this.encounters = new Array(this.map.cells.length);
    }
    return this.map;
  },
  getMap: async function() {
    let map = await axios.get('/api/places');
    this.map = map.data;
    return this.map;
  },
  /* renderMap
    Generate a rendered version of the map, focused on the current place.
  */
  renderMap: async function(height, width, currentPlace) {
    if (!currentPlace)
      currentPlace = this.map.cells[this.map.startingCellIndex];
    this.renderer.init(this.map, height, width);
    console.log('place', currentPlace);
    return renderer.renderMap(currentPlace);
  },
};

module.exports = PlaceManager;
