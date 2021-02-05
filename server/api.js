const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Braezos = require("../shared/Braezos");
const defaultParams = require("../params.config");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/makeMap", async function(req, res) {
  let params = defaultParams;
  params.seed = _.get(
    req.query,
    "seed",
    _.get(defaultParams, "seed", "BRAEZOS")
  );
  await Braezos.saveMap(
    `${__dirname}/../public/maps/${_.get(params, "mapName", "map.svg")}`,
    await Braezos.makeMapSVG(params)
  );
  res.send("Birds charges");
});
// define the about route
router.get("/about", function(req, res) {
  res.send("About birds");
});

module.exports = router;
