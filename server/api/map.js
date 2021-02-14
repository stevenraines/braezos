const Braezos = require('../../shared/Braezos');
const defaultParams = require('../../params.config');
const _ = require('lodash');
const LocationManager = require('../../shared/LocationManager');

const Map = {
  currentMap: null,
  load: async function() {
    Map.currentMap = require(`${__dirname}/../../public/maps/map.json`);
  },
  clearEncounters: async function() {
    LocationManager.resetEncounters();
  },
  getMap: async function() {
    if (!Map.currentMap) {
      await Map.load();
    }
    return Map.currentMap;
  },
  create: async function(req, res) {
    let params = defaultParams;
    params.seed = _.get(
      req,
      'query.seed',
      _.get(defaultParams, 'seed', 'BRAEZOS')
    );
    await Braezos.saveMap(
      `${__dirname}/../../public/maps/${_.get(params, 'mapName', 'map')}`,
      await Braezos.makeMap(params)
    );
    if (res) res.send('done');
  },
  getPlaces: async function(req, res) {
    let map = await Map.getMap();

    LocationManager.resetEncounters();
    return res.status(200).send(map);
  },
};

module.exports = Map;
