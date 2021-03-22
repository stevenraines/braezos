const express = require('express');
const router = express.Router();

// middleware that is specific to this router

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/test', function(req, res) {
  res.send('test worked');
});

// define the home page route

module.exports = router;
