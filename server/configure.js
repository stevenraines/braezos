const api = require('./api.js');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = function(app, server) {
  // app.use(bodyParser.json());
  if (!server) return;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/socktest', (req, res) => {
    res.sendFile(__dirname + '/socktest.html');
  });

  let whitelist = ['http://localhost:8080', 'http://localhost:8081'];
  let corsOptions = {
    credentials: true,
  };
  app.use(cors(corsOptions));

  //app.use(cors(corsOptions));

  app.use('/api', api);
};
