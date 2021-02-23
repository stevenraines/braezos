const bodyParser = require('body-parser');

const api = require('./api');

module.exports = function(app, server) {
  app.use(bodyParser.json());
  app.use('/api', api);
};
