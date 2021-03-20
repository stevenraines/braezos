const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api.js');
let world = null;
let socketClients = [];
const World = require('../shared/classes/world.js');

module.exports = function(app, server) {
  // app.use(bodyParser.json());
  if (!server) return;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/socktest', (req, res) => {
    res.sendFile(__dirname + '/socktest.html');
  });

  let corsOptions = {
    credentials: true,
  };
  app.use(cors(corsOptions));

  console.log(`initializing world with seed ${process.env.WORLD_SEED}`);
  world = new World({ seed: process.env.WORLD_SEED });
  app.set('world', world);
  app.use('/api', api);
  app.set('socketClients', socketClients);
};
