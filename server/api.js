const express = require('express');
const router = express.Router();

const _ = require('lodash');
const fs = require('fs');

const defaultParams = require('../params.config');

async function initialize() {}

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route

router.get('*', function(req, res) {
  res.send('no valid endpoint');
});
initialize();
module.exports = router;
