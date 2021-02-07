const Braezos = require("../../shared/Braezos");
const defaultParams = require("../../params.config");
const _ = require("lodash");
const LocationManager = require("../../shared/LocationManager");

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
      console.log("loading map!");
      await Map.load();
    }
    return Map.currentMap;
  },
  create: async function(req, res) {
    console.log("create map");
    let params = defaultParams;
    params.seed = _.get(
      req,
      "query.seed",
      _.get(defaultParams, "seed", "BRAEZOS")
    );
    await Braezos.saveMap(
      `${__dirname}/../../public/maps/${_.get(params, "mapName", "map")}`,
      await Braezos.makeMap(params)
    );
    if (res) res.send("done");
  },
  getLocation: async function(req, res) {
    let map = await Map.getMap();

    if (req.params.cellIndex == "start") {
      LocationManager.resetEncounters();
      return res
        .status(200)
        .send(LocationManager.getLocationDetails(map, map.startingCellIndex));
    }

    if (req.params.cellIndex >= 0 && req.params.cellIndex < map.cells.length) {
      return res
        .status(200)
        .send(LocationManager.getLocationDetails(map, req.params.cellIndex));
    }

    return res.status(404).send("no such place");
  },
};

module.exports = Map;
