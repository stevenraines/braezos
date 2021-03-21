const express = require('express');
const router = express.Router();

router.post('/act', async function(req, res) {
  let player = await req.app.get('world').getPlayer({ name: req.body.name });

  if (player[req.body.action]) {
    let resp = await player[req.body.action](req.body);
    return res.send(resp);
  }

  res.send(null);
});

router.post('/', async function(req, res) {
  let io = req.app.get('io');

  let params = { name: req.body.name };

  let player = await req.app.get('world').getPlayer(params);

  if (req.body.socketId) {
    player.__socket = io.of('/').sockets.get(req.body.socketId);
    player.__socket.emit(
      'message',
      `Registered  ${player.name} (${player.id})`
    );
  }

  res.send(player.serialize());
});

router.post('/tiles', async function(req, res) {
  let player = await req.app.get('world').getPlayer({ name: req.body.name });

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

  let worldSegment = await req.app.get('world').getWorldPositions(area);

  res.send(worldSegment);
});

module.exports = router;
