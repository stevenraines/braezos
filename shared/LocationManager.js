const LocationTemplates = require('../data/encounter.js');
const _ = require('lodash');
const EncounterStates = require('../shared/enums/encounterStates');

const LocationManager = {
  encounters: null,
  initialize: function(map) {
    if (!this.encounters) {
      this.encounters = new Array(map.cells.length);
    }
  },
  resetEncounters: function() {
    this.encounters = null;
  },
  getLocationTemplateByName: function(name) {
    return _.find(LocationTemplates, { name: name });
  },
  updateEncounter: function(encounter) {
    this.encounters[encounter.id] = encounter;
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
        id: id,
        state: EncounterStates.START,
      };

      if (id == map.startingCellIndex) {
        encounter = _.merge(encounter, this.getLocationTemplateByName('start'));
      } else {
        encounter = _.merge(
          encounter,
          this.getLocationTemplateByName('default')
        );
      }
    }
    this.encounters[id] = encounter;

    location.encounter = encounter;

    return location;
  },
};

module.exports = LocationManager;
