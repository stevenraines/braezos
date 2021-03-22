const bodyParser = require('body-parser');
const cors = require('cors');

let world = null;
let socketClients = [];
const World = require('./classes/world.class');

module.exports = async function(app) {
  let corsOptions = { credentials: true };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  console.log(`initializing world with seed ${process.env.WORLD_SEED}`);
  world = new World({ seed: process.env.WORLD_SEED });
  world.initialize();

  console.log('postinit');
  app.set('world', world);

  app.use('/api', require('./api.js'));
  app.use('/api/world', require('./api/world.api'));
  app.use('/api/player', require('./api/player.api'));
  app.get('/socktest', (req, res) => {
    res.sendFile(__dirname + '/socktest.html');
  });

  app.set('socketClients', socketClients);
};
