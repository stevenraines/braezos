const LocationTemplates = require("../data/locations");
const _ = require("lodash");
const EncounterStates = require("../shared/enums/encounterStates");

const LocationManager = {
  encounters: null,
  initialize: function(map) {
    if (!this.encounters) {
      this.encounters = new Array(map.cells.length);
    }
  },
  resetEncounters: function() {
    console.log("resetEncounters");
    this.encounters = null;
  },
  getLocationTemplateByName: function(name) {
    return _.find(LocationTemplates, { name: name });
  },
  getLocationDetails: function(map, id) {
    // if we do not have any encounters, make / load them.
    this.initialize(map);

    // get the location data from the supplied map.
    let location = map.cells[id];

    // if we don't have a modified version of this encounter, generate the encounter from templates
    let encounter = this.encounters[id];
    if (!encounter) {
      encounter = {
        state: EncounterStates.START,
      };

      if (id == map.startingCellIndex) {
        encounter = _.assign(
          encounter,
          this.getLocationTemplateByName("start")
        );
      } else {
        encounter = _.assign(
          encounter,
          this.getLocationTemplateByName("default")
        );
      }
    }
    this.encounters[id] = encounter;

    location.encounter = encounter;
    return location;
  },
};

module.exports = LocationManager;
