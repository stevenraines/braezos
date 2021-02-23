const express = require('express');
const router = express.Router();

const _ = require('lodash');

async function initialize() {}

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/t', function(req, res) {
  res.send('t');
});

// define the home page route

initialize();
module.exports = router;
