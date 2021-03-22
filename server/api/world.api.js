const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  let worldObj = global.world.serialize();

  res.send(worldObj);
});

router.get('/map', function(req, res) {
  let img = global.world.renderToImage();

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length,
  });
  res.end(img);
});

router.get('/positions', function(req, res) {
  let x = parseInt(req.query.x) || 0;
  let y = parseInt(req.query.y) || 0;
  let d = parseInt(req.query.d) || 0;
  let radius = parseInt(req.query.radius) || 5;

  let area = {
    topLeft: { x: x - radius, y: y - radius, d: d },
    bottomRight: { x: x + radius, y: y + radius, d: d },
  };

  let worldSegment = global.world.getWorldPositions(area);
  res.send(JSON.stringify(worldSegment));
});

module.exports = router;
