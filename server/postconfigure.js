const socketHandler = require('./sockets.js');

module.exports = function(app, server, compiler, PORT, prod) {
  // if we are in prod, do this:
  let httpServer = null;

  if (prod) {
    httpServer = server;
  } else {
    httpServer = require('http').createServer(app);
  }

  let origin = `http://localhost:${PORT || 8080}`;

  const io = require('socket.io')(httpServer, {
    cors: {
      origin: origin,
      methods: ['GET', 'POST'],
      credentials: true,
      allowEIO3: true,
    },
  });

  socketHandler(io);

  if (!prod) httpServer.listen(8081);
  global.world.__io = io;
};
