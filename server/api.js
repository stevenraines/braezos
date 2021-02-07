const express = require("express");
const router = express.Router();
const _ = require("lodash");
const fs = require("fs");
const MapAPI = require("./api/map");
const defaultParams = require("../params.config");

async function initialize() {
  console.log(
    `${__dirname}/../public/maps/${_.get(defaultParams, "mapName", "map")}.json`
  );
  if (
    !fs.existsSync(
      `${__dirname}/../public/maps/${_.get(
        defaultParams,
        "mapName",
        "map"
      )}.svg`
    ) ||
    !fs.existsSync(
      `${__dirname}/../public/maps/${_.get(
        defaultParams,
        "mapName",
        "map"
      )}.json`
    )
  ) {
    await MapAPI.create();
  }
}

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/makeMap", MapAPI.create);
router.get("/location/:cellIndex", MapAPI.getLocation);

// define the about route
router.get("/about", function(req, res) {
  res.send("About birds");
});
router.get("*", function(req, res) {
  res.send("no valid endpoint");
});
initialize();
module.exports = router;
