const api = require('./api.js');
const bodyParser = require('body-parser');

module.exports = function(app, server) {
  // app.use(bodyParser.json());
  if (!server) return;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api', api);
};
