const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.use(function checkWorld(req, res, next) {
  if (!req.app.get('world').io && req.app.get('io')) {
    req.app.get('world').io = req.app.get('io');
  }
  next();
});

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/player/act', function(req, res) {
  let player = req.app.get('world').getPlayer({ id: req.body.id });

  if (player[req.body.action]) {
    let resp = player[req.body.action](req.body);
    return res.send(resp);
  }

  res.send(null);
});

router.post('/player', function(req, res) {
  let io = req.app.get('io');
  let params = { id: req.body.id };
  if (!req.body.id) params = { name: req.body.name };

  let player = req.app.get('world').getPlayer(params);

  if (req.body.socketId) {
    player.__socket = io.of('/').sockets.get(req.body.socketId);
    player.__socket.emit(
      'message',
      `Registered  ${player.name} (${player.id})`
    );
  }

  res.send(player.serialize());
});

router.get('/world', function(req, res) {
  let worldClone = _.clone(req.app.get('world'));
  delete worldClone.simplexElevation;
  delete worldClone.simplexMoisture;
  delete worldClone.elevationOctaveArray;
  delete worldClone.moistureOctaveArray;
  res.send(worldClone);
});

router.get('/worldMap', function(req, res) {
  let img = req.app.get('world').renderToImage();
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

  let worldSegment = req.app.get('world').getWorldPositions(area);
  res.send(JSON.stringify(worldSegment));
});

// define the home page route

module.exports = router;
