const express = require('express');
const router = express.Router();
const _ = require('lodash');
let world = null;
const World = require('../shared/classes/world.js');

async function initialize() {
  console.log(`initializing world with seed ${process.env.WORLD_SEED}`);

  world = new World({ seed: process.env.WORLD_SEED });
  console.log(world.serialize());
}

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/player/act', function(req, res) {
  let player = world.getPlayer({ id: req.body.id });

  if (player[req.body.action]) {
    let resp = player[req.body.action](req.body);
    return res.send(resp);
  }

  res.send(null);
});

router.post('/player', function(req, res) {
  console.log('getPlayer params', req.body);
  res.send(world.getPlayer(req.body));
});

router.get('/world', function(req, res) {
  let worldClone = _.clone(world);
  delete worldClone.simplexElevation;
  delete worldClone.simplexMoisture;
  delete worldClone.elevationOctaveArray;
  delete worldClone.moistureOctaveArray;
  res.send(worldClone);
});

router.get('/worldMap', function(req, res) {
  let img = world.renderToImage();
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length,
  });
  res.end(img);
});

router.get('/worldPositions', function(req, res) {
  let x = parseInt(req.query.x) || 0;
  let y = parseInt(req.query.y) || 0;
  let d = parseInt(req.query.d) || 0;
  let radius = parseInt(req.query.radius) || 5;

  let area = {
    topLeft: { x: x - radius, y: y - radius, d: d },
    bottomRight: { x: x + radius, y: y + radius, d: d },
  };

  let worldSegment = world.getWorldPositions(area);
  res.send(JSON.stringify(worldSegment));
});

// define the home page route

initialize();
module.exports = router;
