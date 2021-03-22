const express = require('express');
const router = express.Router();

router.post('/act', async function(req, res) {
  let player = await global.world.getPlayer({ name: req.body.name });

  if (player[req.body.action]) {
    let resp = await player[req.body.action](req.body);
    return res.send(resp);
  }

  res.send(null);
});

router.post('/registerSocket', async function(req, res) {
  let params = { name: req.body.name };
  let player = await global.world.getPlayer(params);
  player.registerSocket(req.body.socketId);
  res.send();
});

router.post('/', async function(req, res) {
  let params = { name: req.body.name };
  let player = await global.world.getPlayer(params);
  if (req.body.socketId) {
    player.registerSocket(req.body.socketId);
  } else {
    console.warn('SOCKETID NOT PROVIDED');
  }

  res.send(player.serialize());
});

router.post('/tiles', async function(req, res) {
  let player = await global.world.getPlayer({ name: req.body.name });

  // return the tiles the user can see.

  let area = {
    topLeft: {
      x: player.position.x - player.viewRadius * 2,
      y: player.position.y - player.viewRadius * 2,
      d: player.position.d,
    },
    bottomRight: {
      x: player.position.x + player.viewRadius * 2,
      y: player.position.y + player.viewRadius * 2,
      d: player.position.d,
    },
  };

  let worldSegment = await global.world.getWorldPositions(area);

  res.send(worldSegment);
});

module.exports = router;
