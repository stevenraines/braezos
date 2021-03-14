const api = require('./api.js');

module.exports = function(app, server) {
  // app.use(bodyParser.json());
  if (!server) return;
  app.use('/api', api);
};
